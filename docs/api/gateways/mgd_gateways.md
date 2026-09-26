# MGD gateway endpoints

This is the endpoint-level companion to [the canonical contract](mgd_canonical_contract.md).
It covers `/mgd/*` only. Other AP-v4 routes remain ordinary REST resources.

Paths omit the deployment-stage prefix. The public AP-v4 deployment consumes
these routes under `/v4/mgd`; `/mgd` and `/dev/mgd` are technical mounts of the
full AP-v4 router, not alternate MGD contracts or legacy resource routes.

For the complete operation-by-operation reference, including exact path
parameter names, query parameters, filters, defaults, request-body fields,
Pydantic models, examples, and status codes, see the [MGD endpoint reference](mgd_endpoint_reference.md).
That reference is generated from the active AP-v4 OpenAPI contract.

## Response rule

Operational MGD resource `POST`, `PUT`, and `DELETE` persist the entity and
return `202 Accepted`:

```json
{
  "status": "proposed",
  "change_group_key": "uuid",
  "entity": {
    "id_resource": 14,
    "id_entity": 90,
    "operation": "C",
    "id_setup_target": 501234,
    "value": {"id_setup_gateway_component": 14}
  },
  "changes": [
    {
      "id_setup_gateway_config_change": 9001,
      "operation": "C",
      "id_resource": 14,
      "change_status": "on_hold",
      "before_value": null,
      "after_value": {"id_setup_gateway_component": 14}
    }
  ]
}
```

Clickie already shows the new value. The external worker has no direct MGD
database access. It reports status through the API; `applied` confirms that
the live row still matches, and `cancelled`/`failed` compensate internally.
`on_hold`, `pending`, and `retry` are cancellable; `in_progress` is not. A
cancelled `pending` change compensates Clickie, and a worker transition that
arrives afterward receives `409`.

Templates are catalog CRUD and keep normal responses. Import is the inverse
path: it receives values already effective in the gateway, reconciles the
complete snapshot against the gateway MGD tables, records effective creates,
updates, and deletes as `applied`, and preserves the global catalog.

## Gateway and component resources

```text
GET            /mgd/gateways
POST           /mgd/gateways
GET            /mgd/gateways/{id_setup}
PUT/DELETE     /mgd/gateways/{id_setup}
GET/POST       /mgd/gateways/{id_setup}/components
GET            /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
PUT/DELETE     /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
GET            /mgd/gateways/{id_setup}/config-json?projection=applied|proposed
```

The gateway collection lists setups and reports whether a corresponding
`setup_gateway_config` exists. It also exposes `asset` and the direct
`devices.id_device_status` value as `id_device_status`; the API does not invent
derived labels such as `degraded`.

## Devices and device-configs

```text
GET            /mgd/gateways/{id_setup}/devices
GET            /mgd/gateways/{id_setup}/devices/{child_id_setup}
GET            /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs
POST           /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs
GET            /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}
PUT/DELETE     /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}
```

`GET /devices` returns each setup-child once and includes all associated
device-config IDs. The optional `child_id_setup` query parameter is only a
collection filter. The singular child GET returns the setup-child and its
associations without selecting a config by inference, so multiple configs do
not produce `409`. See the endpoint reference for the exact parameter tables.

`config` is `id_setup_gateway_device_config`. Its `device_key`, `connection`,
and `function_status` are not duplicated into the child representation.

## Points and point groups

```text
GET/POST       /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points
GET            /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
PUT/DELETE     /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}

GET/POST       /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups
GET/PUT/DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}
GET/POST       /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points
DELETE         /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points/{id_device_model_point}
GET/POST       /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days
DELETE         /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days/{id_setup_gateway_special_day}
```

`model_point` is `id_device_model_point`, the catalog key used to address a
point under one explicit config. `group` is
`id_setup_gateway_point_group`. Name and scope are response data, not singular
route resolvers. `everyday` is a point-group rule, not a device-config rule.

### Point-level group membership rules

The constraints below are evaluated for each `id_device_model_point`, not for a
group name and not by pairing groups with names such as
`point_group_special_day_requires_everyday`:

- a point may belong to at most one group with an `everyday` schedule scope;
- multiple groups with a `special_day` scope are allowed when they represent
  different day groups;
