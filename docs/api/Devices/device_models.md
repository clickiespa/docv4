# Device Models

## Endpoints
- [List device models](#list-device-models)
- [Get device model](#get-device-model)
- [Update device model](#update-device-model)
- [List settings for a device model](#list-settings-for-a-device-model)
- [List device model points](#list-device-model-points)
- [Create a device model point](#create-a-device-model-point)
- [Get a device model point](#get-a-device-model-point)
- [Update a device model point](#update-a-device-model-point)
- [Delete a device model point](#delete-a-device-model-point)
- [Get the setting matched to a device model point](#get-the-setting-matched-to-a-device-model-point)
- [List device model types](#list-device-model-types)
- [List device model manufacturers](#list-device-model-manufacturers)

Descriptions of supported device models that can be assigned to devices, including their technical point catalogs used by MGD gateway configuration.

**Clearance requirements:** read requires clearance level 4 or lower, update
requires clearance level 2 or lower, and model-point mutations require A2 or
A1. This API surface does not expose a device-model creation endpoint.

## List device models

Retrieve device models visible to the authenticated account, with optional filters for archival status, model type, manufacturer and name.

Clearance level 4 or lower is required to read device models through this endpoint.

### Endpoint
```
GET /device_models
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `skip` | No | int | `0` | Pagination offset. |
| `limit` | No | int | `100` | Maximum number of records to return. |
| `archived` | No | bool | No | Filter by archival status. When omitted, both archived and active models are returned. |
| `id_device_model_type` | No | int | No | Filter models by the related type identifier configured for the account. See [Related catalogs](#related-catalogs). |
| `id_device_model_manufacturer` | No | int | No | Filter models by the manufacturer identifier associated with the account. See [Related catalogs](#related-catalogs). |
| `model_name` | No | string | No | Filter models using a case-insensitive match on the model name. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/device_models?archived=false&limit=25"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Device models retrieved successfully",
  "data": [
    {
      "id_device_model": 3,
      "id_device_model_type": 2,
      "id_device_model_manufacturer": 4,
      "id_device_model_role": 2,
      "id_file_picture": 18,
      "id_configuration": null,
      "id_gateway_protocol": 2,
      "model_name": "Gateway v2",
      "model_description": "LTE-enabled indoor gateway",
      "model_observations": null,
      "model_sends_data": true,
      "device_model_protocol": "tcp",
      "model_trace_by_quantity": false,
      "model_archived": false
    }
  ],
  "context": {},
  "instance": "/device_models"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_model` | int | Numeric identifier of the device model. |
| `id_device_model_type` | int | Identifier of the model type configured for the account. See [Related catalogs](#related-catalogs). |
| `id_device_model_manufacturer` | int | Identifier of the manufacturer associated with the model. See [Related catalogs](#related-catalogs). |
| `id_device_model_role` | int | Device model role identifier used to validate gateway-capable models and subinstallable child models. |
| `id_file_picture` | int | Identifier of the picture file illustrating the model. |
| `id_configuration` | int | Identifier of the default configuration applied to devices of this model. |
| `id_gateway_protocol` | int | Identifier of the gateway protocol assigned to the model. Obtain valid values from [`GET /mgd/gateways/protocols`](../gateways/mgd_gateways.md#catalog). |
| `model_name` | string | Human-readable name of the device model. |
| `model_description` | string | Narrative description of the model. |
| `model_observations` | string | Internal notes about the model. |
| `model_sends_data` | bool | Indicates whether devices of this model publish telemetry. |
| `device_model_protocol` | string | Read-only protocol label resolved from `id_gateway_protocol` through `gateway_protocols`. |
| `model_trace_by_quantity` | bool | Determines if stock is tracked by quantity for the model. |
| `model_archived` | bool | Indicates whether the model is archived. |

### Related catalogs

Use the following endpoints to obtain identifiers referenced by device models:

- [`GET /types/device_models`](#list-device-model-types) returns available model types.
- [`GET /device_model_manufacturers`](#list-device-model-manufacturers) lists registered manufacturers.

### Pydantic models

- Response item: `ShowDeviceModel` (`List[ShowDeviceModel]`).

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device models retrieved successfully. |
| `400` | Pagination or filter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user is not authorized to list device models. |
| `404` | Not used for this collection endpoint. |
| `500` | Unexpected server error. |

### Error response (403)
```json
{
  "status": "error",
  "message": "Insufficient permissions",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/device_models"
}
```

## Get device model

Retrieve details for a single device model.

Clearance level 4 or lower is required to read device models through this endpoint.

### Endpoint
```
GET /device_models/{id_device_model}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Numeric identifier of the device model to retrieve. |

### Query parameters

This endpoint does not accept query parameters.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /device_models/3
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_device_model": 3,
    "id_device_model_type": 2,
    "id_device_model_manufacturer": 4,
    "id_device_model_role": 2,
    "id_file_picture": 18,
    "id_configuration": null,
    "id_gateway_protocol": 2,
    "model_name": "Gateway v2",
    "model_description": "LTE-enabled indoor gateway",
    "model_observations": null,
    "model_sends_data": true,
    "device_model_protocol": "tcp",
    "model_trace_by_quantity": false,
    "model_archived": false
  },
  "context": {},
  "instance": "/device_models/3"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_model` | int | Numeric identifier of the device model. |
| `id_device_model_type` | int | Identifier of the model type configured for the account. See [Related catalogs](#related-catalogs). |
| `id_device_model_manufacturer` | int | Identifier of the manufacturer associated with the model. See [Related catalogs](#related-catalogs). |
| `id_device_model_role` | int | Device model role identifier used to validate gateway-capable models and subinstallable child models. |
| `id_file_picture` | int | Identifier of the picture file illustrating the model. |
| `id_configuration` | int | Identifier of the default configuration applied to devices of this model. |
| `id_gateway_protocol` | int | Identifier of the gateway protocol assigned to the model. Obtain valid values from [`GET /mgd/gateways/protocols`](../gateways/mgd_gateways.md#catalog). |
| `model_name` | string | Human-readable name of the device model. |
| `model_description` | string | Narrative description of the model. |
| `model_observations` | string | Internal notes about the model. |
| `model_sends_data` | bool | Indicates whether devices of this model publish telemetry. |
| `device_model_protocol` | string | Read-only protocol label resolved from `id_gateway_protocol` through `gateway_protocols`. |
| `model_trace_by_quantity` | bool | Determines if stock is tracked by quantity for the model. |
| `model_archived` | bool | Indicates whether the model is archived. |

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device model retrieved successfully. |
| `400` | Validation failed for the provided identifier. |
| `401` | Authentication failed. |
| `403` | The authenticated user is not authorized to read device models. |
| `404` | Device model not found for the supplied identifier. |
| `500` | Unexpected server error. |

### Error response (404)
```json
{
  "status": "error",
  "message": "Device model not found",
  "data": null,
  "context": {
    "params": {
      "id_device_model": 99999
    }
  },
  "instance": "/device_models/99999"
}
```

### Pydantic models

- Response: `ShowDeviceModel`.

## Update device model

Update editable fields for a device model. Omitted fields are preserved. Assign the MGD gateway protocol using `id_gateway_protocol` from [`GET /mgd/gateways/protocols`](../gateways/mgd_gateways.md#catalog).

Clearance level 2 or lower is required to update device models through this endpoint.

### Endpoint
```
PUT /device_models/{id_device_model}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Numeric identifier of the device model to update. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_device_model_type` | No | int | No | Model type identifier. See [Related catalogs](#related-catalogs). |
| `id_device_model_manufacturer` | No | int | No | Manufacturer identifier. See [Related catalogs](#related-catalogs). |
| `id_device_model_role` | No | int | No | Device model role identifier. |
| `id_file_picture` | No | int | No | Picture file identifier. |
| `id_configuration` | No | int | No | Default configuration identifier. |
| `id_gateway_protocol` | No | int | No | Gateway protocol identifier from `gateway_protocols`. |
| `model_name` | No | string | No | Human-readable model name. |
| `model_description` | No | string | No | Narrative description. |
| `model_observations` | No | string | No | Internal notes. |
| `model_sends_data` | No | bool | No | Whether devices of this model publish telemetry. |
| `model_trace_by_quantity` | No | bool | No | Whether stock is tracked by quantity. |
| `model_archived` | No | bool | No | Whether the model is archived. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -X PUT -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_gateway_protocol": 2}' \
  /device_models/3
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_device_model": 3,
    "id_device_model_type": 2,
    "id_device_model_manufacturer": 4,
    "id_device_model_role": 2,
    "id_file_picture": 18,
    "id_configuration": null,
    "id_gateway_protocol": 2,
    "model_name": "Gateway v2",
    "model_description": "LTE-enabled indoor gateway",
    "model_observations": null,
    "model_sends_data": true,
    "device_model_protocol": "tcp",
    "model_trace_by_quantity": false,
    "model_archived": false
  },
  "context": {},
  "instance": "/device_models/3"
}
```

### Pydantic models

- Request: `DeviceModelUpdate`.
- Response: `ShowDeviceModel`.

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device model updated successfully. |
| `400` | Validation failed for the provided payload. |
| `401` | Authentication failed. |
| `403` | The authenticated user is not authorized to update device models. |
| `404` | Device model or referenced `id_gateway_protocol` not found. |
| `500` | Unexpected server error. |

### Error response (404)
```json
{
  "status": "error",
  "message": "GatewayProtocol with id_gateway_protocol 99 does not exist",
  "data": null,
  "context": {
    "path": {
      "id_gateway_protocol": 99
    }
  },
  "instance": "/device_models/3"
}
```

## List settings for a device model

Retrieve settings definitions for a specific device model. This endpoint replaces direct access to `device_model_settings`.

Clearance level 4 or lower is required to use this endpoint.

### Endpoint
```
GET /device_models/{id_device_model}/settings
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Device model identifier returned by [List device models](#list-device-models). |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `skip` | No | int | `0` | Pagination offset. |
| `limit` | No | int | `100` | Maximum number of records to return. |

### Request body

This endpoint does not accept a request body.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/device_models/3/settings?skip=0&limit=20"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [
    {
      "id_device_model_setting": 500101,
      "id_uom": 12,
      "id_device_model": 3,
      "id_function": null,
      "dms_attribute_name": "temperature",
      "dms_observations": null,
      "dms_payload_length": 2,
      "dms_payload_transform": "raw"
    }
  ],
  "context": {},
  "instance": "/device_models/3/settings"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_model_setting` | int | Numeric identifier of the model setting. |
| `id_uom` | int | Unit-of-measure identifier used by the setting. |
| `id_device_model` | int | Owning device model identifier. |
| `id_function` | int | Optional function identifier associated with the setting. |
| `dms_attribute_name` | string | Attribute name exposed by the setting. |
| `dms_observations` | string | Optional setting notes. |
| `dms_payload_length` | int | Number of payload values consumed by the setting. |
| `dms_payload_transform` | string | Optional transform applied to the payload. |

### Status codes

| Status | Description |
| --- | --- |
| `200` | Model settings retrieved successfully. |
| `401` | Authentication failed. |
| `403` | The authenticated user is not authorized to read model settings. |
| `404` | The device model does not exist in the requested scope. |
| `500` | Unexpected server error. |

### Pydantic models

- Response item: `ShowDeviceModelSetting` (`List[ShowDeviceModelSetting]`).

## List device model points

List the technical points available in a device model catalog. MGD uses this
catalog when assigning points to an explicit device configuration.

Clearance level 4 or lower is required to read device model points.

### Endpoint
```http
GET /device_models/{id_device_model}/points
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile. | string |
| `Account` | Yes | Target account identifier. | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Device model identifier returned by [List device models](#list-device-models). |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_type` | No | string | No | Filter by one supported point type. |
| `writable` | No | bool | No | `true` returns points with a write function; `false` returns read-only points. |

### Supported point types

| Value | Meaning |
| --- | --- |
| `modbus_coil` | Modbus coil. |
| `modbus_discrete_input` | Modbus discrete input. |
| `modbus_input_register` | Modbus input register. |
| `modbus_holding_register` | Modbus holding register. |
| `gpio` | GPIO channel. |
| `virtual` | Computed or non-addressed point. |

Do not use legacy point type names or name-based point identifiers. The
catalog key is `id_device_model_point`; `point_key` identifies the point in
the exported JSON and `point_label` is its display label.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/device_models/42/points?point_type=modbus_holding_register&writable=false"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_device_model_point": 900,
      "id_device_model": 42,
      "point_key": "Hact",
      "point_label": "Active power",
      "point_type": "modbus_holding_register",
      "address": 100,
      "count": 2,
      "bit": null,
      "value_format": "float32",
      "byteorder_key": "big",
      "wordorder_key": "big",
      "factor_default": 1,
      "read_function": "read_holding_registers",
      "write_function": null,
      "available_status_default": null
    }
  ],
  "context": {
    "query": {
      "point_type": "modbus_holding_register",
      "writable": "false"
    }
  },
  "instance": "/device_models/42/points"
}
```

### Pydantic models

- Response item: `ShowDeviceModelPoint` (`List[ShowDeviceModelPoint]`).

### Status codes

| Status | Description |
| --- | --- |
| `200` | Points retrieved successfully. |
| `400` | Query parameter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot read the model point catalog. |
| `404` | Device model not found or outside the request scope. |
| `500` | Unexpected server error. |

## Create a device model point

Create one technical point in a device model catalog.

Clearance A2 or A1 is required to create a device model point.

### Endpoint
```http
POST /device_models/{id_device_model}/points
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile. | string |
| `Account` | Yes | Target account identifier. | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Device model that owns the new point. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_key` | Yes | string | No | Stable technical key used by exports and cross-references. |
| `point_label` | Yes | string | No | Human-readable display label. |
| `point_type` | Yes | enum | No | One of the six supported point types listed above. |
| `address` | Conditional | int | No | Required for physical types (`modbus_*` and `gpio`); optional for `virtual`. |
| `count` | No | int | No | Register count when the protocol requires more than one register. |
| `bit` | No | int | No | Bit number for packed values. |
| `value_format` | No | string | No | Stored value format. |
| `byteorder_key` | No | string | No | Byte-order key. |
| `wordorder_key` | No | string | No | Word-order key. |
| `factor_default` | No | number | `1` | Default factor used when a device point has no override. |
| `read_function` | Yes | string | No | Reader function name. |
| `write_function` | No | string | No | Writer function name. Its presence marks the point as writable. |
| `available_status_default` | No | object | No | Default status mapping for writable/control points. Omit for read-only points. |

`point_name` is not a request field. Use `point_key` for the technical
identity and `point_label` for display. `modbus_register` is not a supported
value; use the specific input- or holding-register type.

The default factor is part of the public contract. A deployment that persists
or returns a null effective factor is out of sync with this contract and must
be corrected before clients rely on the value.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Sample request
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "point_key": "Hact",
    "point_label": "Active power",
    "point_type": "modbus_holding_register",
    "address": 100,
    "count": 2,
    "value_format": "float32",
    "read_function": "read_holding_registers"
  }' \
  /device_models/42/points
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_device_model_point": 900,
    "id_device_model": 42,
    "point_key": "Hact",
    "point_label": "Active power",
    "point_type": "modbus_holding_register",
    "address": 100,
    "count": 2,
    "bit": null,
    "value_format": "float32",
    "byteorder_key": null,
    "wordorder_key": null,
    "factor_default": 1,
    "read_function": "read_holding_registers",
    "write_function": null,
    "available_status_default": null
  },
  "context": {},
  "instance": "/device_models/42/points"
}
```

### Pydantic models

- Request: `DeviceModelPointCreate`.
- Response: `ShowDeviceModelPoint`.

### Status codes

| Status | Description |
| --- | --- |
| `201` | Point created successfully. |
| `400` | Payload validation failed, including an invalid type or missing physical address. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot create model points. |
| `404` | Device model not found or outside the request scope. |
| `500` | Unexpected server error. |

## Get a device model point

Retrieve one model point by its catalog ID.

Clearance level 4 or lower is required to read a device model point.

### Endpoint
```http
GET /device_models/{id_device_model}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile. | string |
| `Account` | Yes | Target account identifier. | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Owning device model identifier. |
| `id_device_model_point` | Yes | int | Catalog point identifier. |

### Query parameters

This endpoint does not accept query parameters.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Pydantic models

- Response: `ShowDeviceModelPoint`.

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /device_models/42/points/900
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_device_model_point": 900,
    "id_device_model": 42,
    "point_key": "Hact",
    "point_label": "Active power",
    "point_type": "modbus_holding_register",
    "address": 100,
    "count": 2,
    "factor_default": 1,
    "read_function": "read_holding_registers",
    "write_function": null,
    "available_status_default": null
  },
  "context": {},
  "instance": "/device_models/42/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Point retrieved successfully. |
| `400` | Path parameter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot read model points. |
| `404` | Model or point not found in the requested scope. |
| `500` | Unexpected server error. |

## Update a device model point

Update selected fields of a model point. Omitted fields are preserved; an
explicit `null` is a request to clear a nullable field, subject to the point
validation rules.

Clearance A2 or A1 is required to update a device model point.

### Endpoint
```http
PUT /device_models/{id_device_model}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile. | string |
| `Account` | Yes | Target account identifier. | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Owning device model identifier. |
| `id_device_model_point` | Yes | int | Catalog point identifier. |

### Request body

The body uses the same fields as the create request, all optional. The
conditional `address` rule and the supported `point_type` values still apply.

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_key` | No | string | No | Technical key. |
| `point_label` | No | string | No | Display label. |
| `point_type` | No | enum | No | Supported point type. |
| `address` | No | int or null | No | Required after the update for physical points; optional for `virtual`. |
| `count` | No | int or null | No | Register count. |
| `bit` | No | int or null | No | Bit number. |
| `value_format` | No | string or null | No | Stored value format. |
| `byteorder_key` | No | string or null | No | Byte-order key. |
| `wordorder_key` | No | string or null | No | Word-order key. |
| `factor_default` | No | number or null | `1` when inherited by contract | Model fallback factor. |
| `read_function` | No | string or null | No | Reader function. |
| `write_function` | No | string or null | No | Writer function. |
| `available_status_default` | No | object or null | No | Status mapping for writable/control points. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Pydantic models

- Request: `DeviceModelPointUpdate`.
- Response: `ShowDeviceModelPoint`.

### Sample request
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"factor_default": 1}' \
  /device_models/42/points/900
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_device_model_point": 900,
    "id_device_model": 42,
    "point_key": "Hact",
    "point_label": "Active power",
    "point_type": "modbus_holding_register",
    "address": 100,
    "factor_default": 1,
    "read_function": "read_holding_registers",
    "write_function": null,
    "available_status_default": null
  },
  "context": {},
  "instance": "/device_models/42/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Point updated successfully. |
| `400` | Payload or conditional point validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot update model points. |
| `404` | Model or point not found in the requested scope. |
| `500` | Unexpected server error. |

## Delete a device model point

Delete one model point by catalog ID. Confirm that no active device
configuration depends on the point before deleting it.

Clearance A2 or A1 is required to delete a device model point.

### Endpoint
```http
DELETE /device_models/{id_device_model}/points/{id_device_model_point}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile. | string |
| `Account` | Yes | Target account identifier. | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Owning device model identifier. |
| `id_device_model_point` | Yes | int | Catalog point identifier. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Pydantic models

- Response: no declared body model; the handler returns the deleted-point result.

### Sample request
```bash
curl -X DELETE \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /device_models/42/points/900
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": true,
  "context": {},
  "instance": "/device_models/42/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Point deleted successfully. |
| `400` | Path parameter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot delete model points. |
| `404` | Model or point not found in the requested scope. |
| `409` | The point has a dependency that prevents deletion. |
| `500` | Unexpected server error. |

## Get the setting matched to a device model point

Retrieve the setting associated with a model point. The route is addressed by
the model point catalog ID. If the current schema does not expose an explicit
point-to-setting foreign key, the implementation may use its documented
semantic matching rule internally; that implementation detail must not change
the public point identity.

Clearance level 4 or lower is required to read the matched setting.

### Endpoint
```http
GET /device_models/{id_device_model}/points/{id_device_model_point}/setting
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile. | string |
| `Account` | Yes | Target account identifier. | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Owning device model identifier. |
| `id_device_model_point` | Yes | int | Catalog point identifier. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Pydantic models

- Response: `ShowDeviceModelPointSetting`.

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /device_models/42/points/900/setting
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "point": {
      "id_device_model_point": 900,
      "id_device_model": 42,
      "point_key": "Hact",
      "point_label": "Active power",
      "point_type": "modbus_holding_register",
      "address": 100,
      "factor_default": 1,
      "read_function": "read_holding_registers",
      "write_function": null,
      "available_status_default": null
    },
    "setting": null
  },
  "context": {},
  "instance": "/device_models/42/points/900/setting"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Point and best matching setting retrieved successfully. |
| `400` | Path parameter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot read model points. |
| `404` | Model or point not found in the requested scope. |
| `500` | Unexpected server error. |

## List device model types

Retrieve device model types configured for the authenticated account.

Clearance level 4 or lower is required to access this endpoint.

### Endpoint
```
GET /types/device_models
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `skip` | No | int | `0` | Pagination offset. |
| `limit` | No | int | `100` | Maximum number of records to return. |
| `archived` | No | bool | No | Filter by archival status. When omitted, both archived and active types are returned. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/types/device_models?archived=false"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Device model types retrieved successfully",
  "data": [
    {
      "id_device_model_type": 2,
      "type_name": "Gateway",
      "type_description": "Gateway devices that forward data",
      "type_archived": false
    }
  ],
  "context": {},
  "instance": "/types/device_models"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_model_type` | int | Identifier of the device model type. |
| `type_name` | string | Name of the model type. |
| `type_description` | string | Description of the type. |
| `type_archived` | bool | Indicates whether the type is archived. |

### Pydantic models

- Response item: `ShowDeviceModelType` (`List[ShowDeviceModelType]`).

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device model types retrieved successfully. |
| `400` | Pagination or filter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user is not authorized to list model types. |
| `404` | Not used for this collection endpoint. |
| `500` | Unexpected server error. |

### Error response (403)
```json
{
  "status": "error",
  "message": "Insufficient permissions",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/types/device_models"
}
```

## List device model manufacturers

Retrieve device model manufacturers configured for the authenticated account.

Clearance level 4 or lower is required to access this endpoint.

### Endpoint
```
GET /device_model_manufacturers
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `skip` | No | int | `0` | Pagination offset. |
| `limit` | No | int | `100` | Maximum number of records to return. |
| `archived` | No | bool | No | Filter by archival status. When omitted, both archived and active manufacturers are returned. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/device_model_manufacturers?archived=false"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Device model manufacturers retrieved successfully",
  "data": [
    {
      "id_device_model_manufacturer": 4,
      "id_file_picture": 18,
      "manufacturer_name": "Acme Devices",
      "manufacturer_description": "Industrial-grade sensors",
      "manufacturer_observations": null,
      "manufacturer_archived": false
    }
  ],
  "context": {},
  "instance": "/device_model_manufacturers"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_model_manufacturer` | int | Identifier of the manufacturer. |
| `id_file_picture` | int | Identifier of the picture file associated with the manufacturer. |
| `manufacturer_name` | string | Name of the manufacturer. |
| `manufacturer_description` | string | Description of the manufacturer. |
| `manufacturer_observations` | string | Internal notes about the manufacturer. |
| `manufacturer_archived` | bool | Indicates whether the manufacturer is archived. |

### Pydantic models

- Response item: `ShowDeviceModelManufacturer` (`List[ShowDeviceModelManufacturer]`).

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device model manufacturers retrieved successfully. |
| `400` | Pagination or filter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user is not authorized to list model manufacturers. |
| `404` | Not used for this collection endpoint. |
| `500` | Unexpected server error. |

### Error response (403)
```json
{
  "status": "error",
  "message": "Insufficient permissions",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/device_model_manufacturers"
}
```
