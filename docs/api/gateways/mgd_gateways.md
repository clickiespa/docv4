# MGD Gateways

Public reference for the platform-facing MGD gateway configuration API under
the `/mgd` route group. This page documents the ClickieV4 `4.2.1` contract;
database upgrades are maintained in the canonical `clickie-platform` database
branch, while SQL files under `assets/mgd/Archive/` in this legacy repository
remain historical references only.

MGD manages normalized gateway configuration resources and their relationships:
gateway configuration, components, child-device bindings, model points, point
groups, special days, schedules, extensions, templates, imports, and tracked
configuration changes.

All endpoints in this guide use paths relative to the API base URL. The
production Postman collection uses the same paths with the `/v4` deployment
prefix. Clearance A2 or A1 is required for the endpoints in this document.

Every successful response uses the standard envelope:

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/endpoint/path"
}
```

Clearance A2 or A1 is required to use the endpoints in this document.

## Concepts

- A **gateway config** (`setup_gateway_configs`) stores the root technical settings of one gateway setup.
- A **component** (`setup_gateway_components`) represents one active gateway module such as `reader_rtu`, `reader_tcp`, `reader_gpio`, `relay_control`, or `log_reader`.
- A **device config** (`setup_gateway_device_configs`) tells the exporter how a child logical setup appears inside the gateway JSON. It does not create a physical device.
- A **device point** (`setup_gateway_device_points`) enables one technical point of that configured device for export/use.
- A **point group** (`setup_gateway_point_groups`) represents one control block under `GG_relay_control.devices.*.config_x_relay` or `GG_relay_control.devices.*.special_days.*.config_x_relay`.
- A **special day** (`setup_gateway_special_days`) names a reusable day set such as `Holidays`.
- A **schedule** (`setup_gateway_schedules`) stores one canonical operating schedule.
- An **extension** (`setup_gateway_extensions`) stores one temporary override range and is linked to schedules through `setup_gateway_extension_schedules`.
- A **config change** (`setup_gateway_config_changes`) logs every tracked MGD write.

## Config-change flow

The canonical status domain, transition machine, installation predicate,
conflict guard, and reconciliation endpoint live in
[`MGD config-change states and activation`](mgd_config_change_states.md). A tracked
mutation enters `pending` only when its gateway or child setup has a current
main installation; otherwise it enters `on_hold`. Gateway and child targets
are independent. Installing a device does not promote changes automatically:
call `POST /mgd/setups/{id_setup}/config-changes/reconcile` when the business
flow is ready to synchronize it.

MGD responses expose `config_sync`, which reports whether the canonical value
may still differ from the latest `config_changes` state. A non-terminal change
means consumers must not assume that the row value is already applied.

The importer is an operational exception: every effective insert or upsert is
recorded directly as terminal `applied`, with the authenticated user and one
shared `change_group_key` per import. By default it rejects existing
non-terminal changes; `force=true` cancels them in the same transaction before
writing the imported resources. The data writes and tracking rows share one
transaction, so a dry run or failed import rolls back both.

### SQS output after pending changes

After an effective MGD mutation commits with `pending` status, API-V4 sends one
message to trigger the external MGD configuration processor. The message
contains the gateway and session-account identifiers:

```json
{"id_setup_gateway": 123, "id_account": 456}
```

The configured destination is supplied by `MGD_CONFIG_CHANGES_QUEUE_URL`. Local
environments may leave the URL unset, which makes notification a no-op.

Only effective `pending` mutations publish. `on_hold`, `GET`, manual status
patches (including `cancelled`) and idempotent writes do not. The send occurs after the SQL commit and
is best-effort; DLQ, retry policy, consumer behavior and recovery belong to the
external process that operates the queue.

## Contents

- [Reading guide](#reading-guide)
- [Catalog](#catalog)
- [Gateways](#gateways)
- [Components](#components)
- [Devices](#devices)
- [Device points](#device-points)
- [Point groups](#point-groups)
- [Point-group points](#point-group-points)
- [Point-group special days](#point-group-special-days)
- [Special days](#special-days)
- [Schedules](#schedules)
- [Schedule bindings](#schedule-bindings)
- [Schedule extensions](#schedule-extensions)
- [Schedule special days](#schedule-special-days)
- [Extensions](#extensions)
- [Templates apply](#templates-apply)
- [Reconcile held changes](#reconcile-held-changes)
- [Config changes](#config-changes)
- [Import](#import)
- [Status codes](#status-codes)

## Reading guide

This section summarizes the main **read** endpoints used to inspect a gateway installation during testing. Each endpoint returns the standard envelope shown above; the tables below describe the `data` payload.

Clearance **A2** or **A1** is required for every endpoint in this document.

| Endpoint | What it returns |
| --- | --- |
| `GET /mgd/gateways` | Configured gateway setups by default. Use `only_with_gateway_config=false` to include every registered gateway; `only_with_active_device=true` additionally requires an active main installation. |
| `GET /mgd/gateways/{id_setup}` | General gateway information: setup name, device IP, gateway configuration, installed device, and child setups. |
| `GET /mgd/gateways/{id_setup}/devices` | Device configurations under the gateway. When a physical device is installed on the child setup, the response includes `id_device`, `device_custom_id`, model, protocol, and device status. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}` | Same fields as the list endpoint for one child setup. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/points` | Active device points enabled for export on that device configuration. |
| `GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/points/{id_device_model_point}` | One active point plus its point groups, assigned schedules, linked extensions, and special days. |
| `GET /mgd/gateways/{id_setup}/schedules` | All operating schedules on the gateway relay-control component. Each row includes `is_active` when at least one point group references it, and the linked point groups when present. |
| `GET /mgd/gateways/{id_setup}/schedules/{schedule_id}` | One schedule with its full configuration, active flag, and every point group currently using it. |
| `GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days` | The relay-control component that owns the schedule, the gateway special-day catalog, and which special-day groups are applied to point groups using this schedule. |
| `GET /mgd/gateways/{id_setup}/extensions` | Every extension on the gateway with all extension fields and schedule link rows. |
| `GET /mgd/gateways/{id_setup}/extensions/{extension_id}` | One extension with the same full shape as the list endpoint. |

### Gateway list (`GET /mgd/gateways`)

| Field | Type | Description |
| --- | --- | --- |
| `id_setup` | int | Gateway setup identifier |
| `setup_name` | string | Gateway setup name |
| `id_device_model` | int | Device model identifier |
| `id_device_model_role` | int | Device model role identifier |
| `has_active_device_installation` | bool | Whether a main device is currently installed on the gateway setup |
| `device_custom_id` | string | Installed device custom identifier when present |
| `device_ip` | string | Network IP resolved from the SIM child setup when present |
| `has_gateway_config` | bool | Whether a gateway configuration row exists |
| `child_setups` | array | Child logical setups under this gateway |

Each `child_setups[]` item includes `id_setup`, `setup_name`, `role_name`, `has_active_device_installation`, `device_custom_id`, and `metrics_enabled_count`.

### Gateway detail (`GET /mgd/gateways/{id_setup}`)

| Field | Type | Description |
| --- | --- | --- |
| `id_setup` | int | Gateway setup identifier |
| `setup_name` | string | Gateway setup name |
| `id_device_model` | int | Device model identifier |
| `id_device_model_role` | int | Device model role identifier |
| `device_ip` | string | Network IP from the SIM child setup when present |
| `has_gateway_config` | bool | Whether a gateway configuration row exists |
| `config` | object | Gateway configuration fields when present |
| `installed_device` | object | Installed gateway device summary when present |
| `child_setups` | array | Child logical setups under this gateway |

`installed_device` includes `id_device`, `device_custom_id`, `id_device_model`, `model_name`, `device_model_protocol`, `id_device_status`, and `id_device_setup`.

### Device configuration (`GET /mgd/gateways/{id_setup}/devices` and singular)

`GET /mgd/gateways/{id_setup}` exposes `child_setups` as the topology list: it
includes every `setups` row whose `id_setup_gateway` equals the gateway. The
`/devices` collection now includes those children too. For a child without a
`setup_gateway_device_configs` row, it returns a placeholder with
`missing_device_config=true`, null configuration values, the setup identity,
and `missing_device_config_component_ids` indicating which component bindings
can still be created. Configured children keep their normal rows. Therefore
the collection can be used both to inspect existing bindings and to discover
what MGD configuration is missing. The optional `child_id_setup` query filter
validates the parent gateway and applies the same behavior to one child.

| Field | Type | Description |
| --- | --- | --- |
| `id_setup` | int | Child logical setup identifier |
| `id_setup_gateway` | int | Owning gateway setup identifier |
| `id_setup_gateway_device_config` | int/null | Device configuration identifier; null when the binding is missing |
| `id_setup_gateway_component` | int/null | Owning gateway component; null only when no candidate device component exists |
| `device_key` | string/null | Exported device key; null when the binding is missing |
| `connection` | object | Transport JSON used by the exporter |
| `function_status` | int | Runtime function status |
| `pending_device_installation` | bool | `true` when no active device is installed on the child setup |
| `missing_device_config` | bool | `true` when this row is a placeholder for a setup without an MGD binding |
| `missing_device_config_component_ids` | array[int] | Device-capable component bindings still missing for this setup |
| `setup_name` | string | Logical child setup name |
| `id_device_model_role` | int | Logical child setup role |
| `id_device` | int | Installed device identifier when present |
| `id_device_setup` | int | Active device-setup link when present |
| `device_custom_id` | string | Installed device custom identifier when present |
| `id_device_model` | int | Installed device model when present |
| `model_name` | string | Installed device model name when present |
| `device_model_protocol` | string | Installed device protocol when present |
| `id_device_status` | int | Installed device status when present |

### Device point detail (`GET .../points/{id_device_model_point}`)

| Field | Type | Description |
| --- | --- | --- |
| `id_setup_gateway_device_point` | int | Active device point identifier |
| `id_setup_gateway_device_config` | int | Parent device configuration identifier |
| `id_device_model_point` | int | Model point identifier |
| `factor_override` | number | Runtime factor override |
| `available_status` | object | Runtime status override |
| `point` | object | Full model point definition |
| `point_groups` | array | Point groups that include this point, with optional embedded schedule |
| `schedules` | array | Schedules assigned through those point groups |
| `extensions` | array | Extensions linked to those schedules |
| `special_days` | array | Special-day groups linked through those point groups |

### Schedule (`GET /mgd/gateways/{id_setup}/schedules` and singular)

| Field | Type | Description |
| --- | --- | --- |
| `id_setup_gateway_schedule` | int | Schedule identifier |
| `id_setup_gateway_component` | int | Owning relay-control component identifier |
| `component_name` | string | Component name, usually `relay_control` |
| `id_gateway_schedule_type` | int | Canonical schedule-type identifier |
| `schedule_number` | int | Numeric slot inside the category |
| `schedule_scope_type` | int | `0` for `everyday`, `1` for `special_day` |
| `schedule_name` | string | Optional human-readable name |
| `schedule_config` | array | Time-window JSON |
| `is_active` | bool | `true` when at least one point group references this schedule |
| `point_groups` | array | Point groups currently linked to this schedule |
| `flags` | array | Non-blocking warnings when the schedule is outside relay control |

Each `flags[]` item includes `code`, `message`, `resource`, and optional `context`. The `resource` object identifies the affected entity with `type` (for example `setup_gateway_schedule`), `id` when available, and `label` as a human-readable key.

### Extension (`GET /mgd/gateways/{id_setup}/extensions` and singular)

| Field | Type | Description |
| --- | --- | --- |
| `id_setup_gateway_extension` | int | Extension identifier |
| `id_setup_gateway_component` | int | Owning component identifier |
| `component_name` | string | Component name |
| `extension_name` | string | Extension name |
| `time_start` | datetime | Start of the override window |
| `time_end` | datetime | End of the override window |
| `desired_status` | string | Status applied during the window |
| `schedule_ids` | array[int] | Linked schedule identifiers |
| `schedule_links` | array | Bridge rows between extension and schedule |
| `is_attached` | bool | `true` when linked to at least one schedule |

Each `schedule_links[]` item includes `id_setup_gateway_extension_schedule`, `id_setup_gateway_extension`, and `id_setup_gateway_schedule`.

### Schedule special days (`GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days`)

| Field | Type | Description |
| --- | --- | --- |
| `component` | object | Relay-control component that owns the schedule |
| `gateway_special_days_catalog` | array | All special-day groups available on the gateway |
| `applied_special_days` | array | Special-day groups currently applied to point groups using this schedule |

## Catalog

Read-only catalog endpoints expose seeded MGD metadata used by the UI to validate component types and supported protocols. Gateway templates also have account-scoped CRUD endpoints; system templates remain visible but are not intended to be modified.

### Endpoint

```http
GET /mgd/gateways/templates
GET /mgd/gateways/templates/{id_gateway_config_template}
POST /mgd/gateways/templates
PUT /mgd/gateways/templates/{id_gateway_config_template}
DELETE /mgd/gateways/templates/{id_gateway_config_template}
GET /mgd/gateways/component-types
GET /mgd/gateways/component-types/{id_gateway_component_type}
GET /mgd/gateways/schedule-types
GET /mgd/gateways/protocols
GET /mgd/gateways/component-protocols
```

The device-model point catalog also supports the same read/control split:
`GET /device_models/{id_device_model}/points?point_type=<type>&writable=true|false`.
`writable=true` means `write_function` is present; `writable=false` means the
point is read-only. Both query parameters are optional and can be combined.

`POST`, `PUT`, and `DELETE` on `/mgd/gateways/templates` complete CRUD for
account-scoped templates. `template_kind`, `template_name`, `payload_version`,
and `template_payload` are required on create; PUT preserves omitted fields and
applies explicit nulls only where the database column allows them.

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_gateway_config_template` | Yes | Template identifier returned by the templates catalog | int |
| `id_gateway_component_type` | Yes | Canonical component-type identifier from `gateway_component_types` | int |

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_gateway_component_type` | int | Canonical component-type identifier from `gateway_component_types`. |
| `component_name` | string | Internal component key such as `reader_rtu`. |
| `component_export_name` | string | Export key used in `lambda_config.json`. |
| `accepts_devices` | bool | Whether the component type accepts device bindings. |
| `protocols` | array | Protocol labels supported by the component type. |
| `id_gateway_protocol` | int | Canonical protocol identifier from `gateway_protocols`. |
| `protocol_label` | string | Protocol key such as `rtu`, `tcp`, or `gpio`. |
| `default_door` | int | Default door value seeded for the protocol. |
| `id_gateway_component_protocol` | int | Technical identifier of one component-protocol pairing row. |

### Sample response

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_gateway_component_type": 1,
      "component_name": "reader_rtu",
      "component_export_name": "GG_reader_RTU",
      "accepts_devices": true,
      "protocols": ["rtu"]
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/component-types"
}
```

