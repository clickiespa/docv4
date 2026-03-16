# Configuraciones de dispositivos

Relación histórica entre los dispositivos físicos y las configuraciones que implementan.

## Puntos finales
- [Dispositivos por configuración](#devices-by-setup)
- [Configuraciones por dispositivo](#setups-by-device)

## Dispositivos por configuración

Enumere cada asignación de un dispositivo a la configuración solicitada.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este punto final.

### Punto final
```
GET /setups/{id_setup}/devices
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_setup` | Sí | entero | Identificador numérico de la configuración cuyo historial de dispositivo desea inspeccionar. Recupérelo de [Obtener configuración](./setups.md#get-setup). |

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
  "/setups/5/devices"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Devices retrieved",
  "data": [
    {
      "id_device_setup": 42,
      "id_device": 10,
      "id_setup": 5,
      "setup_install_date": "2023-07-01T12:00:00Z",
      "setup_install_observations": "Initial installation",
      "setup_uninstall_date": null,
      "setup_uninstall_observations": null
    }
  ],
  "context": {},
  "instance": "/setups/5/devices"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device_setup` | entero | Identificador numérico de la relación dispositivo-configuración. |
| `id_device` | entero | Identificador del dispositivo. Recupérelo de [Obtener dispositivo](../Devices/devices.md#get-device). |
| `id_setup` | entero | Identificador de configuración vinculado a la tarea. Ver [Obtener configuración](./setups.md#get-setup). |
| `setup_install_date` | cadena | Fecha y hora en que el dispositivo se vinculó a la configuración (ISO 8601). |
| `setup_install_observations` | cadena | Notas opcionales registradas durante la instalación. |
| `setup_uninstall_date` | cadena | Fecha y hora en que se eliminó el dispositivo de la configuración. `null` mientras está instalado. |
| `setup_uninstall_observations` | cadena | Notas opcionales registradas durante la eliminación. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | El historial del dispositivo se recuperó exitosamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para inspeccionar las configuraciones del dispositivo. |
| `404` | La configuración a la que se hace referencia no existe. |
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
  "instance": "/setups/5/devices"
}
```

## Configuraciones por dispositivo

Enumere todas las configuraciones que se han asignado al dispositivo solicitado.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este punto final.

### Punto final
```
GET /devices/{id_device}/setups
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_device` | Sí | entero | Identificador numérico del dispositivo cuyo historial de configuración desea inspeccionar. Recupérelo de [Obtener dispositivo](../Devices/devices.md#get-device). |

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
  "/devices/10/setups"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Setups retrieved",
  "data": [
    {
      "id_device_setup": 42,
      "id_device": 10,
      "id_setup": 5,
      "setup_install_date": "2023-07-01T12:00:00Z",
      "setup_install_observations": "Initial installation",
      "setup_uninstall_date": null,
      "setup_uninstall_observations": null
    }
  ],
  "context": {},
  "instance": "/devices/10/setups"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device_setup` | entero | Identificador numérico de la relación dispositivo-configuración. |
| `id_device` | entero | Identificador del dispositivo. Recupérelo de [Obtener dispositivo](../Devices/devices.md#get-device). |
| `id_setup` | entero | Identificador de configuración vinculado a la tarea. Ver [Obtener configuración](./setups.md#get-setup). |
| `setup_install_date` | cadena | Fecha y hora en que el dispositivo se vinculó a la configuración (ISO 8601). |
| `setup_install_observations` | cadena | Notas opcionales registradas durante la instalación. |
| `setup_uninstall_date` | cadena | Fecha y hora en que se eliminó el dispositivo de la configuración. `null` mientras está instalado. |
| `setup_uninstall_observations` | cadena | Notas opcionales registradas durante la eliminación. |

### Códigos de estado| Estado | Descripción |
| --- | --- |
| `200` | Historial de configuración recuperado exitosamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para inspeccionar las configuraciones del dispositivo. |
| `404` | El dispositivo al que se hace referencia no existe. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Device 999 was not found",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/devices/999/setups"
}
```