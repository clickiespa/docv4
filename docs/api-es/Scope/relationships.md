# Relaciones de recursos

## Endpoints
- [Listar relaciones](#list-relationships)
- [Listar relaciones por tipo](#list-relationships-by-type)
- [crear relación](#create-relationship)
- [Obtener una relación específica](#get-specific-relationship)
- [Eliminar relación](#delete-relationship)

Una relación vincula dos recursos en una jerarquía padre-hijo. Las entidades admitidas son colaboradores, activos, paneles y métricas.

## Listar relaciones

### Endpoint
```
GET /relationships/{entity}/{id}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `{entity}` | si | Tipo de entidad principal | cadena | No |
| `{id}` | si | ID de entidad principal | entero | No |

### Parámetros de consulta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `direction` | no | `child` o `parent` | cadena | `child` |
| `skip` | no | Desplazamiento para paginación | entero | `0` |
| `limit` | no | Registros máximos para devolver | entero | `100` |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /relationships/assets/10
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Relationships retrieved",
  "data": [{"id_child": 5, "child_type": "metrics"}],
  "context": null,
  "instance": "/relationships/assets/10"
}
```

La respuesta utiliza el sobre JSON estándar.

### Códigos de estado
- `200` Relaciones recuperadas exitosamente
- `400` Solicitud no válida
- `401` No autorizado
- `403` Prohibido
- `404` Entidad principal no encontrada
- `500` Error interno del servidor

## Listar relaciones por tipo

### Endpoint
```
GET /relationships/{entity}/{id}/{entity_type}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `{entity}` | si | Tipo de entidad principal | cadena | No |
| `{id}` | si | ID de entidad principal | entero | No |
| `{entity_type}` | si | Filtrar por tipo de entidad secundaria o principal | cadena | No |

### Parámetros de consulta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `direction` | no | `child` o `parent` | cadena | `child` |
| `skip` | no | Desplazamiento para paginación | entero | `0` |
| `limit` | no | Registros máximos para devolver | entero | `100` |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /relationships/assets/10/metrics
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Relationships retrieved",
  "data": [{"id_child": 20, "child_type": "metrics"}],
  "context": null,
  "instance": "/relationships/assets/10/metrics"
}
```

La respuesta utiliza el sobre JSON estándar.

### Códigos de estado
- `200` Relaciones recuperadas exitosamente
- `400` Solicitud no válida
- `401` No autorizado
- `403` Prohibido
- `404` Entidad principal no encontrada
- `500` Error interno del servidor

## Crear relación

### Endpoint
```
POST /relationships/{entity}/{id}/{child_entity}/{child_id}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `{entity}` | si | Tipo de entidad principal | cadena | No |
| `{id}` | si | ID de entidad principal | entero | No |
| `{child_entity}` | si | Tipo de entidad secundaria | cadena | No |
| `{child_id}` | si | ID de entidad secundaria | entero | No |

### Solicitud de muestra
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /relationships/assets/10/metrics/20
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_parent": 10, "id_child": 20},
  "context": null,
  "instance": "/relationships/assets/10/metrics/20"
}
```

La respuesta utiliza el sobre JSON estándar.

### Códigos de estado
- `201` Relación creada
- `400` Solicitud no válida
- `401` No autorizado
- `403` Prohibido
- `404` Entidad no encontrada
- `500` Error interno del servidor

### Respuesta de error (400)
```json
{
  "status": "error",
  "message": "Relationship already exists",
  "data": null,
  "context": null,
  "instance": "/relationships/assets/10/metrics/20"
}
```

## Obtener una relación específica

### Endpoint
```
GET /relationships/{entity}/{id}/{child_entity}/{child_id}
```

### Encabezados| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `{entity}` | si | Tipo de entidad principal | cadena | No |
| `{id}` | si | ID de entidad principal | entero | No |
| `{child_entity}` | si | Tipo de entidad secundaria | cadena | No |
| `{child_id}` | si | ID de entidad secundaria | entero | No |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /relationships/assets/10/metrics/20
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_parent": 10, "id_child": 20},
  "context": null,
  "instance": "/relationships/assets/10/metrics/20"
}
```

La respuesta utiliza el sobre JSON estándar.

### Códigos de estado
- `200` Relación recuperada
- `400` Solicitud no válida
- `401` No autorizado
- `403` Prohibido
- `404` Relación no encontrada
- `500` Error interno del servidor

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Element not found",
  "data": null,
  "context": null,
  "instance": "/relationships/assets/10/metrics/999"
}
```

## Eliminar relación

### Endpoint
```
DELETE /relationships/{entity}/{id}/{child_entity}/{child_id}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- | --- |
| `{entity}` | si | Tipo de entidad principal | cadena | No |
| `{id}` | si | ID de entidad principal | entero | No |
| `{child_entity}` | si | Tipo de entidad secundaria | cadena | No |
| `{child_id}` | si | ID de entidad secundaria | entero | No |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /relationships/assets/10/metrics/20
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/relationships/assets/10/metrics/20"
}
```

La respuesta utiliza el sobre JSON estándar.

### Códigos de estado
- `200` Relación eliminada
- `400` Solicitud no válida
- `401` No autorizado
- `403` Prohibido
- `404` Relación no encontrada
- `500` Error interno del servidor