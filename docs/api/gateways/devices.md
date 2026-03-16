# Devices endpoints

## GET /devices

## Objective
List the Clickiemota devices that belong to the authenticated account. Devices are fetched from the `devices` table, filtered by the Clickiemota model identifiers, and restricted to those currently installed in an active setup.

## Authentication
* **Required** — Clickie API key and account headers.

## Request
```http
GET /dev/clickiemottas/devices HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

## Successful response
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "identifier": "cm-001",
        "model_id": 294,
        "model_name": "Clickiemota Mini",
        "model_description": "Kit Clickiemota con conectividad básica",
        "status": "connected",
        "status_since": "2024-02-10T14:22:31",
        "setup": {
          "id": 9001,
          "identifier": "cmt-lab-a",
          "name": "Laboratorio A"
        }
      }
    ],
    "count": 1
  }
}
```

*`identifier` corresponds to the `device_custom_id` column and is the value to reuse across all `/devices/{identifier}` endpoints.*

### Configuration
* Default Clickiemota models: `381, 389, 500001, 500002, 500003, 294, 318, 330, 362`.
* Override the list with the `CLICKIEMOTA_MODEL_IDS` environment variable using a comma-separated list (e.g. `CLICKIEMOTA_MODEL_IDS=381,389,500001`). Invalid values are ignored and logged as warnings.
* Only devices with an active `device_setup` record (no `setup_uninstall_date`) are returned.

### Status values

| status         | description                                                   |
| -------------- | ------------------------------------------------------------- |
| `connected`    | Device reports as online (source status id `1`).              |
| `disconnected` | Device reported offline (source status id `2`).               |
| `unknown`      | No recent status available (source status id `3` or missing). |

---

## Implementation guidelines for upcoming device endpoints *(lineamientos)*

The following sections document the contracts that must be honoured when the remaining device endpoints are implemented. They are considered **real mode** features: configuration calls interact with the existing MQTT bridge so no stubs are necessary.

### GET /devices/{identifier}

#### Objective
Retrieve detailed metadata for a single Clickiemota device. Validates that the device belongs to the authenticated account and is installed in an active setup. Returns comprehensive device information including model details, connectivity status, and setup association.

#### Authentication
* **Required** — Clickie API key and account headers.

#### Request
```http
GET /dev/clickiemottas/devices/cm-001 HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

#### Successful Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "model": "Clickiemota Mini",
    "firmware_version": "1.0.0",
    "labels": ["lab", "clickiemota"],
    "last_seen_at": "2025-10-15T14:22:31Z",
    "stub_mode": false,
    "setup": {
      "id": 9001,
      "identifier": "cmt-lab-a",
      "name": "Laboratorio A"
    },
    "status": "connected",
    "status_since": "2025-10-15T14:22:31Z",
    "model_id": 294,
    "model_description": "Kit Clickiemota con conectividad básica"
  }
}
```

#### Error Responses

**400 Bad Request** — Missing device identifier
```json
{
  "status": "failed",
  "code": "missing_identifier",
  "errors": [
    {"message": "Device identifier is required."}
  ]
}
```

**401 Unauthorized** — Missing account identification
```json
{
  "status": "failed", 
  "code": "missing_account_id",
  "errors": [
    {"message": "Account identification is required."}
  ]
}
```

**404 Not Found** — Device not found or not accessible
```json
{
  "status": "failed",
  "code": "device_not_found", 
  "errors": [
    {"message": "Device 'cm-999' not found or not accessible."}
  ]
}
```

**500 Internal Server Error** — Database or system error
```json
{
  "status": "failed",
  "code": "internal_server_error",
  "errors": [
    {"message": "Failed to retrieve device information."}
  ]
}
```

**503 Service Unavailable** — Configuration error
```json
{
  "status": "failed",
  "code": "service_unavailable",
  "errors": [
    {"message": "Clickiemota model configuration is invalid."}
  ]
}
```

#### Response Fields

