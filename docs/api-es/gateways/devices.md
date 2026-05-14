# Endpoints de dispositivos

## OBTENER /dispositivos

## Objetivo
Enumere los dispositivos Clickiemota que pertenecen a la cuenta autenticada. Los dispositivos se obtienen de la tabla `devices`, se filtran por los identificadores de modelo de Clickiemota y se restringen a aquellos instalados actualmente en una configuración activa.

## Autenticación
* **Obligatorio**: clave API de Clickie y encabezados de cuenta.

## Solicitud
```http
GET /v4/gateways/devices HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

## Respuesta exitosa
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

*`identifier` corresponde a la columna `device_custom_id` y es el valor que se va a reutilizar en todos los endpoints `/devices/{identifier}`.*

### Configuración
* Modelos Clickiemota predeterminados: `381, 389, 500001, 500002, 500003, 294, 318, 330, 362`.
* Anule la lista con la variable de entorno `CLICKIEMOTA_MODEL_IDS` usando una lista separada por comas (por ejemplo, `CLICKIEMOTA_MODEL_IDS=381,389,500001`). Los valores no válidos se ignoran y se registran como advertencias.
* Solo se devuelven los dispositivos con un registro `device_setup` activo (no `setup_uninstall_date`).

### Valores de estado

| estado | descripción |
| -------------- | ------------------------------------------------------- |
| `connected` | El dispositivo informa que está en línea (id. de estado de la fuente `1`).              |
| `disconnected` | Dispositivo reportado fuera de línea (id de estado de fuente `2`).               |
| `unknown` | No hay estado reciente disponible (ID de estado de fuente `3` o falta). |

---

## OBTENER /dispositivos/{identificador}

### Objetivo
Recupere metadatos detallados para un único dispositivo Clickiemota. Valida que el dispositivo pertenece a la cuenta autenticada y está instalado en una configuración activa. Devuelve información completa del dispositivo, incluidos detalles del modelo, estado de conectividad y asociación de configuración.

### Autenticación
* **Obligatorio**: clave API de Clickie y encabezados de cuenta.

### Solicitud
```http
GET /v4/gateways/devices/cm-001 HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

### Respuesta exitosa (200 OK)
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

### Respuestas de error

**400 Solicitud incorrecta**: falta el identificador del dispositivo
```json
{
  "status": "failed",
  "code": "missing_identifier",
  "errors": [
    {"message": "Device identifier is required."}
  ]
}
```

**401 No autorizado** — Falta identificación de cuenta
```json
{
  "status": "failed", 
  "code": "missing_account_id",
  "errors": [
    {"message": "Account identification is required."}
  ]
}
```

**404 No encontrado**: dispositivo no encontrado o no accesible
```json
{
  "status": "failed",
  "code": "device_not_found", 
  "errors": [
    {"message": "Device 'cm-999' not found or not accessible."}
  ]
}
```

**Error interno del servidor 500**: error de base de datos o del sistema
```json
{
  "status": "failed",
  "code": "internal_server_error",
  "errors": [
    {"message": "Failed to retrieve device information."}
  ]
}
```

