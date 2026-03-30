# Tipos de eventos de métricas

## Endpoints
- [Listar tipos de eventos](#list-event-types)
- [Crear tipo de evento](#create-event-type)
- [Obtener tipo de evento](#get-event-type)
- [Actualizar tipo de evento](#update-event-type)
- [Eliminar tipo de evento](#delete-event-type)

Catálogo de tipos de eventos que se pueden asociar a métricas.

## Listar tipos de eventos

### Endpoint
```
GET /types/metric_events
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `skip` | no | entero | `0` | Desplazamiento para paginación |
| `limit` | no | entero | `100` | Registros máximos para devolver |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" "/types/metric_events?skip=0&limit=100"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Event types retrieved",
  "data": [{"id_event_type": 1, "type_name": "alarm", "type_description": "Alarm events"}],
  "context": null,
  "instance": "/types/metric_events"
}
```

## Crear tipo de evento

### Endpoint
```
POST /types/metric_events
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `type_name` | si | cadena | - | Nombre para mostrar |
| `type_description` | no | cadena | `null` | Detalles opcionales |

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"type_name":"alarm","type_description":"Alarm events"}' \
  /types/metric_events
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_event_type": 2, "type_name": "alarm", "type_description": "Alarm events"},
  "context": null,
  "instance": "/types/metric_events"
}
```

## Obtener tipo de evento

### Endpoint
```
GET /types/metric_events/{id_event_type}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_event_type}` | Identificador numérico del tipo de evento | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/metric_events/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_event_type": 2, "type_name": "alarm", "type_description": "Alarm events"},
  "context": null,
  "instance": "/types/metric_events/2"
}
```

## Actualizar tipo de evento

### Endpoint
```
PUT /types/metric_events/{id_event_type}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_event_type}` | Identificador numérico del tipo de evento | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `type_name` | no | cadena | `null` | Nombre para mostrar |
| `type_description` | no | cadena | `null` | Detalles opcionales |

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"type_name":"critical","type_description":"Critical events"}' \
  /types/metric_events/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_event_type": 2, "type_name": "critical", "type_description": "Critical events"},
  "context": null,
  "instance": "/types/metric_events/2"
}
```

## Eliminar tipo de evento

### Endpoint
```
DELETE /types/metric_events/{id_event_type}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_event_type}` | Identificador numérico del tipo de evento | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/metric_events/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/types/metric_events/2"
}
```