- a point may belong to a `special_day` group only after it belongs to an
  `everyday` group;
- a point group without a schedule is allowed. Its `unscheduled` scope does
  not consume either scheduled membership slot.

The API validates these rules while locking the affected device-point and
relationship rows. Import validation applies the same rules to the complete
snapshot and rolls back an invalid graph. Group names are descriptive data and
do not establish, require, or remove any relationship between groups.

## Special days, schedules, and extensions

```text
GET/POST       /mgd/gateways/{id_setup}/special-days
GET            /mgd/gateways/{id_setup}/special-days/{special_day_id}
PUT/DELETE     /mgd/gateways/{id_setup}/special-days/{special_day_id}

GET/POST       /mgd/gateways/{id_setup}/schedules
GET            /mgd/gateways/{id_setup}/schedules/{schedule_id}
PUT/DELETE     /mgd/gateways/{id_setup}/schedules/{schedule_id}
GET            /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
PUT/DELETE     /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}

GET/POST       /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions
POST           /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
PUT/DELETE     /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
GET/POST       /mgd/gateways/{id_setup}/extensions
GET/PUT/DELETE /mgd/gateways/{id_setup}/extensions/{extension_id}

GET            /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
PUT/DELETE     /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
```

A schedule may be created without a point-group assignment. It is a valid
resource, but its create or update change remains `on_hold` until the
relationship required for dispatch exists. Assignment is a later mutation.
Writing `group → schedule` may promote that schedule and extensions already
bound to it; attaching an existing extension promotes that extension, not the
schedule. Deleting a schedule is different: on an installed gateway, its
`DELETE` change goes directly to `pending` even without a point group, so the
worker can remove an orphan schedule that was present in the previous gateway
configuration. On an uninstalled gateway it stays `on_hold` and can be
promoted by `reconcile` after installation. Schedules belong to a component;
point groups belong to a device-config; relationship scope and schedule type
are validated by the API.

## Changes, reconciliation, replay, and import

```text
GET   /mgd/gateways/{id_setup}/config-changes
GET   /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}
PATCH /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}/status
PATCH /mgd/gateways/{id_setup}/config-changes/status
GET   /mgd/gateways/{id_setup}/config-sync
POST  /mgd/setups/{id_setup}/config-changes/reconcile
POST  /mgd/setups/{id_setup}/config-changes/replay
POST  /mgd/gateways/{id_setup}/imports
```

The history list is paginated and ordered by `created_at DESC` and ID DESC.
It accepts inclusive UNIX-second `from` and `to` filters over `created_at`, in
addition to `change_status`, `change_group_key`, `operation`,
`id_setup_target`, `limit`, `offset`, and opt-in `include_config_sync`.
`/config-sync` is the
setup rollup plus `resources[]`; supplying the complete `id_entity` and
`id_resource` pair returns only that resource, while `id_setup_target` can
scope a child target. An incomplete resource pair returns `400`. This is an
indexed resource lookup, not a client-side scan of every gateway change. A
non-terminal on one point group does not block creating another resource of
the same child unless a graph 409 applies. With only `from`, the upper bound
is the current UTC second; with only `to`, the lower bound is omitted. An
explicit `from > to` returns `400` and the API does not swap the values. The
date filters compose with the existing filters and offset pagination. See
[config-change states](mgd_config_change_states.md).

The worker uses only the status PATCH endpoints. It may include optional
`scheduled_at` in the same payload; when omitted, the API preserves the row's
existing value. `applied` confirms the canonical row and records the status
transition. Reconciliation promotes eligible `on_hold` rows and demotes
installation-dependent `pending` rows without compensating. `include_children`
is honored only on the gateway path. Replay resends existing `pending`
messages after a delivery failure; it does not change status. The worker
applies the gateway snapshot and must `PATCH applied` every `pending` change
that snapshot materialized. No outbox table is part of this design.

### Import payload rules

`POST /mgd/gateways/{gateway}/imports` accepts JSON documents with
`json_version` at or above `v4.1`. In a relay device, `special_days` is the
v4.3 list form only:

```json
"special_days": [
  {
    "day_groups": ["holidays"],
    "config_x_relay": {
      "Tset_special": {"config": "off", "registers": ["relay_1"]}
    }
  }
]
```

