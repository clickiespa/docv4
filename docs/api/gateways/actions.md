# Actions endpoints — implementation guidelines (lineamientos)

---

## GET /devices/{identifier}/actions

### Objective
Return the available actions and communication protocols configured on a device by parsing its device configuration. Returns the device's communication types, supported functions (actions), devices, and register groups for each function.

### Behaviour
1. Validates that the device exists and belongs to the authenticated account.
2. Retrieves device configuration from the database if available, otherwise fetches via MQTT from the device.
3. Parses the configuration to extract available communication protocols (RTU, TCP) and their associated functions (e.g., `GG_reader_RTU`, `GG_relay_control`).
4. For each function, includes the supported actions (read/write) and the devices with their register groups.
5. If the device is not found or not accessible, responds with `404 not_found`.
6. If the device lacks a `GG_execute_tasks` configuration section, returns a message indicating no actions are available.

### Path Parameters

| Parameter    | Type   | Required | Description                            |
| ------------ | ------ | -------- | -------------------------------------- |
| `identifier` | string | Yes      | Unique identifier of the target device |

### Query Parameters

| Parameter      | Type   | Required | Default | Description                                            |
| -------------- | ------ | -------- | ------- | ------------------------------------------------------ |
| `subscription` | string | No       | `edge`  | Subscription mode: `"edge"`, `"edge-dev"`, or `"core"` |

### Headers

| Header          | Value              | Required |
| --------------- | ------------------ | -------- |
| `Authorization` | Bearer token       | Yes      |
| `Account`       | Account identifier | Yes      |

### Successful Response (200)