| Field               | Type          | Description                                     |
| ------------------- | ------------- | ----------------------------------------------- |
| `identifier`        | string        | Device custom identifier (device_custom_id)     |
| `model`             | string        | Device model name from device_models table      |
| `firmware_version`  | string        | Current firmware version (placeholder: "1.0.0") |
| `labels`            | array[string] | Configuration labels plus "clickiemota" default |
| `last_seen_at`      | string\|null  | ISO timestamp when device was last connected    |
| `stub_mode`         | boolean       | Always `false` - indicates real implementation  |
| `setup`             | object        | Associated setup information                    |
| `setup.id`          | number        | Setup ID from setups table                      |
| `setup.identifier`  | string        | Setup identifier                                |
| `setup.name`        | string        | Setup display name                              |
| `status`            | string        | Device connectivity status                      |
| `status_since`      | string\|null  | ISO timestamp of last status change             |
| `model_id`          | number        | Device model ID from device_models table        |
| `model_description` | string        | Model description from device_models table      |

#### Status Values

| Value          | Description                                     |
| -------------- | ----------------------------------------------- |
| `connected`    | Device is currently reachable and active        |
| `disconnected` | Device is not responding to connectivity checks |
| `unknown`      | Device status cannot be determined              |

#### Implementation Notes
* Validates device ownership using account_id from authentication context
* Requires active setup (no `setup_uninstall_date`)
* Only returns Clickiemota models (configurable via `CLICKIEMOTA_MODEL_IDS`)
* Structured logging for successful retrievals and errors
* Parses `device_configuration` JSON field for custom labels

### GET /devices/{identifier}/config *(real via MQTT)*
* Retrieve the latest configuration snapshot by querying the MQTT-backed device shadow. The existing MQTT pipeline already supports both read and write operations.
* When the config cannot be fetched, return `503 service_unavailable` with `code: mqtt_bridge_unavailable`.
* **Example response uses a trimmed JSON**. The real payload is a large nested document; keep the structure but expand with the full fields exposed by the firmware when implementing.
* Subscription can be optionally specified via query parameter (default: "edge").
* Supports reading a specific nested property using `mode=read_specific` with a `route` parameter.

#### Request examples

Full configuration:
```http
GET /dev/clickiemottas/devices/cm-001/config HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

With subscription parameter:
```http
GET /dev/clickiemottas/devices/cm-001/config?subscription=core HTTP/1.1
```

Read a specific nested property (e.g., temperature thresholds):
```http
GET /dev/clickiemottas/devices/cm-001/config?mode=read_specific&route=app/thresholds/temperature HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

#### Successful Response (200 OK) — Full configuration

```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "subscription": "edge",
    "config": {
      "network": {"iface": "eth0", "ip": "192.0.2.10"},
      "app": {
        "profile": "factory-default",
        "thresholds": {
          "temperature": {"min": 18, "max": 26}
        }
      }
    }
  }
}
```

#### Successful Response (200 OK) — Specific nested property

When `mode=read_specific&route=app/thresholds/temperature`:
```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "subscription": "edge",
    "config": {
      "min": 18,
      "max": 26
    }
  }
}
```

#### Error Responses

**400 Bad Request** — Invalid subscription
```json
{
  "status": "failed",
  "code": "invalid_subscription",
  "errors": [
    {"message": "Subscription 'invalid' is not valid. Must be one of: edge-dev, edge, core"}
  ]
}
```

**400 Bad Request** — Missing route when mode is read_specific
```json
{
  "status": "failed",
  "code": "missing_route",
  "errors": [
    {"message": "Query parameter 'route' is required when mode is 'read_specific'."}
  ]
}
```

**503 Service Unavailable** — MQTT bridge unavailable
```json
{
  "status": "failed",
  "code": "mqtt_bridge_unavailable",
  "errors": [
    {"message": "Failed to communicate with device. The MQTT bridge or device is currently unavailable."}
  ]
}
```

#### Query parameters

| Parameter     | Default | Description                                           |
| ------------- | ------- | ----------------------------------------------------- |
| `subscription` | "edge"  | Target subscription: "edge-dev", "edge", or "core"   |
| `mode`        | null    | Set to "read_specific" to read a nested property      |
| `route`       | null    | JSON path to specific property (required if mode="read_specific"); format: `key/nested/path` |

