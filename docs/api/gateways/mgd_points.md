# MGD device points

This guide documents the canonical device-point resources under an explicit
MGD device configuration. It complements the [MGD canonical contract](mgd_canonical_contract.md)
and focuses on point identifiers, filters, overrides, asynchronous changes,
and the JSON produced for reader devices.

## Table of contents

- [List device points](#list-device-points)
- [Create device points](#create-device-points)
- [Get a device point](#get-a-device-point)
- [Update a device point](#update-a-device-point)
- [Delete a device point](#delete-a-device-point)
- [Reader configuration and effective values](#reader-configuration-and-effective-values)

## Common headers and response envelope

All requests use:

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from the account configuration panel. | string |
| `Account` | Yes | Target account identifier. | int or string |
| `Content-Type` | For JSON bodies | Must be `application/json`. | string |

### Sample headers

```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

Operational MGD mutations persist the canonical row and return `202 Accepted`
with a proposal and a `change_group_key`. The gateway worker applies the
proposal asynchronously. The response envelope is:

```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {
    "status": "proposed",
    "change_group_key": "<CHANGE_GROUP_KEY>",
    "entity": {},
    "changes": []
  },
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points"
}
```

`id_device_model_point` identifies a point in the model catalog. The MGD row
created for that assignment is identified by
`id_setup_gateway_device_point`. The two IDs must not be interchanged.

## List device points

List the points assigned to one explicit device configuration.

Clearance level 4 or lower is required to read device points.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Gateway setup identifier. |
| `child_id_setup` | Yes | int | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | int | Explicit device configuration identifier selected for the child. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `point_type` | No | string | No | Filter by a supported model point type. |
| `writable` | No | bool | No | `true` returns points with a write function; `false` returns read-only points. |
| `include_config_sync` | No | bool | `false` | Include the gateway configuration synchronization hint. |

### Pydantic models

- Response item: `ShowGatewayDevicePoint` (`List[ShowGatewayDevicePoint]`).

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
  "/mgd/gateways/501234/devices/501709/configs/44/points?point_type=modbus_holding_register&writable=false"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_setup_gateway_device_point": 9100,
      "id_setup_gateway_device_config": 44,
      "id_device_model_point": 900,
      "factor_override": null,
      "available_status": null,
      "point": {
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
      }
    }
  ],
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device points retrieved successfully. |
| `400` | Query or path validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot read this gateway configuration. |
| `404` | Gateway, child, or device configuration was not found in scope. |
| `500` | Unexpected server error. |

## Create device points

Assign one or more existing model points to an explicit device configuration.
The body supports the legacy catalog-ID list and an atomic `points` list that
sets per-device overrides during the same proposal.

Clearance A2 or A1 is required to create device-point assignments.

### Endpoint
```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Gateway setup identifier. |
| `child_id_setup` | Yes | int | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | int | Device configuration receiving the point assignments. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | bool | `false` | Include the gateway configuration synchronization hint in the proposal. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_device_model_point_ids` | No | array of int | `[]` | Legacy catalog point IDs belonging to the child device model. An empty list produces no new assignments. |
| `points` | No | array of object | `[]` | Atomic point assignments. Each item may include the per-device overrides below. |
| `points[].id_device_model_point` | Yes, when item is present | int | No | Catalog point ID belonging to the child device model. |
| `points[].factor_override` | No | number or null | `null` | Device-specific factor. Omit it to inherit the model factor. |
| `points[].available_status` | No | object or null | `null` | Status mapping for writable points only. Omit it for read-only points. |

An ID may appear only once across both fields. `factor_override` applies to
read and writable points. `available_status` is rejected for a read-only model
point so the device configuration cannot store an inapplicable status mapping.
If a point is already assigned, sending an override returns `409`; use the
point PUT route for a later edit.

### Pydantic models

- Request: `GatewayDevicePointsForConfigCreate`.
- Response: `ShowGatewayProposal`.

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
  -d '{"points":[{"id_device_model_point":900,"factor_override":0.1},{"id_device_model_point":901,"factor_override":1,"available_status":{"off":0,"on":1}}]}' \
  /mgd/gateways/501234/devices/501709/configs/44/points
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {
    "status": "proposed",
    "change_group_key": "<CHANGE_GROUP_KEY>",
    "entity": {
      "operation": "C",
      "id_setup_target": 501709,
      "value": {
        "id_setup_gateway_device_config": 44,
        "id_device_model_point": 900,
        "factor_override": 0.1
      }
    },
    "changes": [
      {
        "operation": "C",
        "id_resource": 9100,
        "after_value": {
          "id_device_model_point": 900,
          "factor_override": 0.1
        },
        "change_status": "on_hold"
      },
      {
        "operation": "C",
        "id_resource": 9101,
        "after_value": {
          "id_device_model_point": 901,
          "factor_override": 1,
          "available_status": {"off": 0, "on": 1}
        },
        "change_status": "on_hold"
      }
    ]
  },
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Assignments persisted and proposed for asynchronous application. |
| `400` | Request body or path validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot modify this gateway configuration. |
| `404` | Gateway, child, config, or model point was not found in scope. |
| `409` | Duplicate assignment or an active related change prevents the mutation. |
| `500` | Unexpected server error. |

### Initial overrides

The `points` form is the atomic workflow and is accepted by the current API:

```json
{
  "points": [
    {
      "id_device_model_point": 900,
      "factor_override": 0.1
    },
    {
      "id_device_model_point": 901,
      "factor_override": 1,
      "available_status": {"off": 0, "on": 1}
    }
  ]
}
```

All assignments and overrides in the request are persisted in one transaction
and share one `change_group_key`. Prefer including the initial overrides in
this POST so the point is created with its complete configuration. The
`id_device_model_point_ids` form remains available for clients that only need
to assign points. If a later PUT collides with an active same-resource
proposal, follow the cancellation flow described in [MGD change states](mgd_config_change_states.md)
and retry; an `in_progress` proposal must finish in the worker first.

## Get a device point

Retrieve one assignment by its model catalog point ID under an explicit config.

Clearance level 4 or lower is required to read a device point.

### Endpoint
```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Gateway setup identifier. |
| `child_id_setup` | Yes | int | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | int | Explicit device configuration identifier. |
| `id_device_model_point` | Yes | int | Model catalog point identifier. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | bool | `false` | Include the gateway configuration synchronization hint. |

### Pydantic models

- Response: `ShowGatewayDevicePointDetail`.

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /mgd/gateways/501234/devices/501709/configs/44/points/900
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup_gateway_device_point": 9100,
    "id_setup_gateway_device_config": 44,
    "id_device_model_point": 900,
    "factor_override": 0.1,
    "available_status": null,
    "point": {
      "id_device_model_point": 900,
      "point_key": "Hact",
      "point_label": "Active power",
      "point_type": "modbus_holding_register",
      "factor_default": 1,
      "write_function": null
    }
  },
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device point retrieved successfully. |
| `400` | Path parameter validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot read this gateway configuration. |
| `404` | Gateway, child, config, or point was not found in scope. |
| `500` | Unexpected server error. |

## Update a device point

Update the per-device overrides for an assigned model point. Omitted fields are
preserved. An explicit `null` means “remove the override” and should restore
model inheritance after effective-value resolution.

Clearance A2 or A1 is required to update a device point.

### Endpoint
```http
PUT /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Gateway setup identifier. |
| `child_id_setup` | Yes | int | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | int | Explicit device configuration identifier. |
| `id_device_model_point` | Yes | int | Model catalog point identifier. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `include_config_sync` | No | bool | `false` | Include the gateway configuration synchronization hint in the proposal. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `factor_override` | No | number or null | No | Device-specific factor. If null or omitted, inherit the model factor. |
| `available_status` | No | object or null | No | Status mapping for writable points. Omit for read-only points. |

If this PUT targets a point with an active same-resource proposal, AP-v4
applies the general MGD resource lock and returns `409`. When the response
provides `next_action=cancel_then_retry`, cancel the `pending`, `on_hold`, or
`retry` proposal through its status endpoint and retry the PUT. A point already
in `in_progress` remains locked; wait for the worker and then retry.

### Pydantic models

- Request: `GatewayDevicePointUpdate`.
- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"factor_override": 0.1}' \
  /mgd/gateways/501234/devices/501709/configs/44/points/900
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {
    "status": "proposed",
    "change_group_key": "<CHANGE_GROUP_KEY>",
    "entity": {
      "operation": "U",
      "id_resource": 9100,
      "id_setup_target": 501709,
      "value": {"factor_override": 0.1}
    },
    "changes": [
      {
        "operation": "U",
        "id_resource": 9100,
        "change_status": "on_hold"
      }
    ]
  },
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Override persisted and proposed for asynchronous application. |
| `400` | Request body or path validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot modify this gateway configuration. |
| `404` | Gateway, child, config, or point was not found in scope. |
| `409` | A non-terminal change already owns the same resource or the override is incompatible. Follow `next_action`: cancel and retry for cancellable states, or wait for the worker for `in_progress`. |
| `500` | Unexpected server error. |

## Delete a device point

Remove a model point assignment from an explicit device configuration.

Clearance A2 or A1 is required to delete a device point.

### Endpoint
```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/configs/{id_setup_gateway_device_config}/points/{id_device_model_point}
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Gateway setup identifier. |
| `child_id_setup` | Yes | int | Child setup identifier. |
| `id_setup_gateway_device_config` | Yes | int | Explicit device configuration identifier. |
| `id_device_model_point` | Yes | int | Model catalog point identifier. |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `recursive` | No | bool | `false` | Whether dependent point-group links may be removed with the point. |
| `include_config_sync` | No | bool | `false` | Include the gateway configuration synchronization hint in the proposal. |

### Pydantic models

- Response: `ShowGatewayProposal`.

### Sample request
```bash
curl -X DELETE \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/mgd/gateways/501234/devices/501709/configs/44/points/900?recursive=false"
```

### Sample response (202)
```json
{
  "status": "success",
  "message": "Element proposed successfully",
  "data": {
    "status": "proposed",
    "change_group_key": "<CHANGE_GROUP_KEY>",
    "entity": {
      "operation": "D",
      "id_resource": 9100,
      "id_setup_target": 501709
    },
    "changes": [
      {
        "operation": "D",
        "id_resource": 9100,
        "change_status": "on_hold"
      }
    ]
  },
  "context": {},
  "instance": "/mgd/gateways/501234/devices/501709/configs/44/points/900"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `202` | Point removal persisted and proposed for asynchronous application. |
| `400` | Query or path validation failed. |
| `401` | Authentication failed. |
| `403` | The authenticated user cannot modify this gateway configuration. |
| `404` | Gateway, child, config, or point was not found in scope. |
| `409` | A point-group dependency prevents deletion without `recursive=true`. |
| `500` | Unexpected server error. |

## Reader configuration and effective values

The functional configuration is read from:

```http
GET /mgd/gateways/{id_setup}/config-json?projection=proposed
```

Use `projection=applied` for live canonical rows and `projection=proposed` to
include active MGD overlays. The full response contract is in
[MGD JSON projection](mgd_json_projection.md).

### Source of a reader point

The point must be resolved through the `device_model_points` catalog using
`id_device_model_point`. `device_types` is a generated JSON object, not a
relational table to update when a point is assigned. The exported key is the
catalog `point_key`.

When the child and model point are resolvable, a reader device must expose a
non-null device identity and model name. An unresolved catalog reference must
be reported in the projection `unresolved` metadata rather than serialized as
a partially populated point.

### Effective-value rules

| Value | Resolution |
| --- | --- |
| `factor` | Device `factor_override`, otherwise model `factor_default`, otherwise `1`. |
| `available_status` for a writable point | Device override, otherwise model `available_status_default`. |
| `available_status` for a read-only point | Omitted. |

This is the intended public behavior. A response that exposes a null effective
factor or an `available_status` for a reader is out of sync and should be
investigated by checking the exact endpoint, `projection`, deployed version,
and `unresolved` metadata.

Example for a read-only register:

```json
{
  "device_types": {
    "TBM400_OFI_read": {
      "registers": {
        "Hact": {
          "address": 100,
          "factor": 1,
          "read_function": "read_holding_registers",
          "write_function": null
        }
      }
    }
  },
  "devices": {
    "TBM400_OFI_read": {
      "id": "501709",
      "device_type": "TBM400_OFI_read",
      "register_groups": [
        {
          "registers": ["Hact"],
          "configs": {
            "Hact": {"factor": 1}
          }
        }
      ]
    }
  }
}
```
