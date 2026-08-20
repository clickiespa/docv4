# MGD canonical REST contract

This is the source-facing contract for `/mgd/*`. Other AP-v4 routes remain
ordinary REST resources and do not use this state machine. Deployed URLs add
the `/v4` prefix. Requests use the normal AP-v4 envelope, `Authorization`,
and `Account: <ID_ACCOUNT>` headers.

## Mutation response

Every operational MGD `POST`, `PUT`, and `DELETE` returns `202` and records a
proposal. It does not write the canonical entity table. The response is:

```json
{
  "status": "success",
  "data": {
    "status": "proposed",
    "change_group_key": "uuid",
    "changes": [
      {
        "id_setup_gateway_config_change": 9001,
        "operation": "C",
        "id_resource": null,
        "resource_key": "mgd:uuid",
        "change_status": "on_hold",
        "before_value": null,
        "after_value": {"id_setup_gateway_component": 14}
      }
    ]
  }
}
```

The integer resource ID is absent until the external processor reports
`applied` through the status endpoint. A `resource_key` is the identity used
for dependencies and projections before that point.

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
| `POST /mgd/gateways` | Proposes the root `setup_gateway_configs` resource. |
| `GET /mgd/gateways/{id_setup}` | Gateway setup detail and current applied config. |
| `PUT/DELETE /mgd/gateways/{id_setup}` | Proposes an update or delete of the root config. |
| `GET /mgd/gateways/{id_setup}/components` | Components owned by the gateway. |
| `POST /mgd/gateways/{id_setup}/components` | Proposes a component. |
| `GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}` | One component by primary key. |
| `PUT/DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}` | Proposes one component mutation. |
| `GET /mgd/gateways/{id_setup}/config-json?projection=applied\|proposed` | Returns the functional JSON projection. |

The API uses the actual integer device status value from `devices`; it does
not invent labels such as `degraded`.

### Devices, configs, and points

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/{id_setup}/devices` | Lists each child setup once, with `has_device_config` and `id_setup_gateway_device_config_ids`. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}` | Child setup resource. It never becomes `409` merely because several configs exist. |
| `GET/POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs` | Lists or proposes one `setup_gateway_device_configs` resource under the child. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}` | One config by row primary key. |
| `PUT/DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}` | Proposes one config mutation. |
| `GET/POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}/points` | Lists or proposes device points under one config. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}/points/{id_device_model_point}` | One point resolved by config plus catalog point ID. |
| `PUT/DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}/points/{id_device_model_point}` | Proposes one point mutation. |

There is no `POST /devices`, no query-string resolver for singular configs,
and no aggregate `/devices/{child}/points` route. Physical device fields such
as `device_key`, `connection`, and `function_status` belong to the config
resource, not to the child setup representation.

### Point groups and links

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups` | Lists groups in the child config scope. |
| `POST .../point-groups` | Proposes a group. |
| `GET/PUT/DELETE .../point-groups/{id_setup_gateway_point_group}` | Resolves one group by primary key. |
| `GET .../{group}/points` | Lists group-point links. |
| `POST .../{group}/points` | Proposes links to existing device-point IDs. |
| `DELETE .../{group}/points/{id_device_model_point}` | Proposes removal of one link. |
| `GET .../{group}/special-days` | Lists group-special-day links. |
| `POST .../{group}/special-days` | Proposes links to existing special-day IDs. |
| `DELETE .../{group}/special-days/{id_setup_gateway_special_day}` | Proposes removal of one link. |

`{group}` is always `id_setup_gateway_point_group`. Name-based paths and the
`scope` query resolver do not exist. The data rule remains: a config may have
at most one `everyday` and one `special_day` behavior for a logical
`point_group_name`; a `special_day` behavior requires the matching `everyday`
behavior. Everyday acceptance is a point-group rule, not a device-config rule.

### Special days, schedules, and extensions

| Method and path | Meaning |
| --- | --- |
| `GET/POST /mgd/gateways/{id_setup}/special-days` | Lists or proposes reusable special-day entities. |
| `GET /mgd/gateways/{id_setup}/special-days/{special_day_id}` | One special-day entity. |
| `PUT/DELETE .../{special_day_id}` | Proposes its mutation. |
| `GET /mgd/gateways/{id_setup}/schedules` | Lists schedules and assignment summaries. |
| `POST /mgd/gateways/{id_setup}/schedules` | Proposes a schedule. Schedules may be detached from groups. |
| `GET /mgd/gateways/{id_setup}/schedules/{schedule_id}` | One schedule. |
| `PUT/DELETE .../{schedule_id}` | Proposes a schedule mutation. |
| `GET /mgd/gateways/{id_setup}/components/{component_id}/schedules` | Schedules belonging to one component. |
| `GET/PUT/DELETE .../components/{component_id}/schedules/{schedule_id}` | Reads or proposes schedule/group assignment changes. |
| `GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions` | Extensions attached to one schedule. |
| `POST .../schedules/{schedule_id}/extensions` | Proposes a new extension and bridge. |
| `POST .../schedules/{schedule_id}/extensions/{extension_id}` | Proposes attachment of an existing extension. |
| `PUT/DELETE .../schedules/{schedule_id}/extensions/{extension_id}` | Proposes update or bridge removal. |
| `GET/PUT/DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days` | Reads or proposes aggregate special-day links for groups using a schedule. |
| `GET/POST /mgd/gateways/{id_setup}/extensions` | Lists or proposes extension entities. |
| `GET/PUT/DELETE /mgd/gateways/{id_setup}/extensions/{extension_id}` | One extension entity. |

### Config changes, replay, reconciliation, importer

| Method and path | Meaning |
| --- | --- |
| `GET /mgd/gateways/{id_setup}/config-changes` | Paginated history. Filters: `change_status`, `change_group_key`, `operation=C\|U\|D`, `limit`, `offset`, and opt-in `include_config_sync=true`. |
| `GET /mgd/gateways/{id_setup}/config-sync` | Expensive synchronization view, only when explicitly requested. |
| `GET /mgd/gateways/{id_setup}/config-changes/{change_id}` | One immutable history row. |
| `PATCH /mgd/gateways/{id_setup}/config-changes/{change_id}/status` | Worker status transition. `applied` materializes the entity in the API transaction. |
| `PATCH /mgd/gateways/{id_setup}/config-changes/status` | Same transition for selected IDs or one group; dependencies are ordered internally. |
| `POST /mgd/setups/{id_setup}/config-changes/reconcile` | Promotes eligible `on_hold` rows and demotes installed-state-dependent `pending` rows. |
| `POST /mgd/setups/{id_setup}/config-changes/replay` | Re-sends SQS for existing `pending` rows after a send failure. |
| `POST /mgd/gateways/{id_setup}/imports` | Effective reverse import. Upserts normalized rows and records terminal `applied` changes; `dry_run` rolls back, `strict` rejects flags, `force` cancels pre-execution proposals. |

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
| Config change | `change_id` | History is append-only; a proposal uses `id_resource` or `resource_key`. |

Collection GETs list all resources. Singular routes use the ID shown in the
parent collection; they never choose the first matching row. Domain conflicts,
illegal transitions, duplicate links, and unresolved dependencies return `409`.
Invalid input returns `400`; an absent scoped resource returns `404`.

See [state transitions](mgd_config_change_states.md), [proposal storage](mgd_proposal_storage.md), and [JSON projection](mgd_json_projection.md).
