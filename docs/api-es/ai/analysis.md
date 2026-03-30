# Analysis

## Endpoints
- [Create analysis](#create-analysis)
- [Get analysis](#get-analysis)
- [Get analysis KPI](#get-analysis-kpi)
- [Get analysis insight](#get-analysis-insight)
- [Get analysis score](#get-analysis-score)

Los endpoints `analysis` crean ejecuciones asincronas de analisis y exponen sus resultados ya procesados.

## Headers

Todos los endpoints de esta pagina requieren:

| Header | Requerido | Tipo | Descripcion |
| --- | --- | --- | --- |
| `Authorization` | si | string | Credencial validada por el authorizer |
| `Account` | si | string | Cuenta propietaria del analisis |

## Create analysis

### Endpoint
```http
POST /ai/analysis
```

### Request body

| Campo | Requerido | Tipo | Default | Descripcion |
| --- | --- | --- | --- | --- |
| `date` | si | int | No | Timestamp en segundos que representa la fecha del analisis. |
| `format` | no | `week` \| `month` | `month` | Periodicidad del analisis. |
| `input` | no | object | `{"prompt":"Centrate en oportunidades de mayor impacto."}` | Payload arbitrario consumido por el worker. |
| `scope` | no | `account` | `account` | Alcance del analisis. Actualmente solo se acepta `account`. |
| `report_format` | no | `dashboard` \| `markdown` | `dashboard` | Formato de salida esperado para `insight`. |
| `comparison.mode` | no | `none` \| `explicit` \| `auto` | `none` | Estrategia de comparacion entre periodos. |
| `comparison.previous_analysis_id` | condicional | string | `null` | Requerido cuando `comparison.mode` es `explicit`. |

### Notes
- El `analysis_id` es deterministico: se calcula a partir del body normalizado y del `Account`.
- Si envias exactamente la misma solicitud para la misma cuenta, el endpoint reutiliza el mismo `analysis_id` en lugar de crear una nueva ejecucion.
- Cuando `comparison.mode` es `auto`, el backend intenta resolver el analisis del periodo anterior usando la misma configuracion.

### Sample request
```bash
curl -X POST \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": 1740700800,
    "format": "month",
    "input": {
      "building_id": "bld_001",
      "prompt": "Centrate en oportunidades de mayor impacto."
    },
    "scope": "account",
    "report_format": "dashboard",
    "comparison": {
      "mode": "auto",
      "previous_analysis_id": null
    }
  }' \
  /ai/analysis
```

### Sample response
```json
{
  "analysis_id": "75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c"
}
```

### Error catalogue

| HTTP | Cuando aplica |
| --- | --- |
| `422` | Error de validacion del body, por ejemplo `comparison.mode="explicit"` sin `previous_analysis_id`. |
| `404` | El `previous_analysis_id` explicitado no existe para la cuenta autenticada. |

## Get analysis

### Endpoint
```http
GET /ai/analysis/{analysis_id}
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{analysis_id}` | string | Identificador SHA-256 del analisis. |

### Sample request
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/analysis/75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c
```

### Sample response
```json
{
  "analysis_id": "75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c",
  "status": "FINISHED",
  "date": 1740700800,
  "format": "month",
  "input": {
    "building_id": "bld_001",
    "prompt": "Centrate en oportunidades de mayor impacto."
  },
  "scope": "account",
  "report_format": "dashboard",
  "comparison": {
    "mode": "auto",
    "previous_analysis_id": "8d0a8cbe4bc68068fe9bcb7ec8c7e6d0f0cf7a2ca89f289f7f3cfa51d4bbd83a"
  },
  "started_at": 1740700820,
  "finished_at": 1740700895,
  "error": null
}
```

### Notes
- `status` puede tomar los valores `QUEUE`, `IN_PROGRESS`, `FINISHED` o `FAILED`.
- Si `status` es `FAILED`, el campo `error` contiene el detalle persistido por el worker.

## Get analysis KPI

### Endpoint
```http
GET /ai/analysis/{analysis_id}/kpi
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{analysis_id}` | string | Analisis del cual se quieren los KPIs. |

### Sample request
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/analysis/75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c/kpi
```

### Sample response
```json
{
  "energy_consumption": {
    "name": "Energy Consumption",
    "value": 12450.6,
    "prev_value": 13210.2,
    "uom": "kWh"
  },
  "peak_demand": {
    "name": "Peak Demand",
    "value": 410.3,
    "prev_value": 438.9,
    "uom": "kW"
  }
}
```

### Error catalogue

| HTTP | Cuando aplica |
| --- | --- |
| `404` | El analisis o sus archivos/resultados KPI no existen, o su metadata es invalida. |
| `409` | El analisis aun esta en `QUEUE` o `IN_PROGRESS`. |
| `422` | El analisis termino en `FAILED`; el detalle se devuelve en `detail`. |

## Get analysis insight

### Endpoint
```http
GET /ai/analysis/{analysis_id}/insight
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{analysis_id}` | string | Analisis del cual se quiere el insight. |

### Response variants

La respuesta depende del `report_format` con el que fue creado el analisis.

#### Dashboard response
```json
{
  "report_format": "dashboard",
  "conclusion": "Cooling demand dropped after correcting night schedules.",
  "oportunities": [
    {
      "topic": "Reduce simultaneous heating and cooling",
      "savings": 1820.5,
      "alert": "high"
    }
  ]
}
```

#### Markdown response
```json
{
  "report_format": "markdown",
  "markdown": "# Executive summary\n\nThe building reduced peak demand by 6%..."
}
```

### Error catalogue

| HTTP | Cuando aplica |
| --- | --- |
| `404` | El analisis no existe, falta el archivo `insight` o el payload persistido es invalido. |
| `409` | El analisis aun esta en `QUEUE` o `IN_PROGRESS`. |
| `422` | El analisis termino en `FAILED`; el detalle se devuelve en `detail`. |

## Get analysis score

### Endpoint
```http
GET /ai/analysis/{analysis_id}/score
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{analysis_id}` | string | Analisis del cual se quieren los scores por activo. |

### Sample request
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/analysis/75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c/score
```

### Sample response
```json
{
  "asset_001": {
    "asset": "Main chiller",
    "location": "Machine room A",
    "value": 71.5,
    "alerts": [
      {
        "name": "Operating hours",
        "value": 14.2,
        "level": "attention"
      }
    ]
  },
  "asset_002": {
    "asset": "Cooling tower",
    "location": "Roof",
    "value": 89.1,
    "alerts": []
  }
}
```

### Error catalogue

| HTTP | Cuando aplica |
| --- | --- |
| `404` | El analisis no existe o no se encuentra el archivo `score.json`. |
| `409` | El analisis aun esta en `QUEUE` o `IN_PROGRESS`. |
| `422` | El analisis termino en `FAILED`; el detalle se devuelve en `detail`. |
