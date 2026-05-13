# Datos

Endpoints para recuperar y gestionar datos métricos.

## Obtener datos de métricas

`GET /data/metric`

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| métrico | si | cadena | UUID métrico o ID interno |
| de | no* | entero | Inicio del rango UTC |
| a | no* | entero | Fin del rango UTC |
| más temprano_recordado | no | booleano | Utilice la primera muestra grabada |
| último_recordado | no | booleano | Usar la última muestra grabada |
| resolución | no | cadena/int | Cubo de agregación |
| dimensión | no | cadena | Método de agregación |
| interpolación | no | cadena | Método de llenado de huecos |
| filtros | no | cadena | Lista de comas de ID de filtro |
| id_time_zone | no | entero | ID de zona horaria para agregación |
| contexto | no | booleano | Incluir contexto de solicitud |

*Requiere `from` y `to` o una de las banderas grabadas.*



Solicitud de muestra:
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" \
     'https://v4.api.clickie.io/data/metric?metric=temperature&from=1700000000&to=1700003600&resolution=1h'
```

Respuesta de muestra:
```json
{
  "status": "success",
  "message": "Data fetched",
  "data": {"1700000000": 20.5},
  "context": null,
  "instance": "/data/metric"
}
```
Campos:
- **estado** – resultado de la solicitud
- **mensaje** – explicación
- **datos** – mapeo de marca de tiempo/valor
- **context** – detalles devueltos cuando está habilitado
- **instancia** – ruta del endpoint


## Actualizar datos de métricas

`PUT /data/metric/{metric_identifier}`

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| identificador_métrico | si | cadena | UUID métrico en la ruta |
| cuerpo | si | objeto | Marcas de tiempo y valores JSON |

Ejemplo de cuerpo:
```json
{"1610845600": 0.83, "1610845800": 2.81}
```

## Eliminar datos de métricas

`DELETE /data/metric/{metric_identifier}`

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| identificador_métrico | si | cadena | UUID métrico en la ruta |
| ts_de | si | entero | Inicio del rango UTC (marca de tiempo Unix) |
| ts_to | si | entero | Fin del rango UTC (marca de tiempo Unix) |

## Evaluar fórmulas métricas

`GET /data/formula`

Utilice este endpoint para evaluar una expresión métrica calculada bajo demanda.

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| fórmula | si | cadena | Expresión de fórmula a evaluar. |

### Solicitud de muestra

```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" \
     'https://v4.api.clickie.io/data/formula?formula=sum(%3Cid_metric%3E)%2Bavg(%3Canother_metric%3E)'
```

### Respuesta de muestra

```json
{
  "status": "success",
  "message": "Formula evaluated",
  "data": {"1700000000": 42.0},
  "context": null,
  "instance": "/data/formula"
}
```

### Casos extremos

Operadores aritméticos con codificación URL para evitar errores de evaluación cuando la fórmula se pasa como parámetro de consulta. Las asignaciones más comunes son:

- `+` → `%2B`
- `/` → `%2F`
- `-` → `%2D`
- `*` → `%2A`