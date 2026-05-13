# Modelos de dispositivos

## Endpoints
- [Listar modelos de dispositivos](#list-device-models)
- [Obtener modelo de dispositivo](#get-device-model)
- [Listar tipos de modelos de dispositivos](#list-device-model-types)
- [Listar fabricantes de modelos de dispositivos](#list-device-model-manufacturers)

Descripciones de modelos de dispositivos compatibles que se pueden asignar a dispositivos.

**Requisitos de autorización:** crear requiere un nivel de autorización 2 o inferior, leer requiere un nivel de autorización 4 o inferior, actualizar requiere un nivel de autorización 2 o inferior y eliminar requiere un nivel de autorización 2 o inferior.

## Listar modelos de dispositivos

Recupere modelos de dispositivos visibles para la cuenta autenticada, con filtros opcionales para estado de archivo, tipo de modelo, fabricante y nombre.

Se requiere un nivel de autorización 4 o inferior para leer los modelos de dispositivos a través de este endpoint.

### Endpoint
```
GET /device_models
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
| `archived` | No | booleano | No | Filtrar por estado de archivo. Cuando se omite, se devuelven tanto los modelos archivados como los activos. |
| `id_device_model_type` | No | entero | No | Filtrar modelos por el identificador de tipo relacionado configurado para la cuenta. Ver [Catálogos relacionados](#related-catalogs). |
| `id_device_model_manufacturer` | No | entero | No | Filtrar modelos por el identificador del fabricante asociado a la cuenta. Ver [Catálogos relacionados](#related-catalogs). |
| `model_name` | No | cadena | No | Filtre modelos utilizando una coincidencia que no distinga entre mayúsculas y minúsculas en el nombre del modelo. |

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
  "/device_models?archived=false&limit=25"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Device models retrieved successfully",
  "data": [
    {
      "id_device_model": 3,
      "id_device_model_type": 2,
      "id_device_model_manufacturer": 4,
      "id_file_picture": 18,
      "id_configuration": null,
      "model_name": "Gateway v2",
      "model_description": "LTE-enabled indoor gateway",
      "model_observations": null,
      "model_sends_data": true,
      "model_is_node": false,
      "model_trace_by_quantity": false,
      "model_archived": false
    }
  ],
  "context": {},
  "instance": "/device_models"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device_model` | entero | Identificador numérico del modelo del dispositivo. |
| `id_device_model_type` | entero | Identificador del tipo de modelo configurado para la cuenta. Ver [Catálogos relacionados](#related-catalogs). |
| `id_device_model_manufacturer` | entero | Identificador del fabricante asociado al modelo. Ver [Catálogos relacionados](#related-catalogs). |
| `id_file_picture` | entero | Identificador del archivo de imagen que ilustra el modelo. |
| `id_configuration` | entero | Identificador de la configuración predeterminada aplicada a los dispositivos de este modelo. |
| `model_name` | cadena | Nombre legible por humanos del modelo de dispositivo. |
| `model_description` | cadena | Descripción narrativa del modelo. |
| `model_observations` | cadena | Notas internas sobre el modelo. |
| `model_sends_data` | booleano | Indica si los dispositivos de este modelo publican telemetría. |
| `model_is_node` | booleano | Especifica si el modelo representa un dispositivo de nodo. |
| `model_trace_by_quantity` | booleano | Determina si se realiza un seguimiento del stock por cantidad para el modelo. |
| `model_archived` | booleano | Indica si el modelo está archivado. |

### Catálogos relacionados

Utilice los siguientes endpoints para obtener identificadores a los que hacen referencia los modelos de dispositivos:

- [`GET /types/device_models`](#list-device-model-types) devuelve los tipos de modelos disponibles.
- [`GET /device_model_manufacturers`](#list-device-model-manufacturers) enumera los fabricantes registrados.

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Modelos de dispositivos recuperados correctamente. |
| `400` | Error de paginación o validación de filtro. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no está autorizado a enumerar modelos de dispositivos. |
| `404` | No se utiliza para este endpoint de recopilación. |
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
  "instance": "/device_models"
}
```

## Obtener modelo de dispositivo

Recuperar detalles de un solo modelo de dispositivo.

Se requiere un nivel de autorización 4 o inferior para leer los modelos de dispositivos a través de este endpoint.

### Endpoint
```
GET /device_models/{id_device_model}
```

### Encabezados| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_device_model` | Sí | entero | Identificador numérico del modelo de dispositivo a recuperar. |

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
  /device_models/3
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_device_model": 3,
    "id_device_model_type": 2,
    "id_device_model_manufacturer": 4,
    "id_file_picture": 18,
    "id_configuration": null,
    "model_name": "Gateway v2",
    "model_description": "LTE-enabled indoor gateway",
    "model_observations": null,
    "model_sends_data": true,
    "model_is_node": false,
    "model_trace_by_quantity": false,
    "model_archived": false
  },
  "context": {},
  "instance": "/device_models/3"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device_model` | entero | Identificador numérico del modelo del dispositivo. |
| `id_device_model_type` | entero | Identificador del tipo de modelo configurado para la cuenta. Ver [Catálogos relacionados](#related-catalogs). |
| `id_device_model_manufacturer` | entero | Identificador del fabricante asociado al modelo. Ver [Catálogos relacionados](#related-catalogs). |
| `id_file_picture` | entero | Identificador del archivo de imagen que ilustra el modelo. |
| `id_configuration` | entero | Identificador de la configuración predeterminada aplicada a los dispositivos de este modelo. |
| `model_name` | cadena | Nombre legible por humanos del modelo de dispositivo. |
| `model_description` | cadena | Descripción narrativa del modelo. |
| `model_observations` | cadena | Notas internas sobre el modelo. |
| `model_sends_data` | booleano | Indica si los dispositivos de este modelo publican telemetría. |
| `model_is_node` | booleano | Especifica si el modelo representa un dispositivo de nodo. |
| `model_trace_by_quantity` | booleano | Determina si se realiza un seguimiento del stock por cantidad para el modelo. |
| `model_archived` | booleano | Indica si el modelo está archivado. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Modelo de dispositivo recuperado correctamente. |
| `400` | La validación falló para el identificador proporcionado. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no está autorizado a leer modelos de dispositivos. |
| `404` | Modelo de dispositivo no encontrado para el identificador proporcionado. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Device model not found",
  "data": null,
  "context": {
    "params": {
      "id_device_model": 99999
    }
  },
  "instance": "/device_models/99999"
}
```

## Listar tipos de modelos de dispositivos

Recupere los tipos de modelo de dispositivo configurados para la cuenta autenticada.

Se requiere un nivel de autorización 4 o inferior para acceder a este endpoint.

### Endpoint
```
GET /types/device_models
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
| `archived` | No | booleano | No | Filtrar por estado de archivo. Cuando se omite, se devuelven tanto los tipos archivados como los activos. |

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
  "/types/device_models?archived=false"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Device model types retrieved successfully",
  "data": [
    {
      "id_device_model_type": 2,
      "type_name": "Gateway",
      "type_description": "Gateway devices that forward data",
      "type_archived": false
    }
  ],
  "context": {},
  "instance": "/types/device_models"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device_model_type` | entero | Identificador del tipo de modelo de dispositivo. |
| `type_name` | cadena | Nombre del tipo de modelo. |
| `type_description` | cadena | Descripción del tipo. |
| `type_archived` | booleano | Indica si el tipo está archivado. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Los tipos de modelos de dispositivos se recuperaron correctamente. |
| `400` | Error de paginación o validación de filtro. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no está autorizado a enumerar tipos de modelos. |
| `404` | No se utiliza para este endpoint de recopilación. |
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
  "instance": "/types/device_models"
}
```
## Listar fabricantes de modelos de dispositivos

Recupere los fabricantes del modelo de dispositivo configurados para la cuenta autenticada.

Se requiere un nivel de autorización 4 o inferior para acceder a este endpoint.

### Endpoint
```
GET /device_model_manufacturers
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
| `archived` | No | booleano | No | Filtrar por estado de archivo. Cuando se omite, se devuelven tanto los fabricantes archivados como los activos. |

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
  "/device_model_manufacturers?archived=false"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Device model manufacturers retrieved successfully",
  "data": [
    {
      "id_device_model_manufacturer": 4,
      "id_file_picture": 18,
      "manufacturer_name": "Acme Devices",
      "manufacturer_description": "Industrial-grade sensors",
      "manufacturer_observations": null,
      "manufacturer_archived": false
    }
  ],
  "context": {},
  "instance": "/device_model_manufacturers"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_device_model_manufacturer` | entero | Identificador del fabricante. |
| `id_file_picture` | entero | Identificador del archivo de imagen asociado al fabricante. |
| `manufacturer_name` | cadena | Nombre del fabricante. |
| `manufacturer_description` | cadena | Descripción del fabricante. |
| `manufacturer_observations` | cadena | Notas internas sobre el fabricante. |
| `manufacturer_archived` | booleano | Indica si el fabricante está archivado. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Los fabricantes de modelos de dispositivos se recuperaron con éxito. |
| `400` | Error de paginación o validación de filtro. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no está autorizado a enumerar los fabricantes de modelos. |
| `404` | No se utiliza para este endpoint de recopilación. |
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
  "instance": "/device_model_manufacturers"
}
```