**503 Servicio no disponible**: error de configuración
```json
{
  "status": "failed",
  "code": "service_unavailable",
  "errors": [
    {"message": "Clickiemota model configuration is invalid."}
  ]
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
| ------------------- | ------------- | ----------------------------------------- |
| `identifier` | cadena | Identificador personalizado del dispositivo (device_custom_id) |
| `model` | cadena | Nombre del modelo de dispositivo de la tabla device_models |
| `firmware_version` | cadena | Versión de firmware actual (marcador de posición: "1.0.0") |
| `labels` | matriz[cadena] | Etiquetas de configuración más "clickiemota" por defecto |
| `last_seen_at` | cadena\|nulo | Marca de tiempo ISO cuando el dispositivo se conectó por última vez |
| `stub_mode` | booleano | Siempre `false` - indica implementación real |
| `setup` | objeto | Información de configuración asociada |
| `setup.id` | número | ID de configuración de la tabla de configuraciones |
| `setup.identifier` | cadena | Identificador de configuración |
| `setup.name` | cadena | Nombre para mostrar de la configuración |
| `status` | cadena | Estado de conectividad del dispositivo |
| `status_since` | cadena\|nulo | Marca de tiempo ISO del último cambio de estado |
| `model_id` | número | ID del modelo de dispositivo de la tabla device_models |
| `model_description` | cadena | Descripción del modelo de la tabla device_models |

### Valores de estado
| Valor | Descripción |
| -------------- | ----------------------------------------- |
| `connected` | El dispositivo está actualmente accesible y activo |
| `disconnected` | El dispositivo no responde a las comprobaciones de conectividad |
| `unknown` | No se puede determinar el estado del dispositivo |

### Notas de implementación
* Valida la propiedad del dispositivo usando account_id desde el contexto de autenticación
* Requiere configuración activa (no `setup_uninstall_date`)
*Solo devuelve modelos Clickiemota (configurable vía `CLICKIEMOTA_MODEL_IDS`)
* Registro estructurado para recuperaciones exitosas y errores
* Analiza el campo JSON `device_configuration` para etiquetas personalizadas

---

## OBTENER /dispositivos/{identificador}/config

Recupere la última instantánea de configuración guardada o intente obtenerla del dispositivo a través de MQTT.

* Cuando no se puede recuperar la configuración, devuelve `503 service_unavailable` con `code: mqtt_bridge_unavailable`.
* La suscripción se puede especificar opcionalmente mediante el parámetro de consulta (predeterminado: `"edge"`).
* Admite la lectura de una propiedad anidada específica usando `mode=read_specific` con un parámetro `route`.

### Solicitar ejemplos

Configuración completa:
```http
GET /v4/gateways/devices/cm-001/config HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

Con parámetro de suscripción:
```http
GET /v4/gateways/devices/cm-001/config?subscription=core HTTP/1.1
```

Lea una propiedad anidada específica (por ejemplo, umbrales de temperatura):
```http
GET /v4/gateways/devices/cm-001/config?mode=read_specific&route=app/thresholds/temperature HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

### Respuesta exitosa (200 OK): configuración completa

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

### Respuesta exitosa (200 OK): propiedad anidada específica

Cuando `mode=read_specific&route=app/thresholds/temperature`:
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

### Respuestas de error

**400 Solicitud incorrecta** — Suscripción no válida
```json
{
  "status": "failed",
  "code": "invalid_subscription",
  "errors": [
    {"message": "Subscription 'invalid' is not valid. Must be one of: edge-dev, edge, core"}
  ]
}
```

**400 Solicitud incorrecta**: falta ruta cuando el modo es específico de lectura
```json
{
  "status": "failed",
  "code": "missing_route",
  "errors": [
    {"message": "Query parameter 'route' is required when mode is 'read_specific'."}
  ]
}
```

**Servicio 503 no disponible** — Puente MQTT no disponible
```json
{
  "status": "failed",
  "code": "mqtt_bridge_unavailable",
  "errors": [
    {"message": "Failed to communicate with device. The MQTT bridge or device is currently unavailable."}
  ]
}
```

### Parámetros de consulta

| Parámetro | Predeterminado | Descripción |
| -------------- | -------- | --------------------------------------------------------------------------------------- |
| `subscription` | `"edge"` | Suscripción de destino: `"edge-dev"`, `"edge"` o `"core"` |
| `device_read` | `false` | Establezca en `"true"` para omitir el caché de DynamoDB y leer la configuración directamente desde el dispositivo a través de MQTT |
| `mode` | nulo | Establezca en `"read_specific"` para leer una propiedad anidada |
| `route` | nulo | Ruta JSON a una propiedad específica (obligatoria si `mode="read_specific"`); formato: `key/nested/path` |

---

## PUT /dispositivos/{identificador}/config

Publique un cambio de configuración en el dispositivo a través de MQTT.

* Acepta una carga útil JSON que coincida con las capacidades del dispositivo.
* La suscripción se puede especificar opcionalmente mediante el parámetro de consulta (predeterminado: `"edge"`).
* Admite dos modos:
  - **Reemplazo completo** (predeterminado): reemplaza toda la configuración del dispositivo. Requiere las claves `database`, `id` y `lambda_functions` en la configuración.
  - **Actualización dirigida** (`mode=write_specific`): actualice una propiedad anidada específica utilizando una ruta JSON (`route`).
* Devuelve `200 OK` cuando el dispositivo confirma que la configuración se aplicó inmediatamente.
* Devuelve `202 Accepted` cuando el dispositivo pone en cola el cambio para el procesamiento asincrónico.
* Devuelve `503 Service Unavailable` cuando no se puede acceder al puente o dispositivo MQTT.

### Ejemplos de solicitud: reemplazo completo

Actualización de configuración completa:
```http
PUT /v4/gateways/devices/cm-001/config?subscription=edge HTTP/1.1
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