### PUT /devices/{identifier}/config *(real via MQTT)*
* Accept a JSON payload matching the device capabilities and publish the change through MQTT.
* Honour the `Idempotency-Key` header for request tracking and audit purposes. In Phase A, this is logged but not enforced; full idempotency will be implemented in Phase B.
* Subscription can be optionally specified via query parameter (default: "edge").
* Support two modes of operation:
  - **Full replacement** (default): Replace the entire device configuration with the provided payload. Requires `database`, `id`, and `lambda_functions` keys in the config.
  - **Targeted update** (`mode=write_specific`): Update a specific nested property using a JSON path (`route`). The device is queried for its current configuration, and the update is merged at the specified route.
* Return `200 OK` when the device confirms the configuration was applied immediately via MQTT.
* Return `202 Accepted` when the device queues the change for asynchronous processing.
* Return `503 Service Unavailable` when the MQTT bridge or device is not reachable.

#### Request examples — Full replacement

Full configuration update:
```http
PUT /dev/clickiemottas/devices/cm-001/config?subscription=edge HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
Content-Type: application/json
Idempotency-Key: 4b0fd0b0-4ef1-4b61-b7ce-73e1e7afc9be

{
  "config": {
    "database": {...},
    "id": "cm-001",
    "lambda_functions": {...},
    "network": {"iface": "eth0", "ip": "192.0.2.25"},
    "app": {
      "profile": "lab-calibration",
      "thresholds": {
        "temperature": {"min": 16, "max": 24}
      }
    }
  }
}
```

#### Request examples — Targeted update

Update a specific nested property (e.g., temperature thresholds):
```http
PUT /dev/clickiemottas/devices/cm-001/config HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
Content-Type: application/json
Idempotency-Key: 4b0fd0b0-4ef1-4b61-b7ce-73e1e7afc9be

{
  "mode": "write_specific",
  "route": "app/thresholds/temperature",
  "config": {
    "min": 16,
    "max": 24
  },
  "create_missing_path": false
}
```

Create missing intermediate paths during targeted update:
```http
PUT /dev/clickiemottas/devices/cm-001/config HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
Content-Type: application/json

{
  "mode": "write_specific",
  "route": "custom/deep/nested/property",
  "config": {
    "value": "example"
  },
  "create_missing_path": true
}
```

#### Response: 200 OK — Immediate acknowledgement

Device replies on the same MQTT roundtrip:

```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "subscription": "edge",
    "applied": true,
    "confirmed_at": "2025-09-29T09:05:03Z"
  }
}
```

#### Response: 202 Accepted — Queued update

Device queues the change for asynchronous processing:

```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "subscription": "edge",
    "applied": false,
    "job_id": "4b0fd0b0-4ef1-4b61-b7ce-73e1e7afc9be",
    "queued_at": "2025-09-29T09:05:03Z"
  }
}
```

#### Error Responses

**400 Bad Request** — Invalid subscription
```json
{
  "status": "failed",
  "code": "invalid_subscription",
  "errors": [
    {"message": "Subscription 'invalid' is not valid. Must be one of: edge-dev, edge, core"}
  ]
}
```

**400 Bad Request** — Empty configuration update
```json
{
  "status": "failed",
  "code": "empty_config",
  "errors": [
    {"message": "Configuration update payload is required."}
  ]
}
```

**400 Bad Request** — Invalid configuration schema (full replacement mode)
```json
{
  "status": "failed",
  "code": "invalid_config_schema",
  "errors": [
    {"message": "Configuration must contain required keys: database, id, lambda_functions. Missing: id, lambda_functions"}
  ]
}
```

**400 Bad Request** — Missing route in targeted update mode
```json
{
  "status": "failed",
  "code": "missing_route",
  "errors": [
    {"message": "Body parameter 'route' is required when mode is 'write_specific'."}
  ]
}
```

