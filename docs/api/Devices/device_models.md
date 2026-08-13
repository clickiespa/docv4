# Device Models

## Endpoints
- [List device models](#list-device-models)
- [Get device model](#get-device-model)
- [Update device model](#update-device-model)
- [List settings for a device model](#list-settings-for-a-device-model)
- [List or create device model points](#list-or-create-device-model-points)
- [Get, update, or delete a device model point](#get-update-or-delete-a-device-model-point)
- [Get the setting matched to a device model point](#get-the-setting-matched-to-a-device-model-point)
- [List device model types](#list-device-model-types)
- [List device model manufacturers](#list-device-model-manufacturers)

Descriptions of supported device models that can be assigned to devices, including their technical point catalogs used by MGD gateway configuration.

**Clearance requirements:** create requires clearance level 2 or lower, read requires clearance level 4 or lower, update requires clearance level 2 or lower and delete requires clearance level 2 or lower.

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

Clearance 4 or lower is required to use this endpoint.

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

## List or create device model points

Technical points represent registers, coils, GPIOs, or virtual points available for a device model. MGD uses this catalog to activate points on configured gateway devices.

Clearance A2 or A1 is required to use this endpoint by default.

### Endpoint
```http
GET /device_models/{id_device_model}/points
POST /device_models/{id_device_model}/points
```

### Request body for `POST`

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_key` | Yes | string | No | Stable key used by exports and cross-references. |
| `point_label` | Yes | string | No | Human-readable label shown in the UI. |
| `point_name` | No | string | No | Semantic point name used by `/mgd/gateways/*/points/{name}` routes. |
| `point_type` | Yes | string | No | `modbus_register`, `modbus_coil`, `gpio`, or `virtual`. |
| `address` | No | int | No | Physical address or channel number. |
| `count` | No | int | No | Register count. |
| `bit` | No | int | No | Bit number for packed values. |
| `value_format` | No | string | No | Stored value format. |
| `byteorder_key` | No | string | No | Byte order key. |
| `wordorder_key` | No | string | No | Word order key. |
| `factor_default` | No | number | No | Default factor for exported values. |
| `read_function` | Yes | string | No | Reader function name. |
| `write_function` | No | string | No | Writer function name. |
| `available_status_default` | No | object | No | Default available status JSON. |

## Get, update, or delete a device model point

### Endpoint
```http
GET /device_models/{id_device_model}/points/{point_label}
PUT /device_models/{id_device_model}/points/{point_label}
DELETE /device_models/{id_device_model}/points/{point_label}
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device_model` | Yes | int | Device model identifier. |
| `point_label` | Yes | string | Point label inside the device model catalog. |

### Notes
- `PUT` preserves omitted fields.
- `DELETE` currently removes the point row directly.

## Get the setting matched to a device model point

The current SQL migration does not relate points to settings directly. The API resolves the best semantic match by trying `point_name`, `point_label`, and `point_key` against `device_model_settings.dms_attribute_name`.

### Endpoint
```http
GET /device_models/{id_device_model}/points/{point_label}/setting
```

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