### Schedule-type catalog

`GET /mgd/gateways/schedule-types` returns the canonical identifiers accepted
by schedule and template REST bodies. The response fields are
`id_gateway_schedule_type` and `schedule_type_key`; do not send the legacy
string `schedule_type` in REST schedule requests.

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

Clearance A2 or A1 is required to use this endpoint.

### Sample response

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_gateway_schedule_type": 3,
      "schedule_type_key": "lighting"
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/schedule-types"
}
```

### Template body

Template CRUD uses the following fields:

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `template_kind` | Yes (POST) | string | No | `operating_schedule`, `operating_extension`, `special_day_group`, or `operating_bundle` |
| `template_name` | Yes (POST) | string | No | Account-scoped display name |
| `id_gateway_schedule_type` | No | int | `null` | Canonical schedule-type identifier when the template is schedule-specific |
| `payload_version` | No | int | `1` | Version of `template_payload` |
| `template_payload` | Yes (POST) | any JSON | No | Template data consumed by the apply operation |

```json
{
  "template_kind": "operating_schedule",
  "template_name": "Retail weekdays",
  "id_gateway_schedule_type": 3,
  "payload_version": 1,
  "template_payload": {
    "schedule_number": 1,
    "schedule_scope_type": 0,
    "schedule_name": "Weekdays",
    "schedule_config": []
  }
}
```

Clearance A2 or A1 is required for template CRUD.
### Sample response (`GET /mgd/gateways/component-protocols`)

```json
{
  "status": "success",
  "message": "3 elements obtained successfully",
  "data": [
    {
      "id_gateway_component_protocol": 1,
      "id_gateway_component_type": 1,
      "id_gateway_protocol": 1,
      "component_name": "reader_rtu",
      "protocol_label": "rtu"
    },
    {
      "id_gateway_component_protocol": 2,
      "id_gateway_component_type": 2,
      "id_gateway_protocol": 2,
      "component_name": "reader_tcp",
      "protocol_label": "tcp"
    },
    {
      "id_gateway_component_protocol": 3,
      "id_gateway_component_type": 3,
      "id_gateway_protocol": 3,
      "component_name": "reader_gpio",
      "protocol_label": "gpio"
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/component-protocols"
}
```

Use this catalog together with [`GET /mgd/gateways/protocols`](#catalog) when assigning `id_gateway_protocol` on `PUT /device_models/{id_device_model}`. See the [device model guide](../Devices/device_models.md) for that related operation.

## Gateways

The gateway endpoints manage the root row of `setup_gateway_configs`. They do not create or delete the physical device installation; they only manage the canonical export configuration attached to an existing gateway setup.

### Endpoint

```http
GET /mgd/gateways
POST /mgd/gateways
GET /mgd/gateways/{id_setup}
PUT /mgd/gateways/{id_setup}
DELETE /mgd/gateways/{id_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `only_with_gateway_config` | No | bool | `true` | When `true`, return only setups that have a row in `setup_gateway_configs`; set to `false` to list all registered gateways |
| `only_with_active_device` | No | bool | `false` | When `true`, additionally return only gateway setups with an active main device installation |

### Request body

`POST` creates the gateway root row. `PUT` updates the same row, preserves omitted fields, and applies explicit `null` values when the target database field permits null.

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway` | Yes (`POST`) | int | No | Existing gateway setup identifier |
| `json_version` | No | string | No | Exported JSON version label |
| `reads_database` | No | string | No | Reads database name |
| `reads_recents_table` | No | string | No | Recents table name |
| `reads_recents_max_rows` | No | int | No | Recents table row limit |
| `reads_history_table` | No | string | No | History table name |
| `reads_history_max_rows` | No | int | No | History table row limit |
| `reads_publish_period` | No | int | No | Publish period in seconds. Must be greater than `0` when present |
| `reads_external_databases` | No | object | No | External databases JSON |
| `tasks_database` | No | string | No | Tasks database name |
| `tasks_table` | No | string | No | Tasks table name |
| `tasks_user` | No | string | No | Tasks database user |
| `tasks_host` | No | string | No | Tasks database host |
| `priority_read` | No | int | No | Read priority |
| `priority_write` | No | int | No | Write priority |
| `extra_config` | No | object | No | Additional JSON configuration |

### Sample request

```json
{
  "id_setup_gateway": 900,
  "json_version": "v4.1",
  "reads_publish_period": 60
}
```

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup": 900,
    "setup_name": "Gateway Store 01",
    "has_gateway_config": true,
    "config": {
      "id_setup_gateway_config": 120,
      "id_setup_gateway": 900,
      "json_version": "v4.1"
    },
    "child_setups": []
  },
  "context": {},
  "instance": "/mgd/gateways/900"
}
```

`DELETE` removes only the `setup_gateway_configs` row. It returns `409` when the gateway still has dependent MGD resources such as components, device configs, schedules, special days, extensions, device points, or point groups.

### Error response (`409`)

```json
{
  "status": "error",
  "message": "The gateway configuration still has dependent MGD resources.",
  "data": null,
  "context": {
    "path": {
      "id_setup": 900
    },
    "component_count": 2,
    "device_config_count": 1
  },
  "instance": "/mgd/gateways/900"
}
```

## Components

A component row activates one gateway module under the current gateway setup. The SQL model enforces one row per `(id_setup, id_gateway_component_type)`, so a gateway can only have one row for each component type.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/components
POST /mgd/gateways/{id_setup}/components
GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `id_setup_gateway_component` | Yes | Component identifier | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | bool | `false` | When `true`, delete every MGD resource owned by the component (device configs, device points, point groups, schedules, special days, and extensions) before removing the component row |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_gateway_component_type` | Yes (`POST`) | int | No | Canonical component-type identifier from `gateway_component_types` |
| `component_period_unit` | No | string | No | Component period unit |
| `component_period_interval` | No | int | No | Component period interval. Must be greater than `0` when present |
| `max_tries_per_dev` | No | int | No | Retry count per device |
| `max_tries_per_point` | No | int | No | Retry count per point/register |
| `settings` | No | object | No | Component-specific JSON settings |

### Description

- `DELETE` is blocked with `409` when the component still owns dependent resources, unless `recursive=true`.
- With `recursive=true`, the API deletes device configs, device points, point groups, schedules, special days, extensions, and their bridge rows under the same `change_group_key` before removing the component.
- Changing `id_gateway_component_type` is blocked when the component still owns device configs, schedules, special days, or extensions, because that would violate the canonical meaning of those rows.

### Sample response

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_component": 7002,
      "id_setup": 900,
      "id_gateway_component_type": 4,
      "component_name": "relay_control",
      "component_period_unit": "seconds",
      "component_period_interval": 60,
      "settings": {}
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/components"
}
```

## Devices

A device config (`setup_gateway_device_configs`) tells the exporter how one child logical setup appears under a gateway component. The SQL model enforces `UNIQUE(id_setup_gateway, device_key)`, so `device_key` is required and must be unique across the whole gateway, not just inside one component.

The device resource is identified in two layers:

- collection/list operations use `/devices`
- singular operations use `/devices/{child_id_setup}` and add `id_setup_gateway_component` only when the same child setup is configured under more than one component

That rule lets the API minimize routes while still individualizing the row when the selector would otherwise be ambiguous.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices
POST /mgd/gateways/{id_setup}/devices
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `child_id_setup` | Yes (`GET`/`PUT`/`DELETE` singular) | Child logical setup identifier | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `child_id_setup` | No (`GET /devices`) | int | No | Filter the list to one child setup |
| `id_setup_gateway_component` | No (`GET /devices`) | int | No | Filter the list to one component |
| `id_setup_gateway_component` | Conditional (`GET`/`PUT`/`DELETE` singular) | int | No | Required when the same `child_id_setup` exists in more than one component; optional when the selector is already unique |
| `recursive` | No (`DELETE` singular) | bool | `false` | When `true`, delete device points and point groups for the selected device config before removing the row |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup` | Yes (`POST`) | int | No | Child logical setup identifier |
| `id_setup_gateway_component` | Yes (`POST`) | int | No | Owning component identifier |
| `device_key` | Yes (`POST`) | string | No | Exported key. Unique per gateway |
| `connection` | No | object | No | Transport JSON used by the exporter |
| `function_status` | No | int | No | Runtime function status |

`PUT` preserves omitted fields. It can also move the device config to another component by sending `id_setup_gateway_component` in the body; the query parameter still selects the current row when the child setup is ambiguous.

### Description

- `POST` validates that the target component exists and accepts devices.
- `GET`/`PUT`/`DELETE` on `/devices/{child_id_setup}` return `409` when more than one row exists and `id_setup_gateway_component` is omitted.
- `DELETE` is blocked with `409` when the selected device config still owns device points or point groups, unless `recursive=true`.
- With `recursive=true`, the API deletes point groups, their bridge rows, and device points for the selected `(child_id_setup, id_setup_gateway_component)` pair before removing the device config.
- The API validates the `(gateway, component, child setup)` ownership before writing.

### Sample request

```json
{
  "id_setup": 901,
  "id_setup_gateway_component": 7001,
  "device_key": "SerialMedidor1",
  "connection": {
    "port": "/dev/ttyAMA2",
    "unit": 20
  },
  "function_status": 1
}
```

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup": 901,
    "id_setup_gateway_device_config": 8001,
    "id_setup_gateway_component": 7001,
    "device_key": "SerialMedidor1",
    "connection": {
      "port": "/dev/ttyAMA2",
      "unit": 20
    },
    "function_status": 1
  },
  "context": {},
  "instance": "/mgd/gateways/900/devices/901"
}
```

## Device points

A device point enables one technical point from `device_model_points` for one configured device. The canonical MGD change tracking happens on `setup_gateway_device_points`, not on `device_model_points`. The SQL model enforces `UNIQUE(id_setup_gateway_device_config, id_device_model_point)`, so the same model point cannot be enabled twice on the same device config.

Point writes evaluate the installation eligibility of their target setup. When
a point mutation enters `pending`, related `on_hold` rows are promoted within
the FK branch and one SQS notification is sent after commit. Unrelated
branches, idempotent writes and `on_hold` point writes do not notify.

- `DELETE` is blocked with `409` when the point is still linked to one or more point groups, unless `recursive=true`.
- With `recursive=true`, the API removes `setup_gateway_point_group_points` bridge rows for the selected point before deleting the `setup_gateway_device_points` row.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/points
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/points
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/points/{id_device_model_point}
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/points/{id_device_model_point}
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `child_id_setup` | Yes | Child logical setup identifier | int |
| `id_device_model_point` | Yes (`GET`/`PUT`/`DELETE` singular) | Canonical identifier of the active model point | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | Conditional (`GET`/`PUT`/`DELETE`) | int | No | Required only when `child_id_setup` resolves to more than one device config |
| `recursive` | No (`DELETE` singular) | bool | `false` | When `true`, remove point-group bridge rows that reference the point before deleting it |
| `point_type` | No (`GET` list) | string | No | Exact `device_model_points.point_type` filter |
| `writable` | No (`GET` list) | bool | No | `true` returns control-capable points (`write_function` present); `false` returns read-only points |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | Conditional (`POST`) | int | No | Required only when `child_id_setup` resolves to more than one device config |
| `id_device_model_point_ids` | Yes (`POST`) | array[int] | `[]` | Device-model point identifiers to enable |
| `factor_override` | No (`PUT`) | number | No | Runtime factor override |
| `available_status` | No (`PUT`) | object | No | Runtime status override |

### Sample response

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_device_point": 9100,
      "id_setup_gateway_device_config": 8001,
      "factor_override": null,
      "available_status": null,
      "point": {
        "id_device_model_point": 3001,
        "point_key": "active_energy",
        "point_label": "Active energy"
      }
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/devices/901/points"
}
```

## Point groups

Point groups are relay-control-only control blocks. They live under one device config and export to one of two logical containers:

- `everyday`: no special-day links
- `special_day`: at least one special-day link

The API allows multiple point groups under the same device config. For each `(device config, point_group_name)` pair, it allows at most one `everyday` behavior and one `special_day` behavior. A `special_day` behavior is valid only when the matching `everyday` behavior exists. Different point-group names are independent, so for example `group_a/special_day` and `group_b/special_day` are allowed when `group_a/everyday` and `group_b/everyday` also exist. The canonical exporter still requires `point_group_name` to be unique inside each exported behavior scope.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `child_id_setup` | Yes | Child setup identifier bound to the gateway device config | int |
| `point_group_name` | Yes (`GET`/`PUT`/`DELETE` singular) | Visible key exported inside `config_x_relay` | string |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `schedule` | No (`GET` collection) | int | No | Filter groups linked to a specific schedule |
| `scope` | No (`GET`/`PUT`/`DELETE` singular) | string | No | Behavior scope: `everyday` or `special_day`. Required when the same `point_group_name` exists in both scopes |
| `recursive` | No (`DELETE` singular) | bool | `false` | When `true`, delete `setup_gateway_point_group_points` and `setup_gateway_point_group_special_days` bridge rows before removing the point group |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_group_name` | Yes (`POST`) | string | No | Visible key exported inside `config_x_relay` |
| `control_mode` | Yes (`POST`) | string | No | Mode exported for this group |
| `id_setup_gateway_schedule` | No | int | No | Linked schedule. If present, it must belong to the same relay-control component as the device config and match the exported scope of the group |

### Description

- Point groups are not allowed on `reader_*`, `reader_gpio`, or `log_reader` device configs.
- The route resolves the relay_control `setup_gateway_device_configs` row for the child setup. If no such row exists, the API returns `404`; if more than one exists, it returns `409`.
- Singular routes are keyed by `point_group_name` and, when needed, the `scope` query parameter. If both scopes exist for the same name, omitting `scope` returns `409` because the resource is ambiguous.
- A `special_day` point group requires a matching `everyday` point group with the same name. Deleting or renaming that `everyday` group while its special-day sibling exists is rejected.
- A point group can exist without a schedule.
- `DELETE` is blocked with `409` when the point group still has linked device points or special days, unless `recursive=true`.
- With `recursive=true`, the API removes `setup_gateway_point_group_points` and `setup_gateway_point_group_special_days` bridge rows for the selected group before deleting the `setup_gateway_point_groups` row.

Clearance **admin** is required to use this endpoint.

### Sample response

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_setup_gateway_point_group": 7301,
    "id_setup_gateway_device_config": 8002,
    "point_group_name": "Normal Piso 1",
    "control_mode": "automatico",
    "id_setup_gateway_schedule": 7201,
    "scope": "everyday",
    "schedule": {
      "id_setup_gateway_schedule": 7201,
      "id_gateway_schedule_type": 3,
      "schedule_scope_type": 0
    },
    "points": [],
    "special_days": []
  },
  "context": {},
  "instance": "/mgd/gateways/900/devices/901/point-groups"
}
```

## Point-group points

This bridge attaches enabled device points to one point group. The SQL model enforces `UNIQUE(id_setup_gateway_point_group, id_setup_gateway_device_point)`.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}/points
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}/points
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `child_id_setup` | Yes | Child setup identifier bound to the gateway device config | int |
| `point_group_name` | Yes | Visible key exported inside `config_x_relay` | string |
| `id_device_model_point` | Yes (`DELETE`) | Canonical identifier of the device-model point linked to the group | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `scope` | No | string | No | Behavior scope: `everyday` or `special_day`. Required when the same `point_group_name` exists in both scopes |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_device_point_ids` | Yes | array[int] | `[]` | Device-point identifiers to link. Each id must belong to the same device config as the point group |

