# MGD config-change state machine

This state machine applies only to `/mgd/*`. The API owns proposal creation,
dependency resolution, canonical materialization and the state transition.
The external worker only calls the API to report processing state; it does not
write MGD tables directly.

## States and transitions

| State | Meaning | Terminal |
| --- | --- | --- |
| `on_hold` | Recorded, but installation/dependency rules do not yet allow dispatch. | No |
| `pending` | Eligible for the external processor; AP-v4 sends an aggregate SQS message. | No |
| `in_progress` | Worker has started processing. | No |
| `retry` | Worker may try again. | No |
| `cancelled` | Request was cancelled before execution. | Yes |
| `applied` | Worker confirmed the physical/configuration result; API materialized it. | Yes |
| `failed` | Worker failed or exhausted retries. | Yes |

```text
on_hold     -> pending | cancelled
pending     -> on_hold | in_progress | cancelled
in_progress -> retry | applied | failed
retry       -> cancelled | in_progress
```

`requested` is historical and is not accepted for new writes. Terminal rows
have no outgoing transitions. Repeating the current status is idempotent.
`on_hold` and `pending` are internal API states: the worker reports only
`in_progress`, `retry`, `failed`, `applied`, or `cancelled`.

## Strict proposal-only semantics

An MGD mutation returns `202` with one or more config-change rows. Until
`applied`, the canonical entity table remains unchanged. Creates use
`id_resource = null` and a stable `resource_key`; updates/deletes use an
existing integer ID or a logical key from a parent proposal.

When the worker calls:

```http
PATCH /mgd/gateways/{id_setup}/config-changes/{change_id}/status
Content-Type: application/json

{"change_status":"applied"}
```

the API transaction:

1. locks and validates the change and its dependencies;
2. resolves logical references to IDs materialized earlier in the group;
3. creates, updates, or deletes the canonical entity;
4. assigns the generated integer ID to a create;
5. sets `applied` and `applied_at`; and
6. commits entity and history changes together.

Any conflict rolls back both the entity write and the status update. A create
that already exists with another value, an update whose precondition changed,
or a missing dependency is a `409`, never a partial `applied` row.

Bulk `PATCH /config-changes/status` orders dependencies internally and applies
the complete group transactionally. Delete cascades are ordered from links to
parents. The worker therefore does not need database credentials, an outbox,
or a second persistence protocol.

## Eligibility and promotion

A gateway or child target can become `pending` only when its active main
`device_setups` row has `setup_uninstall_date IS NULL`,
`device_setup_is_accessory = false`, and a non-deleted device. Gateway and
child targets are independent.

Most mutations start `on_hold`; the endpoint policy may select `pending` for an
installed target. When a mutation targets a resource, AP-v4 also promotes
existing `on_hold` changes in the same dependency branch. It does not promote
sibling children or invent changes. The branch includes the selected config,
point/group/schedule/special-day/extension links and their logical parents.

`GET` never promotes anything. Reconciliation is explicit:

```http
POST /mgd/setups/{id_setup}/config-changes/reconcile
{"include_children": true}
```

It promotes eligible `on_hold` rows, re-evaluates dependencies, and demotes
`pending` rows when an installation predicate is no longer true.

A schedule can exist detached from a point group. It remains a valid resource;
its assignment is a separate proposal. The `everyday` rule belongs to the
point-group relationship and is not imposed on `device_config`.

## Cancellation and retention

Only `on_hold`, `pending`, and `retry` can become `cancelled`. `in_progress`
cannot be cancelled because the worker has taken the operation. `applied` and
`failed` are terminal. Cancellation does not materialize anything, does not
send SQS, and does not delete history. A cancelled create leaves no entity; a
cancelled update leaves the previous value; a cancelled delete leaves the
resource.

There is no config-change DELETE endpoint. The API retains every history row;
the sparse repair of old snapshots is historical compatibility data and does
not alter this retention rule.

## SQS and replay

After committing a promotion to `pending`, AP-v4 sends the aggregate event
directly to SQS and returns/logs the SQS message ID and request correlation.
If delivery fails, use:

```http
POST /mgd/setups/{id_setup}/config-changes/replay
```

Replay only resends existing `pending` rows. It does not create an outbox row,
change state, or write entities. Queue retry and DLQ policy are external.

## Importer exception

`POST /mgd/gateways/{id_setup}/imports` is the reverse of proposal ingestion.
It receives values that already exist in the source gateway and overwrites or
upserts normalized MGD rows in one effective operation. It records effective
changes as terminal `applied`; `dry_run` rolls back both rows and history,
`strict` makes importer flags hard errors, and `force` cancels only
pre-execution proposals before the import. The importer is not proposal-only.

## HTTP errors

`400` means invalid input or scope. `404` means the resource is absent from the
requested account/gateway/child scope. `409` means uniqueness, dependency,
state-transition, cancellation, or optimistic-precondition conflict. A `500`
is an implementation defect, not a domain result.
