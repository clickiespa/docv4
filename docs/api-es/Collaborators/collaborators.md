# Colaboradores

## Puntos finales
- [Listar colaboradores](#list-collaborators)
- [Crear colaborador](#create-collaborator)
- [conseguir colaborador](#get-collaborator)
- [Colaborador de actualización](#update-collaborator)
- [Eliminar colaborador](#delete-collaborator)
- [Historial de inicio de sesión del colaborador](#collaborator-login-history)

Puntos finales relacionados con la gestión de usuarios dentro de una cuenta.

Colaborador es el nombre de pila de un usuario registrado en la plataforma.
Un colaborador existe en un entorno específico y puede ser [asignado a una cuenta](../Scope/accounts.md#add-collaborator-to-account) para interactuar con él.
Un colaborador asignado a una cuenta puede interactuar con un conjunto definido de recursos según el nivel de autorización del colaborador en la cuenta.

## Listar colaboradores

Recuperar todos los colaboradores vinculados a la cuenta actual.

### Punto final
```
GET /collaborators
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

### Ejemplo de encabezados de solicitud
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" <HOST_NAME>/collaborators
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Collaborators retrieved",
  "data": [{"id_user": 1, "user_email": "john@example.com"}],
  "context": null,
  "instance": "/collaborators"
}
```

 

## Crear colaborador

Crea un nuevo colaborador para la cuenta actual.

### Punto final
```
POST /collaborators
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `user_email` | si | cadena | Dirección de correo electrónico |
| `user_name` | si | cadena | Nombre |
| `user_last_name` | si | cadena | Apellido |
| `id_role` | no | entero | ID de rol |
| `id_language` | no | entero | ID de idioma (ver [Listar idiomas](../Global_resources/languages.md#list-languages)) |
| `id_time_zone` | si | entero | ID de zona horaria (ver [Listar zonas horarias](../Global_resources/time_zones.md#list-time-zones)) |

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"user_email":"new@example.com","user_name":"New","user_last_name":"User","id_time_zone":1}' \
  <HOST_NAME>/collaborators
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_user": 2, "user_email": "new@example.com"},
  "context": null,
  "instance": "/collaborators"
}
```

## Consigue colaborador

Recuperar detalles de un colaborador específico.

### Punto final
```
GET /collaborators/{id_user}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_user}` | Identificador numérico del colaborador | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" <HOST_NAME>/collaborators/<ID_USER>
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_user": 2, "user_email": "new@example.com"},
  "context": null,
  "instance": "/collaborators/<ID_USER>"
}
```

## Actualizar colaborador

Modificar los datos de un colaborador existente.

### Punto final
```
PUT /collaborators/{id_user}
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
| `{id_user}` | Identificador numérico del colaborador | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `user_email` | no | cadena | Dirección de correo electrónico |
| `user_name` | no | cadena | Nombre |
| `user_last_name` | no | cadena | Apellido |
| `id_role` | no | entero | ID de rol |
| `id_language` | no | entero | ID de idioma (ver [Listar idiomas](../Global_resources/languages.md#list-languages)) |
| `id_time_zone` | no | entero | ID de zona horaria (ver [Listar zonas horarias](../Global_resources/time_zones.md#list-time-zones)) |

La actualización del correo electrónico cambia las credenciales de inicio de sesión.

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Updated"}' \
  <HOST_NAME>/collaborators/<ID_USER>
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_user": 2, "user_email": "new@example.com"},
  "context": null,
  "instance": "/collaborators/<ID_USER>"
}
```

## Eliminar colaborador

Eliminar un colaborador de la cuenta corriente.

### Punto final
```
DELETE /collaborators/{id_user}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_user}` | Identificador numérico del colaborador | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" <HOST_NAME>/collaborators/<ID_USER>
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/collaborators/<ID_USER>"
}
```

## Historial de inicio de sesión del colaborador

Recuperar eventos de autenticación para un colaborador.

### Punto final
```
GET /collaborators/{id_user}/login_history
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_user}` | Identificador numérico del colaborador | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" <HOST_NAME>/collaborators/<ID_USER>/login_history
```

### Respuesta de muestra
```json
[
  {"event": "SignIn", "timestamp": "2023-09-01T00:00:00Z"}
]
```