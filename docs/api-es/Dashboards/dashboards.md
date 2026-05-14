# Paneles y widgets de panel

Colecciones visuales de paneles y sus instancias de widgets.

## Endpoints
- [Listar paneles](#list-dashboards)
- [Crear panel](#create-dashboard)
- [Obtener panel](#get-dashboard)
- [Actualizar panel](#update-dashboard)
- [Eliminar panel](#delete-dashboard)
- [Listar widgets del panel](#list-dashboard-widgets)
- [Crear widget de panel](#create-dashboard-widget)
- [Obtener widget de panel](#get-dashboard-widget)
- [Actualizar el widget del panel](#update-dashboard-widget)
- [Eliminar el widget del panel](#delete-dashboard-widget)

## Listar paneles de control
Recuperar una lista de paneles. Se requiere nivel de autorización 8. Los usuarios con niveles de autorización 1 o 2 pueden elegir cualquier valor de filtro `archived` (`true`, `false` u omitido). Otras autorizaciones filtran los paneles archivados según la marca proporcionada y, de forma predeterminada, `false` se omite.

### Endpoint
```
GET /dashboards
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
| `archived` | no | booleano | Filtro de archivo. Las autorizaciones 1 y 2 pueden omitir `true` o `false`. Otras autorizaciones tienen por defecto `false` cuando se omiten. |

### Solicitud de muestra
```
curl -H "Authorization: <API_KEY>" -H "Account: 1" /dashboards?skip=0&limit=20
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Dashboards retrieved",
  "data": [
    {
      "id_dashboard": 1,
      "id_parent_dashboard": null,
      "dashboard_name": "Overview"
    }
  ],
  "context": {"query": {"skip": "0", "limit": "20"}},
  "instance": "/dashboards"
}
```

## Crear panel
Crea un nuevo panel. Se requiere autorización de nivel 2.

### Endpoint
```
POST /dashboards
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
| `id_icon` | no | entero | 2462 | Identificador de icono |
| `id_parent_dashboard` | no | entero | nulo | Identificador del panel principal para anidamiento |
| `dashboard_name` | si | cadena | — | Nombre para mostrar (máximo 100 caracteres) |
| `dashboard_description` | no | cadena | No | Descripción |
| `dashboard_color` | no | cadena | No | Código de color hexadecimal (máximo 7 caracteres) |

### Solicitud de muestra
```
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: 1" \
  -H "Content-Type: application/json" \
  -d '{"dashboard_name":"New","id_icon":1}' \
  /dashboards
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_dashboard": 2, "id_parent_dashboard": null, "dashboard_name": "New"},
  "context": {"body": {"dashboard_name": "New", "id_icon": 1}},
  "instance": "/dashboards"
}
```

## Obtener panel
Recupere un único panel por ID. Se requiere nivel de autorización 8.

### Endpoint
```
GET /dashboards/{id_dashboard}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_dashboard}` | Identificador numérico del tablero | entero |

### Solicitud de muestra
```
curl -H "Authorization: <API_KEY>" -H "Account: 1" /dashboards/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_dashboard": 2, "id_parent_dashboard": null, "dashboard_name": "New"},
  "context": {"path": {"id_dashboard": "2"}},
  "instance": "/dashboards/2"
}
```

## Actualizar panel
Actualizar un panel existente. Se requiere nivel de autorización 5.

### Endpoint
```
PUT /dashboards/{id_dashboard}
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
| `{id_dashboard}` | Identificador numérico del tablero | entero |

### Cuerpo de la solicitud
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_icon` | no | entero | No | Identificador de icono |
| `id_parent_dashboard` | no | entero | nulo | Identificador del panel principal para anidamiento (establecido en `null` para eliminarlo) |
| `dashboard_name` | no | cadena | No | Nombre para mostrar (máximo 100 caracteres) |
| `dashboard_description` | no | cadena | No | Descripción |
| `dashboard_color` | no | cadena | No | Código de color hexadecimal |
| `dashboard_archived` | no | booleano | No | Bandera de archivo |

### Solicitud de muestra
```
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: 1" \
  -H "Content-Type: application/json" \
  -d '{"dashboard_description":"Updated"}' \
  /dashboards/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_dashboard": 2, "id_parent_dashboard": null, "dashboard_name": "New"},
  "context": {"body": {"dashboard_description": "Updated"}, "path": {"id_dashboard": "2"}},
  "instance": "/dashboards/2"
}
```

## Eliminar panel
Eliminar un panel existente. Se requiere autorización de nivel 2.

### Endpoint
```
DELETE /dashboards/{id_dashboard}
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_dashboard}` | Identificador numérico del tablero | entero |

### Solicitud de muestra
```
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: 1" /dashboards/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": null,
  "context": {"path": {"id_dashboard": "2"}},
  "instance": "/dashboards/2"
}
```

## Lista de widgets del panel
Enumera los widgets adjuntos a un panel (se omiten los datos de configuración). Se requiere autorización 7 para utilizar este endpoint.

### Endpoint
```
GET /dashboards/{id_dashboard}/widgets
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_dashboard}` | Identificador del panel | entero |

### Solicitud de muestra
```
curl -H "Authorization: <API_KEY>" -H "Account: 1" /dashboards/2/widgets
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_dashboard_widget": 3,
      "id_dashboard": 2,
      "id_widget": 10,
      "widget_width": 6,
      "widget_height": 4,
      "widget_order": 0
    }
  ],
  "context": {"path": {"id_dashboard": "2"}},
  "instance": "/dashboards/2/widgets"
}
```

## Crear widget de panel
Adjunte un widget a un panel. La configuración es opcional porque la API genera los valores predeterminados, incluidos los valores predeterminados del subformulario. Se requiere autorización 6 para utilizar este endpoint.

### Endpoint
```
POST /dashboards/{id_dashboard}/widgets
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
| `{id_dashboard}` | Identificador del panel | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_widget` | si | entero | — | Identificador del catálogo de widgets |
| `widget_width` | no | entero | No | Asignación de ancho |
| `widget_height` | no | entero | No | Asignación de altura |
| `widget_order` | no | entero | 100 | Posición de pedido |
| `config_data` | no | objeto | No | Carga útil de configuración opcional que incluye un objeto `form_data` y subformularios anidados |

Cuando se omite `config_data`, la API crea valores predeterminados para el formulario y al menos una entrada de subformulario para cada entrada anidada.
Los campos no definidos en las entradas del formulario del widget se rechazan con una respuesta `400`.

### Solicitud de muestra
```
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: 1" \
  -H "Content-Type: application/json" \
  -d '{"id_widget":3,"widget_width":6,"widget_height":4,"config_data":{"form_data":{"title":"Line chart","moments":[{"form_data":{"metric":"temperature"}}]}}}' \
  /dashboards/2/widgets
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_dashboard_widget": 3,
    "id_dashboard": 2,
    "id_widget": 3,
    "widget_width": 6,
    "widget_height": 4,
    "widget_order": 0,
    "config_data": {
      "id_form_data": 55,
      "form_data": {
        "title": "Line chart",
        "moments": [
          {
            "id_form_data": 56,
            "form_data": {"metric": "temperature"}
          }
        ]
      }
    }
  },
  "context": {
    "body": {
      "id_widget": 3,
      "widget_width": 6,
      "widget_height": 4
    },
    "path": {"id_dashboard": "2"}
  },
  "instance": "/dashboards/2/widgets"
}
```

## Obtener el widget del panel
Recupera una instancia de widget específica con su configuración. Se requiere autorización 7 para utilizar este endpoint.

### Endpoint
```
GET /dashboards/{id_dashboard}/widgets/{id_dashboard_widget}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_dashboard}` | Identificador del panel | entero |
| `{id_dashboard_widget}` | Identificador del widget del panel | entero |

### Solicitud de muestra
```
curl -H "Authorization: <API_KEY>" -H "Account: 1" /dashboards/2/widgets/3
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_dashboard_widget": 3,
    "id_dashboard": 2,
    "id_widget": 3,
    "widget_width": 6,
    "widget_height": 4,
    "widget_order": 0,
    "config_data": {
      "id_form_data": 55,
      "form_data": {
        "title": "Line chart",
        "moments": [
          {
            "id_form_data": 56,
            "form_data": {"metric": "temperature"}
          }
        ]
      }
    }
  },
  "context": {"path": {"id_dashboard": "2", "id_dashboard_widget": "3"}},
  "instance": "/dashboards/2/widgets/3"
}
```

## Actualizar el widget del panel
Actualice la ubicación o configuración del widget. Cuando se proporciona `config_data`, las claves `form_data` no especificadas conservan sus valores anteriores y las entradas del subformulario se pueden crear, actualizar o eliminar. Se requiere autorización 7 para utilizar este endpoint.

### Endpoint
```
PUT /dashboards/{id_dashboard}/widgets/{id_dashboard_widget}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_dashboard}` | Identificador del panel | entero |
| `{id_dashboard_widget}` | Identificador del widget del panel | entero |

### Cuerpo de la solicitud
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_widget` | no | entero | No | Identificador del catálogo de widgets |
| `widget_width` | no | entero | No | Asignación de ancho |
| `widget_height` | no | entero | No | Asignación de altura |
| `widget_order` | no | entero | No | Posición de pedido |
| `config_data` | no | objeto | No | Carga útil de configuración que contiene `form_data` más subformularios anidados con `id_form_data` para actualizaciones |

Al actualizar subformularios, incluya `id_form_data` para las entradas existentes. Para eliminar un registro de subformulario, envíe la entrada con `"form_data": null`.
Los campos no definidos en las entradas del formulario del widget se rechazan con una respuesta `400`.

### Solicitud de muestra
```
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: 1" \
  -H "Content-Type: application/json" \
  -d '{"config_data": {"form_data": {"title": "Updated title","moments":[{"id_form_data":56,"form_data":{"metric":"temperature"}}]}}}' \
  /dashboards/2/widgets/3
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_dashboard_widget": 3,
    "id_dashboard": 2,
    "id_widget": 3,
    "widget_width": 6,
    "widget_height": 4,
    "widget_order": 0,
    "config_data": {
      "id_form_data": 55,
      "form_data": {
        "title": "Updated title",
        "moments": [
          {
            "id_form_data": 56,
            "form_data": {"metric": "temperature"}
          }
        ]
      }
    }
  },
  "context": {
    "body": {"config_data": {"title": "Updated title"}},
    "path": {"id_dashboard": "2", "id_dashboard_widget": "3"}
  },
  "instance": "/dashboards/2/widgets/3"
}
```

## Eliminar el widget del panel
Eliminar una instancia de widget de un panel. Se requiere autorización 6 para utilizar este endpoint.

### Endpoint
```
DELETE /dashboards/{id_dashboard}/widgets/{id_dashboard_widget}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_dashboard}` | Identificador del panel | entero |
| `{id_dashboard_widget}` | Identificador del widget del panel | entero |

### Solicitud de muestra
```
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: 1" /dashboards/2/widgets/3
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": null,
  "context": {"path": {"id_dashboard": "2", "id_dashboard_widget": "3"}},
  "instance": "/dashboards/2/widgets/3"
}
```