# MGD gateway JSON projection

## Endpoint

```http
GET /mgd/gateways/{id_setup}/config-json?projection=proposed
```

`{id_setup}` is the gateway `setups.id_setup`. `projection` accepts:

- `applied`: live canonical rows.
- `proposed`: those same rows plus `after_value` overlays from active MGD
  changes, in creation order: `on_hold`, `pending`, `in_progress`, and
  `retry`.

The response is a read envelope:

```json
{
  "id_setup": 501234,
  "id_setup_gateway": 501234,
  "projection": "proposed",
  "status": "complete",
  "active_change_ids": [901, 902],
  "cancelled_change_ids": [],
  "failed_change_ids": [],
  "unresolved": [],
  "config": {
    "json_version": "v4.1",
    "id": "gateway-1",
    "name": "Gateway 1",
    "database": {},
    "lambda_functions": {}
  }
}
```

`config` keeps the functional shape of `lambda_config.json`: links are
`device_key`, component, type, and schedule number, not internal MGD primary
keys. With eager write those primary keys already exist. If an overlay cannot
rebuild a required relationship, the response remains valid JSON but returns
`status="unresolved"` and explains why in `unresolved`; that document must not
be sent to the physical gateway.

The endpoint is read-only. It does not change `config_changes`, write rows, or
publish SQS. Compensation happens inside the API when the worker or operator
marks `cancelled` or `failed`. Clickie may show the new value while the device
still has the previous one. `include_config_sync=true` on this endpoint
attaches the **gateway** rollup hint. Per-row sync belongs on that resource’s
GET. After a compensated `failed` of a resource, `is_synchronized=true` **for
that row**.

## What `cancelled` means

`cancelled` is terminal: the intent is no longer applicable. A cancelled
proposal is excluded from `projection=proposed`:

| Case | Projection result |
| --- | --- |
| Cancelled create | Compensation deletes the row; the resource is absent. |
| Cancelled update | The previous value is restored. |
| Cancelled delete | The canonical resource is recreated. |
| Cancelled group | All of its cancellable rows are excluded as one logical unit. |

Only `on_hold` and `retry` can be cancelled. `pending` cannot: SQS may already
have arrived and the worker may have started the external process; compensating
Clickie would create drift. An `in_progress` row is not cancelled from AP-v4.
`applied` is not cancelled: if the physical value must be reverted, create a
new inverse proposal. `failed` is not reopened; create a new proposal or use
the external recovery procedure.

## Identity and keys

These table primary keys are internal integers. An eager create already has
`id_resource`. `id_setup_target` separates the gateway from each child so
scope is not inferred.

| Resource | Table | Canonical REST identity | Main relationships |
| --- | --- | --- | --- |
| Gateway config | `setup_gateway_configs` | `{id_setup}`; `id_setup_gateway_config` in the representation | one gateway, one-to-one |
| Component | `setup_gateway_components` | `{id_setup_gateway_component}` | gateway setup + `id_gateway_component_type` |
| Device config | `setup_gateway_device_configs` | `{config}` under `/devices/{child}/configs` | gateway + component + child setup |
| Device point | `setup_gateway_device_points` | `{point}` = `id_setup_gateway_device_point` | device config + catalog `id_device_model_point` |
| Point group | `setup_gateway_point_groups` | `{group}` = `id_setup_gateway_point_group` | device config + optional schedule |
| Schedule | `setup_gateway_schedules` | `{schedule}` = `id_setup_gateway_schedule` | component + schedule type + scope |
| Special day | `setup_gateway_special_days` | `{special_day}` = `id_setup_gateway_special_day` | component |
| Extension | `setup_gateway_extensions` | `{extension}` = `id_setup_gateway_extension` | component + schedules via bridge |
| Point-group point | `setup_gateway_point_group_points` | `{link}` = bridge PK | group + device point |
| Point-group special day | `setup_gateway_point_group_special_days` | `{link}` = bridge PK | group + special day |
| Extension schedule | `setup_gateway_extension_schedules` | `{link}` = bridge PK | extension + schedule |
| Config change | `setup_gateway_config_changes` | `{change}` = `id_setup_gateway_config_change` | gateway + target + entity + resource |

`id_device_model_point` is not the MGD `device_point` row ID; it is the model
catalog reference. The final device-point path uses
`id_setup_gateway_device_point` and keeps `id_device_model_point` as the
catalog reference.

## Uniqueness enforced by the database

These constraints are part of the contract and must not be duplicated with
“first row wins” resolvers in the repository:

| Rule | Constraint |
| --- | --- |
| One root config per gateway | `UNIQUE(id_setup_gateway)` |
| One component of each type per setup | `UNIQUE(id_setup, id_gateway_component_type)` |
| One device key per gateway | `UNIQUE(id_setup_gateway, device_key)` |
| One catalog point per device config | `UNIQUE(id_setup_gateway_device_config, id_device_model_point)` |
| One schedule per type/number/scope/component | `UNIQUE(id_setup_gateway_component, id_gateway_schedule_type, schedule_number, schedule_scope_type)` |
| One special-day per component and name | `UNIQUE(id_setup_gateway_component, day_group_name)` |
| One extension per schedule | `UNIQUE(id_setup_gateway_extension, id_setup_gateway_schedule)` |
| One point in a group | `UNIQUE(id_setup_gateway_point_group, id_setup_gateway_device_point)` |
| One special day in a group | `UNIQUE(id_setup_gateway_point_group, id_setup_gateway_special_day)` |

Create/mutation `409`s correspond to a collision of these rules, an ambiguous
singular selector, or an incompatible relationship. A collection GET lists
every row and does not use `409` to express multiplicity.

## Relationships and content rules

```text
gateway setup
├── setup_gateway_config (1)
├── components (N)
│   ├── schedules (N)
│   ├── special_days (N)
│   ├── extensions (N) ── extension_schedules ── schedules
│   └── device_configs (N) per child setup
│       ├── device_points (N)
│       └── point_groups (N)
│           ├── point_group_points ── device_points
│           └── point_group_special_days ── special_days
```

- A schedule can be created without assigning it to a group. It is valid as a
  canonical row, but stays `on_hold` until the relationship that enables
  dispatch exists.
- `everyday` and `special_day` are scopes of `setup_gateway_schedules`. An
  everyday schedule is used for the group’s usual configuration and for
  extensions; an extension cannot point at a `special_day` schedule.
- Schedules belong to the component; point groups belong to the device
  config. The API validates that the group and schedule are compatible and
  that the schedule belongs to the same component.
- The importer is the reverse path: it receives effective JSON, upserts rows,
  and records only effective writes as `applied`. It is not a proposal
  source.

## Persistence, promotion, and SQS

`before_value` and `after_value` are sparse patches: they contain only keys
that actually changed, except a delete that stores the domain snapshot. An
absent key means “do not touch”; a present key with `null` means “clear”. The
entity table reflects the new value from the mutation; `applied` only confirms
that it still matches.

The database requires `id_setup_target NOT NULL` and `id_resource NOT NULL`.
It does not use `resource_key` or a dependency table. It does not need an
outbox. When a group becomes `pending`, AP-v4 commits and sends the aggregate
event directly to SQS. If send fails,
`POST /mgd/setups/{id_setup}/config-changes/replay` republishes it without
changing status. The send response keeps `request_id` and `message_id`.

Endpoints outside `/mgd/*` do not use this state machine or this log.

`400` is an invalid projection or request, `404` is an out-of-scope gateway,
and `409` is a deterministic relationship conflict. An unexpected `500` is an
implementation defect.
