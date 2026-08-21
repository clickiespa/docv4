# MGD canonical REST contract

This is the source-facing contract for `/mgd/*`. Other AP-v4 routes remain
ordinary REST resources and do not use this state machine. Deployed URLs add
the `/v4` prefix. Requests use the normal AP-v4 envelope, `Authorization`,
and `Account: <ID_ACCOUNT>` headers.

## Mutation response

Every operational MGD `POST`, `PUT`, and `DELETE` persists the canonical
entity and the history row together, then returns `202`. Clickie already shows
the new value; the device catches up when the worker reports `applied`. The
response is:

```json
{
  "status": "success",
  "data": {
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
}
```

`id_resource` is the real primary key at mutation time. There is no
`resource_key`. When the worker requests `applied`, the API confirms that the
live row still matches; it does not create the entity again. `cancelled` and
`failed` compensate internally. A deterministic conflict returns `409` and
does not leave a partially applied row. `pending` is not cancelled: SQS may
already have reached the worker. A `cancelled` PATCH on `pending` returns
`409`. If the worker receives `409` when requesting `in_progress` or
`applied`, it abandons the SQS message and does not retry until `applied`.
`in_progress` is not cancelled either.

Templates are catalog resources and keep their own CRUD response. Import is
the inverse path and writes already-effective values; it returns its import
summary and records effective changes as `applied`.

## Canonical route map

### Catalog and templates

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/templates` | Account-visible templates. Identity: `id_gateway_config_template`. |
| `POST /mgd/gateways/templates` | Create an account-owned template. |
| `GET/PUT/DELETE /mgd/gateways/templates/{id_gateway_config_template}` | Read or mutate one template. System templates are read-only. |
| `GET /mgd/gateways/component-types` | Component type catalog. |
| `GET /mgd/gateways/component-types/{id_gateway_component_type}` | One component type. |
| `GET /mgd/gateways/schedule-types` | Schedule type catalog. Schedules use `id_gateway_schedule_type`. |
| `GET /mgd/gateways/protocols` | Protocol catalog. |
| `GET /mgd/gateways/component-protocols` | Valid component/protocol combinations. |

### Gateways and components

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways` | Lists gateway setups and checks whether `setup_gateway_configs` exists. It includes the direct `devices.id_device_status`, asset summary and installation flags. |
| `POST /mgd/gateways` | Creates the root `setup_gateway_configs` resource and records the change. |
| `GET /mgd/gateways/{id_setup}` | Gateway setup detail and current applied config. |
| `PUT/DELETE /mgd/gateways/{id_setup}` | Updates or deletes the root config and records the change. |
| `GET /mgd/gateways/{id_setup}/components` | Components owned by the gateway. |
| `POST /mgd/gateways/{id_setup}/components` | Creates a component and records the change. |
| `GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}` | One component by primary key. |
| `PUT/DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}` | Mutates one component and records the change. |
| `GET /mgd/gateways/{id_setup}/config-json?projection=applied\|proposed` | Returns the functional JSON projection. |

The API uses the actual integer device status value from `devices`; it does
not invent labels such as `degraded`.

### Devices, configs, and points

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/{id_setup}/devices` | Lists each child setup once, with `has_device_config` and `id_setup_gateway_device_config_ids`. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}` | Child setup resource. It never becomes `409` merely because several configs exist. |
| `GET/POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs` | Lists or creates one `setup_gateway_device_configs` resource under the child. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}` | One config by row primary key. |
| `PUT/DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}` | Mutates one config and records the change. |
| `GET/POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}/points` | Lists or creates device points under one config. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}/points/{id_device_model_point}` | One point resolved by config plus catalog point ID. |
| `PUT/DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}/points/{id_device_model_point}` | Mutates one point and records the change. |

There is no `POST /devices`, no query-string resolver for singular configs,
and no aggregate `/devices/{child}/points` route. Physical device fields such
as `device_key`, `connection`, and `function_status` belong to the config
resource, not to the child setup representation.

