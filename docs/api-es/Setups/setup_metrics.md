# Configurar métricas

Asociaciones entre configuraciones y las métricas que exponen.

## Endpoints
- [Métricas por configuración](#metrics-by-setup)
- [Configuraciones por métrica](#setups-by-metric)

## Métricas por configuración

Enumere todas las métricas adjuntas a la configuración solicitada.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
GET /setups/{id_setup}/metrics
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_setup` | Sí | entero | Identificador numérico de la configuración cuyas asociaciones de métricas desea inspeccionar. Recupérelo de [Obtener configuración](./setups.md#get-setup). |

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
  "/setups/3/metrics"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Metrics retrieved",
  "data": [
    {
      "id_setup_metric": 12,
      "id_setup": 3,
      "id_metric": 5,
      "id_alias": null
    }
  ],
  "context": {},
  "instance": "/setups/3/metrics"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_setup_metric` | entero | Identificador numérico de la relación configuración-métrica. |
| `id_setup` | entero | Identificador de configuración. Ver [Obtener configuración](./setups.md#get-setup). |
| `id_metric` | entero | Identificador de métrica vinculado a la configuración. Recupérelo de [Obtener métrica](../Metrics_and_data/metrics.md#get-metric). |
| `id_alias` | entero | Identificador de alias opcional utilizado para nombres para mostrar. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Las métricas de configuración se recuperaron correctamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para inspeccionar las métricas de configuración. |
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
  "instance": "/setups/3/metrics"
}
```

## Configuraciones por métrica

Enumere cada configuración que utilice la métrica solicitada.

Se requiere un nivel de autorización 6 o inferior (el nivel 1 es administrador) para utilizar este endpoint.

### Endpoint
```
GET /metrics/{metric_identifier}/setups
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `metric_identifier` | Sí | cadena | UUID que identifica la métrica cuyas asociaciones de configuración desea inspeccionar. Puedes obtenerlo de [Listar métricas](../Metrics_and_data/metrics.md#list-metrics). |

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
  "/metrics/<METRIC_UUID>/setups"
```

### Respuesta de muestra (200)
```json
{
  "status": "success",
  "message": "Setups retrieved",
  "data": [
    {
      "id_setup_metric": 12,
      "id_setup": 3,
      "id_metric": 5,
      "id_alias": null
    }
  ],
  "context": {},
  "instance": "/metrics/<METRIC_UUID>/setups"
}
```

### Atributos de datos de respuesta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id_setup_metric` | entero | Identificador numérico de la relación configuración-métrica. |
| `id_setup` | entero | Identificador de configuración. Ver [Obtener configuración](./setups.md#get-setup). |
| `id_metric` | entero | Identificador de métrica vinculado a la configuración. Recupérelo de [Obtener métrica](../Metrics_and_data/metrics.md#get-metric). |
| `id_alias` | entero | Identificador de alias opcional utilizado para nombres para mostrar. |

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Las asociaciones de configuración se recuperaron correctamente. |
| `401` | La autenticación falló. |
| `403` | El usuario autenticado no tiene autorización para inspeccionar las métricas de configuración. |
| `404` | La métrica a la que se hace referencia no existe. |
| `500` | Error inesperado del servidor. |

### Respuesta de error (404)
```json
{
  "status": "error",
  "message": "Metric 00000000-0000-0000-0000-000000000000 was not found",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/metrics/00000000-0000-0000-0000-000000000000/setups"
}
```