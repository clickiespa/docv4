# Análisis

## Endpoints
- [Crear análisis](#create-analysis)
- [Obtener análisis](#get-analysis)
- [Obtener KPI de análisis](#get-analysis-kpi)
- [Obtenga información de análisis](#get-analysis-insight)
- [Obtener puntuación de análisis](#get-analysis-score)

Los endpoints `analysis` crean ejecuciones asincronas de análisis y exponen sus resultados ya procesados.

## encabezados

Todos los endpoints de esta página requieren:

| Encabezado | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `Authorization` | si | cadena | Credencial validada por el autorizador |
| `Account` | si | cadena | Cuenta propietaria del análisis |

## Crear análisis

### Endpoint
```http
POST /ai/analysis
```

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `date` | si | entero | No | Marca de tiempo en segundos que representa la fecha del análisis. |
| `format` | no | `week` \| `month` | `month` | Periodicidad del análisis. |
| `input` | no | objeto | `{"prompt":"Centrate en oportunidades de mayor impacto."}` | Carga útil arbitrario consumido por el trabajador. |
| `scope` | no | `account` | `account` | Alcance del análisis. Actualmente solo se acepta `account`. |
| `report_format` | no | `dashboard` \| `markdown` \| `email` | `dashboard` | Formato de salida esperado para `insight`. |
| `comparison.mode` | no | `none` \| `explicit` \| `auto` | `none` | Estrategia de comparación entre periodos. |
| `comparison.previous_analysis_id` | condicional | cadena | `null` | Requerido cuando `comparison.mode` es `explicit`. |

### Notas
- El `analysis_id` es determinístico: se calcula a partir del cuerpo normalizado y del `Account`.
- Si envías exactamente la misma solicitud para la misma cuenta, el endpoint reutiliza el mismo `analysis_id` en lugar de crear una nueva ejecución.
- Cuando `comparison.mode` es `auto`, el backend intenta resolver el análisis del periodo anterior usando la misma configuración.

### Solicitud de muestra
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

### Respuesta de muestra
```json
{
  "analysis_id": "75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c"
}
```

### Catálogo de errores

| HTTP | Cuando aplica |
| --- | --- |
| `422` | Error de validación del cuerpo, por ejemplo `comparison.mode="explicit"` sin `previous_analysis_id`. |
| `404` | El `previous_analysis_id` explícito no existe para la cuenta autenticada. |

## Obtener análisis

### Endpoint
```http
GET /ai/analysis/{analysis_id}
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{analysis_id}` | cadena | Identificador SHA-256 del análisis. |

### Solicitud de muestra
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/analysis/75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c
```

### Respuesta de muestra
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

### Notas
- `status` puede tomar los valores `QUEUE`, `IN_PROGRESS`, `FINISHED` o `FAILED`.
- Si `status` es `FAILED`, el campo `error` contiene el detalle persistido por el trabajador.

## Obtener KPI de análisis

### Endpoint
```http
GET /ai/analysis/{analysis_id}/kpi
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{analysis_id}` | cadena | Análisis del cual se quieren los KPIs. |

### Solicitud de muestra
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/analysis/75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c/kpi
```

### Respuesta de muestra
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

### Catálogo de errores

| HTTP | Cuando aplica |
| --- | --- |
| `404` | El análisis de sus archivos/resultados KPI no existe, o sus metadatos no son válidos. |
| `409` | El análisis aún está en `QUEUE` o `IN_PROGRESS`. |
| `422` | El análisis finaliza en `FAILED`; el detalle se devuelve en `detail`. |

## Obtenga información de análisis

### Endpoint
```http
GET /ai/analysis/{analysis_id}/insight
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{analysis_id}` | cadena | Análisis del cual se quiere el insight. |

### Variantes de respuesta

La respuesta depende del `report_format` con el que fue creado el análisis.

#### Respuesta del panel
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

#### Respuesta de rebajas
```json
{
  "report_format": "markdown",
  "markdown": "
# Executive summary\n\nThe building reduced peak demand by 6%..."
}
```

#### Respuesta por correo electrónico
```json
{
  "report_format": "email",
  "email": "<div style=\"font-family:Arial,sans-serif\"><h1>Resumen ejecutivo</h1><p>La demanda de enfriamiento disminuyo tras corregir horarios nocturnos.</p><h2>Hallazgos principales</h2><ul><li>El consumo nocturno bajo respecto al periodo anterior.</li></ul><h2>Oportunidades de mejora</h2><ul><li>Reducir simultaneidad entre calefaccion y enfriamiento.</li></ul><h2>Acciones recomendadas</h2><p>Validar programaciones y monitorear el impacto durante la proxima semana.</p></div>"
}
```

### Catálogo de errores
| HTTP | Cuando aplica |
| --- | --- |
| `404` | El análisis no existe, falta el archivo `insight` o la carga útil persistido es inválido. |
| `409` | El análisis aún está en `QUEUE` o `IN_PROGRESS`. |
| `422` | El análisis finaliza en `FAILED`; el detalle se devuelve en `detail`. |

## Obtener puntuación de análisis

### Endpoint
```http
GET /ai/analysis/{analysis_id}/score
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{analysis_id}` | cadena | Analisis del cual se quieren los puntajes por activo. |

### Solicitud de muestra
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/analysis/75b3832b2cc7d6f9185ef1dce8da8e9d1e8ec2d4da4bd3db4dbf2b7fd11f9c7c/score
```

### Respuesta de muestra
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

### Catálogo de errores

| HTTP | Cuando aplica |
| --- | --- |
| `404` | El análisis no existe o no se encuentra el archivo `score.json`. |
| `409` | El análisis aún está en `QUEUE` o `IN_PROGRESS`. |
| `422` | El análisis finaliza en `FAILED`; el detalle se devuelve en `detail`. |