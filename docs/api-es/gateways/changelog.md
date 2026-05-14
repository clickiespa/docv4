# Registro de cambios

Todos los cambios notables en Clickiemota API v4 están documentados en este archivo.

El formato se basa en [Mantenga un registro de cambios](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Versionado semántico](https://semver.org/spec/v2.0.0.html).

## [Inédito]

### Agregado
- `GET /v4/gateways/devices/{identifier}/config` — Se agregó el parámetro de consulta `device_read`; cuando se establece en `true`, omite el caché del historial de DynamoDB y lee la configuración directamente desde el dispositivo a través de MQTT

### Cambiado
- Los endpoints relacionados con las configuraciones ahora filtran *CMWS* del identificador del dispositivo para no usarlo en interacciones MQTT ni guardar la configuración en la base de datos.
- `PUT /v4/gateways/devices/{identifier}/config` - Se cambió el parámetro de consulta `subscription` a un campo de cuerpo.
- `GET /v4/gateways/devices/{identifier}/config`: las lecturas de configuración ahora se sirven desde DynamoDB (`cm-config-history`) en lugar de la columna SQL `devices.device_configuration`; vuelve a MQTT si no existe ninguna entrada en el historial
- `PUT /v4/gateways/devices/{identifier}/config`: las escrituras de configuración ahora persisten en DynamoDB (`cm-config-history`) a través de `save_cm_config` en lugar de actualizar la tabla SQL `devices`.
- `GET /v4/gateways/devices` — Prefijo de ruta actualizado de `/dev/clickiemottas/` a `/v4/gateways/`
- `GET /v4/gateways/devices/{identifier}` — Prefijo de ruta actualizado de `/dev/clickiemottas/` a `/v4/gateways/`
- `GET /v4/gateways/devices/{identifier}/config` — Prefijo de ruta actualizado de `/dev/clickiemottas/` a `/v4/gateways/`
- `PUT /v4/gateways/devices/{identifier}/config` — Prefijo de ruta actualizado de `/dev/clickiemottas/` a `/v4/gateways/`
- `GET /v4/gateways/health` — Prefijo de ruta actualizado de `/dev/clickiemottas/` a `/v4/gateways/`

### Fijo
-

### En desuso
-

### Eliminado
-

### Seguridad
- 

## [Versiones anteriores]

---

### Directrices para las entradas del registro de cambios

- **Agregado**: nuevas funciones o endpoints
- **Cambiado**: cambios en la funcionalidad existente
- **Corregido** — Corrección de errores
- **Obsoleto**: funciones marcadas para eliminación futura
- **Eliminado**: funciones o endpoints eliminados
- **Seguridad**: parches de seguridad o correcciones de vulnerabilidades

### Formato para cada entrada

```markdown
- [ENDPOINT] — Brief description of change (e.g., `GET /devices/{id}` — Added status field to response)
```