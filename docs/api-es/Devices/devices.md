# Dispositivos

## Puntos finales
- [Listar dispositivos](#list-devices)
- [Obtener dispositivo](#get-device)
- [Crear dispositivo](#create-device)
- [Actualizar dispositivo](#update-device)
- [Eliminar dispositivo](#delete-device)

Dispositivos de hardware registrados disponibles para la cuenta autenticada.

**Requisitos de autorización:** crear requiere un nivel de autorización 2 o inferior, leer requiere un nivel de autorización 5 o inferior, actualizar requiere un nivel de autorización 2 o inferior y eliminar requiere un nivel de autorización 2 o inferior.

## Listar dispositivos

Recupere todos los dispositivos visibles para la cuenta autenticada, opcionalmente filtrándolos por inventario, modelo, estado operativo o identificador personalizado.

Se requiere un nivel de autorización 5 o inferior para leer dispositivos a través de este punto final.

### Punto final
```
GET /devices
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `skip` | No | entero | `0` | Desplazamiento de paginación. |
| `limit` | No | entero | `100` | Número máximo de registros a devolver. |
| `id_inventory` | No | entero | No | Filtrar dispositivos asociados con un inventario específico devuelto por [Listar inventarios](../Setups/inventories.md#list-inventories). |
| `id_device_model` | No | entero | No | Filtrar dispositivos por el identificador de modelo relacionado devuelto por [Listar modelos de dispositivos](./device_models.md#list-device-models). |
| `id_device_status` | No | entero | No | Filtre los dispositivos por su identificador de estado operativo (`1` para conectados, `2` para desconectados). |
| `device_custom_id` | No | cadena | No | Filtre dispositivos por el identificador personalizado específico de la cuenta. |

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
  "/devices?limit=20&device_custom_id=NODE-01"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Devices retrieved successfully",
  "data": [
    {
      "id_device": 1,
      "id_inventory": 8,
      "id_device_model": 3,
      "id_device_status": 2,
      "device_custom_id": "NODE-01",
      "device_observations": "Outdoor gateway",
      "device_configuration": null,
      "device_archived": false,
      "device_status_since": "2024-03-17T15:24:51Z"
    },
    {
      "id_device": 2,
      "id_inventory": null,
      "id_device_model": 5,
      "id_device_status": 1,
      "device_custom_id": "NODE-02",
      "device_observations": null,
      "device_configuration": "{}",
      "device_archived": false,
      "device_status_since": null
    }
  ],
  "context": {},
  "instance": "/devices"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device` | entero | Identificador numérico del dispositivo. Utilice [Obtener dispositivo](#get-device) para recuperar sus detalles. |
| `id_inventory` | entero | Identificador de inventario donde se encuentra el dispositivo. |
| `id_device_model` | entero | Identificador del modelo de dispositivo que define las capacidades del hardware. |
| `id_device_status` | entero | Identificador que representa el estado operativo del dispositivo (`1` está conectado, `2` está desconectado). |
| `device_custom_id` | cadena | Identificador específico de la cuenta asignado al dispositivo. |
| `device_observations` | cadena | Notas de formato libre sobre el dispositivo. |
| `device_configuration` | cadena | Configuración serializada aplicada al dispositivo. |
| `device_archived` | booleano | Indica si el dispositivo está archivado. |
| `device_status_since` | cadena | Marca de tiempo ISO-8601 para el último cambio de estado. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Dispositivos recuperados exitosamente. |
| `400` | Error de paginación o validación de filtro. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no está autorizado a enumerar dispositivos. |
| `404` | No se utiliza para este punto final de recopilación. |
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
  "instance": "/devices"
}
```

## Obtener dispositivo

Recupera un dispositivo por su identificador numérico.

Se requiere un nivel de autorización 5 o inferior para leer dispositivos a través de este punto final.

### Punto final
```
GET /devices/{id_device}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_device` | Sí | entero | Identificador numérico del dispositivo a recuperar. |

### Parámetros de consulta

Este punto final no acepta parámetros de consulta.

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
  /devices/1
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_device": 1,
    "id_inventory": 8,
    "id_device_model": 3,
    "id_device_status": 2,
    "device_custom_id": "NODE-01",
    "device_observations": "Outdoor gateway",
    "device_configuration": null,
    "device_archived": false,
    "device_status_since": "2024-03-17T15:24:51Z"
  },
  "context": {},
  "instance": "/devices/1"
}
```### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device` | entero | Identificador numérico del dispositivo. |
| `id_inventory` | entero | Identificador de inventario donde se encuentra el dispositivo. |
| `id_device_model` | entero | Identificador del modelo de dispositivo que define las capacidades del hardware. Utilice [Obtener modelo de dispositivo](./device_models.md#get-device-model) para recuperar su entrada de catálogo. |
| `id_device_status` | entero | Identificador que representa el estado operativo del dispositivo (`1` está conectado, `2` está desconectado). |
| `device_custom_id` | cadena | Identificador específico de la cuenta asignado al dispositivo. |
| `device_observations` | cadena | Notas de formato libre sobre el dispositivo. |
| `device_configuration` | cadena | Configuración serializada aplicada al dispositivo. |
| `device_archived` | booleano | Indica si el dispositivo está archivado. |
| `device_status_since` | cadena | Marca de tiempo ISO-8601 para el último cambio de estado. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Dispositivo recuperado exitosamente. |
| `400` | La validación falló para el identificador proporcionado. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no está autorizado a leer dispositivos. |
| `404` | Dispositivo no encontrado para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Device not found",
  "data": null,
  "context": {
    "params": {
      "id_device": 99999
    }
  },
  "instance": "/devices/99999"
}
```

## Crear dispositivo

Registre un nuevo dispositivo dentro de la cuenta autenticada.

Se requiere un nivel de autorización 2 o inferior para utilizar este punto final.

### Punto final
```
POST /devices
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_inventory` | No | entero | No | Inventario donde se almacena el dispositivo. Recupérelo de [Listar inventarios](../Setups/inventories.md#list-inventories). |
| `id_device_model` | Sí | entero | No | Modelo de dispositivo que define las capacidades del hardware. Consíguelo de [Obtener modelo de dispositivo](./device_models.md#get-device-model). |
| `id_device_status` | No | entero | No | Identificador de estado operativo (`1` para conectado, `2` para desconectado). |
| `device_custom_id` | No | cadena | No | Identificador específico de la cuenta asignado al dispositivo. |
| `device_observations` | No | cadena | No | Notas de formato libre sobre el dispositivo. |
| `device_configuration` | No | cadena | No | Configuración serializada que se debe aplicar al dispositivo. |
| `device_archived` | No | booleano | falso | Establezca en `true` para crear el dispositivo en un estado archivado. |

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
    "id_device_model": 3,
    "id_inventory": 8,
    "device_custom_id": "NODE-100",
    "device_observations": "Installed in warehouse"
  }' \
  /devices
```

### Ejemplo de respuesta (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_device": 120,
    "id_inventory": 8,
    "id_device_model": 3,
    "id_device_status": null,
    "device_custom_id": "NODE-100",
    "device_observations": "Installed in warehouse",
    "device_configuration": null,
    "device_archived": false,
    "device_status_since": null
  },
  "context": {
    "body": {
      "id_device_model": 3,
      "id_inventory": 8,
      "device_custom_id": "NODE-100",
      "device_observations": "Installed in warehouse"
    }
  },
  "instance": "/devices"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `201` | Dispositivo creado exitosamente. |
| `400` | La validación falló para la carga útil proporcionada. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado carece de autorización para crear dispositivos. |
| `404` | No se encontró el inventario o modelo de dispositivo al que se hace referencia. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "DeviceModel with id_device_model 999 does not exist",
  "data": null,
  "context": {
    "body": {
      "id_device_model": 999,
      "device_custom_id": "INVALID"
    }
  },
  "instance": "/devices"
}
```

## Actualizar dispositivo

Modificar un dispositivo existente. Los campos omitidos mantienen su valor actual.

Se requiere un nivel de autorización 2 o inferior para utilizar este punto final.

### Punto final
```
PUT /devices/{id_device}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_device` | Sí | entero | Identificador numérico del dispositivo a actualizar. |

### Cuerpo de la solicitud| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_inventory` | No | entero | No | Inventario donde se almacena el dispositivo. |
| `id_device_model` | No | entero | No | Modelo de dispositivo asignado al hardware. |
| `id_device_status` | No | entero | No | Identificador del estado operativo. |
| `device_custom_id` | No | cadena | No | Identificador específico de la cuenta asignado al dispositivo. |
| `device_observations` | No | cadena | No | Notas actualizadas sobre el dispositivo. |
| `device_configuration` | No | cadena | No | Configuración serializada actualizada. |
| `device_archived` | No | booleano | No | Establezca en `true` para archivar el dispositivo. |

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
    "id_inventory": 9,
    "device_archived": true
  }' \
  /devices/120
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_device": 120,
    "id_inventory": 9,
    "id_device_model": 3,
    "id_device_status": null,
    "device_custom_id": "NODE-100",
    "device_observations": "Installed in warehouse",
    "device_configuration": null,
    "device_archived": true,
    "device_status_since": null
  },
  "context": {
    "body": {
      "id_inventory": 9,
      "device_archived": true
    },
    "path": {
      "id_device": "120"
    }
  },
  "instance": "/devices/120"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Dispositivo actualizado correctamente. |
| `400` | La validación falló para la carga útil proporcionada. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para actualizar los dispositivos. |
| `404` | No se encontró el dispositivo o el inventario o modelo de referencia. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Device 120 was not found",
  "data": null,
  "context": {
    "path": {
      "id_device": "120"
    }
  },
  "instance": "/devices/120"
}
```

## Eliminar dispositivo

Eliminar un dispositivo de la cuenta autenticada.

Se requiere un nivel de autorización 2 o inferior para utilizar este punto final.

### Punto final
```
DELETE /devices/{id_device}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_device` | Sí | entero | Identificador numérico del dispositivo a eliminar. |

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
  /devices/120
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": null,
  "context": {
    "path": {
      "id_device": "120"
    }
  },
  "instance": "/devices/120"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Dispositivo eliminado correctamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para eliminar dispositivos. |
| `404` | Dispositivo no encontrado para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Device 120 was not found",
  "data": null,
  "context": {
    "path": {
      "id_device": "120"
    }
  },
  "instance": "/devices/120"
}
```