```json
{
  "status": "success",
  "data": {
    "identifier": "10000000e0570554",
    "subscription": "edge",
    "actions": [
      {
        "protocol": "RTU",
        "functions_data": [
          {
            "name": "GG_reader_RTU",
            "actions": ["read"],
            "devices": [
              {
                "name": "DZS924060059",
                "register_groups": [
                  {
                    "configs": {
                      "factor": 0.005
                    },
                    "registers": ["M2L5", "M2L6", "M2L7", "M5L5", "M5L6", "M5L7", "M6L5", "M6L6", "M6L7", "M8L5", "M8L6", "M8L7", "M9L5", "M9L6", "M9L7", "P2", "P5", "P6", "P8", "P9"]
                  },
                  {
                    "configs": {
                      "factor": 0.01
                    },
                    "registers": ["M7L5", "M7L6", "M7L7", "P7", "T1L1", "T1L10", "T1L11", "T1L3", "T1L9", "T2L1", "T2L3", "T3L1", "T3L3", "T4L1", "T4L3", "T5L1", "T5L3", "T6L1", "T6L3", "T7L1", "T7L3", "T8L1", "T8L3", "T9L1", "T9L3"]
                  },
                  {
                    "configs": {
                      "factor": 0.04
                    },
                    "registers": ["M1L5", "M1L6", "M1L7", "M3L5", "M3L6", "M3L7", "M4L5", "M4L6", "M4L7", "P1", "P3", "P4"]
                  }
                ]
              },
              {
                "name": "medidor",
                "register_groups": [
                  {
                    "configs": {
                      "factor": 1
                    },
                    "registers": ["VA", "VB", "VC"]
                  }
                ]
              }
            ]
          },
          {
            "name": "GG_relay_control",
            "actions": ["read", "write"],
            "devices": []
          }
        ]
      },
      {
        "protocol": "TCP",
        "functions_data": [
          {
            "name": "GG_reader_TCP",
            "actions": ["read"],
            "devices": []
          },
          {
            "name": "GG_relay_control",
            "actions": ["read", "write"],
            "devices": [
              {
                "name": "device_tcp",
                "register_groups": [
                  {
                    "configs": {
                      "available_status": {"off": 0, "on": 1},
                      "factor": 1
                    },
                    "registers": ["manual_op"]
                  },
                  {
                    "configs": {
                      "available_status": {"auto": 3, "cool": 1, "heat": 2, "off": 0},
                      "factor": 1
                    },
                    "registers": ["mode"]
                  },
                  {
                    "configs": {
                      "available_status": {"occ": 0, "off": 0, "unocc": 1},
                      "factor": 1
                    },
                    "registers": ["occ_unocc"]
                  },
                  {
                    "configs": {
                      "available_status": {"auto": 0, "high": 3, "low": 1, "med": 2, "off": 0},
                      "factor": 1
                    },
                    "registers": ["fan_mode"]
                  },
                  {
                    "configs": {
                      "available_status": {"high": 20, "low": 22, "med": 21, "off": 30},
                      "factor": 1
                    },
                    "registers": ["tcool_occ"]
                  },
                  {
                    "configs": {
                      "available_status": {"high": 24, "low": 22, "med": 23, "off": 18},
                      "factor": 1
                    },
                    "registers": ["theat_occ"]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Error Catalogue

| HTTP | Code                      | When                                                             |
| ---- | ------------------------- | ---------------------------------------------------------------- |
| 400  | `missing_identifier`      | Device identifier is missing from path parameters                |
| 404  | `device_not_found`        | Device is unknown or not accessible to the authenticated account |
| 503  | `mqtt_bridge_unavailable` | Failed to retrieve configuration via MQTT (when not in DB)       |
| 500  | `internal_server_error`   | Unexpected server error                                          |

### Error Response Example

```json
{
  "status": "failed",
  "code": "device_not_found",
  "data": {
    "message": "Device 'unknown-device' not found or not accessible."
  }
}
```

### Notes
- The device must belong to a Clickiemota model and be bound to an active setup to be accessible.
- Configuration is cached in the database after successful MQTT retrieval to improve performance.
- Register groups contain configuration metadata (e.g., `factor`, `available_status`) that describe how to interpret register values.
- If `GG_execute_tasks` is not present in the device configuration, a message is returned indicating no actions are available.

---

## POST /devices/{identifier}/actions

### Objective
Submit read/write operations to IoT devices via MQTT. Supports two configuration formats: preconfig (simplified, predefined device mappings) and custom (detailed, low-level register specifications).

### Path Parameters

| Parameter    | Type   | Required | Description                            |
| ------------ | ------ | -------- | -------------------------------------- |
| `identifier` | string | Yes      | Unique identifier of the target device |

### Headers

| Header          | Value              | Required |
| --------------- | ------------------ | -------- |
| `Authorization` | Bearer token       | Yes      |
| `Account`       | Account identifier | Yes      |
| `Content-Type`  | `application/json` | Yes      |

### Request Body

```json
{
  "action": "read" | "write",
  "comm_type": "rtu",
  "config_type": "preconfig" | "custom",
  "payload": {...},
  "task_id": "optional-uuid-or-string"
}
```

#### Required Fields

| Field         | Type         | Values                    | Description                                                     |
| ------------- | ------------ | ------------------------- | --------------------------------------------------------------- |
| `action`      | string       | `"read"`, `"write"`       | Action type to execute on the device                            |
| `comm_type`   | string       | `"rtu"`                   | Communication protocol type                                     |
| `config_type` | string       | `"preconfig"`, `"custom"` | Configuration format                                            |
| `payload`     | object/array | —                         | Device-specific configuration (format depends on `config_type`) |

#### Optional Fields

| Field     | Type   | Description                                              |
| --------- | ------ | -------------------------------------------------------- |
| `task_id` | string | Task identifier. Auto-generated as UUID if not provided. |

### Payload Formats

#### Preconfig Format (Read)
```json
{
  "action": "read",
  "comm_type": "rtu",
  "config_type": "preconfig",
  "payload": {
    "RTU_Device2": ["1", "2"],
    "medidor": ["VA", "VB"]
  }
}
```

#### Preconfig Format (Write)
```json
{
  "action": "write",
  "comm_type": "rtu",
  "config_type": "preconfig",
  "payload": {
    "medidor_control": {
      "wm": 1
    }
  }
}
```

#### Custom Format (Read)
```json
{
  "action": "read",
  "comm_type": "rtu",
  "config_type": "custom",
  "payload": [
    {
      "device": "RTU_Device2",
      "vars": [
        {
          "name": "1",
          "address": 0,
          "count": 8,
          "bit": 1,
          "value_format": "8uint",
          "byteorder_key": "bigendian",
          "wordorder_key": "bigendian",
          "read_function": "read_single_coil"
        }
      ]
    }
  ]
}
```

#### Custom Format (Write)
```json
{
  "action": "write",
  "comm_type": "rtu",
  "config_type": "custom",
  "payload": [
    {
      "device": "medidor_control",
      "vars": [
        {
          "name": "wm",
          "address": 8196,
          "count": 1,
          "value": 1,
          "value_format": "16uint",
          "byteorder_key": "bigendian",
          "wordorder_key": "bigendian",
          "write_function": "write_register"
        }
      ]
    }
  ]
}
```

### Custom Format Field Reference

#### Common Fields

| Field           | Type    | Required | Description                                                                              |
| --------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `name`          | string  | Yes      | Variable/register name                                                                   |
| `address`       | integer | Yes      | Modbus address                                                                           |
| `count`         | integer | Yes      | Number of registers/coils                                                                |
| `bit`           | integer | Yes      | Bit position (usually 1)                                                                 |
| `value_format`  | string  | Yes      | Data format (8uint, 16uint, 32uint, 64uint, 8int, 16int, 32int, 64int, float32, float64) |
| `byteorder_key` | string  | Yes      | Byte order: `"bigendian"` or `"littleendian"`                                            |
| `wordorder_key` | string  | Yes      | Word order: `"bigendian"`, `"littleendian"`, or `"wordswap"`                             |

#### Read-Only Fields

| Field           | Type   | Required | Description                                                                                         |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| `read_function` | string | Yes      | Read function: read_single_coil, read_discrete_inputs, read_holding_registers, read_input_registers |

#### Write-Only Fields

| Field            | Type   | Required | Description                                                              |
| ---------------- | ------ | -------- | ------------------------------------------------------------------------ |
| `write_function` | string | Yes      | Write function: write_register, write_registers, write_coil, write_coils |
| `value`          | number | Yes      | Value to write (must be numeric)                                         |

### Successful Response (200)

```json
{
  "status": "success",
  "data": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "device_id": "000000004e89faf5",
    "action": "read",
    "config_type": "preconfig",
    "status": "success",
    "submitted_at": "2025-12-03T14:30:45.123Z",
    "result": {
      "status": "success",
      "data": {
        "RTU_Device2": [10, 20],
        "medidor": [230, 240]
      }
    }
  }
}
```

### Error Catalogue

| HTTP | Code                          | When                                             |
| ---- | ----------------------------- | ------------------------------------------------ |
| 400  | `missing_required_field`      | A required field is missing from the request     |
| 400  | `invalid_action`              | The `action` field has an invalid value          |
| 400  | `invalid_config_type`         | The `config_type` field has an invalid value     |
| 400  | `invalid_payload_format`      | Payload format does not match expected structure |
| 400  | `empty_payload`               | Payload object/array is empty                    |
| 400  | `preconfig_validation_failed` | Preconfig validation failed (see error details)  |
| 400  | `custom_validation_failed`    | Custom validation failed (see error details)     |
| 400  | `missing_device_id`           | Device ID is missing from path parameters        |
| 500  | `device_action_error`         | Unexpected error during action submission        |
| 500  | `internal_server_error`       | Unexpected server error                          |

### Error Response Example

```json
{
  "status": "failed",
  "code": "preconfig_validation_failed",
  "data": {
    "message": "Preconfig validation failed.",
    "errors": {
      "RTU_Device2": "Device 'RTU_Device2' is read-only and does not support write operations."
    }
  }
}
```

### Validation Rules

#### Preconfig Format
1. `payload` must be a non-empty dictionary
2. Each device name must exist in the device registry
3. For **read** actions: each device maps to a list of register names
4. For **write** actions: each device maps to a dict of register: numeric_value pairs
5. All register names must exist in the device
6. Write operations rejected on read-only devices
7. Write values must be numeric

#### Custom Format
1. `payload` must be a non-empty list
2. Each item must have `device` and `vars` keys
3. All devices must exist in registry
4. `vars` must be a non-empty list
5. Each variable must have all required fields (differs for read vs write)
6. All enum fields validated against allowed values
7. Write values must be numeric

### Supported Devices

#### Read-Only
| Device Name   | Supported Registers |
| ------------- | ------------------- |
| `RTU_Device2` | `"1"`, `"2"`        |
| `medidor`     | `"VA"`, `"VB"`      |

#### Writable
| Device Name       | Supported Registers |
| ----------------- | ------------------- |
| `medidor_control` | `"wm"`              |

> **Note:** The API does not validate device names or register values. Validation is performed on the device side. Ensure that payloads conform to the supported devices and registers for successful execution.
### Notes
- `task_id` is automatically generated as a UUID if not provided
- MQTT timeout is 60 seconds
- All timestamps are in ISO-8601 UTC format
- Device responses vary based on device type and action