Clearance **admin** is required to use this endpoint.

### Sample response

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_setup_gateway_point_group": 7301,
    "points": [
      {
        "id_setup_gateway_device_point": 9100,
        "point": {
          "id_device_model_point": 3001,
        "point_key": "active_energy",
          "point_label": "Active energy"
        }
      }
    ],
    "special_days": []
  },
  "context": {},
  "instance": "/mgd/gateways/900/devices/901/point-groups/Normal Piso 1/points"
}
```

## Point-group special days

This bridge attaches special-day groups to one point group. The SQL model enforces `UNIQUE(id_setup_gateway_point_group, id_setup_gateway_special_day)`. The linked special days must belong to the same `relay_control` component as the point group's device config.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}/special-days
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}/special-days
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}/special-days/{id_setup_gateway_special_day}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `child_id_setup` | Yes | Child setup identifier bound to the gateway device config | int |
| `point_group_name` | Yes | Visible key exported inside `config_x_relay` | string |
| `id_setup_gateway_special_day` | Yes (`DELETE`) | Special-day identifier | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `scope` | No | string | No | Behavior scope. Use `special_day`; required when the same `point_group_name` exists in both scopes |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_special_day_ids` | Yes | array[int] | `[]` | Special-day identifiers to link |

Clearance **admin** is required to use this endpoint.

