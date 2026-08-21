# MGD eager persistence and compensation

This model applies only to `/mgd/*`. The rest of AP-v4 remains ordinary REST.

## Recording a mutation

`setup_gateway_config_changes` is permanent history. A row contains:

| Field | Rule |
| --- | --- |
| `id_setup_gateway` | Owning gateway aggregate. |
| `id_setup_target` | Gateway or child used by installation and promotion. |
| `id_entity` | Canonical MGD entity. |
| `id_resource` | Real primary key of the canonical row. Always present. |
| `operation` | `C`, `U`, or `D`. |
| `before_value` | Changed keys; on delete, the domain snapshot used to restore. |
| `after_value` | Requested/changed keys. |
| `change_status` | MGD state-machine value. |

The entity table is written at the same time as the log. There is no
`resource_key`, no `mgd:…` token, and no logical-dependency table: canonical
foreign keys already exist when a child is inserted.

The production upgrade `upgrade_4.2.1_mgd_eager_preserve_catalog.sql` emptied
the MGD resource tables (device configs, points, schedules, groups,
extensions, and the change log), added `id_setup_target NOT NULL` and indexes,
and kept the catalog plus the uneditable seed (`gateway_*` types, protocols,
and templates; `setup_gateway_configs`; `setup_gateway_components`). There was
no backfill.

## API-owned compensation

The worker has no direct database access. The HTTP trigger for `cancelled` and
`failed` is the status PATCH: lock the change with `FOR UPDATE`, compensate,
then write the terminal. Uninstall and import `force` call the same
compensation, but only to move `on_hold`/`retry` to `cancelled`; never to
`failed`. Reconcile does not compensate. Process diagrams live in
[config-change states](mgd_config_change_states.md).

`applied` confirms that the live row matches the post-mutation value.
`cancelled` and `failed` revert create/update/delete (delete the create, sparse
merge of `before_value`, recreate the delete) before marking status.

An atomic group is compensated in reverse apply order: creates newest to
oldest, then updates, then restore of deletes oldest to newest. UNIQUE/FK
collision or a live row that no longer matches returns `409` and does not
change status.

The SQS race is serialized by the lock. `pending` is not cancelled: the
message may already be at the worker, and compensating Clickie would create
drift. If the worker receives `409` when moving to `in_progress` or
`applied`, it abandons the message and does not retry until `applied`.

## Clickie versus the device

With eager write, Clickie already shows the new value while the device still
has the previous value until `applied`. That is not a defect of the resource
GET. Opt-in `config_sync` on GET/202 is **for that row**
(`id_entity`+`id_resource`). `GET .../config-sync` of the setup is the rollup
plus `resources[]`. An `applied` point may be synchronized while a group on
the same child is still `pending`. The edit mutex and A/B 409s are in
[config-change states](mgd_config_change_states.md).
`config-json?projection=applied` reads live rows; `proposed` overlays
`after_value` of non-terminal changes. With eager write the two views almost
always match.

`failed` compensates Clickie to the previous value. The worker reports
`failed` only when the device does not have the new value; then
`is_synchronized=true`. `cancelled` is user abandonment. Do not reuse
`failed` for “the user gave up”. The demotion `pending → on_hold` does not
compensate: the value stays applied in Clickie.

## Responses and queries

MGD mutations return `202` with the group, `config_changes` rows (real primary
keys), an optional `entity` snapshot, and `config_sync` when requested.
Resource, detail, MGD list, and `config-json` GETs accept
`include_config_sync=false` by default. Catalogs do not. `GET .../config-sync`
remains the dedicated endpoint. `GET /mgd/gateways/{id_setup}/config-changes`
uses stable pagination by `created_at` and ID. It accepts `id_setup_target`.

A nested create resolves `id_setup_target` from the resource `id_setup` or
from the already-persisted parent FK chain. If the child is resolvable it
does not fall back to the gateway. Initial `pending` uses that target.

## Cancellation and retention

`on_hold` and `retry` can become `cancelled`. `pending` and `in_progress`
cannot; `applied` and `failed` are terminal. Cancel keeps history and
compensates the entity. `pending` is not cancelled because SQS may already
have reached the worker. Uninstall and import with `force` return `409` if
any row is `pending`.

## Direct SQS

The API commits the promotion to `pending` and sends the aggregate event
directly to SQS. The result keeps `request_id` and `message_id`. `replay`
resends `pending` changes without adding an outbox table.

## Importer

The importer receives already-effective configurations and upserts or
overwrites MGD entities. It records effective writes as `applied`. With
`force` it cancels `on_hold` and `retry`; `pending` and `in_progress` return
`409`.