### Ejemplos de solicitud: actualización específica

Actualizar una propiedad anidada específica (por ejemplo, umbrales de temperatura):
```http
PUT /v4/gateways/devices/cm-001/config HTTP/1.1
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

Cree rutas intermedias faltantes durante la actualización dirigida:
```http
PUT /v4/gateways/devices/cm-001/config HTTP/1.1
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

### Respuesta: 200 OK — Reconocimiento inmediato

El dispositivo responde en el mismo viaje de ida y vuelta MQTT:

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

### Respuesta: 202 Aceptada: actualización en cola

El dispositivo pone en cola el cambio para el procesamiento asincrónico:```json
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

### Respuestas de error

**400 Solicitud incorrecta** — Suscripción no válida
```json
{
  "status": "failed",
  "code": "invalid_subscription",
  "errors": [
    {"message": "Subscription 'invalid' is not valid. Must be one of: edge-dev, edge, core"}
  ]
}
```

**400 Solicitud incorrecta** — Actualización de configuración vacía
```json
{
  "status": "failed",
  "code": "empty_config",
  "errors": [
    {"message": "Configuration update payload is required."}
  ]
}
```

**400 Solicitud incorrecta**: esquema de configuración no válido (modo de reemplazo completo)
```json
{
  "status": "failed",
  "code": "invalid_config_schema",
  "errors": [
    {"message": "Configuration must contain required keys: database, id, lambda_functions. Missing: id, lambda_functions"}
  ]
}
```

**400 Solicitud incorrecta**: falta ruta en el modo de actualización dirigida
```json
{
  "status": "failed",
  "code": "missing_route",
  "errors": [
    {"message": "Body parameter 'route' is required when mode is 'write_specific'."}
  ]
}
```

**Servicio 503 no disponible** — Puente MQTT no disponible
```json
{
  "status": "failed",
  "code": "mqtt_bridge_unavailable",
  "errors": [
    {"message": "Failed to communicate with device. The MQTT bridge or device is currently unavailable."}
  ]
}
```

### Solicitar parámetros del cuerpo

| Parámetro | Tipo | Requerido | Modo | Descripción |
| -------------------- | ------- | -------- | ----------------- | ----------------------------------------------- |
| `config` | objeto | Sí | Ambos | Objeto de configuración o carga útil de actualización específica |
| `mode` | cadena | No | Ambos | Establezca en "write_specific" para actualizaciones específicas; omitir para reemplazo completo |
| `route` | cadena | Sí* | escribir_específico | Ruta JSON a la propiedad de destino; formato: `key/nested/path` (*obligatorio cuando mode="write_specific") |
| `create_missing_path` | booleano | No | escribir_específico | Si es verdadero, cree rutas intermedias que no existen; predeterminado: falso |

### Solicitar encabezados

| Encabezado | Requerido | Descripción |
| ---------------- | -------- | -------------------------------------------------------------------------- |
| `Idempotency-Key` | No | UUID para seguimiento. Registrado para auditoría; idempotencia total llega en la Fase B. |

### Parámetros de consulta

| Parámetro | Predeterminado | Descripción |
| ------------- | ------- | ----------------------------------------------- |
| `subscription` | "borde" | Suscripción de destino: "edge-dev", "edge" o "core" |

### Campos de respuesta

| Campo | Tipo | Descripción |
| -------------- | ------- | -------------------------------------------------------------- |
| `identifier` | cadena | Identificador de dispositivo |
| `subscription` | cadena | Suscripción utilizada para la operación |
| `applied` | booleano | Si la configuración se aplicó inmediatamente (verdadero) o se puso en cola (falso) |
| `confirmed_at` | cadena | Marca de tiempo ISO de confirmación (cuando `applied: true`) |
| `job_id` | cadena | ID de trabajo para rastrear actualizaciones asincrónicas (cuando `applied: false`) |
| `queued_at` | cadena | Marca de tiempo ISO de cuándo se puso en cola la actualización (cuando `applied: false`) |

## Catálogo de errores

| HTTP | código | Cuando |
| ---- | --------------------- | ----------------------- |
| 500 | error_servidor_interno | Cualquier fallo inesperado. |