### Point groups and links

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups` | Lists groups in the child config scope. |
| `POST .../point-groups` | Creates a group. Writing `group → schedule` may promote that schedule and extensions already bound to it. |
| `GET/PUT/DELETE .../point-groups/{id_setup_gateway_point_group}` | Resolves one group by primary key. |
| `GET .../{group}/points` | Lists group-point links. |
| `POST .../{group}/points` | Creates links to existing device-point IDs. |
| `DELETE .../{group}/points/{id_device_model_point}` | Removes one link. |
| `GET .../{group}/special-days` | Lists group-special-day links. |
| `POST .../{group}/special-days` | Creates links to existing special-day IDs. |
| `DELETE .../{group}/special-days/{id_setup_gateway_special_day}` | Removes one link. |

`{group}` is always `id_setup_gateway_point_group`. Name-based paths and the
`scope` query resolver do not exist. The data rule remains: a config may have
at most one `everyday` and one `special_day` behavior for a logical
`point_group_name`; a `special_day` behavior requires the matching `everyday`
behavior. Everyday acceptance is a point-group rule, not a device-config rule.

### Special days, schedules, and extensions

| Method and path | Meaning |
| --- | --- |
| `GET/POST /mgd/gateways/{id_setup}/special-days` | Lists or creates reusable special-day entities. |
| `GET /mgd/gateways/{id_setup}/special-days/{special_day_id}` | One special-day entity. |
| `PUT/DELETE .../{special_day_id}` | Mutates it and records the change. |
| `GET /mgd/gateways/{id_setup}/schedules` | Lists schedules and assignment summaries. |
| `POST /mgd/gateways/{id_setup}/schedules` | Creates a schedule. Detached schedules stay `on_hold` until a live point group uses them. |
| `GET /mgd/gateways/{id_setup}/schedules/{schedule_id}` | One schedule. |
| `PUT/DELETE .../{schedule_id}` | Mutates a schedule and records the change. |
| `GET /mgd/gateways/{id_setup}/components/{component_id}/schedules` | Schedules belonging to one component. |
| `GET/PUT/DELETE .../components/{component_id}/schedules/{schedule_id}` | Reads or replaces schedule/group assignment changes. |
| `GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions` | Extensions attached to one schedule. |
| `POST .../schedules/{schedule_id}/extensions` | Creates a new extension and bridge. |
| `POST .../schedules/{schedule_id}/extensions/{extension_id}` | Attaches an existing extension and may promote that extension, not the schedule. |
| `PUT/DELETE .../schedules/{schedule_id}/extensions/{extension_id}` | Updates or removes the bridge. |
| `GET/PUT/DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days` | Reads or replaces aggregate special-day links for groups using a schedule. |
| `GET/POST /mgd/gateways/{id_setup}/extensions` | Lists or creates extension entities. Detached creates stay `on_hold`. |
| `GET/PUT/DELETE /mgd/gateways/{id_setup}/extensions/{extension_id}` | One extension entity. |

### Config changes, replay, reconciliation, importer

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/{id_setup}/config-changes` | Paginated history. Filters: `change_status`, `change_group_key`, `operation=C\|U\|D`, `id_setup_target`, `limit`, `offset`, and opt-in `include_config_sync=true`. |
| `GET /mgd/gateways/{id_setup}/config-sync` | Setup rollup plus `resources[]`. Not the edit mutex. |
| `GET /mgd/gateways/{id_setup}/config-changes/{change_id}` | One immutable history row. |
| `PATCH /mgd/gateways/{id_setup}/config-changes/{change_id}/status` | Worker/operator status transition. `applied` confirms the live row. `cancelled`/`failed` compensate first. |
| `PATCH /mgd/gateways/{id_setup}/config-changes/status` | Same transition for selected IDs or one group; compensation order is internal. |
| `POST /mgd/setups/{id_setup}/config-changes/reconcile` | Promotes eligible `on_hold` rows and demotes `pending` when the target is no longer installed. `include_children` is honored only on the gateway path. |
| `POST /mgd/setups/{id_setup}/config-changes/replay` | Re-sends SQS for existing `pending` rows after a send failure. |
| `POST /mgd/gateways/{id_setup}/imports` | Effective reverse import. Upserts normalized rows and records terminal `applied` changes; `dry_run` rolls back, `strict` rejects flags, `force` cancels `on_hold`/`retry`. |

## Identity and uniqueness

| Resource | Canonical identity | Key rule |
| --- | --- | --- |
| Gateway config | `id_setup` | One config per gateway setup. |
| Component | `id_setup_gateway_component` | One component type per gateway. |
| Device config | `config_id` under child | Belongs to exactly one gateway, component and child; `device_key` is gateway-unique. |
| Device point | `config_id/id_device_model_point` | One model point per config. |
| Point group | `id_setup_gateway_point_group` | One everyday and one special-day row per logical name/config. |
| Schedule | `schedule_id` | Unique by component, type, number, and numeric scope. |
| Special day | `special_day_id` | Unique within its component and day-group name. |
| Extension | `extension_id` | `(extension, schedule)` bridge is unique. |
| Config change | `change_id` | History is append-only; `id_resource` is the real PK and `id_setup_target` is required. |

Collection GETs list all resources. Singular routes use the ID shown in the
parent collection; they never choose the first matching row. Domain conflicts,
illegal transitions, duplicate links, live catalog links, and graph conflicts
return `409` with `reason`/`look_at` context. Invalid input returns `400`; an
absent scoped resource returns `404`.

See [state transitions](mgd_config_change_states.md), [eager persistence](mgd_proposal_storage.md), [device-config model](mgd_device_config_model.md), and [JSON projection](mgd_json_projection.md).
