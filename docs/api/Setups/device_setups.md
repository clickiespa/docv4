# Device Setups

Historical relationship between physical devices and the setups they implement.

## Endpoints
- [Devices by setup](#devices-by-setup)
- [Install device in setup](#install-device-in-setup)
- [Uninstall device from setup](#uninstall-device-from-setup)
- [Setups by device](#setups-by-device)

## Devices by setup

List every assignment of a device to the requested setup.

Clearance note: the route uses the `DeviceSetup` entity permissions for `read`; it has no fixed numeric clearance declared in the handler.

### Endpoint
```
GET /setups/{id_setup}/devices
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Numeric identifier of the setup whose device history you want to inspect. Retrieve it from [Get setup](./setups.md#get-setup). |

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
  "/setups/5/devices"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Devices retrieved",
  "data": [
    {
      "id_device_setup": 42,
      "id_device": 10,
      "id_setup": 5,
      "device_setup_is_accessory": false,
      "setup_install_date": "2023-07-01T12:00:00Z",
      "setup_install_observations": "Initial installation",
      "setup_uninstall_date": null,
      "setup_uninstall_observations": null
    }
  ],
  "context": {},
  "instance": "/setups/5/devices"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_setup` | int | Numeric identifier of the device-setup relationship. |
| `id_device` | int | Device identifier. Retrieve it from [Get device](../Devices/devices.md#get-device). |
| `id_setup` | int | Setup identifier linked to the assignment. See [Get setup](./setups.md#get-setup). |
| `device_setup_is_accessory` | bool | Whether the device is installed as an accessory. |
| `setup_install_date` | string | Date and time when the device was linked to the setup (ISO 8601). |
| `setup_install_observations` | string | Optional notes recorded during installation. |
| `setup_uninstall_date` | string | Date and time when the device was removed from the setup. `null` while installed. |
| `setup_uninstall_observations` | string | Optional notes recorded during removal. |

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device history retrieved successfully. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks clearance to inspect device setups. |
| `404` | The referenced setup does not exist. |
| `500` | Unexpected server error. |

### Pydantic models

- Response item: `ShowDeviceSetup` (`List[ShowDeviceSetup]`).

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
  "instance": "/setups/5/devices"
}
```

## Install device in setup

Create an active main device installation by inserting a row in `device_setups`.

Clearance note: the route uses the `DeviceSetup` entity permissions for `create`; it has no fixed numeric clearance declared in the handler.

### Endpoint
```
POST /setups/{id_setup}/devices
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Setup where the device will be installed. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_device` | Yes | int | No | Device to install. |
| `setup_install_observations` | No | string | No | Installation notes. |
| `replace_existing` | No | bool | `false` | Uninstall the current main device before installing the new one. |

### Sample request
```json
{
  "id_device": 1001,
  "setup_install_observations": "Installed via API",
  "replace_existing": true
}
```

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_device_setup": 43,
    "id_device": 1001,
    "id_setup": 5,
    "device_setup_is_accessory": false,
    "setup_install_date": "2026-07-07T12:00:00Z",
    "setup_install_observations": "Installed via API",
    "setup_uninstall_date": null,
    "setup_uninstall_observations": null
  },
  "context": {},
  "instance": "/setups/5/devices"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `201` | Device installed successfully. |
| `400` | Device model does not match setup model. |
| `401` | Authentication failed. |
| `403` | Insufficient permissions. |
| `404` | Setup or device not found. |
| `409` | Device already active elsewhere, or setup already has a main device and `replace_existing` is false. |
| `500` | Unexpected server error. |

### Pydantic models

- Request: `DeviceSetupCreate`.
- Response: `ShowDeviceSetup`.

## Uninstall device from setup

Close an active device-to-setup assignment by setting its uninstall timestamp. When the assignment is for a main device, cancellable MGD changes for the setup are cancelled before the assignment is closed. Accessory assignments do not cancel MGD changes.

Clearance note: the route uses the `DeviceSetup` entity permissions for `delete`; it has no fixed numeric clearance declared in the handler.

### Endpoint
```
DELETE /setups/{id_setup}/devices/{id_device_setup}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Setup containing the active assignment. |
| `id_device_setup` | Yes | int | Active device-setup relationship identifier. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a request body.

### Pydantic models

- Response: `ShowDeviceSetup`.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -X DELETE \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /setups/5/devices/42
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": {
    "id_device_setup": 42,
    "id_device": 10,
    "id_setup": 5,
    "device_setup_is_accessory": false,
    "setup_install_date": "2023-07-01T12:00:00Z",
    "setup_install_observations": "Initial installation",
    "setup_uninstall_date": "2026-08-27T12:00:00Z",
    "setup_uninstall_observations": null
  },
  "context": {},
  "instance": "/setups/5/devices/42"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `200` | Device-setup assignment closed successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The authenticated user lacks `DeviceSetup` delete permission. |
| `404` | The setup does not exist, or the assignment is not active for that setup. |
| `500` | Unexpected server error. |

## Setups by device

List every setup that has been assigned to the requested device.

Clearance note: the route uses the `DeviceSetup` entity permissions for `read`; it has no fixed numeric clearance declared in the handler.

### Endpoint
```
GET /devices/{id_device}/setups
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_device` | Yes | int | Numeric identifier of the device whose setup history you want to inspect. Retrieve it from [Get device](../Devices/devices.md#get-device). |

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
  "/devices/10/setups"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Setups retrieved",
  "data": [
    {
      "id_device_setup": 42,
      "id_device": 10,
      "id_setup": 5,
      "device_setup_is_accessory": false,
      "setup_install_date": "2023-07-01T12:00:00Z",
      "setup_install_observations": "Initial installation",
      "setup_uninstall_date": null,
      "setup_uninstall_observations": null
    }
  ],
  "context": {},
  "instance": "/devices/10/setups"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_device_setup` | int | Numeric identifier of the device-setup relationship. |
| `id_device` | int | Device identifier. Retrieve it from [Get device](../Devices/devices.md#get-device). |
| `id_setup` | int | Setup identifier linked to the assignment. See [Get setup](./setups.md#get-setup). |
| `device_setup_is_accessory` | bool | Whether the device is installed as an accessory. |
| `setup_install_date` | string | Date and time when the device was linked to the setup (ISO 8601). |
| `setup_install_observations` | string | Optional notes recorded during installation. |
| `setup_uninstall_date` | string | Date and time when the device was removed from the setup. `null` while installed. |
| `setup_uninstall_observations` | string | Optional notes recorded during removal. |

### Status codes

| Status | Description |
| --- | --- |
| `200` | Setup history retrieved successfully. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks clearance to inspect device setups. |
| `404` | The referenced device does not exist. |
| `500` | Unexpected server error. |

### Error response (404)
```json
{
  "status": "error",
  "message": "Device 999 was not found",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/devices/999/setups"
}
```

### Pydantic models

- Response item: `ShowDeviceSetup` (`List[ShowDeviceSetup]`).