The legacy dictionary keyed by arbitrary names is not accepted. With
`strict=true`, the API returns `400` with the validation message
`Per-device special_days must be a list` and rolls back the import. With
`strict=false`, the invalid device section is skipped, the remaining valid
snapshot is imported, and the response contains the warning/flag
`special_days_invalid_format`. The component-level `special_days` mapping is
different: its keys identify reusable special-day catalog rows and remains
supported.

`channel_configs` is stored as component `settings`; it is not imported as a
dedicated table. The `connection.resource` field is an ignored legacy key and
is not persisted. A model-point reference with complete metadata is registered
in the catalog; `model_point_catalog_missing` remains limited to references that
do not provide enough metadata to register the point.

When a new change is created, the API moves existing `retry` rows for the same
gateway into the same approximate `now + 1 minute` dispatch window. It keeps
their current retry count; the external worker owns the backoff and increases
that count after a subsequent failed attempt. `on_hold` rows are excluded and
do not have `scheduled_at`. Cancelling one change also cancels its cancellable
siblings (`on_hold`, `pending`, and `retry`) with the same
`change_group_key`. An `in_progress` sibling makes the whole cancellation
return `409` without partial compensation.

## Importer JSON v4.3

`POST /mgd/gateways/{id_setup}/imports` accepts canonical JSON with
`json_version >= v4.1`; for importer input, the current device-level
`special_days` contract is the v4.3 list shape only. The database schema is
unchanged.

```json
{
  "json_version": "v4.3",
  "lambda_functions": {
    "GG_relay_control": {
      "devices": {
        "Iluminacion_1": {
          "id": "10000000e0570554",
          "device_type": "WSTRTURelay8RO8DI",
          "special_days": [
            {
              "day_groups": ["irrenunciables"],
              "config_x_relay": {"night": {"registers": ["Tset"]}}
            }
          ]
        }
      }
    }
  }
}
```

The legacy dictionary form is invalid. With `strict=false`, the importer
reports `special_days_invalid_format`, marks the flag, skips that section, and
continues the import. With `strict=true`, the API returns `400` with the
validation detail `Per-device special_days must be a list` (or the equivalent
entry-object detail). Component-level reusable `special_days` remains a
mapping. The ultra-legacy device connection `resource` field is not imported;
`channel_configs` is stored in `setup_gateway_components.settings`. The
`model_point_catalog_missing` warning remains for references without enough
metadata; complete point metadata can still register the point.

The importer also rejects malformed payloads with a structured `400` before
the transaction commits. This includes a non-object
`lambda_functions.<component>.devices` value (use `{}` when there are no
devices), a physical register without `address` or `gpio`, a non-positive
component `schedule.every`, and a relay point group missing
`schedule_type`, `schedule_number`, `config`, or `registers`. The error
identifies the invalid JSON path and the snapshot is rolled back, so these
client-payload errors do not become an unexpected `500` or a partial import.

The import is a complete effective snapshot: present managed rows are
upserted, absent managed rows are deleted, and effective writes are recorded as
`applied`. `dry_run` rolls back, `force` can cancel `on_hold`/`pending`/`retry`,
and an `in_progress` row still returns `409`.

## Identity and constraints

| Resource | REST key | Main rule |
| --- | --- | --- |
| Gateway config | gateway setup | one config per gateway |
| Component | component ID | one component type per gateway |
| Device config | config ID under child | gateway + component + child; gateway-unique `device_key` |
| Device point | model point under config | one model point per config |
| Point group | group ID | point-level membership cardinality and schedule-scope compatibility |
| Schedule | schedule ID | component + type + number + scope |
| Special day | special-day ID | component + name |
| Extension | extension ID | unique extension-schedule bridge |
| Config change | change ID | append-only history; real `id_resource` and `id_setup_target` |

`400` is invalid input or enum, `404` is an absent scoped resource, and
`409` is a uniqueness, graph, catalog-link, state, precondition, or
singular-selection conflict. Collections list all rows and never return `409`
for multiplicity.

## Related guides

- [Canonical contract](mgd_canonical_contract.md)
- [Device-config identity](mgd_device_config_model.md)
- [States, promotion, compensation, and processes](mgd_config_change_states.md)
- [Eager persistence and compensation](mgd_proposal_storage.md)
- [JSON projection](mgd_json_projection.md)