### Sample response

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_setup_gateway_point_group": 7301,
    "special_days": [
      {
        "id_setup_gateway_special_day": 7501,
        "day_group_name": "Holidays",
        "dates": ["2026-12-25"]
      }
    ]
  },
  "context": {},
  "instance": "/mgd/gateways/900/devices/901/point-groups/Normal Piso 1/special-days"
}
```

## Special days

A special day defines a reusable named date set under one canonical `relay_control` component. The SQL model enforces `UNIQUE(id_setup_gateway_component, day_group_name)`.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/special-days
POST /mgd/gateways/{id_setup}/special-days
GET /mgd/gateways/{id_setup}/special-days/{special_day_id}
PUT /mgd/gateways/{id_setup}/special-days/{special_day_id}
DELETE /mgd/gateways/{id_setup}/special-days/{special_day_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `special_day_id` | Yes (`GET`/`PUT`/`DELETE`) | Special-day identifier | int |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `day_group_name` | Yes (`POST`) / No (`PUT`) | string | No | Name exported for the day group |
| `dates` | Yes (`POST`) / No (`PUT`) | array[string] | No | Calendar dates in `dd-mm` format, for example `25-12` |

### Description

- `GET` and `POST` resolve the gateway `relay_control` component internally. Responses still include `id_setup_gateway_component`.
- `POST` returns `404` when the gateway has no `relay_control` component and `409` when more than one exists.
- Each `dates` entry must be a string in `dd-mm` format (`01-01`, `18-09`, `25-12`). Invalid formats return `422`.
- Singular routes resolve directly by `special_day_id` inside the gateway.
- `DELETE` also clears the bridge rows that reference the special day.

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup_gateway_special_day": 7501,
    "id_setup_gateway_component": 7002,
    "day_group_name": "Holidays",
    "dates": ["25-12"]
  },
  "context": {},
  "instance": "/mgd/gateways/900/special-days/7501"
}
```

