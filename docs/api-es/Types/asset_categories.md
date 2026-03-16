# Categorías de activos

## Puntos finales
- [Listar categorías](#list-categories)
- [Crear categoría](#create-category)
- [Obtener categoría](#get-category)
- [Categoría de actualización](#update-category)
- [Eliminar categoría](#delete-category)

Categorías utilizadas para agrupar activos.

## Listar categorías

### Punto final
```
GET /types/assets
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `skip` | no | entero | `0` | Desplazamiento para paginación |
| `limit` | no | entero | `100` | Registros máximos para devolver |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" "/types/assets?skip=0&limit=100"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Categories retrieved",
  "data": [{"id_category": 1, "category_name": "Sensors"}],
  "context": null,
  "instance": "/types/assets"
}
```

## Crear categoría

### Punto final
```
POST /types/assets
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
| `category_name` | si | cadena | - | Nombre para mostrar |

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"category_name":"Sensors"}' \
  /types/assets
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_category": 2, "category_name": "Sensors"},
  "context": null,
  "instance": "/types/assets"
}
```

## Obtener categoría

### Punto final
```
GET /types/assets/{id_category}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_category}` | Identificador numérico de categoría | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/assets/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_category": 2, "category_name": "Sensors"},
  "context": null,
  "instance": "/types/assets/2"
}
```

## Actualizar categoría

### Punto final
```
PUT /types/assets/{id_category}
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
| `{id_category}` | Identificador numérico de categoría | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `category_name` | no | cadena | `null` | Nombre para mostrar |

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"category_name":"Other"}' \
  /types/assets/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_category": 2, "category_name": "Other"},
  "context": null,
  "instance": "/types/assets/2"
}
```

## Eliminar categoría

### Punto final
```
DELETE /types/assets/{id_category}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_category}` | Identificador numérico de categoría | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/assets/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/types/assets/2"
}
```