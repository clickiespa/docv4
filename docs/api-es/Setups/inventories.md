# Inventarios

Colecciones de dispositivos agrupados con fines organizativos.

## Endpoints
- [Listar inventarios](#list-inventories)
- [Obtener inventario](#get-inventory)
- [Crear inventario](#create-inventory)
- [Actualizar inventario](#update-inventory)
- [Eliminar inventario](#delete-inventory)

## Listar inventarios

Recupere todos los inventarios visibles para la cuenta autenticada. Opcionalmente, puede filtrar los resultados por nombre.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
GET /inventories
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | No | entero | Número de inventarios que se deben omitir antes de recopilar el conjunto de resultados. |
| `limit` | No | entero | Número máximo de inventarios a devolver. |
| `inventory_name` | No | cadena | Realiza una búsqueda que no distingue entre mayúsculas y minúsculas en los nombres de inventario. |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/inventories?inventory_name=Main"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Inventories retrieved",
  "data": [
    {
      "id_inventory": 1,
      "inventory_name": "Main",
      "inventory_identifier": "inv-main",
      "inventory_description": "Primary devices"
    }
  ],
  "context": {},
  "instance": "/inventories"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_inventory` | entero | Identificador numérico del inventario. |
| `inventory_name` | cadena | Nombre de inventario legible por humanos. |
| `inventory_identifier` | cadena | Identificador único utilizado para hacer referencia al inventario. |
| `inventory_description` | cadena | Descripción opcional del inventario. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Inventarios recuperados exitosamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para enumerar inventarios. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (403)
```json
{
  "status": "error",
  "message": "Insufficient permissions",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/inventories"
}
```

## Obtener inventario

Recupera los detalles de un único inventario por su identificador numérico.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
GET /inventories/{id_inventory}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_inventory` | Sí | entero | Identificador numérico del inventario a recuperar. Puede obtenerlo de [Listar inventarios](#list-inventories). |

### Parámetros de consulta

Este endpoint no acepta parámetros de consulta.

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/inventories/1"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_inventory": 1,
    "inventory_name": "Main",
    "inventory_identifier": "inv-main",
    "inventory_description": "Primary devices"
  },
  "context": {},
  "instance": "/inventories/1"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_inventory` | entero | Identificador numérico del inventario. |
| `inventory_name` | cadena | Nombre de inventario legible por humanos. |
| `inventory_identifier` | cadena | Identificador único utilizado para hacer referencia al inventario. |
| `inventory_description` | cadena | Descripción opcional del inventario. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Inventario recuperado exitosamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para ver este inventario. |
| `404` | No se encontró inventario para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Inventory 999 was not found",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/inventories/999"
}
```

## Crear inventario

Cree un nuevo inventario disponible para la cuenta autenticada.

Se requiere un nivel de autorización 2 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
POST /inventories
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Cuerpo de la solicitud
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `inventory_name` | Sí | cadena | No | Nombre de inventario legible por humanos. |
| `inventory_description` | No | cadena | No | Descripción opcional para el inventario. |

El `inventory_identifier` se genera automáticamente y no se acepta en la carga útil de la solicitud.

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -X POST -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_name": "Warehouse",
    "inventory_description": "Devices stored in the main warehouse"
  }' \
  /inventories
```

### Ejemplo de respuesta (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_inventory": 15,
    "inventory_name": "Warehouse",
    "inventory_identifier": "inv-warehouse",
    "inventory_description": "Devices stored in the main warehouse"
  },
  "context": {
    "body": {
      "inventory_name": "Warehouse",
      "inventory_description": "Devices stored in the main warehouse"
    }
  },
  "instance": "/inventories"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `201` | Inventario creado exitosamente. |
| `400` | La validación falló para la carga útil proporcionada. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado carece de autorización para crear inventarios. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (400)
```json
{
  "status": "error",
  "message": "inventory_name field required",
  "data": null,
  "context": {
    "body": {
      "inventory_name": "Warehouse"
    }
  },
  "instance": "/inventories"
}
```

## Actualizar inventario

Modificar un inventario existente. Los campos omitidos mantienen su valor actual.

Se requiere un nivel de autorización 2 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
PUT /inventories/{id_inventory}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_inventory` | Sí | entero | Identificador numérico del inventario a actualizar. Recupérelo de [Listar inventarios](#list-inventories). |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `inventory_name` | No | cadena | No | Nombre de inventario actualizado. |
| `inventory_description` | No | cadena | No | Descripción actualizada. |

El `inventory_identifier` devuelto en las respuestas es de solo lectura y no se puede modificar.

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -X PUT -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_description": "Devices stored in the refurbished warehouse"
  }' \
  /inventories/15
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_inventory": 15,
    "inventory_name": "Warehouse",
    "inventory_identifier": "inv-warehouse",
    "inventory_description": "Devices stored in the refurbished warehouse"
  },
  "context": {
    "body": {
      "inventory_description": "Devices stored in the refurbished warehouse"
    },
    "path": {
      "id_inventory": "15"
    }
  },
  "instance": "/inventories/15"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Inventario actualizado exitosamente. |
| `400` | La validación falló para la carga útil proporcionada. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado carece de autorización para actualizar los inventarios. |
| `404` | No se encontró inventario para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Inventory 15 was not found",
  "data": null,
  "context": {
    "path": {
      "id_inventory": "15"
    }
  },
  "instance": "/inventories/15"
}
```

## Eliminar inventario

Eliminar un inventario de la cuenta autenticada.

Se requiere un nivel de autorización 2 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
DELETE /inventories/{id_inventory}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_inventory` | Sí | entero | Identificador numérico del inventario a eliminar. Recupérelo de [Listar inventarios](#list-inventories). |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /inventories/15
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": null,
  "context": {
    "path": {
      "id_inventory": "15"
    }
  },
  "instance": "/inventories/15"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | El inventario se eliminó correctamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para eliminar inventarios. |
| `404` | No se encontró inventario para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Inventory 15 was not found",
  "data": null,
  "context": {
    "path": {
      "id_inventory": "15"
    }
  },
  "instance": "/inventories/15"
}
```