## Schedules

A schedule stores one canonical operating schedule. The SQL model enforces `UNIQUE(id_setup_gateway_component, id_gateway_schedule_type, schedule_number, schedule_scope_type)`. Schedules are relay-control-only rows.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/schedules
POST /mgd/gateways/{id_setup}/schedules
GET /mgd/gateways/{id_setup}/schedules/{schedule_id}
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}
DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `schedule_id` | Yes (`GET`/`PUT`/`DELETE` singular) | Schedule identifier | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No (`DELETE` singular) | bool | `false` | When `true`, delete extensions linked to the schedule (and their bridge rows) before removing the schedule |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_gateway_schedule_type` | Yes (`POST`) | int | No | Canonical identifier from `GET /mgd/gateways/schedule-types` |
| `schedule_number` | Yes | int | No | Numeric slot inside that category |
| `schedule_scope_type` | Yes | int | No | `0` for `everyday` or `1` for `special_day` |
| `schedule_name` | No | string | No | Optional human-readable name |
| `schedule_config` | Yes | array | No | Validated time-window JSON |

### Description

- `GET` and `POST` resolve the gateway `relay_control` component internally. Responses still include `id_setup_gateway_component`.
- These endpoints are rejected when the gateway has no unique `relay_control` component.
- `DELETE` is blocked with `409` when the schedule is still referenced by one or more point groups.
- `DELETE` is also blocked with `409` when extension bridge rows exist, unless `recursive=true`.
- With `recursive=true`, the API deletes `setup_gateway_extensions` rows linked to the schedule and their `setup_gateway_extension_schedules` bridge rows before removing the schedule. Point groups still block deletion.
- If a schedule is already linked to point groups, its `schedule_scope_type` cannot be changed to a value that disagrees with those groups.
- If a schedule is linked to extensions, it must keep `schedule_scope_type = 0`.

### Sample response

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_schedule": 7201,
      "id_setup_gateway_component": 7002,
      "component_name": "relay_control",
      "id_gateway_schedule_type": 3,
      "schedule_number": 1,
      "schedule_scope_type": 0,
      "schedule_name": "Retail weekdays",
      "schedule_config": [],
      "is_active": true,
      "point_groups": [
        {
          "id_setup_gateway_point_group": 7301,
          "point_group_name": "Normal Piso 1",
          "control_mode": "automatico",
          "id_setup_gateway_device_config": 8002,
          "id_setup_gateway_schedule": 7201
        }
      ],
      "flags": []
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/schedules"
}
```

