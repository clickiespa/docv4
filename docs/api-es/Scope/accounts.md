# Cuentas

## Endpoints
- [Listar cuentas](#list-accounts)
- [Crear una cuenta](#create-account)
- [Obtener cuenta](#get-account)
- [Actualizar cuenta](#update-account)
- [Eliminar cuenta](#delete-account)
- [Agregar colaborador a la cuenta](#add-collaborator-to-account)
- [Actualizar colaborador en cuenta](#update-collaborator-in-account)
- [Eliminar colaborador de la cuenta](#remove-collaborator-from-account)

Una cuenta es la entidad que representa su negocio. Si estás asignado a una cuenta, podrás acceder a información global sobre el estado y procesos de tu negocio.

Una cuenta puede poseer unidades de usuario, métricas, monitores, activos y paneles.

## Listar cuentas

Se requiere un nivel de autorización 5 o inferior para listar cuentas.
Los usuarios con nivel de autorización 1 no están restringidos a la cuenta actual y pueden recuperar todas las cuentas del entorno.

### Endpoint
```
GET /accounts
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Número de registros a omitir |
| `limit` | no | entero | Registros máximos para devolver |
| `archived` | no | booleano | Incluir cuentas archivadas |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /accounts?skip=0&limit=10&archived=false
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Accounts retrieved",
  "data": [
    {
      "id_account": 1,
      "id_environment": 2,
      "account_name": "Main",
      "ids_time_zone": "11,2,4",
      "environment": {
        "id_environment": 2,
        "environment_name": "Production",
        "environment_description": "Primary tenant environment"
      }
    }
  ],
  "context": null,
  "instance": "/accounts"
}
```

## Crear cuenta

Se requiere un nivel de autorización 3 o inferior para crear una cuenta.
Se requiere autorización A1 para configurar `id_environment` al crear una cuenta.

### Endpoint
```
POST /accounts
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_environment` | no | entero | nulo | ID de entorno para asignar la cuenta (solo autorización A1) |
| `id_file_picture` | no | entero | nulo | ID de archivo de imagen |
| `account_name` | si | cadena | No | Nombre para mostrar |
| `account_description` | no | cadena | nulo | Descripción opcional |
| `ids_time_zone` | si | cadena | No | ID de zona horaria separados por comas |

### Solicitud de muestra
```bash
curl -X POST   -H "Authorization: <API_KEY>"   -H "Account: <ID_ACCOUNT>"   -H "Content-Type: application/json"   -d '{"id_environment":2,"id_file_picture":1,"account_name":"Main","account_description":"Sample","ids_time_zone":"11,2,4"}'   /accounts
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_account": 2,
    "id_environment": 2,
    "account_name": "Main",
    "ids_time_zone": "11,2,4",
    "environment": {
      "id_environment": 2,
      "environment_name": "Production",
      "environment_description": "Primary tenant environment"
    }
  },
  "context": null,
  "instance": "/accounts"
}
```

## Obtener cuenta

Se requiere un nivel de autorización 5 o inferior para obtener una cuenta por ID.
Los usuarios con nivel de autorización 1 pueden recuperar cualquier cuenta, incluso si no está vinculada al encabezado de cuenta que están utilizando.

### Endpoint
```
GET /accounts/{id_account}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_account}` | Identificador numérico de cuenta | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /accounts/1
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_account": 1,
    "id_environment": 2,
    "account_name": "Main",
    "ids_time_zone": "11,2,4",
    "environment": {
      "id_environment": 2,
      "environment_name": "Production",
      "environment_description": "Primary tenant environment"
    }
  },
  "context": null,
  "instance": "/accounts/1"
}
```

## Actualizar cuenta

Se requiere un nivel de autorización 4 o inferior para actualizar una cuenta.
Se requiere autorización A1 para configurar `id_environment` al actualizar una cuenta.

### Endpoint
```
PUT /accounts/{id_account}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_account}` | Identificador numérico de cuenta | entero |### Cuerpo de la solicitud
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_environment` | no | entero | nulo | Nuevo ID de entorno (solo autorización A1) |
| `id_file_picture` | no | entero | nulo | ID de archivo de imagen |
| `account_name` | no | cadena | nulo | Nombre para mostrar |
| `account_description` | no | cadena | nulo | Descripción opcional |
| `ids_time_zone` | no | cadena | nulo | ID de zona horaria separados por comas |
| `account_archived` | no | booleano | nulo | Bandera de archivo |

### Solicitud de muestra
```bash
curl -X PUT   -H "Authorization: <API_KEY>"   -H "Account: <ID_ACCOUNT>"   -H "Content-Type: application/json"   -d '{"id_environment":2,"id_file_picture":1,"account_name":"Main","account_description":"Updated","ids_time_zone":"1,2,3","account_archived":false}'   /accounts/1
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_account": 1,
    "id_environment": 2,
    "account_name": "Main",
    "ids_time_zone": "1,2,3",
    "environment": {
      "id_environment": 2,
      "environment_name": "Production",
      "environment_description": "Primary tenant environment"
    }
  },
  "context": null,
  "instance": "/accounts/1"
}
```

## Eliminar cuenta

Se requiere un nivel de autorización 3 o inferior para eliminar una cuenta.

### Endpoint
```
DELETE /accounts/{id_account}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_account}` | Identificador numérico de cuenta | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /accounts/1
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/accounts/1"
}
```

Los endpoints `/accounts/collaborators` administran los colaboradores asignados directamente a una cuenta. Si necesita una vista agregada de cada colaborador de una cuenta, consulte [`/collaborators` endpoints](../Collaborators/collaborators.md). Para recuperar colaboradores vinculados a un activo específico, utilice el [`/relationships` endpoints](relationships.md) documentado para ese recurso.

## Agregar colaborador a la cuenta

Se requiere un nivel de autorización 4 o inferior para agregar colaboradores a una cuenta.

El usuario solicitante ya debe ser colaborador de la cuenta de destino, a menos que el nivel de autorización de la sesión sea `1`, en cuyo caso la persona que llama puede administrar colaboradores para cualquier cuenta. Cuando otras personas que llaman no son parte de la cuenta, la API devuelve `400` con el mensaje `You must be a collaborator of the account to manage its collaborators.`. Si la persona que llama no tiene suficiente autorización para asignar el nivel solicitado, la API responde con `400` y el mensaje `Your clearance level is not high enough to assign id clearance <id_clearance>`.

### Endpoint
```
POST /accounts/collaborators
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetros de consulta

Este endpoint no acepta parámetros de consulta.

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `user_email` | si | cadena | No | Correo electrónico del colaborador |
| `id_clearance` | si | entero | No | Nivel de autorización |

### Solicitud de muestra
```bash
curl -X POST   -H "Authorization: <API_KEY>"   -H "Account: <ID_ACCOUNT>"   -H "Content-Type: application/json"   -d '{"user_email":"user@example.com","id_clearance":2}'   /accounts/collaborators
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_user_account": 42,
    "id_user": 18,
    "id_account": 7,
    "id_clearance": 2,
    "is_limited": false,
    "created_at": "2025-01-12T16:41:07Z"
  },
  "context": {},
  "instance": "/accounts/collaborators"
}
```

### Respuesta de error (400: la persona que llama no es un colaborador)
```json
{
  "status": "error",
  "message": "You must be a collaborator of the account to manage its collaborators.",
  "data": null,
  "context": {
    "session": {
      "id_account": 1,
      "id_user": 23
    }
  },
  "instance": "/accounts/collaborators"
}
```

### Respuesta de error (400 - autorización insuficiente)
```json
{
  "status": "error",
  "message": "Your clearance level is not high enough to assign id clearance 2.",
  "data": null,
  "context": {
    "body": {
      "user_email": "user@example.com",
      "id_clearance": 2
    }
  },
  "instance": "/accounts/collaborators"
}
```

## Actualizar colaborador en cuenta

Se requiere un nivel de autorización 5 o inferior para actualizar a los colaboradores.

Las personas que llaman con nivel de autorización `1` pueden actualizar los colaboradores de cualquier cuenta sin pertenecer ya a ella. Otras personas que llaman deben ser colaboradores de la cuenta.

### Endpoint
```
PUT /accounts/collaborators/{collaborator_email}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{collaborator_email}` | Email del colaborador para actualizar | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_clearance` | no | entero | nulo | Nuevo nivel de autorización |

### Solicitud de muestra
```bash
curl -X PUT   -H "Authorization: <API_KEY>"   -H "Account: <ID_ACCOUNT>"   -H "Content-Type: application/json"   -d '{"id_clearance":3}'   /accounts/collaborators/user@example.com
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_user_account": 42,
    "id_user": 18,
    "id_account": 7,
    "id_clearance": 3,
    "is_limited": false,
    "created_at": "2025-01-12T16:41:07Z"
  },
  "context": {},
  "instance": "/accounts/collaborators/user@example.com"
}
```

## Eliminar colaborador de la cuenta

Se requiere un nivel de autorización 4 o inferior para eliminar colaboradores de una cuenta.Las personas que llaman con nivel de autorización `1` pueden eliminar colaboradores de cualquier cuenta, incluso si no están asignados actualmente a ella. Otras personas que llaman deben ser colaboradores de la cuenta.

### Endpoint
```
DELETE /accounts/collaborators/{collaborator_email}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{collaborator_email}` | Email del colaborador a eliminar | cadena |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /accounts/collaborators/user@example.com
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": {
    "id_user_account": 42,
    "id_user": 18,
    "id_account": 7,
    "id_clearance": 3,
    "is_limited": false,
    "created_at": "2025-01-12T16:41:07Z"
  },
  "context": {},
  "instance": "/accounts/collaborators/user@example.com"
}
```