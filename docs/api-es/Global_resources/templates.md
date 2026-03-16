# Plantillas

## Puntos finales
- [Plantillas de lista](#list-templates)
- [Crear plantilla](#create-template)
- [Obtener plantilla](#get-template)
- [Actualizar plantilla](#update-template)
- [Eliminar plantilla](#delete-template)

Plantillas para comunicaciones como correos electrónicos o notificaciones.

## Plantillas de lista
Recupera las plantillas disponibles para la cuenta actual.

Se requiere un nivel de autorización 7 o inferior para utilizar este punto final.

### Punto final
```
GET /templates
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `skip` | No | entero | `0` | Desplazamiento aplicado al conjunto de resultados |
| `limit` | No | entero | `50` | Número máximo de plantillas para devolver |

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
  "/templates?skip=0&limit=20"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Templates retrieved",
  "data": [
    {
      "id_template": 1,
      "id_communication_type": 2,
      "template_name": "Alert",
      "template_description": "Triggered when a monitor detects an anomaly",
      "template_body": "An issue has been detected.",
      "created_at": "2024-01-07T18:12:46Z"
    }
  ],
  "context": {},
  "instance": "/templates"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Templates not available",
  "data": {},
  "context": {
    "errors": [
      "No templates were found for the requested account"
    ]
  },
  "instance": "/templates"
}
```

### Códigos de estado
- `200`: lista de plantillas recuperada correctamente.
- `400` — Parámetros de paginación no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — No se encontraron plantillas.
- `500` — Error interno del servidor.

## Crear plantilla
Crea una nueva plantilla de comunicación para la cuenta.

Se requiere un nivel de autorización 1 o inferior para utilizar este punto final.

### Punto final
```
POST /templates
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |
| `Content-Type` | Sí | Debe ser `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_communication_type` | No | entero | `1` | Tipo de comunicación asociado a la plantilla. Ver [Tipos de comunicación](../Types/types.md#communication-types). |
| `template_name` | Sí | cadena | No | Nombre para mostrar que se muestra en la interfaz de usuario |
| `template_description` | No | cadena | `None` | Breve descripción de la plantilla |
| `template_body` | No | cadena | `None` | Contenido que se entrega cuando se utiliza la plantilla |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "Alert",
    "template_description": "Triggered when a monitor detects an anomaly",
    "template_body": "An issue has been detected."
  }' \
  /templates
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_template": 2,
    "id_communication_type": 1,
    "template_name": "Alert",
    "template_description": "Triggered when a monitor detects an anomaly",
    "template_body": "An issue has been detected.",
    "created_at": "2024-01-09T08:21:11Z"
  },
  "context": {},
  "instance": "/templates"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Template could not be created",
  "data": {},
  "context": {
    "errors": [
      "template_name must be unique"
    ]
  },
  "instance": "/templates"
}
```

### Códigos de estado
- `201`: plantilla creada correctamente.
- `400`: la carga útil de la solicitud no es válida.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontraron recursos dependientes.
- `500` — Error interno del servidor.

## Obtener plantilla
Recupera una plantilla por su identificador.

Se requiere un nivel de autorización 7 o inferior para utilizar este punto final.

### Punto final
```
GET /templates/{id_template}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_template` | Sí | entero | Identificador numérico de plantilla |

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
  /templates/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_template": 2,
    "id_communication_type": 1,
    "template_name": "Alert",
    "template_description": "Triggered when a monitor detects an anomaly",
    "template_body": "An issue has been detected.",
    "created_at": "2024-01-09T08:21:11Z"
  },
  "context": {},
  "instance": "/templates/2"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Template not found",
  "data": {},
  "context": {
    "errors": [
      "Template 2 does not exist"
    ]
  },
  "instance": "/templates/2"
}
```

### Códigos de estado
- `200`: plantilla recuperada correctamente.
- `400`: formato de identificador no válido.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontró la plantilla.
- `500` — Error interno del servidor.

## Actualizar plantilla
Actualiza una plantilla con nuevos metadatos o contenido del cuerpo.

Se requiere un nivel de autorización 2 o inferior para utilizar este punto final.

### Punto final
```
PUT /templates/{id_template}
```

### Encabezados| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |
| `Content-Type` | Sí | Debe ser `application/json` | cadena |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_template` | Sí | entero | Identificador numérico de plantilla |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_communication_type` | No | entero | `None` | Nuevo identificador de tipo de comunicación. Ver [Tipos de comunicación](../Types/types.md#communication-types). |
| `template_name` | No | cadena | `None` | Nombre para mostrar actualizado |
| `template_description` | No | cadena | `None` | Breve descripción actualizada |
| `template_body` | No | cadena | `None` | Contenido de plantilla actualizado |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "template_description": "Updated short description"
  }' \
  /templates/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_template": 2,
    "id_communication_type": 1,
    "template_name": "Alert",
    "template_description": "Updated short description",
    "template_body": "An issue has been detected.",
    "created_at": "2024-01-09T08:21:11Z"
  },
  "context": {},
  "instance": "/templates/2"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Template could not be updated",
  "data": {},
  "context": {
    "errors": [
      "No changes were provided"
    ]
  },
  "instance": "/templates/2"
}
```

### Códigos de estado
- `200` — Plantilla actualizada correctamente.
- `400`: la carga útil de la solicitud no es válida.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontró la plantilla.
- `500` — Error interno del servidor.

## Eliminar plantilla
Elimina una plantilla existente.

Se requiere un nivel de autorización 1 o inferior para utilizar este punto final.

### Punto final
```
DELETE /templates/{id_template}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_template` | Sí | entero | Identificador numérico de plantilla |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -X DELETE \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /templates/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": {},
  "context": {},
  "instance": "/templates/2"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Template could not be deleted",
  "data": {},
  "context": {
    "errors": [
      "Template 2 is referenced by an active monitor"
    ]
  },
  "instance": "/templates/2"
}
```

### Códigos de estado
- `200`: plantilla eliminada correctamente.
- `400`: formato de identificador no válido.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontró la plantilla.
- `500` — Error interno del servidor.