**503 Service Unavailable** — MQTT bridge unavailable
```json
{
  "status": "failed",
  "code": "mqtt_bridge_unavailable",
  "errors": [
    {"message": "Failed to communicate with device. The MQTT bridge or device is currently unavailable."}
  ]
}
```

#### Request body parameters

| Parameter            | Type    | Required | Mode              | Description                                           |
| -------------------- | ------- | -------- | ----------------- | ----------------------------------------------------- |
| `config`             | object  | Yes      | Both              | Configuration object or specific update payload       |
| `mode`               | string  | No       | Both              | Set to "write_specific" for targeted updates; omit for full replacement |
| `route`              | string  | Yes*     | write_specific    | JSON path to target property; format: `key/nested/path` (*required when mode="write_specific") |
| `create_missing_path` | boolean | No       | write_specific    | If true, create intermediate paths that don't exist; default: false |

#### Request headers

| Header           | Required | Description                                                                |
| ---------------- | -------- | -------------------------------------------------------------------------- |
| `Idempotency-Key` | No       | UUID for tracking. Logged for audit; full idempotency coming in Phase B.   |

#### Query parameters

| Parameter     | Default | Description                                           |
| ------------- | ------- | ----------------------------------------------------- |
| `subscription` | "edge"  | Target subscription: "edge-dev", "edge", or "core"   |

#### Response fields

| Field          | Type    | Description                                                    |
| -------------- | ------- | -------------------------------------------------------------- |
| `identifier`   | string  | Device identifier                                              |
| `subscription` | string  | Subscription used for the operation                            |
| `applied`      | boolean | Whether configuration was applied immediately (true) or queued (false) |
| `confirmed_at` | string  | ISO timestamp of confirmation (when `applied: true`)          |
| `job_id`       | string  | Job ID for tracking asynchronous updates (when `applied: false`) |
| `queued_at`    | string  | ISO timestamp of when update was queued (when `applied: false`) |

### GET /devices/{identifier}/health *(stub until agent mode)*
* Returns a placeholder health document per device so integrators can wire dashboards before telemetry hooks are live.
* Include `execution_mode: "stub"` until the device agent provides real-time data.
* When telemetry becomes available, populate connectivity checks, last heartbeat, and backlog counters accordingly.

```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "execution_mode": "stub",
    "generated_at": "2025-09-29T09:05:03Z",
    "checks": {
      "connectivity": {"reachable": false, "note": "Awaiting agent integration"},
      "last_seen_at": null,
      "pending_jobs": 0
    }
  }
}
```

## Error catalogue
| HTTP | code                  | When                    |
| ---- | --------------------- | ----------------------- |
| 500  | internal_server_error | Any unexpected failure. |

---

## Planned device endpoints

| Endpoint                             | Mode                 | Status | Notes                                                                                                                 |
| ------------------------------------ | -------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `GET /devices/{identifier}`          | **Real**             | ✅ Live | Returns device metadata with model, status, and setup association                                                    |
| `GET /devices/{identifier}/config`   | **Real**             | ✅ Live | Reads configuration via MQTT bridge; returns 503 if device unavailable                                               |
| `PUT /devices/{identifier}/config`   | **Real**             | ✅ Live | Publishes config updates via MQTT; returns 200 (immediate) or 202 (queued)                                           |
| `GET /devices/{identifier}/health`   | **Stub → Real**      | ☐ Planned | Return stub payload above until telemetry is wired. Replace with live data once agents ship.                          |
| `GET /devices/{identifier}/actions`  | **Stub**             | ☐ Planned | Returns static catalog from fixtures per Phase A scope. Placeholder response should be the deterministic stub payload |
| `POST /devices/{identifier}/actions` | **Stub**             | ☐ Planned | Accepts requests and returns canned job results. Placeholder should echo stubbed job with `status: succeeded`         |
| `GET /devices/{identifier}/jobs`     | **Stub/Real hybrid** | ☐ Planned | Final behaviour pending with Jobs team; return `501 feature_not_ready` until storage contract is ratified            |

All planned endpoints must keep responses aligned with the standard envelope documented in `README.md`.

