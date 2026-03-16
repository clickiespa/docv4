# Empezando

Esta guía presenta los conceptos básicos de Clickie API v4.

## Anfitrión

```
https://api.clickie.io/v4/
```

Utilice esta URL base con las rutas relativas que se muestran en toda la documentación.
Todos los ejemplos de `curl` omiten el host, así que anteponga esta base a cada ruta.

## Métodos HTTP

| Método | Descripción |
| --- | --- |
| `GET` | Recupera recursos |
| `POST` | Crea recursos |
| `PUT` | Actualizaciones de recursos |
| `DELETE` | Elimina recursos |

## Autenticación

### Encabezado de autorización

Utilice una clave API en el encabezado `Authorization`. Las claves se pueden generar desde su perfil: https://my.clickie.io/profile/api-keys

### Encabezado de cuenta

La mayoría de los puntos finales, incluido el punto final `/accounts`, requieren un encabezado `Account` con el ID de la cuenta en la que desea operar. Si no conoce el ID de su cuenta, puede encontrarlo en la aplicación web de Clickie: https://my.clickie.io/home.

Una vez que conozca su ID de cuenta, puede enumerar sus cuentas usando:

```
GET /accounts
```

### Cómo se aplica el alcance de la cuenta en la creación

El autorizador de API Gateway inyecta el valor del encabezado `Account` en la sesión (`id_account`) y la capa de acceso a datos asigna automáticamente ese `id_account` a nuevos registros que incluyen un campo `id_account`. Si una carga útil proporciona explícitamente un `id_account`, se utiliza en su lugar. Esta configuración predeterminada solo se aplica a modelos distintos de `Account` y `UserAccount`.

### Clave API

Las claves API autentican a un colaborador y definen permisos.

## Encabezados comunes

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| Autorización | si | Clave API generada desde su perfil | cadena |
| Cuenta | si | ID de cuenta de destino | entero |

## Formatear una solicitud

### Parámetros de ruta

Los identificadores de recursos aparecen en el URI cuando se solicita un registro específico.

```
GET /monitors/{id_monitor}/triggers
```

### Cuerpo de la solicitud

Las solicitudes `POST` y `PUT` utilizan cargas útiles JSON.

```
POST /uoms
```

```json
{
  "id_aggregation": 1,
  "id_interpolation": 1,
  "uom_name": "string",
  "uom_description": "string",
  "uom_unit": "string"
}
```

## Respuestas

Las respuestas siguen una estructura JSON común:

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/endpoint/path"
}
```

### Códigos de estado

| Código | Descripción |
| --- | --- |
| `200` | Éxito |
| `201` | Creado |
| `400` | Mala solicitud |
| `401` | No autorizado |
| `403` | Prohibido |
| `404` | No encontrado |
| `500` | Error interno del servidor |

### Solicitud exitosa

| Método | Respuesta |
| --- | --- |
| `GET` | Devuelve datos de recursos |
| `POST` | Devuelve el objeto creado |
| `PUT` | Devuelve objeto actualizado |
| `DELETE` | Confirmación de eliminación de devoluciones |

## Herramientas API

### Punto final de Documentos

La documentación interactiva está disponible en:

```
/docs
```

Para usarlo, sigue los siguientes pasos:

1. Haga clic en [aquí](https://api.clickie.io/v4/docs#).
2. Haga clic en el botón Autorizar en la parte superior derecha de la página y agregue manualmente los encabezados Cuenta y Autorización.
3. Haga clic en el punto final que desea utilizar, complete los campos obligatorios y haga clic en el botón "Pruébelo" para realizar la solicitud.
4. La respuesta del servidor se mostrará a continuación.