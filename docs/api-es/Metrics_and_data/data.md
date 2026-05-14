# Endpoints de datos

## Endpoints
- [Obtener datos de métricas](#get-metric-data)
- [Obtener datos de fórmula](#get-formula-data)
- [Obtener datos de etiquetas](#get-tag-data)
- [Obtener instantáneas](#get-snapshots)
- [Inspeccionar fórmula métrica](#inspect-metric-formula)
- [Inspeccionar la fórmula](#inspect-formula)
- [Inspeccionar la fórmula de la etiqueta](#inspect-tag-formula)

Estos endpoints recuperan datos de series temporales, agregan valores de métricas e inspeccionan
árboles de dependencia de fórmulas.

Estos endpoints devuelven una carga útil directa con `data` o `inspect` en la parte superior.
nivel, sin el sobre `status`, `message` y `instance` de toda la API. cuando
`context=true`, las respuestas incluyen campos de diagnóstico adicionales.

## Parámetros comunes

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |
| `Content-Type` | Requerido para `POST /data/snapshots` | Debe ser `application/json` al enviar un cuerpo JSON | cadena |

### Encabezados de muestra

```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Parámetros de consulta compartidos

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `context` | No | booleano | `false` | Cuando `true`, incluye campos de diagnóstico. Ver [Diagnóstico de contexto](#context-diagnostics). |
| `filters` | No | booleano, lista de enteros separados por comas o lista de enteros JSON | `true` | `true` aplica filtros de métricas habilitados. `false` se salta los filtros. Una lista como `1,4,8` o `[1,4,8]` aplica solo esos ID de filtro. Se aplica a endpoints de datos, no a endpoints de inspección. |
| `id_time_zone` | No | entero | UTC | ID de zona horaria utilizado para la alineación del segmento y la evaluación del patrón de tiempo. Utilice `0`, `null` u omítalo para UTC. |
| `dimension` | No | `mean`, `sum`, `max`, `min`, `first`, `last` | Valor predeterminado de métrica | Método de agregación utilizado cuando los datos se agrupan. Se aplica a `/data/metric`, `/data/formula` y `/data/tags`. |
| `interpolation` | No | `linear`, `zero`, `pad`, `blackhole`, `zerofill` | Valor predeterminado de métrica | Estrategia utilizada para llenar los cubos faltantes. Se aplica a `/data/metric`, `/data/formula` y `/data/tags`. |
| `interpolation_mode` | No | `default`, `request_only` | `default` | Controla la interpolación en árboles de dependencia de métricas calculadas. `request_only` requiere `interpolation` y aplica la interpolación solo a la serie raíz solicitada. |

### Valores del identificador

| Valor | Utilizado por | Descripción |
| --- | --- | --- |
| UUID métrico | `metric`, `requests.<metric>` | El identificador público de métrica devuelto como `metric_identifier` por `GET /metrics`. |
| ID de métrica numérica | Expresiones de fórmula como `@123` | El identificador numérico de métrica devuelto como `id_metric` por `GET /metrics`. |
| ID de zona horaria | `id_time_zone` | El identificador de zona horaria devuelto por `GET /time_zones`. |

### Filtrado de tiempo

El parámetro de consulta opcional `time_pattern` se puede utilizar con
`/data/metric`, `/data/formula` y `/data/tags`.

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `time_pattern` | No | cadena | Sin filtro | Restringe las marcas de tiempo devueltas usando `hours|days_of_week|days_of_month|months`. Cada segmento acepta `*` o números enteros separados por comas. El horario es `0-23`; los días de la semana son `1-7`; los días del mes son `1-31`; Los meses son `1-12`. |

`time_pattern` no se aplica a `/data/snapshots` ni a los endpoints de inspección.

Ejemplos:

| Valor | Significado |
| --- | --- |
| `13|1|*|*` | Sólo hora `13` el día de la semana `1`. |
| `18,19,20,21,22|1,2|*|*` | Horas `18-22` los días de la semana `1` y `2`. |
| `21,22,23,0,1|1,2,3,4,5|*|4,5,6,7,8,9` | Horario nocturno de lunes a viernes de abril a septiembre. |

Al enviar este valor en una URL, codifique los caracteres reservados. Por ejemplo,
`0,6,12,18|*|*|*` se convierte en `0%2C6%2C12%2C18%7C*%7C*%7C*`.
El uso de `curl --data-urlencode` maneja esto automáticamente.

### Valores de resolución

`resolution` controla el tamaño del depósito de salida.| Formato | Ejemplos | Descripción |
| --- | --- | --- |
| Minutos enteros | `1`, `5`, `60`, `1440` | Número de minutos por cubo. |
| Alias ​​de minutos | `min`, `15min`, `T`, `15T` | Frecuencia de minutos. `T` se acepta para clientes heredados. |
| Horas | `h`, `6h`, `12h` | Frecuencia horaria. |
| Días | `D`, `7D` | Frecuencia del día. |
| Semanas | `W`, `W-MON`, `W-SUN` | Frecuencia semanal. `W` se resuelve en `W-SUN`. |
| Períodos del calendario | `MS`, `3MS`, `QS`, `YS` | Frecuencia de inicio de mes, inicio de trimestre o inicio de año. |
| Intervalo completo | `interval` | Devuelve un depósito que cubre el rango solicitado. |

Para `/data/metric`, omita `resolution` para solicitar datos sin procesar a través de `from` / `to`
rango. `/data/formula` y `/data/tags` requieren `resolution`.

## Obtener datos de métricas

Recupera una serie temporal de métricas o el valor registrado más antiguo o más reciente para un
métrica. La métrica puede ser directa o calculada.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
GET /data/metric
```

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `metric` | Sí | cadena | No | UUID métrico. |
| `from` | Requerido con `to` | entero | No | Inicio del rango UTC como marca de tiempo Unix en segundos. |
| `to` | Requerido con `from` | entero | No | Fin del rango UTC como marca de tiempo Unix en segundos. |
| `earliest_recorded` | Requerido cuando no se envía `from` / `to` | booleano | No | Devuelve el primer valor registrado disponible. No se puede mezclar con `from` / `to`. |
| `latest_recorded` | Requerido cuando no se envía `from` / `to` | booleano | No | Devuelve el último valor registrado disponible. No se puede mezclar con `from` / `to`. |
| `resolution` | No | cadena o int | Datos brutos | Tamaño del cubo. Ver [Valores de resolución](#resolution-values). |
| `dimension` | No | cadena | Valor predeterminado de métrica | Método de agregación. |
| `interpolation` | No | cadena | Valor predeterminado de métrica | Método de interpolación. |
| `interpolation_mode` | No | cadena | `default` | Modo de interpolación para métricas calculadas. Utilice `request_only` con `interpolation` para interpolar solo la serie raíz solicitada. |
| `filters` | No | booleano, lista de enteros separados por comas o lista de enteros JSON | `true` | Manejo de filtros. |
| `id_time_zone` | No | entero | UTC | ID de zona horaria utilizado para la alineación del segmento y la evaluación del patrón de tiempo. |
| `context` | No | booleano | `false` | Incluye diagnóstico cuando `true`. |

Utilice `from` y `to`, o al menos uno de `earliest_recorded` y
`latest_recorded`. No mezcle ambos modos.

Para las métricas calculadas, las solicitudes más antiguas/últimas evalúan todas las dependencias y
respetar las compensaciones de fórmulas como `@123[-1]`, por lo que la marca de tiempo devuelta representa una
punto totalmente computable.

### Solicitud de muestra

```bash
curl -G '/data/metric' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'metric=9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2' \
  --data-urlencode 'from=1715731200' \
  --data-urlencode 'to=1715817600' \
  --data-urlencode 'resolution=60' \
  --data-urlencode 'dimension=mean' \
  --data-urlencode 'interpolation=linear'
```

### Respuesta de muestra

```json
{
  "data": {
    "1715731200": 42.7,
    "1715734800": 41.3,
    "1715738400": 39.9
  }
}
```

### Solicitud de muestra más antigua/última

```bash
curl -G '/data/metric' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'metric=9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2' \
  --data-urlencode 'latest_recorded=true'
```

### Respuesta de muestra más temprana/última

```json
{
  "data": {
    "1715817300": 47.3
  }
}
```

## Obtener datos de fórmula

Evalúa una fórmula ad hoc durante un rango de tiempo solicitado.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
GET /data/formula
```

### Parámetros de consulta
| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `formula` | Sí | cadena | No | Expresión de fórmula que utiliza referencias métricas numéricas como `@123`. |
| `from` | Sí | entero | No | Inicio del rango UTC como marca de tiempo Unix en segundos. |
| `to` | Sí | entero | No | Fin del rango UTC como marca de tiempo Unix en segundos. |
| `resolution` | Sí | cadena o int | No | Tamaño del cubo. Ver [Valores de resolución](#resolution-values). |
| `dimension` | No | cadena | Valor predeterminado de métrica | Método de agregación de métricas referenciadas cuando corresponda. |
| `interpolation` | No | cadena | Valor predeterminado de métrica | Método de interpolación. |
| `interpolation_mode` | No | cadena | `default` | Modo de interpolación para dependencias calculadas. Utilice `request_only` con `interpolation` para interpolar solo la serie raíz solicitada. |
| `filters` | No | booleano, lista de enteros separados por comas o lista de enteros JSON | `true` | Manejo de filtros. |
| `id_time_zone` | No | entero | UTC | ID de zona horaria utilizado para la alineación del segmento y la evaluación del patrón de tiempo. |
| `context` | No | booleano | `false` | Incluye diagnóstico cuando `true`. |

### Sintaxis de fórmula

| Elemento | Ejemplos |
| --- | --- |
| Referencias métricas | `@123`, `@456` |
| Acceso compensado | `@123[-1]`, `@123[-2]` |
| Paréntesis | `(@123 + @456) / 2` |
| Funciones | `abs(x)`, `pow(x, y)`, `sqrt(x)`, `sin(x)`, `cos(x)`, `tan(x)`, `log(x)`, `exp(x)`, `deg2rad(x)`, `rad2deg(x)`, `rand(min, max)` |
| Operadores | `+`, `-`, `*`, `/`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`, `condition ? A : B` |

Las expresiones de fórmula utilizan ID de métricas numéricas en el formato `@<id_metric>`.

### Solicitud de muestra

```bash
curl -G '/data/formula' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'formula=(@123+@456)/2' \
  --data-urlencode 'from=1715731200' \
  --data-urlencode 'to=1715817600' \
  --data-urlencode 'resolution=60' \
  --data-urlencode 'interpolation=zerofill'
```

### Respuesta de muestra

```json
{
  "data": {
    "1715731200": 40.0,
    "1715734800": 41.2,
    "1715738400": 43.5
  }
}
```

## Obtener datos de etiquetas

Agrega todas las métricas asociadas con una o más etiquetas.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
GET /data/tags
```

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `tags` | Sí | lista de cadenas o cadenas JSON | No | Una etiqueta, una lista separada por comas, como `plant_1,plant_2`, o una lista JSON, como `["plant_1","plant_2"]`. |
| `merge` | Sí | `sum`, `mean` | No | Estrategia de agregación utilizada para combinar métricas ampliadas a partir de las etiquetas. |
| `from` | Sí | entero | No | Inicio del rango UTC como marca de tiempo Unix en segundos. |
| `to` | Sí | entero | No | Fin del rango UTC como marca de tiempo Unix en segundos. |
| `resolution` | Sí | cadena o int | No | Tamaño del cubo. Ver [Valores de resolución](#resolution-values). |
| `dimension` | No | cadena | Valor predeterminado de métrica | Método de agregación para métricas individuales cuando corresponda. |
| `interpolation` | No | cadena | Valor predeterminado de métrica | Método de interpolación. |
| `interpolation_mode` | No | cadena | `default` | Modo de interpolación para dependencias calculadas. Utilice `request_only` con `interpolation` para interpolar solo la serie raíz solicitada. |
| `filters` | No | booleano, lista de enteros separados por comas o lista de enteros JSON | `true` | Manejo de filtros. |
| `id_time_zone` | No | entero | UTC | ID de zona horaria utilizado para la alineación del segmento y la evaluación del patrón de tiempo. |
| `context` | No | booleano | `false` | Incluye diagnóstico cuando `true`. |

### Solicitud de muestra

```bash
curl -G '/data/tags' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'tags=plant_1,plant_2' \
  --data-urlencode 'merge=sum' \
  --data-urlencode 'from=1715731200' \
  --data-urlencode 'to=1715817600' \
  --data-urlencode 'resolution=60'
```

### Respuesta de muestra

```json
{
  "data": {
    "1715731200": 150.0,
    "1715734800": 163.4,
    "1715738400": 158.9
  }
}
```

## Obtener instantáneas

Devuelve un valor por métrica. Utilice este endpoint cuando un panel o un cliente lo necesite
varios resúmenes puntuales en una sola solicitud.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
POST /data/snapshots
```

### Parámetros de consulta
| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `filters` | No | booleano, lista de enteros separados por comas o lista de enteros JSON | `true` | Manejo de filtros aplicado a cada solicitud de métrica en el cuerpo. |
| `id_time_zone` | No | entero | UTC | ID de zona horaria utilizado para la alineación del depósito de instantáneas. |
| `context` | No | booleano | `false` | Incluye campos de diagnóstico cuando `true`. |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `requests` | Sí | objeto | No | Objeto codificado por UUID métrico. Cada valor describe la instantánea que se calculará para esa métrica. |
| `requests.<metric>.timeframe` | Requerido con `dimension` | cadena | No | Rango de marca de tiempo UTC Unix como `"<from>,<to>"`. |
| `requests.<metric>.dimension` | Requerido con `timeframe` | `mean`, `sum`, `max`, `min`, `first`, `last` | No | Agregación para calcular sobre `timeframe`. |
| `requests.<metric>.earliest_recorded` | Requerido cuando no se envía `timeframe` / `dimension` | booleano | No | Devuelve el primer valor registrado disponible para esa métrica. |
| `requests.<metric>.latest_recorded` | Requerido cuando no se envía `timeframe` / `dimension` | booleano | No | Devuelve el último valor registrado disponible para esa métrica. |

Para cada métrica, envíe `timeframe` con `dimension`, o al menos uno de
`earliest_recorded` y `latest_recorded`.

### Solicitud de muestra

```bash
curl -X POST '/data/snapshots' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  -H 'Content-Type: application/json' \
  -d '{
        "requests": {
          "9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2": {
            "timeframe": "1715731200,1715817600",
            "dimension": "sum"
          },
          "0c0aaed1-2b18-4a31-9137-03568e8366fa": {
            "latest_recorded": true
          }
        }
      }'
```

### Respuesta de muestra

```json
{
  "data": {
    "9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2": 3290.4,
    "0c0aaed1-2b18-4a31-9137-03568e8366fa": 47.3
  }
}
```

Si una métrica no se puede procesar, esa clave de métrica devuelve un objeto con un
`error` mensaje mientras que el resto de las métricas aún pueden devolver valores.

```json
{
  "data": {
    "9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2": 3290.4,
    "0c0aaed1-2b18-4a31-9137-03568e8366fa": {
      "error": "Parameter 'dimension' for metric 0c0aaed1-2b18-4a31-9137-03568e8366fa must be one of: sum, last, mean, min, max, first"
    }
  }
}
```

## Inspeccionar fórmula métrica

Devuelve el árbol de dependencia de una métrica calculada.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
GET /data/inspect/metric
```

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `metric` | Sí | cadena | No | UUID métrico. La métrica debe tener una fórmula. |
| `details` | No | booleano | `false` | Incluye metadatos ampliados para métricas referenciadas cuando `true`. |
| `context` | No | booleano | `false` | Incluye diagnóstico cuando `true`. |

### Solicitud de muestra

```bash
curl -G '/data/inspect/metric' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'metric=9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2' \
  --data-urlencode 'details=false'
```

### Respuesta de muestra

```json
{
  "inspect": {
    "formula": "(@123+@456)/2",
    "children": [
      {
        "id_metric": 123,
        "metric_identifier": "2dc7e08f-23d1-4e89-81a8-877c3ce5d2d4",
        "metric_formula": null,
        "children": []
      },
      {
        "id_metric": 456,
        "metric_identifier": "8ab2b43d-243f-4bb2-b2ec-a34e61c672f7",
        "metric_formula": null,
        "children": []
      }
    ]
  }
}
```

## Inspeccionar fórmula

Valida una fórmula ad-hoc y devuelve su árbol de dependencia.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
GET /data/inspect/formula
```

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `formula` | Sí | cadena | No | Expresión de fórmula. |
| `details` | No | booleano | `false` | Incluye metadatos ampliados para métricas referenciadas cuando `true`. |
| `context` | No | booleano | `false` | Incluye diagnóstico cuando `true`. |

### Solicitud de muestra

```bash
curl -G '/data/inspect/formula' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'formula=(@123+@456)/2' \
  --data-urlencode 'details=false'
```

### Respuesta de muestra

```json
{
  "inspect": {
    "formula": "(@123+@456)/2",
    "children": [
      {
        "id_metric": 123,
        "metric_identifier": "2dc7e08f-23d1-4e89-81a8-877c3ce5d2d4",
        "metric_formula": null,
        "children": []
      },
      {
        "id_metric": 456,
        "metric_identifier": "8ab2b43d-243f-4bb2-b2ec-a34e61c672f7",
        "metric_formula": null,
        "children": []
      }
    ]
  }
}
```

## Inspeccionar la fórmula de la etiqueta

Expande las etiquetas en métricas y devuelve el árbol de dependencia generado.

Se requiere permiso de lectura sobre métricas para utilizar este endpoint.

### Endpoint

```text
GET /data/inspect/tags
```

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `tags` | Sí | lista de cadenas o cadenas JSON | No | Una etiqueta, una lista separada por comas o una lista JSON. |
| `merge` | No | `sum`, `mean` | `sum` | Estrategia de agregación para la expansión de etiquetas. |
| `details` | No | booleano | `false` | Incluye metadatos ampliados para métricas referenciadas cuando `true`. |
| `context` | No | booleano | `false` | Incluye diagnóstico cuando `true`. |

### Solicitud de muestra

```bash
curl -G '/data/inspect/tags' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'tags=plant_1,plant_2' \
  --data-urlencode 'merge=sum' \
  --data-urlencode 'details=false'
```

### Respuesta de muestra

```json
{
  "inspect": {
    "formula": "@123+@456",
    "children": [
      {
        "id_metric": 123,
        "metric_identifier": "2dc7e08f-23d1-4e89-81a8-877c3ce5d2d4",
        "metric_formula": null,
        "children": []
      },
      {
        "id_metric": 456,
        "metric_identifier": "8ab2b43d-243f-4bb2-b2ec-a34e61c672f7",
        "metric_formula": null,
        "children": []
      }
    ]
  }
}
```

## Diagnóstico de contexto

Cuando `context=true`, los endpoints de datos pueden incluir información de diagnóstico que ayude
interpretar los valores devueltos.

```json
{
  "data": {
    "1715731200": 42.7,
    "1715734800": 41.3
  },
  "confidence_score": {
    "score": 0.92,
    "penalties": {
      "cp_interpolation": 1
    }
  },
  "request": {
    "type": "metric",
    "metric": "9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2",
    "from": 1715731200,
    "to": 1715817600,
    "resolution": "60",
    "context": true
  }
}
```

| Campo | Descripción |
| --- | --- |
| `confidence_score.score` | Número entre `0` y `1` que resume cuánto posprocesamiento fue necesario para producir la serie. Los valores más altos indican menos ajustes. |
| `confidence_score.penalties` | Desglose de los ajustes que afectaron la puntuación, como interpolación o filtrado. |
| `warning` | Se devuelve un mensaje opcional cuando se completa la solicitud, pero se debe revisar alguna condición de calidad de los datos. |
| `request` | Valores de solicitud normalizados. Útil para comprobar cómo se interpretaron los parámetros de la consulta. |

## Respuestas de error

La mayoría de los errores que los clientes pueden corregir son errores de validación y estado de devolución `400`
con un mensaje `error`.

```json
{
  "error": "Missing required parameter: metric"
}
```

```json
{
  "error": "Parameter 'dimension' must be one of: mean, sum, max, min, first, last"
}
```

```json
{
  "error": "For 'metric' type, do not mix explicit 'from/to' with 'earliest_recorded'/'latest_recorded' flags."
}
```

### Códigos de estado

| Código | Descripción |
| --- | --- |
| `200` | Solicitud procesada exitosamente. |
| `400` | Parámetros faltantes o no válidos. |
| `401` | Credenciales faltantes o no válidas. |
| `403` | El nivel de autorización es insuficiente. |
| `413` | La respuesta solicitada es demasiado grande. Acorte el rango de tiempo o utilice una resolución más gruesa. |
| `500` | Error inesperado del servidor. |
| `503` | Servicio no disponible temporalmente. |