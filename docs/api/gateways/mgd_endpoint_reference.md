# MGD endpoint reference

This reference is generated from the active AP-v4 OpenAPI contract. It
documents every MGD operation's headers, path parameters, query
parameters, filters, request body, representative request, response
envelope, and status codes. Paths are relative to the AP-v4 base URL;
the production deployment adds `/v4`.

The historical `API-V4/` copy in this documentation repository is not the
source of the canonical MGD route contract. Generate this file with the
active AP-v4 Lambda directory when the route or schema contract changes.

## Regeneration and drift check

From this repository, generate the reference with:

```bash
python scripts/generate_mgd_endpoint_reference.py \
  --api-root /path/to/active/ap-v4
```

Use `--check` in CI or before publishing to fail when the checked-in
reference no longer matches the active OpenAPI contract.

## Common headers

All operations require `Authorization` and `Account: <ID_ACCOUNT>`. JSON
mutations also require `Content-Type: application/json`. The operation
tables below repeat these headers so each endpoint can be used in
isolation.

## Filter and flag semantics

- Collection filters are applied only when their query parameter is
  present; omitting a filter does not select an arbitrary default row.
- `point_type` uses the point type stored in the device-model catalog.
  `writable=true` selects model points with a write function and
  `writable=false` selects read-only points.
- `projection` accepts only `applied` or `proposed`.
- `recursive` is a delete flag; it permits removal of dependent bridge
  rows only on resources that document that behavior.
- `include_config_sync` is opt-in response metadata and does not change
  the selected resource set.
- `dry_run`, `strict`, and `force` apply only to complete-snapshot imports.

## Endpoint coverage

The active contract contains **44 paths** and **80 operations**.

## Table of contents

