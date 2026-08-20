# MGD proposal storage

This design is limited to `/mgd/*`. Other AP-v4 resources continue to be
normal REST resources and do not use `config_changes` or this state machine.

## Storage contract

`setup_gateway_config_changes` is immutable history. A new proposal contains:

| Field | Rule |
| --- | --- |
| `id_setup_gateway` | Gateway aggregate that owns the request. |
| `id_setup_target` | Gateway or child setup used by installation/promotion rules. |
| `id_entity` | EAV entity name for the canonical table. |
| `id_resource` | Existing integer ID for update/delete, or generated ID after a create is applied. |
| `resource_key` | Stable logical ID while a create or dependent proposal has no integer ID. |
| `operation` | `C`, `U`, or `D`. |
| `before_value` | Only fields changed by an update; `{}` for a delete. |
| `after_value` | Only fields requested for a create/update. |
| `change_status` | State-machine value. |

Before `applied`, a proposal has exactly one identity: `id_resource` or
`resource_key`. The database upgrade makes `id_resource` nullable, stores
`resource_key`, adds `id_setup_target`, indexes dispatch queries and prevents
history deletion. Dependency rows connect a child proposal to its parent and
record the logical FK field. The production SQL is owned by the `database`
branch; this document does not apply it.

Historical rows remain. Old full snapshots may be retained as sparse-repair
input; new API writes are sparse and do not repeat unchanged fields.

## API-owned materialization

The external worker has no direct MGD database access. It reports status through
the canonical API. For `in_progress -> applied`, the API locks the change,
checks the precondition, resolves dependency keys, executes the entity write,
assigns the generated ID if necessary, updates `applied_at`, and commits all
of it in one transaction. If any step fails, no canonical row or `applied`
status is committed and the API returns a domain `409` when the conflict is
deterministic.

For a dependency group:

```text
proposal C parent (resource_key)   --applied--> parent id_resource = 501
proposal C child (FK resource_key) --applied--> child FK = 501
```

The API stores dependency metadata while both proposals are logical. Bulk
status promotion orders parents before children and deletes links before
parents. A single child status call returns `409` until its parent is applied.

## Endpoint behavior

Operational MGD mutations return `202` and a `ShowGatewayProposal` object:

```json
{
  "status": "proposed",
  "change_group_key": "uuid",
  "changes": [
    {
      "operation": "C",
      "id_resource": null,
      "resource_key": "mgd:uuid",
      "change_status": "on_hold",
      "before_value": null,
      "after_value": {"id_setup": 501709}
    }
  ]
}
```

`GET` routes read canonical applied tables. `GET /mgd/gateways/{id_setup}/config-json?projection=proposed`
is a read-only projection that overlays active proposals without assigning
fake integer IDs. `projection=applied` excludes non-terminal proposals.

`GET /config-changes` is paginated by `created_at` and change ID. It omits the
expensive synchronization object unless `include_config_sync=true`; callers
that need it can use `/config-sync` explicitly.

## Cancellation and retention

`on_hold`, `pending`, and `retry` are cancellable. `in_progress` is not;
`applied` and `failed` are terminal. A cancellation only changes the history
row. It does not delete `config_changes`, publish SQS, or materialize a row.

The importer is intentionally different: it receives already effective values,
overwrites/upserts canonical MGD rows, and records the effective operation as
`applied`. It is the inverse of proposal-only CRUD, not a second proposal path.

## SQS without outbox

When a proposal becomes `pending`, AP-v4 sends the existing aggregate SQS
message after the database transaction commits. The response/log carries the
SQS message ID for traceability. `POST /mgd/setups/{id_setup}/config-changes/replay`
resends existing `pending` rows after a delivery failure. No outbox table or
worker-infrastructure branch is required for this design.