`GET /mgd/gateways/{id_setup}/schedules/{schedule_id}` returns the same schedule shape for a single object in `data`, including `is_active` and `point_groups`.

## Schedule bindings

These endpoints list schedules for one component and show or update which point groups currently reference one schedule. Use the component-scoped list as the entry point when working from a component context, then open one schedule binding detail to inspect or change its point-group links. The `PUT` operation rebinds the selected point groups, but only when each group exports the same scope as the schedule (`0` (everyday) or `1` (special_day)).

### Endpoint

```http
GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules
GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `id_setup_gateway_component` | Yes | Relay-control component identifier | int |
| `schedule_id` | Yes (`GET`/`PUT`/`DELETE` singular) | Schedule identifier | int |

### Request body (`PUT`)

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_group_ids` | Yes | array[int] | `[]` | Point groups that must reference the selected schedule |

### Description

- `GET` list returns every schedule owned by the selected component, using the same schedule payload shape as [`GET /mgd/gateways/{id_setup}/schedules`](#schedules).
- `GET` singular returns the schedule plus the point groups, devices, and points currently bound to it.
- `PUT` replaces the point-group bindings for the selected schedule.
- `DELETE` clears the point-group bindings for the selected schedule without deleting the schedule row itself.

### Sample response (`GET` list)

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_schedule": 7201,
      "id_setup_gateway_component": 7002,
      "component_name": "relay_control",
      "id_gateway_schedule_type": 3,
      "schedule_number": 1,
      "schedule_scope_type": 0,
      "schedule_name": "Retail weekdays",
      "schedule_config": [],
      "flags": []
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/components/7002/schedules"
}
```

### Sample response (`GET` singular)

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "schedule": {
      "id_setup_gateway_schedule": 7201,
      "id_gateway_schedule_type": 3,
      "schedule_number": 1,
      "schedule_scope_type": 0
    },
    "point_groups": [
      {
        "id_setup_gateway_point_group": 7301,
        "point_group_name": "Normal Piso 1",
        "control_mode": "automatico"
      }
    ],
    "devices": [],
    "points": []
  },
  "context": {},
  "instance": "/mgd/gateways/900/components/7002/schedules/7201"
}
```