- [GET /mgd/gateways](#get-mgd-gateways)
- [POST /mgd/gateways](#post-mgd-gateways)
- [GET /mgd/gateways/component-protocols](#get-mgd-gateways-component-protocols)
- [GET /mgd/gateways/component-types](#get-mgd-gateways-component-types)
- [GET /mgd/gateways/component-types/{id_gateway_component_type}](#get-mgd-gateways-component-types-id-gateway-component-type)
- [GET /mgd/gateways/protocols](#get-mgd-gateways-protocols)
- [GET /mgd/gateways/schedule-types](#get-mgd-gateways-schedule-types)
- [GET /mgd/gateways/templates](#get-mgd-gateways-templates)
- [POST /mgd/gateways/templates](#post-mgd-gateways-templates)
- [DELETE /mgd/gateways/templates/{id_gateway_config_template}](#delete-mgd-gateways-templates-id-gateway-config-template)
- [GET /mgd/gateways/templates/{id_gateway_config_template}](#get-mgd-gateways-templates-id-gateway-config-template)
- [PUT /mgd/gateways/templates/{id_gateway_config_template}](#put-mgd-gateways-templates-id-gateway-config-template)
- [DELETE /mgd/gateways/{id_setup}](#delete-mgd-gateways-id-setup)
- [GET /mgd/gateways/{id_setup}](#get-mgd-gateways-id-setup)
- [PUT /mgd/gateways/{id_setup}](#put-mgd-gateways-id-setup)
- [GET /mgd/gateways/{id_setup}/components](#get-mgd-gateways-id-setup-components)
- [POST /mgd/gateways/{id_setup}/components](#post-mgd-gateways-id-setup-components)
- [DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}](#delete-mgd-gateways-id-setup-components-id-setup-gateway-component)
- [GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}](#get-mgd-gateways-id-setup-components-id-setup-gateway-component)
- [PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}](#put-mgd-gateways-id-setup-components-id-setup-gateway-component)
- [GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules](#get-mgd-gateways-id-setup-components-id-setup-gateway-component-schedules)
- [DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}](#delete-mgd-gateways-id-setup-components-id-setup-gateway-component-schedules-schedule-id)
- [GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}](#get-mgd-gateways-id-setup-components-id-setup-gateway-component-schedules-schedule-id)
- [PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}](#put-mgd-gateways-id-setup-components-id-setup-gateway-component-schedules-schedule-id)
- [GET /mgd/gateways/{id_setup}/config-changes](#get-mgd-gateways-id-setup-config-changes)
- [PATCH /mgd/gateways/{id_setup}/config-changes/status](#patch-mgd-gateways-id-setup-config-changes-status)
- [GET /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}](#get-mgd-gateways-id-setup-config-changes-id-setup-gateway-config-change)
- [PATCH /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}/status](#patch-mgd-gateways-id-setup-config-changes-id-setup-gateway-config-change-status)
- [GET /mgd/gateways/{id_setup}/config-json](#get-mgd-gateways-id-setup-config-json)
- [GET /mgd/gateways/{id_setup}/config-sync](#get-mgd-gateways-id-setup-config-sync)
- [GET /mgd/gateways/{id_setup}/devices](#get-mgd-gateways-id-setup-devices)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}](#get-mgd-gateways-id-setup-devices-child-id-setup)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs](#get-mgd-gateways-id-setup-devices-child-id-setup-configs)
- [POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs](#post-mgd-gateways-id-setup-devices-child-id-setup-configs)
- [DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}](#delete-mgd-gateways-id-setup-devices-child-id-setup-configs-config-id)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}](#get-mgd-gateways-id-setup-devices-child-id-setup-configs-config-id)
- [PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}](#put-mgd-gateways-id-setup-devices-child-id-setup-configs-config-id)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points](#get-mgd-gateways-id-setup-devices-child-id-setup-configs-id-setup-gateway-device-config-points)
- [POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points](#post-mgd-gateways-id-setup-devices-child-id-setup-configs-id-setup-gateway-device-config-points)
- [DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}](#delete-mgd-gateways-id-setup-devices-child-id-setup-configs-id-setup-gateway-device-config-points-id-device-model-point)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}](#get-mgd-gateways-id-setup-devices-child-id-setup-configs-id-setup-gateway-device-config-points-id-device-model-point)
- [PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}](#put-mgd-gateways-id-setup-devices-child-id-setup-configs-id-setup-gateway-device-config-points-id-device-model-point)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups](#get-mgd-gateways-id-setup-devices-child-id-setup-point-groups)
- [POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups](#post-mgd-gateways-id-setup-devices-child-id-setup-point-groups)
- [DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}](#delete-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}](#get-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group)
- [PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}](#put-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points](#get-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group-points)
- [POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points](#post-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group-points)
- [DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points/{id_device_model_point}](#delete-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group-points-id-device-model-point)
- [GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days](#get-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group-special-days)
- [POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days](#post-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group-special-days)
- [DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days/{id_setup_gateway_special_day}](#delete-mgd-gateways-id-setup-devices-child-id-setup-point-groups-id-setup-gateway-point-group-special-days-id-setup-gateway-special-day)
- [GET /mgd/gateways/{id_setup}/extensions](#get-mgd-gateways-id-setup-extensions)
- [POST /mgd/gateways/{id_setup}/extensions](#post-mgd-gateways-id-setup-extensions)
- [DELETE /mgd/gateways/{id_setup}/extensions/{extension_id}](#delete-mgd-gateways-id-setup-extensions-extension-id)
- [GET /mgd/gateways/{id_setup}/extensions/{extension_id}](#get-mgd-gateways-id-setup-extensions-extension-id)
- [PUT /mgd/gateways/{id_setup}/extensions/{extension_id}](#put-mgd-gateways-id-setup-extensions-extension-id)
- [POST /mgd/gateways/{id_setup}/imports](#post-mgd-gateways-id-setup-imports)
- [GET /mgd/gateways/{id_setup}/schedules](#get-mgd-gateways-id-setup-schedules)
- [POST /mgd/gateways/{id_setup}/schedules](#post-mgd-gateways-id-setup-schedules)
- [DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}](#delete-mgd-gateways-id-setup-schedules-schedule-id)
- [GET /mgd/gateways/{id_setup}/schedules/{schedule_id}](#get-mgd-gateways-id-setup-schedules-schedule-id)
- [PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}](#put-mgd-gateways-id-setup-schedules-schedule-id)
- [GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions](#get-mgd-gateways-id-setup-schedules-schedule-id-extensions)
- [POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions](#post-mgd-gateways-id-setup-schedules-schedule-id-extensions)
- [DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}](#delete-mgd-gateways-id-setup-schedules-schedule-id-extensions-id-setup-gateway-extension)
- [POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}](#post-mgd-gateways-id-setup-schedules-schedule-id-extensions-id-setup-gateway-extension)
- [PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}](#put-mgd-gateways-id-setup-schedules-schedule-id-extensions-id-setup-gateway-extension)
- [DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days](#delete-mgd-gateways-id-setup-schedules-schedule-id-special-days)
- [GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days](#get-mgd-gateways-id-setup-schedules-schedule-id-special-days)
- [PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days](#put-mgd-gateways-id-setup-schedules-schedule-id-special-days)
- [GET /mgd/gateways/{id_setup}/special-days](#get-mgd-gateways-id-setup-special-days)
- [POST /mgd/gateways/{id_setup}/special-days](#post-mgd-gateways-id-setup-special-days)
- [DELETE /mgd/gateways/{id_setup}/special-days/{special_day_id}](#delete-mgd-gateways-id-setup-special-days-special-day-id)
- [GET /mgd/gateways/{id_setup}/special-days/{special_day_id}](#get-mgd-gateways-id-setup-special-days-special-day-id)
- [PUT /mgd/gateways/{id_setup}/special-days/{special_day_id}](#put-mgd-gateways-id-setup-special-days-special-day-id)
- [POST /mgd/gateways/{id_setup}/templates/{id_gateway_config_template}/apply](#post-mgd-gateways-id-setup-templates-id-gateway-config-template-apply)
- [POST /mgd/setups/{id_setup}/config-changes/reconcile](#post-mgd-setups-id-setup-config-changes-reconcile)
- [POST /mgd/setups/{id_setup}/config-changes/replay](#post-mgd-setups-id-setup-config-changes-replay)

## GET /mgd/gateways

List gateway setups, configured by default and optionally including all registered gateways.

### Endpoint
```http
GET /mgd/gateways
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `only_with_gateway_config` | No | boolean | true | Keep only gateway setups with an MGD configuration row. |
| `only_with_active_device` | No | boolean | false | Keep only gateway setups with an active main device. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `GatewayListSummary`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways?only_with_gateway_config=true&only_with_active_device=false&include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways

Propose the MGD gateway configuration row for a gateway setup.

### Endpoint
```http
POST /mgd/gateways
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway` | Yes | integer | No | Gateway setup that owns the configuration. Exclusive min: `0.0`. |
| `json_version` | No | string or null | null | Version label for the gateway JSON configuration. |
| `reads_database` | No | string or null | null | Database used by the gateway read process. |
| `reads_recents_table` | No | string or null | null | Recent-read table name. |
| `reads_recents_max_rows` | No | integer or null | null | Maximum recent-read rows retained. |
| `reads_history_table` | No | string or null | null | Read-history table name. |
| `reads_history_max_rows` | No | integer or null | null | Maximum history rows retained. |
| `reads_publish_period` | No | integer or null | null | Read publication period. |
| `reads_external_databases` | No | object or null | null | External read-database configuration. |
| `tasks_database` | No | string or null | null | Database used by the gateway task process. |
| `tasks_table` | No | string or null | null | Task table name. |
| `tasks_user` | No | string or null | null | Task database user. |
| `tasks_host` | No | string or null | null | Task database host. |
| `priority_read` | No | integer or null | null | Read process priority. |
| `priority_write` | No | integer or null | null | Write process priority. |
| `extra_config` | No | object or null | null | Additional gateway configuration object. |

### Pydantic models

- Request: `GatewayCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway":1,"json_version":"string","reads_database":"string","reads_recents_table":"string","reads_recents_max_rows":1,"reads_history_table":"string","reads_history_max_rows":1,"reads_publish_period":1,"tasks_database":"string","tasks_table":"string","tasks_user":"string","tasks_host":"string","priority_read":1,"priority_write":1}' \
  /mgd/gateways?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/component-protocols

List the supported MGD gateway component-protocol pairings.

### Endpoint
```http
GET /mgd/gateways/component-protocols
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayComponentProtocol`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/component-protocols
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/component-protocols"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/component-types

List the supported MGD gateway component types and their protocols.

### Endpoint
```http
GET /mgd/gateways/component-types
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayComponentType`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/component-types
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/component-types"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/component-types/{id_gateway_component_type}

Retrieve one MGD gateway component type from the catalog.

### Endpoint
```http
GET /mgd/gateways/component-types/{id_gateway_component_type}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_gateway_component_type` | Yes | integer | Gateway component type catalog identifier. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayComponentType`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/component-types/2
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/component-types/2"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/protocols

List the supported MGD gateway protocols.

### Endpoint
```http
GET /mgd/gateways/protocols
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProtocol`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/protocols
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/protocols"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/schedule-types

List schedule-type catalog rows used by canonical REST requests.

### Endpoint
```http
GET /mgd/gateways/schedule-types
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayScheduleType`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/schedule-types
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/schedule-types"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/templates

List the visible MGD gateway templates.

### Endpoint
```http
GET /mgd/gateways/templates
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayTemplate`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/templates
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/templates"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/templates

Create an account-scoped MGD gateway configuration template.

### Endpoint
```http
POST /mgd/gateways/templates
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

This endpoint has no path parameters.

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `template_kind` | Yes | string | No | Template category supported by the MGD catalog. Allowed: `operating_schedule`, `operating_extension`, `special_day_group`, `operating_bundle`. |
| `template_name` | Yes | string | No | Human-readable template name. Max length: `100`. |
| `id_gateway_schedule_type` | No | integer or null | null | Schedule type catalog identifier. |
| `payload_version` | No | integer | 1 | Version of the template payload format. Exclusive min: `0.0`. |
| `template_payload` | Yes | object | No | Template-specific configuration payload. |

### Pydantic models

- Request: `GatewayTemplateCreate`.
- Response: `ShowGatewayTemplate`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"template_kind":"operating_schedule","template_name":"string","id_gateway_schedule_type":1,"payload_version":1}' \
  /mgd/gateways/templates
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/templates"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `201` | Resource created successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/templates/{id_gateway_config_template}

Soft-delete an account-scoped MGD gateway configuration template.

### Endpoint
```http
DELETE /mgd/gateways/templates/{id_gateway_config_template}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_gateway_config_template` | Yes | integer | Gateway configuration template identifier. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/templates/7
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/templates/7"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/templates/{id_gateway_config_template}

Retrieve a specific MGD gateway template.

### Endpoint
```http
GET /mgd/gateways/templates/{id_gateway_config_template}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_gateway_config_template` | Yes | integer | Gateway configuration template identifier. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayTemplate`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/templates/7
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/templates/7"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/templates/{id_gateway_config_template}

Update an account-scoped MGD gateway configuration template.

### Endpoint
```http
PUT /mgd/gateways/templates/{id_gateway_config_template}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_gateway_config_template` | Yes | integer | Gateway configuration template identifier. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `template_kind` | No | string or null | null | Template category supported by the MGD catalog. |
| `template_name` | No | string or null | null | Human-readable template name. |
| `id_gateway_schedule_type` | No | integer or null | null | Schedule type catalog identifier. |
| `payload_version` | No | integer or null | null | Version of the template payload format. |
| `template_payload` | No | object or null | null | Template-specific configuration payload. |

### Pydantic models

- Request: `GatewayTemplateUpdate`.
- Response: `ShowGatewayTemplate`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"template_kind":"operating_schedule","template_name":"string","id_gateway_schedule_type":1,"payload_version":1}' \
  /mgd/gateways/templates/7
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/templates/7"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}

Delete the MGD gateway configuration row without removing the setup or physical device.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}

Return the gateway setup detail and MGD configuration when present.

### Endpoint
```http
GET /mgd/gateways/{id_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `GatewayDetail`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}

Update the MGD gateway configuration without nulling omitted fields.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `json_version` | No | string or null | null | Version label for the gateway JSON configuration. |
| `reads_database` | No | string or null | null | Database used by the gateway read process. |
| `reads_recents_table` | No | string or null | null | Recent-read table name. |
| `reads_recents_max_rows` | No | integer or null | null | Maximum recent-read rows retained. |
| `reads_history_table` | No | string or null | null | Read-history table name. |
| `reads_history_max_rows` | No | integer or null | null | Maximum history rows retained. |
| `reads_publish_period` | No | integer or null | null | Read publication period. |
| `reads_external_databases` | No | object or null | null | External read-database configuration. |
| `tasks_database` | No | string or null | null | Database used by the gateway task process. |
| `tasks_table` | No | string or null | null | Task table name. |
| `tasks_user` | No | string or null | null | Task database user. |
| `tasks_host` | No | string or null | null | Task database host. |
| `priority_read` | No | integer or null | null | Read process priority. |
| `priority_write` | No | integer or null | null | Write process priority. |
| `extra_config` | No | object or null | null | Additional gateway configuration object. |

### Pydantic models

- Request: `GatewayConfigUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"json_version":"string","reads_database":"string","reads_recents_table":"string","reads_recents_max_rows":1,"reads_history_table":"string","reads_history_max_rows":1,"reads_publish_period":1,"tasks_database":"string","tasks_table":"string","tasks_user":"string","tasks_host":"string","priority_read":1,"priority_write":1}' \
  /mgd/gateways/501234?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/components

List the active components for a gateway setup.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/components
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayComponent`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/components?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/components

Activate a component for a gateway setup.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/components
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_gateway_component_type` | Yes | integer | No | Component type selected from the MGD catalog. Exclusive min: `0.0`. |
| `component_period_unit` | No | string or null | null | Unit used for component polling periods. |
| `component_period_interval` | No | integer or null | null | Polling interval for the component. |
| `max_tries_per_dev` | No | integer or null | null | Maximum device-level retries configured for the component. |
| `max_tries_per_point` | No | integer or null | null | Maximum point-level retries configured for the component. |
| `settings` | No | object or null | null | Component-specific settings object. |

### Pydantic models

- Request: `GatewayComponentCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_gateway_component_type":1,"component_period_unit":"string","component_period_interval":1,"max_tries_per_dev":1,"max_tries_per_point":1}' \
  /mgd/gateways/501234/components?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}

Delete a gateway component.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | boolean | false | Allow deletion of dependent relationship rows when supported. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/components/14?recursive=false&include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}

Return the details of a single active component.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayComponent`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/components/14?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}

Update a component without nulling omitted fields.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_gateway_component_type` | No | integer or null | null | Component type selected from the MGD catalog. |
| `component_period_unit` | No | string or null | null | Unit used for component polling periods. |
| `component_period_interval` | No | integer or null | null | Polling interval for the component. |
| `max_tries_per_dev` | No | integer or null | null | Maximum device-level retries configured for the component. |
| `max_tries_per_point` | No | integer or null | null | Maximum point-level retries configured for the component. |
| `settings` | No | object or null | null | Component-specific settings object. |

### Pydantic models

- Request: `GatewayComponentUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_gateway_component_type":1,"component_period_unit":"string","component_period_interval":1,"max_tries_per_dev":1,"max_tries_per_point":1}' \
  /mgd/gateways/501234/components/14?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules

List schedules belonging to a specific gateway component.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewaySchedule`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/components/14/schedules?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14/schedules"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}

Clear schedule bindings from the component point groups.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/components/14/schedules/12?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14/schedules/12"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}

Return the detailed schedule usage across point groups, devices and points.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayScheduleDetail`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/components/14/schedules/12?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14/schedules/12"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}

Bind the schedule to the selected point groups of the component.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | Gateway component row identifier. |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_group_ids` | No | array of integer | [] | Point-group identifiers used by the component schedule relation. |

### Pydantic models

- Request: `GatewayComponentScheduleUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"point_group_ids":[1]}' \
  /mgd/gateways/501234/components/14/schedules/12?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/components/14/schedules/12"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/config-changes

List config changes with stable pagination and optional sync hints.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/config-changes
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `change_status` | No | string or null | null | Filter changes by their current change status. |
| `change_group_key` | No | string or null | null | Filter changes belonging to one proposal group. |
| `operation` | No | string or null | null | Filter changes by operation (`C`, `U`, or `D`). |
| `id_setup_target` | No | integer or null | null | Filter changes or synchronization state by target setup. |
| `limit` | No | integer | 100 | Maximum number of history rows to return. Min: `1`; max: `500`. |
| `offset` | No | integer | 0 | Number of history rows to skip before returning results. Min: `0`. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayConfigChange`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/config-changes?limit=100&offset=0&include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/config-changes"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PATCH /mgd/gateways/{id_setup}/config-changes/status

Update the change_status of several config changes selected by ids or change_group_key.

### Endpoint
```http
PATCH /mgd/gateways/{id_setup}/config-changes/status
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `change_status` | Yes | string | No | Requested configuration-change status transition. Allowed: `in_progress`, `retry`, `failed`, `applied`, `cancelled`. |
| `scheduled_at` | No | date-time string or null | null | Optional worker scheduling timestamp; omission preserves the current value. |
| `id_setup_gateway_config_change_ids` | No | array of integer | [] | Configuration-change row identifiers to update. |
| `change_group_key` | No | string or null | null | Request attribute defined by the operation schema. |

### Pydantic models

- Request: `GatewayConfigChangeBulkStatusUpdate`.
- Response: `ShowGatewayConfigChange`.

### Sample request
```bash
curl -X PATCH -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"change_status":"in_progress","scheduled_at":"string","id_setup_gateway_config_change_ids":[1],"change_group_key":"string"}' \
  /mgd/gateways/501234/config-changes/status
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/config-changes/status"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}

Get Gateway Config Change

### Endpoint
```http
GET /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_config_change` | Yes | integer | Configuration-change row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayConfigChange`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/config-changes/9001?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/config-changes/9001"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PATCH /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}/status

Update the change_status of a single config change, enforcing allowed transitions.

### Endpoint
```http
PATCH /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}/status
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup_gateway_config_change` | Yes | integer | Configuration-change row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `change_status` | Yes | string | No | Requested configuration-change status transition. Allowed: `in_progress`, `retry`, `failed`, `applied`, `cancelled`. |
| `scheduled_at` | No | date-time string or null | null | Optional worker scheduling timestamp; omission preserves the current value. |

### Pydantic models

- Request: `GatewayConfigChangeStatusUpdate`.
- Response: `ShowGatewayConfigChange`.

### Sample request
```bash
curl -X PATCH -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"change_status":"in_progress","scheduled_at":"string"}' \
  /mgd/gateways/501234/config-changes/9001/status
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/config-changes/9001/status"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/config-json

Return the functional gateway JSON from canonical rows plus active proposals.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/config-json
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `projection` | No | string | "proposed" | Select the functional JSON projection to return. Allowed: `applied`, `proposed`. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayJsonProjection`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/config-json?projection=proposed&include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/config-json"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/config-sync

Return derived synchronization state only for an explicit request.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/config-sync
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_entity` | No | integer or null | null | Resource entity identifier. Must be supplied together with `id_resource` to select one resource. |
| `id_resource` | No | integer or null | null | Resource primary-key identifier. Must be supplied together with `id_entity` to select one resource. |
| `id_setup_target` | No | integer or null | null | Filter changes or synchronization state by target setup. |

### Request body

This endpoint does not accept a JSON request body.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  "/mgd/gateways/501234/config-sync?id_entity=1002&id_resource=7001&id_setup_target=501709"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup": 501709,
    "id_setup_gateway": 501234,
    "id_entity": 1002,
    "id_resource": 7001,
    "installed": true,
    "is_synchronized": true,
    "canonical_value_may_not_be_applied": false,
    "non_terminal_change_count": 0,
    "failed_change_count": 0,
    "unresolved_change_count": 0,
    "status_counts": {"applied": 1},
    "has_active_change": false,
    "has_failed_change": false,
    "latest_change_status": "applied",
    "latest_change_id": 9001,
    "latest_change_scheduled_at": null
  },
  "context": {},
  "instance": "/mgd/gateways/501234/config-sync"
}
```

Without the resource pair, the response is the gateway rollup and includes
`resources[]`. Supplying only one of `id_entity` or `id_resource` returns
`400`; the API does not require clients to scan the complete config-change
history to find a resource.

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices

List each sensor or actuator setup under the gateway once.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `child_id_setup` | No | integer or null | null | Filter the device collection to one child setup. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDevice`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}

Return the setup-child resource and its device-config associations.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDevice`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs

List all device-config resources owned by one child setup.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDeviceConfig`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs

Create one device-config explicitly under its child setup.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | No | Component receiving or owning the resource. Exclusive min: `0.0`. |
| `device_key` | Yes | string | No | Gateway-unique key for the configured child device. Max length: `100`. |
| `connection` | No | object or null | null | Physical device connection configuration. |
| `function_status` | No | integer or null | null | Device function status value. |

### Pydantic models

- Request: `GatewayDeviceConfigForChildCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_component":1,"device_key":"string","function_status":1}' \
  /mgd/gateways/501234/devices/501709/configs?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}

Delete Gateway Device Config

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `config_id` | Yes | integer | Device configuration identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | boolean | false | Allow deletion of dependent relationship rows when supported. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs/config_id?recursive=false&include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/config_id"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}

Get Gateway Device Config

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `config_id` | Yes | integer | Device configuration identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDeviceConfig`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs/config_id?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/config_id"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}

Update Gateway Device Config

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{config_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `config_id` | Yes | integer | Device configuration identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | No | integer or null | null | Component receiving or owning the resource. |
| `device_key` | No | string or null | null | Gateway-unique key for the configured child device. |
| `connection` | No | object or null | null | Physical device connection configuration. |
| `function_status` | No | integer or null | null | Device function status value. |

### Pydantic models

- Request: `GatewayDeviceUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_component":1,"device_key":"string","function_status":1}' \
  /mgd/gateways/501234/devices/501709/configs/config_id?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/config_id"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points

List points under one canonical device-config resource.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | integer | Explicit device configuration identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_type` | No | string or null | null | Filter points by the model catalog point type. |
| `writable` | No | boolean or null | null | Filter points by whether the model point has a write function. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDevicePoint`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs/44/points?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points

Enable model points under one canonical device-config resource.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | integer | Explicit device configuration identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_device_model_point_ids` | No | array of integer | [] | Model catalog point identifiers to enable. |

### Pydantic models

- Request: `GatewayDevicePointsForConfigCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_device_model_point_ids":[1]}' \
  /mgd/gateways/501234/devices/501709/configs/44/points?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}

Delete Gateway Device Config Point

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | integer | Explicit device configuration identifier. |
| `id_device_model_point` | Yes | integer | Device-model catalog point identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | boolean | false | Allow deletion of dependent relationship rows when supported. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs/44/points/900?recursive=false&include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}

Get Gateway Device Config Point

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | integer | Explicit device configuration identifier. |
| `id_device_model_point` | Yes | integer | Device-model catalog point identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDevicePointDetail`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs/44/points/900?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}

Update Gateway Device Config Point

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | integer | Explicit device configuration identifier. |
| `id_device_model_point` | Yes | integer | Device-model catalog point identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `factor_override` | No | number or null | null | Device-specific factor; omit or clear it to use model inheritance. |
| `available_status` | No | object or null | null | Writable-point status mapping; omit it for read-only points. |

### Pydantic models

- Request: `GatewayDevicePointUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"factor_override":1}' \
  /mgd/gateways/501234/devices/501709/configs/44/points/900?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups

List the point groups of the relay_control device-config, optionally filtered by schedule.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `schedule` | No | integer or null | null | Filter point groups by their linked schedule identifier. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayPointGroup`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups

Create a point group for the relay_control device-config resolved from the child setup.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_group_name` | Yes | string | No | Logical point-group name. Max length: `100`. |
| `control_mode` | Yes | string | No | Point-group control mode. Max length: `50`. |
| `id_setup_gateway_schedule` | No | integer or null | null | Schedule assigned to the point group. |

### Pydantic models

- Request: `GatewayPointGroupCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"point_group_name":"string","control_mode":"string","id_setup_gateway_schedule":1}' \
  /mgd/gateways/501234/devices/501709/point-groups?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}

Delete one point group using its canonical resource identifier.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | boolean | false | Allow deletion of dependent relationship rows when supported. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups/80?recursive=false&include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}

Return one point group using its canonical resource identifier.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayPointGroupDetail`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups/80?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}

Update one point group using its canonical resource identifier.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_group_name` | No | string or null | null | Logical point-group name. |
| `control_mode` | No | string or null | null | Point-group control mode. |
| `id_setup_gateway_schedule` | No | integer or null | null | Schedule assigned to the point group. |

### Pydantic models

- Request: `GatewayPointGroupUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"point_group_name":"string","control_mode":"string","id_setup_gateway_schedule":1}' \
  /mgd/gateways/501234/devices/501709/point-groups/80?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points

Get Point Group Points By Id

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayDevicePoint`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups/80/points?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80/points"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points

Add Point Group Points By Id

### Endpoint
```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_device_point_ids` | No | array of integer | [] | Existing device-point row identifiers to link. |

### Pydantic models

- Request: `GatewayPointGroupPointsUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_device_point_ids":[1]}' \
  /mgd/gateways/501234/devices/501709/point-groups/80/points?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80/points"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points/{id_device_model_point}

Delete Point Group Point By Id

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_device_model_point` | Yes | integer | Device-model catalog point identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups/80/points/900?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days

Get Point Group Special Days By Id

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewaySpecialDay`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups/80/special-days?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80/special-days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days

Add Point Group Special Days By Id

### Endpoint
```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_special_day_ids` | No | array of integer | [] | Existing special-day row identifiers to link. |

### Pydantic models

- Request: `GatewayPointGroupSpecialDaysUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_special_day_ids":[1]}' \
  /mgd/gateways/501234/devices/501709/point-groups/80/special-days?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80/special-days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days/{id_setup_gateway_special_day}

Delete Point Group Special Day By Id

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{id_setup_gateway_point_group}/special-days/{id_setup_gateway_special_day}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `child_id_setup` | Yes | integer | Child setup identifier. |
| `id_setup_gateway_point_group` | Yes | integer | Point-group row identifier. |
| `id_setup_gateway_special_day` | Yes | integer | Special-day row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/point-groups/80/special-days/21?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/point-groups/80/special-days/21"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/extensions

List the gateway extension catalog, including whether each extension is currently attached to a schedule.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/extensions
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayExtension`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/extensions?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/extensions"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/extensions

Create a detached extension entity for a gateway component.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/extensions
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | No | Component receiving or owning the resource. Exclusive min: `0.0`. |
| `extension_name` | Yes | string | No | Human-readable extension name. Max length: `100`. |
| `time_start` | Yes | date-time string | No | Extension start time. |
| `time_end` | Yes | date-time string | No | Extension end time. |
| `desired_status` | Yes | string | No | Status the extension applies during its time range. Max length: `20`. |

### Pydantic models

- Request: `GatewayExtensionCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_component":1,"extension_name":"string","time_start":"string","time_end":"string","desired_status":"string"}' \
  /mgd/gateways/501234/extensions?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/extensions"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/extensions/{extension_id}

Delete an extension entity; recursive also removes its schedule links.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/extensions/{extension_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `extension_id` | Yes | integer | Gateway extension row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | boolean | false | Allow deletion of dependent relationship rows when supported. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/extensions/31?recursive=false&include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/extensions/31"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/extensions/{extension_id}

Return the detail of one gateway extension.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/extensions/{extension_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `extension_id` | Yes | integer | Gateway extension row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayExtension`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/extensions/31?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/extensions/31"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/extensions/{extension_id}

Update one extension entity independently from schedule links.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/extensions/{extension_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `extension_id` | Yes | integer | Gateway extension row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `extension_name` | No | string or null | null | Human-readable extension name. |
| `time_start` | No | date-time string or null | null | Extension start time. |
| `time_end` | No | date-time string or null | null | Extension end time. |
| `desired_status` | No | string or null | null | Status the extension applies during its time range. |

### Pydantic models

- Request: `GatewayScheduleExtensionUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"extension_name":"string","time_start":"string","time_end":"string","desired_status":"string"}' \
  /mgd/gateways/501234/extensions/31?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/extensions/31"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/imports

Import one canonical gateway JSON document and track effective writes as applied.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/imports
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `dry_run` | No | boolean | false | Validate and calculate an import without persisting it. |
| `strict` | No | boolean | false | Fail the import when strict validation detects an unsupported condition. |
| `force` | No | boolean | false | Allow the import operation when its documented force guard applies. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `root` | Yes | object | No | Complete canonical gateway JSON snapshot. See the [MGD JSON projection](mgd_json_projection.md) for the document structure. |

The root document must declare `json_version >= v4.1`. In the v4.3 device
shape, `special_days` is a list of objects only. The legacy dictionary shape
is invalid: `strict=false` reports `special_days_invalid_format`, skips that
section, and continues; `strict=true` returns `400`. The legacy device
connection `resource` field is ignored, `channel_configs` is imported under
component `settings`, and
`model_point_catalog_missing` remains for unresolved point references without
sufficient metadata.

### Pydantic models

- Request: `GatewayImportPayload`.
- Response: `ShowGatewayImportSummary`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "root": {
      "json_version": "v4.3",
      "id": "501234",
      "name": "Gateway CM4GGV2",
      "database": {},
      "lambda_functions": {
        "GG_relay_control": {
          "channel_configs": {"mode": "automatic"},
          "devices": {
            "Iluminacion_1": {
              "id": "10000000e0570554",
              "device_type": "WSTRTURelay8RO8DI",
              "resource": "legacy-value",
              "port": "/dev/ttyAMA2",
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
  }' \
  /mgd/gateways/501234/imports?dry_run=false&strict=false&force=false
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {
    "id_setup": 501234,
    "imported_gateway_id": "10000000e0570554",
    "resolved_setup_id": 501234,
    "dry_run": false,
    "strict": false,
    "warnings": [],
    "flags": []
  },
  "context": {},
  "instance": "/mgd/gateways/501234/imports"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `201` | Resource created successfully. |
| `400` | Invalid path, query parameter, request body, JSON version, or strict importer validation. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/schedules

List schedules for the gateway relay_control component.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/schedules
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewaySchedule`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/schedules

Create a schedule on the gateway relay_control component.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/schedules
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_gateway_schedule_type` | Yes | integer | No | Schedule type catalog identifier. Exclusive min: `0.0`. |
| `schedule_number` | Yes | integer | No | Schedule number within its type and scope. |
| `schedule_scope_type` | Yes | integer | No | Numeric schedule scope (`0` everyday, `1` special day). Min: `0.0`; max: `1.0`. |
| `schedule_name` | No | string or null | null | Human-readable schedule name. |
| `schedule_config` | Yes | object | No | Schedule-specific configuration object. |

### Pydantic models

- Request: `GatewayScheduleCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_gateway_schedule_type":1,"schedule_number":1,"schedule_scope_type":1,"schedule_name":"string"}' \
  /mgd/gateways/501234/schedules?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}

Delete a schedule. With recursive=true, purge linked extensions first.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | boolean | false | Allow deletion of dependent relationship rows when supported. |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12?recursive=false&include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/schedules/{schedule_id}

Return the detail of a specific gateway schedule.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewaySchedule`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}

Update a schedule without nulling omitted fields.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_gateway_schedule_type` | No | integer or null | null | Schedule type catalog identifier. |
| `schedule_number` | No | integer or null | null | Schedule number within its type and scope. |
| `schedule_scope_type` | No | integer or null | null | Numeric schedule scope (`0` everyday, `1` special day). |
| `schedule_name` | No | string or null | null | Human-readable schedule name. |
| `schedule_config` | No | object or null | null | Schedule-specific configuration object. |

### Pydantic models

- Request: `GatewayScheduleUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_gateway_schedule_type":1,"schedule_number":1,"schedule_scope_type":1,"schedule_name":"string"}' \
  /mgd/gateways/501234/schedules/12?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions

List the extensions currently attached to the selected schedule.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayExtension`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12/extensions?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/extensions"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions

Create an extension and attach it to the selected schedule.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `extension_name` | Yes | string | No | Human-readable extension name. Max length: `100`. |
| `time_start` | Yes | date-time string | No | Extension start time. |
| `time_end` | Yes | date-time string | No | Extension end time. |
| `desired_status` | Yes | string | No | Status the extension applies during its time range. Max length: `20`. |

### Pydantic models

- Request: `GatewayScheduleExtensionCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"extension_name":"string","time_start":"string","time_end":"string","desired_status":"string"}' \
  /mgd/gateways/501234/schedules/12/extensions?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/extensions"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}

Detach one extension from the selected schedule without deleting the entity.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup_gateway_extension` | Yes | integer | Gateway extension row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12/extensions/31?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/extensions/31"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}

Attach an existing extension entity to one schedule.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup_gateway_extension` | Yes | integer | Gateway extension row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12/extensions/31?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/extensions/31"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}

Update one extension attached to the selected schedule.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions/{id_setup_gateway_extension}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup_gateway_extension` | Yes | integer | Gateway extension row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `extension_name` | No | string or null | null | Human-readable extension name. |
| `time_start` | No | date-time string or null | null | Extension start time. |
| `time_end` | No | date-time string or null | null | Extension end time. |
| `desired_status` | No | string or null | null | Status the extension applies during its time range. |

### Pydantic models

- Request: `GatewayScheduleExtensionUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"extension_name":"string","time_start":"string","time_end":"string","desired_status":"string"}' \
  /mgd/gateways/501234/schedules/12/extensions/31?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/extensions/31"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days

Clear all special-day associations from the point groups that currently use the schedule.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12/special_days?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/special_days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days

Return the gateway special-day catalog and the subset currently applied through the schedule point groups.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayScheduleSpecialDays`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/schedules/12/special_days?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/special_days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days

Replace the special days associated to the point groups that currently use the schedule.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}/special_days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `schedule_id` | Yes | integer | Schedule row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_special_day_ids` | No | array of integer | [] | Existing special-day row identifiers to link. |

### Pydantic models

- Request: `GatewayScheduleSpecialDaysUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_special_day_ids":[1]}' \
  /mgd/gateways/501234/schedules/12/special_days?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/schedules/12/special_days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/special-days

List the relay_control special-day catalog for the gateway.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/special-days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewaySpecialDay`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/special-days?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/special-days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/special-days

Create a special-day group on the gateway relay_control component.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/special-days
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `day_group_name` | Yes | string | No | Logical special-day group name. Max length: `100`. |
| `dates` | Yes | array of string | No | Special-day dates in the documented `dd-mm` format. |

### Pydantic models

- Request: `GatewaySpecialDayCreate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"day_group_name":"string","dates":["string"]}' \
  /mgd/gateways/501234/special-days?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/special-days"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## DELETE /mgd/gateways/{id_setup}/special-days/{special_day_id}

Delete a special-day group and its point-group links.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/special-days/{special_day_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `special_day_id` | Yes | integer | Special-day row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/special-days/21?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/special-days/21"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## GET /mgd/gateways/{id_setup}/special-days/{special_day_id}

Return a single special-day group.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/special-days/{special_day_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `special_day_id` | Yes | integer | Special-day row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `ShowGatewaySpecialDay`.

### Sample request
```bash
curl -X GET -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/special-days/21?include_config_sync=false
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/special-days/21"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## PUT /mgd/gateways/{id_setup}/special-days/{special_day_id}

Update a special-day group without nulling omitted fields.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/special-days/{special_day_id}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `special_day_id` | Yes | integer | Special-day row identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `day_group_name` | No | string or null | null | Logical special-day group name. |
| `dates` | No | array of string or null | null | Special-day dates in the documented `dd-mm` format. |

### Pydantic models

- Request: `GatewaySpecialDayUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"day_group_name":"string","dates":["string"]}' \
  /mgd/gateways/501234/special-days/21?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/special-days/21"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/gateways/{id_setup}/templates/{id_gateway_config_template}/apply

Apply a config template to a component, materializing schedules or extensions under one change group.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/templates/{id_gateway_config_template}/apply
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_gateway_config_template` | Yes | integer | Gateway configuration template identifier. |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | boolean | false | Include the applicable configuration synchronization hint. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_setup_gateway_component` | Yes | integer | No | Component receiving or owning the resource. Exclusive min: `0.0`. |
| `overrides` | No | object or null | null | Optional template resource override map. |

### Pydantic models

- Request: `GatewayTemplateApply`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_setup_gateway_component":1,"overrides":{}}' \
  /mgd/gateways/501234/templates/7/apply?include_config_sync=false
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/gateways/501234/templates/7/apply"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Mutation accepted and proposed for asynchronous processing. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/setups/{id_setup}/config-changes/reconcile

Validate installation and synchronize MGD changes for a setup.

The body is optional so the operation can be called without JSON. When
present, it remains extensible for gateway-wide reconciliation options.

### Endpoint
```http
POST /mgd/setups/{id_setup}/config-changes/reconcile
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_children` | No | boolean | false | Request attribute defined by the operation schema. |

### Pydantic models

- Request: `inline schema`.
- Response: `MgdSetupReconcileResponse`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"include_children":false}' \
  /mgd/setups/501234/config-changes/reconcile
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/setups/501234/config-changes/reconcile"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |

## POST /mgd/setups/{id_setup}/config-changes/replay

Replay one SQS notification for existing pending MGD changes.

### Endpoint
```http
POST /mgd/setups/{id_setup}/config-changes/replay
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration. | string |
| `Account` | Yes | Target account identifier. | int or string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | integer | Gateway setup identifier. Exclusive min: `0`. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a JSON request body.

### Pydantic models

- Response: `MgdSetupReplayResponse`.

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /mgd/setups/501234/config-changes/replay
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {},
  "context": {},
  "instance": "/mgd/setups/501234/config-changes/replay"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Request completed successfully. |
| `400` | Invalid path, query parameter, or request body. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks the required permission. |
| `404` | A scoped resource was not found. |
| `422` | See the OpenAPI response definition. |
| `500` | Unexpected server error. |
