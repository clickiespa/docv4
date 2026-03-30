# Endpoints de acciones: lineamientos de implementación

---

## OBTENER /dispositivos/{identificador}/acciones

### Objetivo
Devuelve las acciones disponibles y los protocolos de comunicación configurados en un dispositivo analizando la configuración de su dispositivo. Devuelve los tipos de comunicación del dispositivo, las funciones admitidas (acciones), los dispositivos y los grupos de registro para cada función.

### Comportamiento
1. Valida que el dispositivo exista y pertenezca a la cuenta autenticada.
2. Recupera la configuración del dispositivo de la base de datos si está disponible; de ​​lo contrario, la recupera a través de MQTT desde el dispositivo.
3. Analiza la configuración para extraer los protocolos de comunicación disponibles (RTU, TCP) y sus funciones asociadas (por ejemplo, `GG_reader_RTU`, `GG_relay_control`).
4. Para cada función, incluye las acciones soportadas (lectura/escritura) y los dispositivos con sus grupos de registros.
5. Si no se encuentra el dispositivo o no se puede acceder a él, responde con `404 not_found`.
6. Si el dispositivo carece de una sección de configuración `GG_execute_tasks`, devuelve un mensaje indicando que no hay acciones disponibles.

### Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
| ------------ | ------ | -------- | -------------------------------------- |
| `identifier` | cadena | Sí | Identificador único del dispositivo de destino |

### Parámetros de consulta

| Parámetro | Tipo | Requerido | Predeterminado | Descripción |
| -------------- | ------ | -------- | ------- | ------------------------------------------------------ |
| `subscription` | cadena | No | `edge` | Modo de suscripción: `"edge"`, `"edge-dev"` o `"core"` |

### Encabezados

| Encabezado | Valor | Requerido |
| --------------- | ------------------ | -------- |
| `Authorization` | Ficha al portador | Sí |
| `Account` | Identificador de cuenta | Sí |

### Respuesta exitosa (200)

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

### Catálogo de errores

| HTTP | Código | Cuando |
| ---- | ------------------------- | ---------------------------------------------------------------- |
| 400 | `missing_identifier` | Falta el identificador del dispositivo en los parámetros de ruta |
| 404 | `device_not_found` | El dispositivo es desconocido o no es accesible para la cuenta autenticada |
| 503 | `mqtt_bridge_unavailable` | No se pudo recuperar la configuración a través de MQTT (cuando no está en la base de datos) |
| 500 | `internal_server_error` | Error inesperado del servidor |

### Ejemplo de respuesta de error

```json
{
  "status": "failed",
  "code": "device_not_found",
  "data": {
    "message": "Device 'unknown-device' not found or not accessible."
  }
}
```

### Notas
- El dispositivo debe pertenecer a un modelo Clickiemota y estar vinculado a una configuración activa para ser accesible.
- La configuración se almacena en caché en la base de datos después de una recuperación exitosa de MQTT para mejorar el rendimiento.
- Los grupos de registros contienen metadatos de configuración (por ejemplo, `factor`, `available_status`) que describen cómo interpretar los valores de los registros.
- Si `GG_execute_tasks` no está presente en la configuración del dispositivo, se devuelve un mensaje indicando que no hay acciones disponibles.

---

## POST /dispositivos/{identificador}/acciones

### Objetivo
Envíe operaciones de lectura/escritura a dispositivos IoT a través de MQTT. Admite dos formatos de configuración: preconfig (asignaciones de dispositivos predefinidas y simplificadas) y personalizado (especificaciones de registro detalladas y de bajo nivel).

### Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
| ------------ | ------ | -------- | -------------------------------------- |
| `identifier` | cadena | Sí | Identificador único del dispositivo de destino |

### Encabezados| Encabezado | Valor | Requerido |
| --------------- | ------------------ | -------- |
| `Authorization` | Ficha al portador | Sí |
| `Account` | Identificador de cuenta | Sí |
| `Content-Type` | `application/json` | Sí |

### Cuerpo de solicitud

```json
{
  "action": "read" | "write",
  "comm_type": "rtu",
  "config_type": "preconfig" | "custom",
  "payload": {...},
  "task_id": "optional-uuid-or-string"
}
```

#### Campos obligatorios

| Campo | Tipo | Valores | Descripción |
| ------------- | ------------ | ------------------------- | --------------------------------------------------------------- |
| `action` | cadena | `"read"`, `"write"` | Tipo de acción a ejecutar en el dispositivo |
| `comm_type` | cadena | `"rtu"` | Tipo de protocolo de comunicación |
| `config_type` | cadena | `"preconfig"`, `"custom"` | Formato de configuración |
| `payload` | objeto/matriz | — | Configuración específica del dispositivo (el formato depende de `config_type`) |

#### Campos opcionales