## Schedule extensions

An extension applies one temporary override range to one or more `everyday` schedules of the same relay-control component. The SQL bridge enforces `UNIQUE(id_setup_gateway_extension, id_setup_gateway_schedule)`.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions
POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `schedule_id` | Yes | Schedule identifier. Must be an `everyday` schedule | int |

### Request body (`POST`)

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `extension_name` | Yes | string | No | Human-readable extension label |
| `time_start` | Yes | datetime | No | Start of the override window |
| `time_end` | Yes | datetime | No | End of the override window. Must be greater than or equal to `time_start` |
| `desired_status` | Yes | string | No | Target status applied during the override window |

`PUT` accepts any subset of the extension fields and preserves omitted fields.
Explicit `null` is rejected for the non-null extension columns. `DELETE` removes
the selected extension and all of its schedule links; it does not remove the
schedule itself. The former bulk `DELETE .../extensions` endpoint is not part of
the contract.

### Description

- `POST` always creates one row in `setup_gateway_extensions` and one bridge row in `setup_gateway_extension_schedules` for the selected schedule.
- `PUT` updates one extension attached to the selected schedule.
- `DELETE` removes the selected extension from both `setup_gateway_extensions` and `setup_gateway_extension_schedules`. If it was linked to other schedules, those bridge rows are removed as well before the extension row is deleted.
- The schedule and the extension must belong to the same `relay_control` component.
- All schedules linked to the same extension must share the same `id_gateway_schedule_type` because the exported JSON stores one `extensions[].id_gateway_schedule_type` plus many `schedule_numbers`.

### Sample request (`POST`)

```json
{
  "extension_name": "Summer override",
  "time_start": "2026-07-02T18:00:00",
  "time_end": "2026-07-02T22:00:00",
  "desired_status": "on"
}
```

### Sample response (`POST`)

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_setup_gateway_extension": 7401,
    "extension_name": "Summer override",
    "desired_status": "on",
    "schedule_ids": [7201],
    "is_attached": true
  },
  "context": {},
  "instance": "/mgd/gateways/900/schedules/7201/extensions"
}
```

### Sample response (`GET`)

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_extension": 7401,
      "extension_name": "Summer override",
      "desired_status": "on",
      "schedule_ids": [7201],
      "is_attached": true
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/schedules/7201/extensions"
}
```

## Schedule special days

This resource returns the component special-day catalog plus the subset currently applied through the point groups that use one schedule.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `schedule_id` | Yes | Schedule identifier | int |

### Request body (`PUT`)

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_special_day_ids` | Yes | array[int] | `[]` | Special-day groups that should be applied to the point groups currently using the schedule |

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "component": {
      "id_setup_gateway_component": 7002,
      "id_setup": 900,
      "id_gateway_component_type": 4,
      "component_name": "relay_control",
      "component_period_unit": "seconds",
      "component_period_interval": 60,
      "settings": {}
    },
    "gateway_special_days_catalog": [
      {
        "id_setup_gateway_special_day": 7501,
        "id_setup_gateway_component": 7002,
        "day_group_name": "Holidays",
        "dates": ["25-12"]
      }
    ],
    "applied_special_days": []
  },
  "context": {},
  "instance": "/mgd/gateways/900/schedules/7201/special_days"
}
```

## Extensions

The extension catalog lists already-created extension rows and shows whether they are linked to any schedule.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/extensions
GET /mgd/gateways/{id_setup}/extensions/{extension_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `extension_id` | Yes | Extension identifier | int |

### Sample response

```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_extension": 7401,
      "id_setup_gateway_component": 7002,
      "component_name": "relay_control",
      "extension_name": "Summer override",
      "time_start": "2026-01-01 00:00:00",
      "time_end": "2026-03-31 23:59:59",
      "desired_status": "on",
      "schedule_ids": [7201],
      "schedule_links": [
        {
          "id_setup_gateway_extension_schedule": 7601,
          "id_setup_gateway_extension": 7401,
          "id_setup_gateway_schedule": 7201
        }
      ],
      "is_attached": true
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/extensions"
}
```

## Templates apply

The template-apply endpoint materializes one template into real canonical rows. It is intended for fast operational flows, such as creating one schedule template or one extension template in a single request.

Supported kinds:

- `operating_schedule`
- `operating_extension`

Not yet supported for automatic materialization:

- `special_day_group`
- `operating_bundle`

### Endpoint

```http
POST /mgd/gateways/{id_setup}/templates/{id_gateway_config_template}/apply
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `id_gateway_config_template` | Yes | Template identifier | int |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | int | No | Target component. It must be the canonical `relay_control` component for schedule/extension templates |
| `overrides` | No | object | No | Values merged on top of the stored `template_payload` before applying |

### Description

- `operating_schedule` creates one or more `setup_gateway_schedules` rows.
- `operating_extension` creates one `setup_gateway_extensions` row plus the bridge rows in `setup_gateway_extension_schedules`.
- Extension templates must reference at least one `everyday` schedule id, and all referenced schedules must share the same `id_gateway_schedule_type`.

### Sample response

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "change_group_key": "6b0c6f5e-2b8b-47d1-93e2-66fd34f2f4c0",
    "template_kind": "operating_schedule",
    "schedules": [
      {
        "id_setup_gateway_schedule": 7205,
        "id_gateway_schedule_type": 3,
        "schedule_scope_type": 0
      }
    ],
    "extensions": []
  },
  "context": {},
  "instance": "/mgd/gateways/900/templates/7/apply"
}
```

## Reconcile held changes

Installation and configuration mutation are separate operations. A tracked
mutation starts as `pending` when its target setup has an active main device
installation; otherwise it starts as `on_hold`. Installing a device does not
promote held changes automatically.

### Endpoint

```http
POST /mgd/setups/{id_setup}/config-changes/reconcile
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway or child setup to validate and reconcile | int |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_children` | No | bool | `false` | When true, also evaluate child setups of a gateway setup |

### Description

The endpoint promotes only `on_hold` changes whose target setup is currently
installed. Gateway and child targets are evaluated independently. It does not
promote sibling children and it reports changes that were promoted, unchanged,
blocked, or demoted.

### Sample request

```json
{
  "include_children": false
}
```

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup": 900,
    "id_setup_gateway": 900,
    "include_children": false,
    "installed": true,
    "promoted": [55],
    "unchanged": [],
    "blocked": [],
    "demoted": [],
    "promoted_count": 1
  },
  "context": {},
  "instance": "/mgd/setups/900/config-changes/reconcile"
}
```

Clearance A2 or A1 is required to use this endpoint.

## Config changes

This resource exposes the tracked write log of MGD rows and lets the platform or an operator move a batch through the supported `change_status` transitions.

### Endpoint

```http
GET /mgd/gateways/{id_setup}/config-changes
PATCH /mgd/gateways/{id_setup}/config-changes/status
PATCH /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}/status
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |
| `id_setup_gateway_config_change` | Yes | Config-change identifier | int |

