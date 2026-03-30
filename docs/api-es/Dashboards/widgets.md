# Aparatos

Endpoints del catálogo para widgets reutilizables. Estos endpoints están expuestos bajo la etiqueta `dashboards` y administran solo el catálogo de widgets, no las instancias de widgets del panel.

## Endpoints
- [Lista de widgets](#list-widgets)
- [Crear widget](#create-widget)
- [Obtener widget](#get-widget)
- [Actualizar widget](#update-widget)
- [Eliminar widget](#delete-widget)

## Lista de widgets
Recuperar entradas del catálogo de widgets. Se requiere nivel de autorización 7.

### Endpoint
```
GET /widgets
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación. Predeterminado: 0 |
| `limit` | no | entero | Tamaño de página. Predeterminado: 100 |
| `archived` | no | booleano | Filtrar widgets archivados. Predeterminado: `false` |

### Solicitud de muestra
```
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /widgets?skip=0&limit=20
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Widgets retrieved",
  "data": [
    {
      "id_widget": 1,
      "id_widget_type": 2,
      "id_form": 3,
      "widget_name": "Chart",
      "widget_code": null,
      "widget_description": "Line chart",
      "widget_tags": "metrics,lines",
      "widget_order": 10,
      "widget_archived": false
    }
  ],
  "context": {"query": {"skip": "0", "limit": "20"}},
  "instance": "/widgets"
}
```

## Crear widget
Cree una entrada de catálogo de widgets. Se requiere autorización de nivel 1.

### Endpoint
```
POST /widgets
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
| `id_widget_type` | si | entero | — | Identificador de tipo de widget |
| `widget_name` | si | cadena | — | Nombre para mostrar del widget |
| `id_form` | no | entero | nulo | Formulario opcional utilizado para inicializar la configuración del widget del panel |
| `widget_code` | no | cadena | nulo | Código interno opcional |
| `widget_description` | no | cadena | nulo | Descripción del widget |
| `widget_tags` | no | cadena | nulo | Etiquetas separadas por comas |
| `widget_order` | no | entero | 100 | Consejo de pedido |
| `widget_archived` | no | booleano | falso | Bandera de archivo |

### Solicitud de muestra
```
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_widget_type":2,"widget_name":"Chart","widget_order":1}' \
  /widgets
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_widget": 5,
    "id_widget_type": 2,
    "id_form": null,
    "widget_name": "Chart",
    "widget_code": null,
    "widget_description": null,
    "widget_tags": null,
    "widget_order": 1,
    "widget_archived": false
  },
  "context": {
    "body": {
      "id_widget_type": 2,
      "widget_name": "Chart",
      "widget_order": 1
    }
  },
  "instance": "/widgets"
}
```

## Obtener widget
Recuperar un widget por ID. Se requiere nivel de autorización 7.

### Endpoint
```
GET /widgets/{id_widget}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_widget` | si | entero | Identificador de widget |

### Solicitud de muestra
```
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /widgets/5
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_widget": 5,
    "id_widget_type": 2,
    "id_form": null,
    "widget_name": "Chart",
    "widget_code": null,
    "widget_description": null,
    "widget_tags": null,
    "widget_order": 1,
    "widget_archived": false
  },
  "context": {"path": {"id_widget": 5}},
  "instance": "/widgets/5"
}
```

## Actualizar widget
Actualizar un widget existente. Se requiere autorización de nivel 2.

### Endpoint
```
PUT /widgets/{id_widget}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_widget` | si | entero | Identificador de widget |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_widget_type` | no | entero | No | Identificador de tipo de widget |
| `widget_name` | no | cadena | No | Nombre para mostrar del widget |
| `id_form` | no | entero | No | Formulario opcional utilizado para inicializar la configuración del widget del panel |
| `widget_code` | no | cadena | No | Código interno opcional |
| `widget_description` | no | cadena | No | Descripción del widget |
| `widget_tags` | no | cadena | No | Etiquetas separadas por comas |
| `widget_order` | no | entero | No | Consejo de pedido |
| `widget_archived` | no | booleano | No | Bandera de archivo |

### Solicitud de muestra
```
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"widget_name":"Updated chart","widget_archived":false}' \
  /widgets/5
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_widget": 5,
    "id_widget_type": 2,
    "id_form": null,
    "widget_name": "Updated chart",
    "widget_code": null,
    "widget_description": null,
    "widget_tags": null,
    "widget_order": 1,
    "widget_archived": false
  },
  "context": {
    "path": {"id_widget": 5},
    "body": {"widget_name": "Updated chart", "widget_archived": false}
  },
  "instance": "/widgets/5"
}
```

## Eliminar widget
Eliminar un widget. Se requiere autorización de nivel 1. Los widgets archivados no se pueden modificar.

### Endpoint
```
DELETE /widgets/{id_widget}
```

### Encabezados| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_widget` | si | entero | Identificador de widget |

### Solicitud de muestra
```
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /widgets/5
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": {"path": {"id_widget": 5}},
  "instance": "/widgets/5"
}
```