# Métricas

## Puntos finales
- [Listar métricas](#list-metrics)
- [Crear métrica](#create-metric)
- [Obtener métrica](#get-metric)
- [Actualizar métrica](#update-metric)
- [Eliminar métrica](#delete-metric)
- [Eventos](#events)
  - [Listar eventos](#list-events)
  - [Obtener evento](#get-event)
  - [Crear evento](#create-event)
  - [Evento de actualización](#update-event)
  - [Eliminar evento](#delete-event)

Las métricas almacenan datos de series temporales.

## Listar métricas

Recupere todas las métricas configuradas para la cuenta autenticada.

Se requiere un nivel de autorización 7 o inferior con permiso de lectura sobre métricas para utilizar este punto final.

### Punto final

```
GET /metrics
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |

### Solicitud de muestra

```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /metrics?skip=0&limit=100
```

### Respuesta de muestra

```json
{
  "status": "success",
  "message": "Metrics retrieved",
  "data": [{"id_metric": 1, "metric_identifier": "<metric_uuid>", "metric_name": "Temperature"}],
  "context": null,
  "instance": "/metrics"
}
```

## Crear métrica

Registre una nueva métrica para la cuenta autenticada.

Se requiere un nivel de autorización 5 o inferior con permiso de creación sobre métricas para utilizar este punto final.

### Punto final

```
POST /metrics
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | Debe ser `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_metric_source` | no | entero | 4 | Identificador de fuente de métrica. Sistema gestionado; El valor predeterminado es `4` (API) o cambia a `2` cuando se proporciona `metric_formula`. |
| `id_uom` | si | entero | No | Identificador de unidad de medida devuelto por [`GET /uoms`](../Uoms/uoms.md#list-uoms). |
| `id_aggregation` | no | entero | nulo | Identificador de agregación obtenido de [`GET /methods/aggregation`](../Global_resources/methods.md#aggregation-methods). |
| `id_interpolation` | no | entero | nulo | Identificador de interpolación obtenido de [`GET /methods/interpolation`](../Global_resources/methods.md#interpolation-methods). |
| `metric_name` | si | cadena | No | Nombre para mostrar de la métrica |
| `metric_description` | no | cadena | nulo | Descripción detallada |
| `metric_tags` | no | cadena | nulo | Etiquetas separadas por comas |
| `metric_formula` | no | cadena | nulo | Fórmula métrica |
| `metric_resolution` | no | entero | nulo | Resolución en segundos |
| `metric_force_availability` | no | entero (`0`, `1`, `2`) | 0 | Forzar el modo de disponibilidad de métricas (`0` predeterminado, `1` forzado, `2` estricto forzado). |
| `metric_impacts_health` | no | booleano | verdadero | Métrica impacta la salud |



### Solicitud de muestra

```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"metric_name": "Humidity", "id_uom": 2}' \
  /metrics
```

### Respuesta de muestra

```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_metric": 2, "metric_identifier": "<metric_uuid>", "metric_name": "Humidity", "id_metric_source": null},
  "context": null,
  "instance": "/metrics"
}
```

## Obtener métrica

Recuperar una métrica por su identificador.

Se requiere un nivel de autorización 7 o inferior con permiso de lectura sobre métricas para utilizar este punto final.

### Punto final
```
GET /metrics/{metric_identifier}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /metrics/<metric_uuid>
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_metric": 2, "metric_identifier": "<metric_uuid>", "metric_name": "Humidity"},
  "context": null,
  "instance": "/metrics/<metric_uuid>"
}
```

## Actualizar métrica

Modificar una métrica existente.

Se requiere un nivel de autorización 5 o inferior con permiso de actualización de métricas para utilizar este punto final.

### Punto final
```
PUT /metrics/{metric_identifier}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | Debe ser `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Cuerpo de la solicitud| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_uom` | no | entero | nulo | Identificador de unidad de medida devuelto por [`GET /uoms`](../Uoms/uoms.md#list-uoms). |
| `id_aggregation` | no | entero | nulo | Identificador de agregación obtenido de [`GET /methods/aggregation`](../Global_resources/methods.md#aggregation-methods). |
| `id_interpolation` | no | entero | nulo | Identificador de interpolación obtenido de [`GET /methods/interpolation`](../Global_resources/methods.md#interpolation-methods). |
| `metric_name` | no | cadena | nulo | Nombre para mostrar de la métrica |
| `metric_description` | no | cadena | nulo | Descripción detallada |
| `metric_tags` | no | cadena | nulo | Etiquetas separadas por comas |
| `metric_formula` | no | cadena | nulo | Fórmula métrica |
| `metric_resolution` | no | entero | nulo | Resolución en segundos |
| `metric_force_availability` | no | entero (`0`, `1`, `2`) | nulo | Forzar el modo de disponibilidad de métricas (`0` predeterminado, `1` forzado, `2` estricto forzado). |
| `metric_impacts_health` | no | booleano | nulo | Métrica impacta la salud |


### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"metric_name":"New name"}' \
  /metrics/<metric_uuid>
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_metric": 2, "metric_identifier": "<metric_uuid>", "metric_name": "New name"},
  "context": null,
  "instance": "/metrics/<metric_uuid>"
}
```

## Eliminar métrica

Archive una métrica que ya no sea necesaria.

Se requiere un nivel de autorización 2 o inferior con permiso de eliminación de métricas para utilizar este punto final.

### Punto final
```
DELETE /metrics/{metric_identifier}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /metrics/<metric_uuid>
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/metrics/<metric_uuid>"
}
```

## Eventos

Los eventos anotan métricas con información contextual, como ventanas de mantenimiento o anomalías de datos.

## Listar eventos

Recupere todos los eventos configurados para la cuenta autenticada.

Se requiere un nivel de autorización 7 o inferior con permiso de lectura sobre eventos de métricas para utilizar este punto final.

### Punto final
```
GET /metrics/{metric_identifier}/events
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /metrics/<metric_uuid>/events?skip=0&limit=100
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Metric events retrieved",
  "data": [],
  "context": null,
  "instance": "/metrics/<metric_uuid>/events"
}
```

## Obtener evento

Recupera un único evento por su identificador.

Se requiere un nivel de autorización 7 o inferior con permiso de lectura sobre eventos de métricas para utilizar este punto final.

### Punto final
```
GET /metrics/{metric_identifier}/events/{id_metric_event}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |
| `{id_metric_event}` | Identificador numérico del evento | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /metrics/<metric_uuid>/events/3
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_metric_event": 3},
  "context": null,
  "instance": "/metrics/<metric_uuid>/events/3"
}
```

## Crear evento

Registre un nuevo evento asociado con una métrica.

Se requiere un nivel de autorización 5 o inferior con permiso de creación sobre eventos de métricas para utilizar este punto final.

### Punto final
```
POST /metrics/{metric_identifier}/events
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetro de ruta| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_event_type` | no | entero | 1 | Identificador de tipo de evento |
| `event_start` | si | cadena o int | No | Marca de tiempo de inicio (ISO 8601 o marca de tiempo Unix) |
| `event_end` | si | cadena o int | No | Marca de tiempo de finalización (marca de tiempo ISO 8601 o Unix) |
| `event_description` | si | cadena | No | Descripción del evento |


### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"event_start":"2023-11-14T08:00:00Z","event_end":"2023-11-14T08:15:00Z","event_description":"Maintenance"}' \
  /metrics/<metric_uuid>/events
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_metric_event": 4},
  "context": null,
  "instance": "/metrics/<metric_uuid>/events/4"
}
```

## Evento de actualización

Modificar un evento existente.

Se requiere un nivel de autorización 5 o inferior con permiso de actualización sobre eventos de métricas para utilizar este punto final.

### Punto final
```
PUT /metrics/{metric_identifier}/events/{id_metric_event}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |
| `{id_metric_event}` | Identificador numérico del evento | entero |

### Cuerpo de la solicitud

Cualquier campo de la tabla de creación puede actualizarse.

> **Validación**
> Mismas reglas que crear: el tipo de evento debe existir y `event_end` debe estar después de `event_start`.

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"event_description":"Updated"}' \
  /metrics/<metric_uuid>/events/4
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_metric_event": 4},
  "context": null,
  "instance": "/metrics/<metric_uuid>/events/4"
}
```

## Eliminar evento

Eliminar un evento del historial de la cuenta.

Se requiere un nivel de autorización 5 o inferior con permiso de eliminación sobre eventos de métricas para utilizar este punto final.

### Punto final
```
DELETE /metrics/{metric_identifier}/events/{id_metric_event}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |
| `{id_metric_event}` | Identificador numérico del evento | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /metrics/<metric_uuid>/events/4
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/metrics/<metric_uuid>/events/4"
}
```