### Query parameters (`GET`)

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `change_status` | No | string | No | Filter by status (`on_hold`, `pending`, `in_progress`, `retry`, `cancelled`, `applied`, `failed`) |
| `change_group_key` | No | string | No | Filter by change group |
| `operation` | No | string | No | Filter by operation (`C`, `U`, `D`) |

### Request body

Single update. The target status is reported by the external processor or an
operator; `on_hold` and `pending` are internal API states:

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `change_status` | Yes | string | No | Target status (`in_progress`, `retry`, `cancelled`, `applied`, `failed`) for the selected config change |

Bulk update. The same manual-status restriction applies to every selected row:

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `change_status` | Yes | string | No | Target status (`in_progress`, `retry`, `cancelled`, `applied`, `failed`) for every selected row |
| `id_setup_gateway_config_change_ids` | No | array[int] | `[]` | Config-change identifiers to update |
| `change_group_key` | No | string | No | Update every row in the selected change group |

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": [
    {
      "id_setup_gateway_config_change": 55,
      "id_setup_gateway": 900,
      "change_group_key": "6b0c6f5e-2b8b-47d1-93e2-66fd34f2f4c0",
      "id_entity": 42,
      "id_resource": 9100,
      "operation": "C",
      "change_status": "pending",
      "before_value": null,
      "after_value": {
        "id_device_model_point": 3001,
        "point_key": "active_energy"
      },
      "created_by": 12,
      "scheduled_at": "2026-07-20 12:00:00",
      "applied_at": null,
      "created_at": "2026-07-20 11:59:00",
      "updated_at": "2026-07-20 12:00:00"
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/900/config-changes"
}
```

## Import

This endpoint imports one canonical gateway JSON into the normalized tables. It records each effective insert or upsert in `setup_gateway_config_changes` as `applied`; dry runs roll back both the normalized writes and their tracking rows.

### Endpoint

```http
POST /mgd/gateways/{id_setup}/imports
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Active account identifier. Use `Account: <ID_ACCOUNT>` | string |

### Path parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `id_setup` | Yes | Gateway setup identifier | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `dry_run` | No | bool | `false` | Execute the import and roll it back |
| `strict` | No | bool | `false` | Turn importer flags into hard errors |
| `force` | No | bool | `false` | Cancel existing non-terminal changes for the target before importing |

### Request body

Send either:

- the canonical gateway JSON document itself (`json_version` at the root), or
- a wrapped device-config response where the canonical JSON lives under `data.config` (for example the payload returned by `GET /v4/gateways/devices/{identifier}/config`).

The importer unwraps `data.config` automatically when the root document does not include `json_version`.

### Description

By default, the importer rejects a target with existing non-terminal MGD changes. Set `force=true` to cancel those changes in the same transaction before importing. `dry_run=true` never cancels changes and rolls back all writes.

The importer surfaces warnings/flags instead of blocking by default. Each flag includes a `resource` object that identifies the affected entity (`type`, `id`, `label`). Current flag codes include:

- `schedule_outside_relay_control` — resource type `setup_gateway_schedule`
- `schedules_without_relay_control` — schedules were present in JSON but no relay-control component was available to persist them
- `schedule_import_incomplete` — the number of schedules persisted did not match the number defined in JSON
- `device_not_found` — a device identifier in the JSON does not exist in the platform inventory
- `device_setup_not_found` — a JSON device could not be resolved to a platform setup
- `duplicate_device_key` — resource type `setup_gateway_device_config`
- `point_group_scope_conflict` — resource type `setup_gateway_point_group`
- `point_group_special_day_requires_everyday` — resource type `setup_gateway_point_group`
- `point_group_schedule_scope_mismatch` — resource type `setup_gateway_point_group`

### Sample response

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "imported_gateway_id": "GW-STORE-01",
    "resolved_setup_id": 900,
    "dry_run": false,
    "strict": false,
    "warnings": [],
    "flags": [
      {
        "code": "schedule_outside_relay_control",
        "message": "This schedule is attached to a component other than relay_control.",
        "resource": {
          "type": "setup_gateway_schedule",
          "id": 7201,
          "label": "lighting #1"
        },
        "context": {
          "component_name": "reader_rtu",
          "id_setup_gateway_component": 7001,
          "schedule_type": "lighting",
          "schedule_number": 1
        }
      }
    ]
  },
  "context": {},
  "instance": "/mgd/gateways/900/imports"
}
```

## Status codes

| Status | Description |
| --- | --- |
| `200` | Resource obtained or updated successfully |
| `201` | Resource created successfully |
| `400` | Invalid payload, empty required key, invalid scope, or failed checked constraint |
| `401` | Authentication failed |
| `403` | The user lacks permission for the requested MGD resource |
| `404` | The requested gateway, component, device, point, point group, special day, schedule, extension, template, or config change was not found |
| `409` | Conflict with the canonical model, for example duplicated `device_key`, unsupported non-`relay_control` ownership, illegal `change_status` transition, selector ambiguity, scope mismatch, or deleting a gateway config that still has dependent MGD resources |
| `500` | Unexpected server error |
