# Monitores

## Puntos finales
- [Listar monitores](#list-monitors)
- [Crear monitor](#create-monitor)
- [Obtener monitor](#get-monitor)
- [Monitor de actualización](#update-monitor)
- [Eliminar monitor](#delete-monitor)
- [Monitorear desencadenantes](#monitor-triggers)
- [Monitorear plantillas](#monitor-templates)
- [Monitorear reglas](#monitor-rules)
- [Monitorear el historial](#monitor-history)

Un monitor observa una o más métricas con una determinada frecuencia, compara valores con límites o rangos configurados por reglas y detecta aquellos valores que cumplen con las reglas. El seguimiento se puede definir como un estado que cambia según el estado de sus reglas. Cada monitor existe sólo dentro de una cuenta específica.

## Listar monitores

Recupere los monitores configurados para la cuenta actual.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.

### Punto final
```
GET /monitors
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

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors?skip=0&limit=100
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Monitors retrieved",
  "data": [{"id_monitor": 1, "monitor_name": "Temperature Monitor"}],
  "context": null,
  "instance": "/monitors"
}
```

## Crear monitor

Cree un nuevo monitor para observar las métricas dentro de la cuenta.

Se requiere un nivel de autorización 5 o cualquier autorización inferior para utilizar este punto final.

### Punto final
```
POST /monitors
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
| `monitor_name` | si | cadena | No | Nombre para mostrar |
| `id_monitor_type` | no | entero | 6 | Tipo de monitor. Los valores disponibles se pueden recuperar con [OBTENER /tipos/monitores](../Types/types.md#monitor-types) |
| `id_monitor_status` | no | entero | 1 | Valor de identificación del estado que se comunicará. Los identificadores de estado disponibles se pueden recuperar mediante el punto final [OBTENER /tipos/monitor_statuses](../Types/types.md#monitor-statuses) |
| `monitor_description` | no | cadena | nulo | Descripción |
| `monitor_sampling_window` | no | entero | 15 | Minutos para promediar |
| `monitor_sampling_frequency` | no | entero | 15 | Consultar frecuencia |

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"monitor_name":"Temp","id_monitor_type":1,"id_monitor_status":1}' \
  /monitors
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_monitor": 2, "monitor_name": "Temp"},
  "context": null,
  "instance": "/monitors"
}
```

## Obtener monitor

Recuperar los detalles de un monitor específico.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.

### Punto final
```
GET /monitors/{id_monitor}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_monitor": 2, "monitor_name": "Temp"},
  "context": null,
  "instance": "/monitors/2"
}
```

## Actualizar monitor

Actualice la configuración de un monitor existente.

Se requiere un nivel de autorización 6 o cualquier autorización inferior para utilizar este punto final.

### Punto final
```
PUT /monitors/{id_monitor}
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
| `{id_monitor}` | Monitorear identificador numérico | entero |

### Cuerpo de la solicitud| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_monitor_type` | no | entero | nulo | Tipo de monitor. Los valores disponibles se pueden recuperar con [OBTENER /tipos/monitores](../Types/types.md#monitor-types) |
| `id_monitor_status` | no | entero | nulo | Valor de identificación del estado que se comunicará. Los identificadores de estado disponibles se pueden recuperar mediante el punto final [OBTENER /tipos/monitor_statuses](../Types/types.md#monitor-statuses) |
| `monitor_name` | no | cadena | nulo | Nombre para mostrar |
| `monitor_description` | no | cadena | nulo | Descripción |
| `monitor_sampling_window` | no | entero | nulo | Minutos para promediar |
| `monitor_sampling_frequency` | no | entero | nulo | Consultar frecuencia |

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"monitor_name":"Updated"}' \
  /monitors/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_monitor": 2, "monitor_name": "Updated"},
  "context": null,
  "instance": "/monitors/2"
}
```

## Eliminar monitor

Elimine un monitor que ya no sea necesario.

Se requiere un nivel de autorización 5 o cualquier autorización inferior para utilizar este punto final.

### Punto final
```
DELETE /monitors/{id_monitor}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/monitors/2"
}
```

## Monitorear desencadenantes

Los desencadenantes del monitor definen cómo reacciona un monitor cuando una de sus reglas cambia de estado. Por lo general, envían comunicaciones, ejecutan integraciones o programan acciones de seguimiento según el tipo de activador configurado.

### Sobre de respuesta
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/endpoint/path"
}
```

### Lista de activadores

Recupere los activadores configurados en un monitor específico.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.


### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Punto final
```
GET /monitors/{id_monitor}/triggers
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/1/triggers?skip=0&limit=100
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Monitor triggers retrieved",
  "data": [
    {
      "id_monitor_trigger": 2,
      "id_trigger_type": 1,
      "time_pattern": "08,18|1,5|*|*",
      "trigger_observations": "Notify when the monitor changes to warning or critical status.",
      "trigger_on": "2,3",
      "trigger_enabled": true,
      "trigger_parameters": {
        "id_users": [
          "2045"
        ],
        "notif_title": "Temperature alert",
        "notif_preview": "Sensor A exceeded threshold",
        "notif_content": "The temperature has exceeded the configured threshold for over 10 minutes.",
        "notif_template": "1"
      }
    }
  ],
  "context": null,
  "instance": "/monitors/1/triggers"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Códigos de estado
- `200`: los activadores del monitor se recuperaron correctamente.
- `400` — Parámetros de paginación no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: disparador o monitor no encontrado.
- `500` — Error interno del servidor.

### Respuestas de error

| Estado | Descripción |
| --- | --- |
| `404` | Se devuelve cuando un disparador hace referencia a un patrón de tiempo que se eliminó. Actualice el programa de activación o vuelva a crearlo con un patrón válido. |

```json
{
  "status": "error",
  "message": "Monitor trigger references a missing time pattern. Update the trigger to point to a valid pattern (id_time_pattern=99).",
  "data": null,
  "context": {
    "path": {
      "id_monitor": "1"
    }
  },
  "instance": "/monitors/1/triggers"
}
```

### Obtener disparador

Obtenga detalles para un único activador que pertenece al monitor seleccionado.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.


### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Punto final
```
GET /monitors/{id_monitor}/triggers/{id_monitor_trigger}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |
| `{id_monitor_trigger}` | Identificador numérico de activación | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/1/triggers/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_monitor_trigger": 2,
    "id_trigger_type": 1,
    "time_pattern": "08,18|1,5|*|*",
    "trigger_observations": "Notify when the monitor changes to warning or critical status.",
    "trigger_on": "2,3",
    "trigger_enabled": true,
    "trigger_parameters": {
      "id_users": [
        "2045"
      ],
      "notif_title": "Temperature alert",
      "notif_preview": "Sensor A exceeded threshold",
      "notif_content": "The temperature has exceeded the configured threshold for over 10 minutes.",
      "notif_template": "1"
    }
  },
  "context": null,
  "instance": "/monitors/1/triggers/2"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Element not found",
  "data": null,
  "context": {
    "path": {
      "id_monitor": "1",
      "id_monitor_trigger": "999"
    }
  },
  "instance": "/monitors/1/triggers/999"
}
```### Códigos de estado
- `200`: activador recuperado correctamente.
- `400`: parámetros de ruta no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — Activador no encontrado.
- `500` — Error interno del servidor.

### Crear disparador

Cree un nuevo activador para que el monitor entregue notificaciones o automatice acciones de seguimiento.

Se requiere un nivel de autorización 5 o cualquier autorización inferior para utilizar este punto final.


### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Punto final
```
POST /monitors/{id_monitor}/triggers
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
| `{id_monitor}` | Monitorear identificador numérico | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_trigger_type` | si | entero | No | Identificador del tipo de disparador. Los valores disponibles se pueden recuperar con [OBTENER /tipos/monitor_triggers](../Types/types.md#monitor-trigger-types) |
| `time_pattern` | no | cadena | nulo | Patrón de tiempo para la ejecución programada. Utilice `{hours}|{dayweek}|{daymonth}|{months}` donde cada segmento acepta `*`, un valor único o valores separados por comas dentro de los rangos horas `00-59`, día semana `1-7`, díames `1-31`, meses `1-12`. Ejemplo: `00,12|1,3|*|*` funciona a las 00:00 y 12:00 los lunes y miércoles. |
| `trigger_observations` | no | cadena | nulo | Observaciones desencadenantes |
| `trigger_on` | no | cadena | '1,3' | Valores de identificación del estado que se comunicará. Los ID de estado disponibles se pueden recuperar mediante el punto final [OBTENER /tipos/monitor_statuses](../Types/types.md#monitor-statuses) |
| `trigger_enabled` | no | booleano | verdadero | Si el disparador está habilitado |
| `trigger_parameters` | no | objeto | nulo | Configuración adicional para el disparador. Consulte [Parámetros de activación](#trigger-parameters) para conocer las claves admitidas. `id_users` debe ser una matriz de cadenas. |

### Parámetros de activación

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_users` | no | matriz[cadena] | nulo | Lista de identificadores de usuarios que reciben la notificación. Se rechazan las cadenas separadas por comas como `"4,7"`. |
| `notif_title` | no | cadena | nulo | Título de la notificación que se muestra en las bandejas de entrada de los destinatarios. |
| `notif_preview` | no | cadena | nulo | Texto breve de vista previa de la notificación. |
| `notif_content` | no | cadena | nulo | Contenido de notificación completo entregado a los destinatarios. |
| `notif_template` | no | cadena | 1 | Identificador de plantilla de notificación para copia predefinida. |

### Formato de patrón de tiempo

El atributo `time_pattern` describe cuándo debe ejecutarse el disparador. Divida la cadena en cuatro secciones usando el formato `{hours}|{dayweek}|{daymonth}|{months}`:

1. `hours`: valores de `00` a `59`. Escriba `*` para ejecutar cada minuto o `00,12` para ejecutar a las 00:00 y 12:00.
2. `dayweek`: valores desde `1` (lunes) hasta `7` (domingo). Utilice valores separados por comas cuando el activador se ejecute en varios días.
3. `daymonth`: valores de `1` a `31`. Utilice `*` para ejecutar todos los días del mes.
4. `months`: valores desde `1` (enero) hasta `12` (diciembre).

Mantenga cada sección libre de espacios y valores de hora de relleno cero para que el sistema pueda almacenar y devolver el patrón sin errores de validación.

### Cuerpo de solicitud de muestra
```json
{
  "id_trigger_type": 1,
  "trigger_on": "2,3",
  "trigger_enabled": true,
  "trigger_parameters": {
    "id_users": [
      "2045"
    ],
    "notif_title": "Temperature alert",
    "notif_preview": "Sensor A exceeded threshold",
    "notif_content": "The temperature has exceeded the configured threshold for over 10 minutes.",
    "notif_template": "1"
  }
}
```

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_trigger_type":1,"trigger_on":"2,3","trigger_enabled":true,"trigger_parameters":{"id_users":["2045"],"notif_title":"Temperature alert","notif_preview":"Sensor A exceeded threshold","notif_content":"The temperature has exceeded the configured threshold for over 10 minutes.","notif_template":"1"}}' \
  /monitors/1/triggers
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_monitor_trigger": 3},
  "context": null,
  "instance": "/monitors/1/triggers/3"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Invalid trigger payload",
  "data": null,
  "context": {
    "body": {
      "trigger_on": "1,8"
    }
  },
  "instance": "/monitors/1/triggers"
}
```### Códigos de estado
- `201`: activador creado correctamente.
- `400`: carga útil o parámetros de activación no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: monitor, tipo de activador o patrón de tiempo no encontrado.
- `500` — Error interno del servidor.

### Activador de actualización

Actualice la configuración de un activador existente.

Se requiere un nivel de autorización 6 o cualquier autorización inferior para utilizar este punto final.


### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Punto final
```
PUT /monitors/{id_monitor}/triggers/{id_monitor_trigger}
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
| `{id_monitor}` | Monitorear identificador numérico | entero |
| `{id_monitor_trigger}` | Identificador numérico de activación | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_trigger_type` | no | entero | nulo | Identificador del tipo de disparador. Los valores disponibles se pueden recuperar con [OBTENER /tipos/monitor_triggers](../Types/types.md#monitor-trigger-types) |
| `time_pattern` | no | cadena | nulo | Patrón de tiempo para la ejecución programada. Utilice `{hours}|{dayweek}|{daymonth}|{months}` donde cada segmento acepta `*`, un valor único o valores separados por comas dentro de los rangos horas `00-59`, día semana `1-7`, díames `1-31`, meses `1-12`. Ejemplo: `0,12|1,3|*|*` se ejecuta a las 00:00 y 12:00 los lunes y miércoles. |
| `trigger_observations` | no | cadena | nulo | Observaciones desencadenantes |
| `trigger_on` | no | cadena | nulo | Códigos de eventos separados por comas |
| `trigger_enabled` | no | booleano | nulo | Si el disparador está habilitado |
| `trigger_parameters` | no | objeto | nulo | Configuración adicional para el disparador. Consulte [Parámetros de activación](#trigger-parameters) para conocer las claves admitidas. `id_users` debe ser una matriz de cadenas. |

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_trigger_type":1,"trigger_on":"2,3","trigger_enabled":true,"trigger_parameters":{"id_users":["2045"],"notif_title":"Temperature alert","notif_preview":"Sensor A exceeded threshold","notif_content":"The temperature has exceeded the configured threshold for over 10 minutes.","notif_template":"1"}}' \
  /monitors/1/triggers/3
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_monitor_trigger": 3},
  "context": null,
  "instance": "/monitors/1/triggers/3"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Element not found",
  "data": null,
  "context": {
    "path": {
      "id_monitor": "1",
      "id_monitor_trigger": "999"
    }
  },
  "instance": "/monitors/1/triggers/999"
}
```

### Códigos de estado
- `200`: el activador se actualizó correctamente.
- `400`: carga útil o parámetros de activación no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — Activador no encontrado.
- `500` — Error interno del servidor.

### Eliminar disparador

Elimine un disparador para que ya no se ejecute en el monitor.

Se requiere un nivel de autorización 5 o cualquier autorización inferior para utilizar este punto final.


### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Punto final
```
DELETE /monitors/{id_monitor}/triggers/{id_monitor_trigger}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |
| `{id_monitor_trigger}` | Identificador numérico de activación | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/1/triggers/3
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/monitors/1/triggers/3"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Element not found",
  "data": null,
  "context": {
    "path": {
      "id_monitor": "1",
      "id_monitor_trigger": "999"
    }
  },
  "instance": "/monitors/1/triggers/999"
}
```

### Códigos de estado
- `200`: el activador se eliminó correctamente.
- `400`: parámetros de ruta no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — Activador no encontrado.
- `500` — Error interno del servidor.

## Plantillas de monitor

Las plantillas de monitor proporcionan una copia predefinida que se puede reutilizar al configurar las notificaciones del monitor.

Se requiere un nivel de autorización 2 o cualquier autorización inferior para utilizar este punto final.


### Punto final
```
GET /monitor_templates
```

### Encabezados| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitor_templates?skip=0&limit=100
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Monitor templates retrieved",
  "data": [
    {
      "id_monitor_template": 1,
      "template_name": "Default notification template",
      "template_description": "Standard notification copy for monitor alerts."
    }
  ],
  "context": null,
  "instance": "/monitor_templates"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Códigos de estado
- `200`: plantillas de monitor recuperadas correctamente.
- `400` — Parámetros de paginación no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — No se encontraron plantillas.
- `500` — Error interno del servidor.

### Respuestas de error
```json
{
  "status": "error",
  "message": "Monitor templates not available",
  "data": [],
  "context": {
    "errors": [
      "No templates were found for the requested account"
    ]
  },
  "instance": "/monitor_templates"
}
```

## Monitorear reglas

Las reglas de monitor evalúan los datos de métricas entrantes y determinan el estado del monitor. Cada regla apunta a una métrica, compara valores con umbrales y emite un estado que puede desencadenar acciones posteriores.

### Listar reglas

Recupera las reglas configuradas en el monitor seleccionado.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.

#### Punto final
```
GET /monitors/{id_monitor}/rules
```

#### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

#### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |

#### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |

#### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/1/rules?skip=0&limit=100
```

#### Ejemplo de respuesta
```json
{
  "status": "success",
  "message": "Monitor rules retrieved",
  "data": [],
  "context": null,
  "instance": "/monitors/1/rules"
}
```

### Obtener regla

Obtenga la configuración de una regla de monitor único.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.

#### Punto final
```
GET /monitors/{id_monitor}/rules/{id_monitor_rule}
```

#### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

#### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |
| `{id_monitor_rule}` | Identificador numérico de regla | entero |

#### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/1/rules/2
```

#### Ejemplo de respuesta
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_monitor_rule": 2},
  "context": null,
  "instance": "/monitors/1/rules/2"
}
```

### Crear regla

Cree una nueva regla para evaluar los datos de métricas para el monitor.

Se requiere un nivel de autorización 5 o cualquier autorización inferior para utilizar este punto final.

#### Punto final
```
POST /monitors/{id_monitor}/rules
```

#### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

#### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |

#### Cuerpo de la solicitud| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_metric` | si | entero | No | Identificador de métrica |
| `id_monitor_status` | no | entero | 1 | Valor de identificación del estado que se comunicará. Los identificadores de estado disponibles se pueden recuperar mediante el punto final [OBTENER /tipos/monitor_statuses](../Types/types.md#monitor-statuses) |
| `rule_name` | si | cadena | No | Nombre de la regla |
| `rule_description` | no | cadena | nulo | Descripción |
| `rule_method` | si | entero | No | Método para detectar valores que cumplen la regla. Identificadores válidos: `1` mayor que, `2` menor que, `3` dentro del rango, `4` fuera del rango |
| `rule_lower_limit` | no | número | nulo | Límite inferior |
| `rule_upper_limit` | no | número | nulo | Límite superior |
| `rule_threshold` | no | entero | 100 | Valor umbral |

#### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_metric":1,"rule_name":"High value","rule_method":1,"id_monitor_status":1,"rule_threshold":100}' \
  /monitors/1/rules
```

#### Ejemplo de respuesta
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_monitor_rule": 3},
  "context": null,
  "instance": "/monitors/1/rules/3"
}
```

### Actualizar regla

Actualice una regla de supervisión existente para ajustar umbrales o asignaciones de estado.

Se requiere un nivel de autorización 6 o cualquier autorización inferior para utilizar este punto final.

#### Punto final
```
PUT /monitors/{id_monitor}/rules/{id_monitor_rule}
```

#### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

#### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |
| `{id_monitor_rule}` | Identificador numérico de regla | entero |

#### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_metric` | no | entero | nulo | Identificador de métrica |
| `id_monitor_status` | no | entero | nulo | Valor de identificación del estado que se comunicará. Los identificadores de estado disponibles se pueden recuperar mediante el punto final [OBTENER /tipos/monitor_statuses](../Types/types.md#monitor-statuses) |
| `rule_name` | no | cadena | nulo | Nombre de la regla |
| `rule_description` | no | cadena | nulo | Descripción |
| `rule_method` | no | entero | nulo | Método para detectar valores que cumplen la regla. Identificadores válidos: `1` mayor que, `2` menor que, `3` dentro del rango, `4` fuera del rango |
| `rule_lower_limit` | no | número | nulo | Límite inferior |
| `rule_upper_limit` | no | número | nulo | Límite superior |
| `rule_threshold` | no | entero | nulo | Valor umbral |
| `rule_enabled` | no | booleano | nulo | Si la regla está habilitada |

#### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"rule_enabled":true}' \
  /monitors/1/rules/3
```

#### Ejemplo de respuesta
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_monitor_rule": 3},
  "context": null,
  "instance": "/monitors/1/rules/3"
}
```

### Eliminar regla

Elimine una regla para que ya no afecte el estado del monitor.

Se requiere un nivel de autorización 5 o cualquier autorización inferior para utilizar este punto final.

#### Punto final
```
DELETE /monitors/{id_monitor}/rules/{id_monitor_rule}
```

#### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

#### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |
| `{id_monitor_rule}` | Identificador numérico de regla | entero |

#### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /monitors/1/rules/3
```

#### Ejemplo de respuesta
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/monitors/1/rules/3"
}
```

## Monitorear el historial

Recuperar los cambios de estado históricos de un monitor.

Se requiere un nivel de autorización 7 o cualquier autorización inferior para utilizar este punto final.

Las entradas del historial del monitor son de sólo lectura; no se pueden crear, actualizar ni eliminar a través de la API.

Si no se proporcionan marcas de tiempo, la API devuelve los últimos siete días de actividad de forma predeterminada. Cuando `from_timestamp` es mayor que `to_timestamp`, el servicio los intercambia automáticamente para crear un rango válido.

### Punto final
```
GET /monitors/{id_monitor}/history
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_monitor}` | Monitorear identificador numérico | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `from_timestamp` | no | entero | Inicio inclusivo del rango en segundos UNIX. El valor predeterminado es 7 días antes de la hora actual cuando se omite. |
| `to_timestamp` | no | entero | Fin de rango inclusivo en segundos UNIX. El valor predeterminado es la hora actual cuando se omite. |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /monitors/1/history?from_timestamp=1713312000&to_timestamp=1713916800
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Monitor history retrieved",
  "data": {
    "id_monitor": 1,
    "from_timestamp": 1713312000,
    "to_timestamp": 1713916800,
    "history": [
      {
        "history_timestamp": 1713400000,
        "history_event": "status change"
      }
    ]
  },
  "context": null,
  "instance": "/monitors/1/history"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Monitorear el historial recuperado exitosamente. |
| `400` | Se proporcionó un formato de marca de tiempo no válido. |
| `401` | Encabezados de autenticación faltantes o no válidos. |
| `403` | El usuario autenticado carece de la autorización requerida. |
| `404` | Monitor no encontrado para el identificador proporcionado. |
| `500` | Error inesperado al recuperar el historial del monitor. |