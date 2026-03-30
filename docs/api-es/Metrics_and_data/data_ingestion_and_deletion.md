# Ingestión y eliminación de datos

## Endpoints
- [Insertar puntos de datos](#insert-datapoints)
- [Eliminar puntos de datos](#delete-datapoints)

## Insertar puntos de datos

### Endpoint
```
POST /metrics/{metric_identifier}/datapoints
```

Solo las métricas creadas con una fuente **API** pueden almacenar lecturas. Las métricas calculadas son de solo lectura.

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | Debe ser `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Cuerpo de la solicitud

| Atributo | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| *marca de tiempo* | si | número | Marca de tiempo de Unix en segundos como clave |
| *valor* | si | número | Lectura numérica para esa marca de tiempo |

Ejemplo de cuerpo:

```json
{"1610845600": 0.83, "1610845800": 2.81}
```

Los clientes heredados pueden ajustar las lecturas bajo una clave `readings` de nivel superior (`{"readings": {"1610845600": 0.83}}`). Se aceptan ambos formatos.

### Solicitud de muestra

```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"1610845600": 0.83}' \
  /metrics/<metric_uuid>/datapoints
```

### Respuesta de muestra

```json
{
  "status": "Data queued for ingestion"
}
```

## Eliminar puntos de datos

### Endpoint
```
DELETE /metrics/{metric_identifier}/datapoints
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{metric_identifier}` | UUID de métrica que identifica la métrica | cadena |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `ts_from` | si | entero | Inicio del rango UTC (marca de tiempo Unix) |
| `ts_to` | si | entero | Fin del rango UTC (marca de tiempo Unix) |

### Solicitud de muestra

```bash
curl -X DELETE \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  '/metrics/<metric_uuid>/datapoints?ts_from=1700000000&ts_to=1700003600'
```

### Respuesta de muestra

```json
{
  "status": "Data deleted successfully.",
  "deletions": 24
}
```