# Configuraciones

Paquetes de configuración que definen cómo interactúan los dispositivos con activos y puertas de enlace.

## Endpoints
- [Configuraciones de lista](#list-setups)
- [Obtener configuración](#get-setup)
- [Crear configuración](#create-setup)
- [Configuración de actualización](#update-setup)
- [Eliminar configuración](#delete-setup)

## Configuraciones de lista

Recupere todas las configuraciones visibles para la cuenta autenticada. Opcionalmente, filtre por activo, modelo de dispositivo o nombre e incluya configuraciones que no estén adjuntas a un activo.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
GET /setups
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | No | entero | Número de configuraciones que se deben omitir antes de recopilar el conjunto de resultados. |
| `limit` | No | entero | Número máximo de configuraciones para devolver. |
| `id_asset` | No | entero | Filtra configuraciones que pertenecen al activo proporcionado. Recupere el identificador de [Listar activos](../Assets/assets.md#list-assets). |
| `id_device_model` | No | entero | Filtra configuraciones que utilizan el modelo de dispositivo proporcionado. Obtenga el identificador de [Obtener modelo de dispositivo](../Devices/device_models.md#get-device-model). |
| `setup_name` | No | cadena | Realiza una búsqueda que no distingue entre mayúsculas y minúsculas en los nombres de configuración. |
| `include_without_asset` | No | booleano | Cuando `true`, también devuelve configuraciones sin un activo asociado. |

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
  "/setups?limit=50&include_without_asset=true"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Setups retrieved",
  "data": [
    {
      "id_setup": 12,
      "id_setup_gateway": 3,
      "id_asset": 25,
      "id_device_model": 4,
      "setup_name": "Packaging Line",
      "setup_description": "Default configuration for packaging",
      "setup_identifier": "setup-00012",
      "setup_recommended_equipment": "Gateway X2",
      "setup_gateway_order": 1,
      "setup_gateway_port": "A1",
      "setup_archived": false,
      "asset": {
        "asset_name": "Packaging Line 1",
        "asset_identifier": "asset-25"
      }
    }
  ],
  "context": {},
  "instance": "/setups"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_setup` | entero | Identificador numérico de la configuración. |
| `id_setup_gateway` | entero | Identificador de la puerta de enlace asignada a la configuración. |
| `id_asset` | entero | Activo asociado con la configuración. Puede ser `null` cuando `include_without_asset` está habilitado. Obtenga todos los detalles a través de [Obtener activo](../Assets/assets.md#get-asset). |
| `id_device_model` | entero | Modelo de dispositivo configurado en la configuración. Ver [Obtener modelo de dispositivo](../Devices/device_models.md#get-device-model). |
| `setup_name` | cadena | Nombre de configuración legible por humanos. |
| `setup_description` | cadena | Descripción opcional de la configuración. |
| `setup_identifier` | cadena | Identificador único utilizado para hacer referencia a la configuración en sistemas externos. |
| `setup_recommended_equipment` | cadena | Nota opcional que describe el equipo recomendado. |
| `setup_gateway_order` | entero | Orden en el que la configuración se comunica con la puerta de enlace. |
| `setup_gateway_port` | cadena | Puerto de puerta de enlace asignado a esta configuración. |
| `setup_archived` | booleano | Indica si la configuración está archivada. |
| `asset` | objeto | Resumen del activo vinculado, incluido el nombre y el identificador devuelto por [Obtener activo](../Assets/assets.md#get-asset). |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Configuraciones recuperadas exitosamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para enumerar las configuraciones. |
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
  "instance": "/setups"
}
```

## Obtener configuración

Recupera una configuración única por su identificador numérico. Utilice este endpoint para inspeccionar la configuración de un emparejamiento de activo-dispositivo específico.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
GET /setups/{id_setup}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_setup` | Sí | entero | Identificador numérico de la configuración a recuperar. Puede obtenerlo de [Configuraciones de lista](#list-setups). |

### Parámetros de consulta

Este endpoint no acepta parámetros de consulta.

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
  "/setups/12"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_setup": 12,
    "id_setup_gateway": 3,
    "id_asset": 25,
    "id_device_model": 4,
    "setup_name": "Packaging Line",
    "setup_description": "Default configuration for packaging",
    "setup_identifier": "setup-00012",
    "setup_recommended_equipment": "Gateway X2",
    "setup_gateway_order": 1,
    "setup_gateway_port": "A1",
    "setup_archived": false,
    "asset": {
      "asset_name": "Packaging Line 1",
      "asset_identifier": "asset-25"
    }
  },
  "context": {},
  "instance": "/setups/12"
}
```
### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_setup` | entero | Identificador numérico de la configuración. |
| `id_setup_gateway` | entero | Identificador de la puerta de enlace asignada a la configuración. |
| `id_asset` | entero | Activo asociado con la configuración. Puede ser `null` cuando la configuración no está vinculada a un activo. Obtenga todos los detalles a través de [Obtener activo](../Assets/assets.md#get-asset). |
| `id_device_model` | entero | Modelo de dispositivo configurado en la configuración. Ver [Obtener modelo de dispositivo](../Devices/device_models.md#get-device-model). |
| `setup_name` | cadena | Nombre de configuración legible por humanos. |
| `setup_description` | cadena | Descripción opcional de la configuración. |
| `setup_identifier` | cadena | Identificador único utilizado para hacer referencia a la configuración externamente. |
| `setup_recommended_equipment` | cadena | Nota opcional que describe el equipo recomendado. |
| `setup_gateway_order` | entero | Orden en el que la configuración se comunica con la puerta de enlace. |
| `setup_gateway_port` | cadena | Puerto de puerta de enlace asignado a esta configuración. |
| `setup_archived` | booleano | Indica si la configuración está archivada. |
| `asset` | objeto | Resumen del activo vinculado, incluido el nombre y el identificador devuelto por [Obtener activo](../Assets/assets.md#get-asset). |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | La configuración se recuperó exitosamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para ver esta configuración. |
| `404` | Configuración no encontrada para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Setup 999 was not found",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/setups/999"
}
```

## Crear configuración

Cree una configuración asociada con la cuenta autenticada. Proporcione el modelo del dispositivo y las referencias de activos y puertas de enlace opcionales.

Se requiere un nivel de autorización 2 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
POST /setups
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_setup_gateway` | No | entero | No | Identificador de la configuración de la puerta de enlace para encadenar. Recupérelo de [Obtener configuración](#get-setup). |
| `id_asset` | No | entero | No | Activo asociado con la configuración. Recupérelo de [Obtener activo](../Assets/assets.md#get-asset). |
| `id_device_model` | Sí | entero | No | Modelo de dispositivo configurado por la instalación. Consíguelo de [Obtener modelo de dispositivo](../Devices/device_models.md#get-device-model). |
| `setup_name` | Sí | cadena | No | Nombre legible por humanos para la configuración. |
| `setup_description` | No | cadena | No | Descripción opcional que aclara el propósito de la configuración. |
| `setup_recommended_equipment` | No | cadena | No | Notas sobre el equipo preferido para esta configuración. |
| `setup_gateway_order` | No | entero | 100 | Orden en el que la configuración se comunica con la puerta de enlace. |
| `setup_gateway_port` | No | cadena | No | Puerto de puerta de enlace asignado a la configuración. |
| `setup_archived` | No | booleano | falso | Indica si la configuración comienza a archivarse. |

El `setup_identifier` se genera automáticamente durante la creación y no se puede proporcionar en la solicitud.

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
    "id_device_model": 4,
    "id_asset": 25,
    "setup_name": "Packaging Line B",
    "setup_description": "Secondary packaging flow",
    "setup_gateway_order": 2
  }' \
  /setups
```

### Ejemplo de respuesta (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_setup": 120,
    "id_setup_gateway": null,
    "id_asset": 25,
    "id_device_model": 4,
    "setup_name": "Packaging Line B",
    "setup_description": "Secondary packaging flow",
    "setup_identifier": "setup-00100",
    "setup_recommended_equipment": null,
    "setup_gateway_order": 2,
    "setup_gateway_port": null,
    "setup_archived": false,
    "asset": null
  },
  "context": {
    "body": {
      "id_device_model": 4,
      "id_asset": 25,
      "setup_name": "Packaging Line B",
      "setup_description": "Secondary packaging flow",
      "setup_gateway_order": 2
    }
  },
  "instance": "/setups"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `201` | La configuración se creó correctamente. |
| `400` | La validación falló para la carga útil proporcionada. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado carece de autorización para crear configuraciones. |
| `404` | No se encontró el activo, puerta de enlace o modelo de dispositivo al que se hace referencia. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (400)
```json
{
  "status": "error",
  "message": "DeviceModel with id_device_model 999 does not exist",
  "data": null,
  "context": {
    "body": {
      "id_device_model": 999,
      "setup_name": "Invalid setup"
    }
  },
  "instance": "/setups"
}
```

## Configuración de actualización

Modificar una configuración existente. Sólo se actualizan los atributos proporcionados; Los campos omitidos mantienen sus valores actuales.

Se requiere un nivel de autorización 2 o inferior (el nivel 1 es administrador) para utilizar este endpoint.### Endpoint
```
PUT /setups/{id_setup}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_setup` | Sí | entero | Identificador numérico de la configuración a actualizar. Recupérelo de [Configuraciones de lista](#list-setups). |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_setup_gateway` | No | entero | No | Configuración de puerta de enlace para encadenar. Omitir para mantener el valor actual. |
| `id_asset` | No | entero | No | Activo asociado con la configuración. Envíe `null` para separar el activo actual u omítalo para conservar el enlace existente. |
| `id_device_model` | No | entero | No | Modelo de dispositivo configurado en la configuración. |
| `setup_name` | No | cadena | No | Nuevo nombre para la instalación. |
| `setup_description` | No | cadena | No | Descripción actualizada. |
| `setup_recommended_equipment` | No | cadena | No | Notas de equipo actualizadas. |
| `setup_gateway_order` | No | entero | No | Orden de puerta de enlace actualizada. |
| `setup_gateway_port` | No | cadena | No | Puerto de puerta de enlace actualizado. |
| `setup_archived` | No | booleano | No | Establezca en `true` para archivar la configuración. |

El `setup_identifier` devuelto por la API es de solo lectura y no se puede modificar después de la creación.

Para separar una configuración de su activo actual, incluya `"id_asset": null` en la carga útil.

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
    "setup_name": "Packaging Line B - Updated",
    "setup_gateway_port": "B2",
    "id_asset": null
  }' \
  /setups/120
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_setup": 120,
    "id_setup_gateway": null,
    "id_asset": null,
    "id_device_model": 4,
    "setup_name": "Packaging Line B - Updated",
    "setup_description": "Secondary packaging flow",
    "setup_identifier": "setup-00100",
    "setup_recommended_equipment": null,
    "setup_gateway_order": 2,
    "setup_gateway_port": "B2",
    "setup_archived": false,
    "asset": null
  },
  "context": {
    "body": {
      "setup_name": "Packaging Line B - Updated",
      "setup_gateway_port": "B2",
      "id_asset": null
    },
    "path": {
      "id_setup": "120"
    }
  },
  "instance": "/setups/120"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | La configuración se actualizó correctamente. |
| `400` | La validación falló para la carga útil proporcionada. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para actualizar las configuraciones. |
| `404` | No se encontró la configuración o el activo, puerta de enlace o modelo de dispositivo al que se hace referencia. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Setup 120 was not found",
  "data": null,
  "context": {
    "path": {
      "id_setup": "120"
    }
  },
  "instance": "/setups/120"
}
```

## Eliminar configuración

Elimine una configuración de la cuenta autenticada.

Se requiere un nivel de autorización 2 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
DELETE /setups/{id_setup}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_setup` | Sí | entero | Identificador numérico de la configuración a eliminar. Recupérelo de [Configuraciones de lista](#list-setups). |

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
  /setups/120
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": null,
  "context": {
    "path": {
      "id_setup": "120"
    }
  },
  "instance": "/setups/120"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | La configuración se eliminó correctamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para eliminar configuraciones. |
| `404` | Configuración no encontrada para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Setup 120 was not found",
  "data": null,
  "context": {
    "path": {
      "id_setup": "120"
    }
  },
  "instance": "/setups/120"
}
```
