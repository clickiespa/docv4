# MGD gateway endpoints

This is the endpoint-level companion to [the canonical contract](mgd_canonical_contract.md).
It covers `/mgd/*` only. Other AP-v4 routes remain ordinary REST resources.

Paths omit the deployment-stage prefix. The public AP-v4 deployment consumes
these routes under `/v4/mgd`; `/mgd` and `/dev/mgd` are technical mounts of the
full AP-v4 router, not alternate MGD contracts or legacy resource routes.

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
`pending` is not cancellable. Cancellable states are `on_hold` and `retry`.

Templates are catalog CRUD and keep normal responses. Import is the inverse
path: it receives values already effective in the gateway, upserts the MGD
tables, and records effective writes as `applied`.

## Gateway and component resources

```text
GET            /mgd/gateways
POST           /mgd/gateways
GET            /mgd/gateways/{id_setup}
PUT/DELETE     /mgd/gateways/{id_setup}
GET/POST       /mgd/gateways/{id_setup}/components
GET            /mgd/gateways/{id_setup}/components/{component}
PUT/DELETE     /mgd/gateways/{id_setup}/components/{component}
GET            /mgd/gateways/{id_setup}/config-json?projection=applied|proposed
```

The gateway collection lists setups and reports whether a corresponding
`setup_gateway_config` exists. It also exposes `asset` and the direct
`devices.id_device_status` value as `id_device_status`; the API does not invent
derived labels such as `degraded`.

## Devices and device-configs

```text
GET            /mgd/gateways/{gateway}/devices
GET            /mgd/gateways/{gateway}/devices/{child}
GET            /mgd/gateways/{gateway}/devices/{child}/configs
POST           /mgd/gateways/{gateway}/devices/{child}/configs
GET            /mgd/gateways/{gateway}/devices/{child}/configs/{config}
PUT/DELETE     /mgd/gateways/{gateway}/devices/{child}/configs/{config}
```

`GET /devices` returns each setup-child once and includes all associated
device-config IDs. The optional `child_id_setup` query parameter is only a
collection filter. The singular child GET returns the setup-child and its
associations without selecting a config by inference, so multiple configs do
not produce `409`.

`config` is `id_setup_gateway_device_config`. Its `device_key`, `connection`,
and `function_status` are not duplicated into the child representation.

## Points and point groups

```text
GET/POST       /mgd/gateways/{gateway}/devices/{child}/configs/{config}/points
GET            /mgd/gateways/{gateway}/devices/{child}/configs/{config}/points/{model_point}
PUT/DELETE     /mgd/gateways/{gateway}/devices/{child}/configs/{config}/points/{model_point}

GET/POST       /mgd/gateways/{gateway}/devices/{child}/point-groups
GET/PUT/DELETE /mgd/gateways/{gateway}/devices/{child}/point-groups/{group}
GET/POST       /mgd/gateways/{gateway}/devices/{child}/point-groups/{group}/points
DELETE         /mgd/gateways/{gateway}/devices/{child}/point-groups/{group}/points/{model_point}
GET/POST       /mgd/gateways/{gateway}/devices/{child}/point-groups/{group}/special-days
DELETE         /mgd/gateways/{gateway}/devices/{child}/point-groups/{group}/special-days/{special_day}
```

`model_point` is `id_device_model_point`, the catalog key used to address a
point under one explicit config. `group` is
`id_setup_gateway_point_group`. Name and scope are response data, not singular
route resolvers. `everyday` is a point-group rule, not a device-config rule.

## Special days, schedules, and extensions

```text
GET/POST       /mgd/gateways/{gateway}/special-days
GET            /mgd/gateways/{gateway}/special-days/{special_day}
PUT/DELETE     /mgd/gateways/{gateway}/special-days/{special_day}

GET/POST       /mgd/gateways/{gateway}/schedules
GET            /mgd/gateways/{gateway}/schedules/{schedule}
PUT/DELETE     /mgd/gateways/{gateway}/schedules/{schedule}
GET            /mgd/gateways/{gateway}/components/{component}/schedules/{schedule}
PUT/DELETE     /mgd/gateways/{gateway}/components/{component}/schedules/{schedule}

GET/POST       /mgd/gateways/{gateway}/schedules/{schedule}/extensions
POST           /mgd/gateways/{gateway}/schedules/{schedule}/extensions/{extension}
PUT/DELETE     /mgd/gateways/{gateway}/schedules/{schedule}/extensions/{extension}
GET/POST       /mgd/gateways/{gateway}/extensions
GET/PUT/DELETE /mgd/gateways/{gateway}/extensions/{extension}

GET            /mgd/gateways/{gateway}/schedules/{schedule}/special_days
PUT/DELETE     /mgd/gateways/{gateway}/schedules/{schedule}/special_days
```

A schedule may be created without a point-group assignment. It is a valid
resource, but its change remains `on_hold` until the relationship required
for dispatch exists. Assignment is a later mutation. Writing `group → schedule`
may promote that schedule and extensions already bound to it; attaching an
existing extension promotes that extension, not the schedule. Schedules belong
to a component; point groups belong to a device-config; relationship scope and
schedule type are validated by the API.

## Changes, reconciliation, replay, and import

```text
GET   /mgd/gateways/{gateway}/config-changes
GET   /mgd/gateways/{gateway}/config-changes/{change}
PATCH /mgd/gateways/{gateway}/config-changes/{change}/status
PATCH /mgd/gateways/{gateway}/config-changes/status
GET   /mgd/gateways/{gateway}/config-sync
POST  /mgd/setups/{setup}/config-changes/reconcile
POST  /mgd/setups/{setup}/config-changes/replay
POST  /mgd/gateways/{gateway}/imports
```

The history list is paginated and ordered by `created_at DESC` and ID DESC.
It accepts `change_status`, `change_group_key`, `operation`, `id_setup_target`,
`limit`, `offset`, and opt-in `include_config_sync`. `/config-sync` is the
setup rollup plus `resources[]`; a resource GET with `include_config_sync`
talks only about that row. A non-terminal on one point group does not block
creating another resource of the same child unless a graph 409 applies. See
[config-change states](mgd_config_change_states.md).

The worker uses only the status PATCH endpoints. `applied` confirms the live
row. Reconciliation promotes eligible `on_hold` rows and demotes
installation-dependent `pending` rows without compensating. `include_children`
is honored only on the gateway path. Replay resends existing `pending`
messages after a delivery failure; it does not change status. The worker
applies the gateway snapshot and must `PATCH applied` every `pending` change
that snapshot materialized. No outbox table is part of this design.

## Identity and constraints

| Resource | REST key | Main rule |
| --- | --- | --- |
| Gateway config | gateway setup | one config per gateway |
| Component | component ID | one component type per gateway |
| Device config | config ID under child | gateway + component + child; gateway-unique `device_key` |
| Device point | model point under config | one model point per config |
| Point group | group ID | table-defined name/scope uniqueness |
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
