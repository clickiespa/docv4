# Entidades EAV

## Puntos finales
- [Enumerar entidades](#list-entities)
- [Obtener entidad](#get-entity)

Entidades utilizadas en el modelo atributo-valor. Una entidad representa una tabla o modelo específico de una cuenta al que se puede hacer referencia desde formularios y relaciones dinámicas.

## Listar entidades

Recupere todas las entidades EAV configuradas para la cuenta autenticada.

Se requiere el nivel de autorización 2 (lectura) o cualquier nivel de autorización inferior para utilizar este punto final.

### Punto final
```
GET /entities
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

Este punto final no acepta parámetros de consulta.

### Cuerpo de la solicitud

Este punto final no acepta un cuerpo de solicitud.

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -X GET \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /entities
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Entities retrieved",
  "data": [
    {
      "id_entity": 1,
      "entity_name": "location"
    }
  ],
  "context": {},
  "instance": "/entities"
}
```

### Sobre de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `status` | cadena | Siempre `"success"` cuando la solicitud finaliza correctamente. |
| `message` | cadena | Resumen legible por humanos de la operación. |
| `data` | conjunto de objetos | Colección de objetos de entidad. Ver [Objeto de entidad](#entity-object). |
| `context` | objeto | Metadatos adicionales proporcionados por la API. Vaciar cuando no sea necesario. |
| `instance` | cadena | Ruta relativa para el recurso solicitado. |

### Objeto de entidad

| Campo | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `id_entity` | entero | No | Identificador numérico de la entidad. |
| `entity_name` | cadena | No | Nombre único asignado a la entidad. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Entidades recuperadas exitosamente. |
| `400` | La solicitud no se pudo procesar debido a encabezados o metadatos de cuenta no válidos. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para enumerar entidades. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (401)
```json
{
  "status": "error",
  "message": "Invalid or expired API key",
  "data": null,
  "context": {},
  "instance": "/entities"
}
```

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
  "instance": "/entities"
}
```

### Respuesta de error (500)
```json
{
  "status": "error",
  "message": "Unexpected server error",
  "data": null,
  "context": {},
  "instance": "/entities"
}
```

## Obtener entidad

Recupera una única entidad EAV por su identificador numérico.

Se requiere el nivel de autorización 2 (lectura) o cualquier nivel de autorización inferior para utilizar este punto final.

### Punto final
```
GET /entities/{id_entity}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_entity` | Sí | entero | Identificador numérico de la entidad. |

### Parámetros de consulta

Este punto final no acepta parámetros de consulta.

### Cuerpo de la solicitud

Este punto final no acepta un cuerpo de solicitud.

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -X GET \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /entities/1
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_entity": 1,
    "entity_name": "location"
  },
  "context": {},
  "instance": "/entities/1"
}
```

### Sobre de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `status` | cadena | Siempre `"success"` cuando se devuelve la entidad. |
| `message` | cadena | Resumen legible por humanos de la operación. |
| `data` | objeto | Carga útil de la entidad. Ver [Objeto de entidad](#entity-object). |
| `context` | objeto | Metadatos adicionales proporcionados por la API. Vaciar cuando no sea necesario. |
| `instance` | cadena | Ruta relativa para el recurso solicitado. |

### Objeto de entidad

Este punto final devuelve el [Objeto de entidad](#entity-object) descrito en la sección Lista de entidades.

### Códigos de estado| Estado | Descripción |
| --- | --- |
| `200` | Entidad recuperada exitosamente. |
| `400` | La solicitud no se pudo procesar debido a encabezados o metadatos de cuenta no válidos. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado carece de autorización para ver la entidad. |
| `404` | No se encontró la entidad solicitada. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (401)
```json
{
  "status": "error",
  "message": "Invalid or expired API key",
  "data": null,
  "context": {},
  "instance": "/entities/1"
}
```

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
  "instance": "/entities/1"
}
```

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Entity not found",
  "data": null,
  "context": {
    "path_params": {
      "id_entity": 9999
    }
  },
  "instance": "/entities/9999"
}
```

### Respuesta de error (500)
```json
{
  "status": "error",
  "message": "Unexpected server error",
  "data": null,
  "context": {},
  "instance": "/entities/1"
}
```