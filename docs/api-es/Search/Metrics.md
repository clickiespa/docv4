## Métricas de búsqueda

Filtre métricas por activos vinculados o metadatos intrínsecos mediante un cuerpo POST flexible.

Se requiere un nivel de autorización 7 o inferior con permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint
```
POST /search/metrics
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | Debe ser `application/json` | cadena |

### Cuerpo de la solicitud
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `resource_filter` | no | objeto | No | Alcance los resultados de las métricas vinculadas a través de `resource_relationships` cuando se proporcionen. |
| `param_filters` | no | matriz | No | Lista de filtros a nivel de campo que aceptan los mismos nombres permitidos en `return_fields` (excepto `id_resource`). |
| `return_fields` | no | matriz | No | Subconjunto de campos a devolver. Cuando `resource_filter` está presente, `id_resource` siempre se incluye en la respuesta incluso si se omite en esta lista. |
| `limit` | no | entero | `100` | Número máximo de registros a devolver. |
| `skip` | no | entero | `0` | Desplazamiento para paginación. |

#### `resource_filter`
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `resource_type` | si | cadena | No | Debe ser `asset`. |
| `direction` | no | cadena | `child` | Lado de la relación a recorrer: `parent` para devolver métricas como padres de los recursos enumerados, `child` (predeterminado) para devolver métricas como hijos. La unión de la relación solo ocurre cuando se proporciona `resource_filter`. |
| `operator` | si | cadena | No | Operador de comparación limitado a `in` o `not_in`. |
| `resource_ids` | si | matriz | No | ID aplicados a la columna `resource_type` utilizando el operador seleccionado. El `id_resource` devuelto coincide con los valores proporcionados aquí. |

#### `param_filters` artículos
| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `type` | si | cadena | No | Atributo de métrica para filtrar (cualquier valor `return_fields` válido excepto `id_resource`). |
| `operator` | si | cadena | No | Operador de comparación: `eq`, `not_eq`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in`, `contains`, `like`, `contains_all`, `like_all`, `not_contains`, o `not_like`. |
| `value` | si | cualquiera | No | Literal o lista utilizada con el operador seleccionado. |

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  /search/metrics \
  -d '{
    "resource_filter": {
      "resource_type": "asset",
      "direction": "child",
      "operator": "in",
      "resource_ids": [10, 12]
    },
    "param_filters": [
      {"type": "metric_tags", "operator": "contains", "value": "temperature"}
    ],
    "return_fields": ["id_resource", "id_metric", "metric_name", "metric_tags"],
    "limit": 25,
    "skip": 0
  }'
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Metrics filtered successfully",
  "data": [
    {
      "id_resource": 10,
      "id_metric": 42,
      "id_metric_source": 4,
      "source_name": "API",
      "id_uom": 3,
      "uom_name": "Celsius",
      "uom_unit": "°C",
      "uom_description": "Temperature in Celsius",
      "id_aggregation": 1,
      "aggregation_name": "mean",
      "aggregation_description": "Average",
      "aggregation_function": "mean",
      "id_interpolation": 2,
      "interpolation_name": "linear",
      "interpolation_description": "Linear interpolation",
      "interpolation_function": "linear",
      "metric_name": "Ambient temperature",
      "metric_identifier": "<metric_uuid>",
      "metric_description": "Temperature sensor",
      "metric_tags": "temperature,indoor",
      "metric_formula": null,
      "metric_force_availability": 0,
      "metric_impacts_health": true,
      "created_at": "2025-01-10T12:00:00.000Z"
    }
  ],
  "context": {},
  "instance": "/search/metrics"
}
```

### Códigos de estado
- `200` Éxito
- `400` Filtro no válido o error de validación de carga útil
- `401` No autorizado
- `403` Prohibido
- `404` Recurso no encontrado
- `500` Error interno del servidor