# Activos

## Endpoints
- [Listar activos](#list-assets)
- [Crear activo](#create-asset)
- [Obtener activo](#get-asset)
- [Actualizar activo](#update-asset)
- [Eliminar activo](#delete-asset)

Un activo es una entidad física con una ubicación real concreta y se utiliza principalmente como nodo central sobre el que se asocian otras entidades como métricas o cuadros de mando. Cada activo existe sólo dentro de una cuenta específica y tiene un tipo de activo que se utiliza para diferenciar entre activos y su función designada en una o más cuentas.

## Listar activos

Se requiere un nivel de autorización 7 o inferior para utilizar este endpoint.

### Endpoint
```
GET /assets
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |
| `archived` | no | booleano | Filtrar por estado de archivo. Omita devolver activos activos y archivados. |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Assets retrieved",
  "data": [{"id_asset": 1, "asset_name": "Building", "asset_archived": false}],
  "context": null,
  "instance": "/assets"
}
```

## Crear activo

Se requiere un nivel de autorización 5 o inferior para utilizar este endpoint.

### Endpoint
```
POST /assets
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_category` | si | entero | No | ID de categoría de activo de [Listar categorías](../Types/asset_categories.md#list-categories). |
| `asset_name` | si | cadena | No | Nombre para mostrar |
| `asset_description` | no | cadena | nulo | Descripción |
| `asset_observations` | no | cadena | nulo | Notas |

> **Nota:** La creación de activos temporalmente no acepta referencias de imágenes o ubicaciones. La compatibilidad con `id_file_picture` y `id_location` volverá en una futura actualización.

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_category":1,"asset_name":"Building"}' \
  /assets
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_asset": 2, "asset_name": "Building", "asset_archived": false},
  "context": null,
  "instance": "/assets"
}
```

## Obtener activo

Se requiere un nivel de autorización 7 o inferior para utilizar este endpoint.

### Endpoint
```
GET /assets/{id_asset}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_asset}` | Identificador numérico del activo | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_asset": 2, "asset_name": "Building", "asset_archived": false},
  "context": null,
  "instance": "/assets/2"
}
```


## Actualizar activo

Se requiere un nivel de autorización 5 o inferior para utilizar este endpoint.

### Endpoint
```
PUT /assets/{id_asset}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_asset}` | Identificador numérico del activo | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_category` | no | entero | nulo | ID de categoría de activo de [Listar categorías](../Types/asset_categories.md#list-categories). |
| `id_file_picture` | no | entero | nulo | ID de archivo de imagen (la gestión de iconos está actualmente restringida). |
| `id_location` | no | entero | nulo | ID de ubicación (los directorios de ubicaciones aún no están disponibles). |
| `asset_name` | no | cadena | nulo | Nombre para mostrar |
| `asset_description` | no | cadena | nulo | Descripción |
| `asset_observations` | no | cadena | nulo | Notas |
| `asset_archived` | no | booleano | nulo | Estado del archivo |

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"asset_description":"Updated"}' \
  /assets/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_asset": 2, "asset_name": "Building", "asset_archived": false},
  "context": null,
  "instance": "/assets/2"
}
```

## Eliminar activo

Se requiere un nivel de autorización 5 o inferior para utilizar este endpoint.

### Endpoint
```
DELETE /assets/{id_asset}
```
### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_asset}` | Identificador numérico del activo | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/assets/2"
}
```