| Campo | Tipo | Descripción |
| --------- | ------ | -------------------------------------------------------- |
| `task_id` | cadena | Identificador de tarea. Generado automáticamente como UUID si no se proporciona. |

### Formatos de carga útil

#### Formato de preconfiguración (lectura)
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

#### Formato de preconfiguración (escritura)
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

#### Formato personalizado (Leer)
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

#### Formato personalizado (escritura)
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

### Referencia de campo de formato personalizado

#### Campos comunes

| Campo | Tipo | Requerido | Descripción |
| --------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `name` | cadena | Sí | Nombre de variable/registro |
| `address` | entero | Sí | Dirección Modbus |
| `count` | entero | Sí | Número de registros/bobinas |
| `bit` | entero | Sí | Posición del bit (normalmente 1) |
| `value_format` | cadena | Sí | Formato de datos (8uint, 16uint, 32uint, 64uint, 8int, 16int, 32int, 64int, float32, float64) |
| `byteorder_key` | cadena | Sí | Orden de bytes: `"bigendian"` o `"littleendian"` |
| `wordorder_key` | cadena | Sí | Orden de las palabras: `"bigendian"`, `"littleendian"` o `"wordswap"` |

#### Campos de solo lectura

| Campo | Tipo | Requerido | Descripción |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| `read_function` | cadena | Sí | Función de lectura: read_single_coil, read_discrete_inputs, read_holding_registers, read_input_registers |

#### Campos de solo escritura| Campo | Tipo | Requerido | Descripción |
| ---------------- | ------ | -------- | ------------------------------------------------------------------------ |
| `write_function` | cadena | Sí | Función de escritura: write_register, write_registers, write_coil, write_coils |
| `value` | número | Sí | Valor a escribir (debe ser numérico) |

### Respuesta exitosa (200)

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

### Catálogo de errores

| HTTP | Código | Cuando |
| ---- | ----------------------- | ------------------------------------------------ |
| 400 | `missing_required_field` | Falta un campo obligatorio en la solicitud |
| 400 | `invalid_action` | El campo `action` tiene un valor no válido |
| 400 | `invalid_config_type` | El campo `config_type` tiene un valor no válido |
| 400 | `invalid_payload_format` | El formato de carga útil no coincide con la estructura esperada |
| 400 | `empty_payload` | El objeto/matriz de carga útil está vacío |
| 400 | `preconfig_validation_failed` | Error en la validación de la preconfiguración (consulte los detalles del error) |
| 400 | `custom_validation_failed` | La validación personalizada falló (ver detalles del error) |
| 400 | `missing_device_id` | Falta la ID del dispositivo en los parámetros de ruta |
| 500 | `device_action_error` | Error inesperado durante el envío de la acción |
| 500 | `internal_server_error` | Error inesperado del servidor |

### Ejemplo de respuesta de error

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

### Reglas de validación

#### Formato de preconfiguración
1. `payload` debe ser un diccionario que no esté vacío
2. Cada nombre de dispositivo debe existir en el registro de dispositivos.
3. Para acciones de **lectura**: cada dispositivo se asigna a una lista de nombres de registros
4. Para acciones de **escritura**: cada dispositivo se asigna a un dictado de registro: pares de valor_numérico
5. Todos los nombres de registro deben existir en el dispositivo.
6. Operaciones de escritura rechazadas en dispositivos de solo lectura
7. Los valores de escritura deben ser numéricos.

#### Formato personalizado
1. `payload` debe ser una lista que no esté vacía
2. Cada elemento debe tener las claves `device` y `vars`.
3. Todos los dispositivos deben existir en el registro.
4. `vars` debe ser una lista que no esté vacía
5. Cada variable debe tener todos los campos obligatorios (difiere entre lectura y escritura)
6. Todos los campos de enumeración validados con los valores permitidos.
7. Los valores de escritura deben ser numéricos.

### Dispositivos compatibles

#### Sólo lectura
| Nombre del dispositivo | Registros admitidos |
| ------------- | ------------------- |
| `RTU_Device2` | `"1"`, `"2"` |
| `medidor` | `"VA"`, `"VB"` |

#### Escribible
| Nombre del dispositivo | Registros admitidos |
| ----------------- | ------------------- |
| `medidor_control` | `"wm"` |

> **Nota:** La API no valida nombres de dispositivos ni registra valores. La validación se realiza en el lado del dispositivo. Asegúrese de que las cargas útiles se ajusten a los dispositivos y registros compatibles para una ejecución exitosa.
### Notas
- `task_id` se genera automáticamente como UUID si no se proporciona
- El tiempo de espera de MQTT es de 60 segundos.
- Todas las marcas de tiempo están en formato UTC ISO-8601
- Las respuestas del dispositivo varían según el tipo de dispositivo y la acción.