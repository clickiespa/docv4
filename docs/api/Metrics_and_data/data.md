# Data endpoints

## Endpoints
- [Get metric data](#get-metric-data)
- [Get formula data](#get-formula-data)
- [Get tag data](#get-tag-data)
- [Get snapshots](#get-snapshots)
- [Inspect metric formula](#inspect-metric-formula)
- [Inspect formula](#inspect-formula)
- [Inspect tag formula](#inspect-tag-formula)

These endpoints retrieve time-series data, aggregate metric values, and inspect
formula dependency trees.

These endpoints return a direct payload with `data` or `inspect` at the top
level, without the API-wide `status`, `message`, and `instance` envelope. When
`context=true`, responses include additional diagnostic fields.

Data responses also include `stats`, which reports how many source data points
were read to produce the response. This can help identify expensive requests.

## Common parameters

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Required for `POST /data/snapshots` | Must be `application/json` when sending a JSON body | string |

### Sample headers

```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Shared query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `context` | No | boolean | `false` | When `true`, includes diagnostic fields. See [Context diagnostics](#context-diagnostics). |
| `filters` | No | boolean, comma-separated integer list, or JSON integer list | `true` | `true` applies enabled metric filters. `false` skips filters. A list such as `1,4,8` or `[1,4,8]` applies only those filter IDs. Applies to data endpoints, not inspection endpoints. |
| `id_time_zone` | No | int | UTC | Time zone ID used for bucket alignment and time-pattern evaluation. Use `0`, `null`, or omit it for UTC. |
| `dimension` | No | `mean`, `sum`, `max`, `min`, `first`, `last` | Metric default | Aggregation method used when data is bucketed. Applies to `/data/metric`, `/data/formula`, and `/data/tags`. |
| `interpolation` | No | `linear`, `zero`, `pad`, `blackhole`, `zerofill` | Metric default | Strategy used to fill missing buckets. Applies to `/data/metric`, `/data/formula`, and `/data/tags`. |
| `interpolation_mode` | No | `default`, `request_only` | `default` | Controls interpolation in calculated metric dependency trees. `request_only` requires `interpolation` and applies interpolation only to the requested root series. |

### Identifier values

| Value | Used by | Description |
| --- | --- | --- |
| Metric UUID | `metric`, `requests.<metric>` | The metric public identifier returned as `metric_identifier` by `GET /metrics`. |
| Numeric metric ID | Formula expressions such as `@123` | The metric numeric identifier returned as `id_metric` by `GET /metrics`. |
| Time zone ID | `id_time_zone` | The time zone identifier returned by `GET /time_zones`. |

### Time filtering

The optional `time_pattern` query parameter can be used with
`/data/metric`, `/data/formula`, and `/data/tags`.

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `time_pattern` | No | string | No filter | Restricts returned timestamps using `hours|days_of_week|days_of_month|months`. Each segment accepts `*` or comma-separated integers. Hours are `0-23`; days of week are `1-7`; days of month are `1-31`; months are `1-12`. |

`time_pattern` is not applied to `/data/snapshots` or inspection endpoints.

Examples:

| Value | Meaning |
| --- | --- |
| `13|1|*|*` | Only hour `13` on day-of-week `1`. |
| `18,19,20,21,22|1,2|*|*` | Hours `18-22` on days-of-week `1` and `2`. |
| `21,22,23,0,1|1,2,3,4,5|*|4,5,6,7,8,9` | Night hours on weekdays during April through September. |

When sending this value in a URL, encode reserved characters. For example,
`0,6,12,18|*|*|*` becomes `0%2C6%2C12%2C18%7C*%7C*%7C*`.
Using `curl --data-urlencode` handles this automatically.

### Resolution values

`resolution` controls the output bucket size.

| Format | Examples | Description |
| --- | --- | --- |
| Integer minutes | `1`, `5`, `60`, `1440` | Number of minutes per bucket. |
| Minute aliases | `min`, `15min`, `T`, `15T` | Minute frequency. |
| Hours | `h`, `6h`, `12h` | Hour frequency. |
| Days | `D`, `7D` | Day frequency. |
| Weeks | `W`, `W-MON`, `W-SUN` | Weekly frequency. `W` resolves to `W-SUN`. |
| Calendar periods | `MS`, `3MS`, `QS`, `YS` | Month-start, quarter-start, or year-start frequency. |
| Whole interval | `interval` | Returns one bucket covering the requested range. |

For `/data/metric`, omit `resolution` to request raw data over a `from` / `to`
range. `/data/formula` and `/data/tags` require `resolution`.

## Get metric data

Retrieves a metric time series or the earliest/latest recorded value for a
metric. The metric can be direct or calculated.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
GET /data/metric
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `metric` | Yes | string | No | Metric UUID. |
| `from` | Required with `to` | int | No | Start of the UTC range as Unix timestamp in seconds. |
| `to` | Required with `from` | int | No | End of the UTC range as Unix timestamp in seconds. |
| `earliest_recorded` | Required when no `from` / `to` is sent | boolean | No | Returns the first available recorded value. Cannot be mixed with `from` / `to`. |
| `latest_recorded` | Required when no `from` / `to` is sent | boolean | No | Returns the last available recorded value. Cannot be mixed with `from` / `to`. |
| `resolution` | No | string or int | Raw data | Bucket size. See [Resolution values](#resolution-values). |
| `dimension` | No | string | Metric default | Aggregation method. |
| `interpolation` | No | string | Metric default | Interpolation method. |
| `interpolation_mode` | No | string | `default` | Interpolation mode for calculated metrics. Use `request_only` with `interpolation` to interpolate only the requested root series. |
| `filters` | No | boolean, comma-separated integer list, or JSON integer list | `true` | Filter handling. |
| `id_time_zone` | No | int | UTC | Time zone ID used for bucket alignment and time-pattern evaluation. |
| `context` | No | boolean | `false` | Includes diagnostics when `true`. |

Use either `from` and `to`, or at least one of `earliest_recorded` and
`latest_recorded`. Do not mix both modes.

For calculated metrics, earliest/latest requests evaluate all dependencies and
honor formula offsets such as `@123[-1]`, so the returned timestamp represents a
fully computable point.

### Sample request

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

### Sample response

```json
{
  "data": {
    "1715731200": 42.7,
    "1715734800": 41.3,
    "1715738400": 39.9
  },
  "stats": {
    "data_points_read": 120,
    "raw_points_read": 120,
    "metric_block_points_read": 0
  }
}
```

### Earliest/latest sample request

```bash
curl -G '/data/metric' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'metric=9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2' \
  --data-urlencode 'latest_recorded=true'
```

### Earliest/latest sample response

```json
{
  "data": {
    "1715817300": 47.3
  }
}
```

## Get formula data

Evaluates an ad-hoc formula over a requested time range.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
GET /data/formula
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `formula` | Yes | string | No | Formula expression using numeric metric references such as `@123`. |
| `from` | Yes | int | No | Start of the UTC range as Unix timestamp in seconds. |
| `to` | Yes | int | No | End of the UTC range as Unix timestamp in seconds. |
| `resolution` | Yes | string or int | No | Bucket size. See [Resolution values](#resolution-values). |
| `dimension` | No | string | Metric default | Aggregation method for referenced metrics when applicable. |
| `interpolation` | No | string | Metric default | Interpolation method. |
| `interpolation_mode` | No | string | `default` | Interpolation mode for calculated dependencies. Use `request_only` with `interpolation` to interpolate only the requested root series. |
| `filters` | No | boolean, comma-separated integer list, or JSON integer list | `true` | Filter handling. |
| `id_time_zone` | No | int | UTC | Time zone ID used for bucket alignment and time-pattern evaluation. |
| `context` | No | boolean | `false` | Includes diagnostics when `true`. |

### Formula syntax

| Element | Examples |
| --- | --- |
| Metric references | `@123`, `@456` |
| Offset access | `@123[-1]`, `@123[-2]` |
| Parentheses | `(@123 + @456) / 2` |
| Functions | `abs(x)`, `pow(x, y)`, `sqrt(x)`, `sin(x)`, `cos(x)`, `tan(x)`, `log(x)`, `exp(x)`, `deg2rad(x)`, `rad2deg(x)`, `rand(min, max)` |
| Operators | `+`, `-`, `*`, `/`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`, `condition ? A : B` |

Formula expressions use numeric metric IDs in the `@<id_metric>` format.

Pure additive formulas, using only metric references, numeric constants, parentheses, `+`, and `-`, treat missing child values as `0` by default. This keeps totals from becoming empty when one component has no point at a timestamp. The default does not apply to formulas with multiplication, division, functions, logical operators, ternaries, or offsets such as `@123[-1]`; those keep strict missing-data behavior unless the referenced metric uses `force_availability`.

### Sample request

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

### Sample response

```json
{
  "data": {
    "1715731200": 40.0,
    "1715734800": 41.2,
    "1715738400": 43.5
  }
}
```

## Get tag data

Aggregates all metrics associated with one or more tags.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
GET /data/tags
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `tags` | Yes | string or JSON string list | No | One tag, a comma-separated list such as `plant_1,plant_2`, or a JSON list such as `["plant_1","plant_2"]`. |
| `merge` | Yes | `sum`, `mean` | No | Aggregation strategy used to combine metrics expanded from the tags. |
| `from` | Yes | int | No | Start of the UTC range as Unix timestamp in seconds. |
| `to` | Yes | int | No | End of the UTC range as Unix timestamp in seconds. |
| `resolution` | Yes | string or int | No | Bucket size. See [Resolution values](#resolution-values). |
| `dimension` | No | string | Metric default | Aggregation method for individual metrics when applicable. |
| `interpolation` | No | string | Metric default | Interpolation method. |
| `interpolation_mode` | No | string | `default` | Interpolation mode for calculated dependencies. Use `request_only` with `interpolation` to interpolate only the requested root series. |
| `filters` | No | boolean, comma-separated integer list, or JSON integer list | `true` | Filter handling. |
| `id_time_zone` | No | int | UTC | Time zone ID used for bucket alignment and time-pattern evaluation. |
| `context` | No | boolean | `false` | Includes diagnostics when `true`. |

### Sample request

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

### Sample response

```json
{
  "data": {
    "1715731200": 150.0,
    "1715734800": 163.4,
    "1715738400": 158.9
  }
}
```

## Get snapshots

Returns one value per metric. Use this endpoint when a dashboard or client needs
several point-in-time summaries in a single request.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
POST /data/snapshots
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `filters` | No | boolean, comma-separated integer list, or JSON integer list | `true` | Filter handling applied to every metric request in the body. |
| `id_time_zone` | No | int | UTC | Time zone ID used for snapshot bucket alignment. |
| `context` | No | boolean | `false` | Includes diagnostic fields when `true`. |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `requests` | Yes | object | No | Object keyed by metric UUID. Each value describes the snapshot to compute for that metric. |
| `requests.<metric>.timeframe` | Required with `dimension` | string | No | UTC Unix timestamp range as `"<from>,<to>"`. |
| `requests.<metric>.dimension` | Required with `timeframe` | `mean`, `sum`, `max`, `min`, `first`, `last` | No | Aggregation to compute over `timeframe`. |
| `requests.<metric>.earliest_recorded` | Required when no `timeframe` / `dimension` is sent | boolean | No | Returns the first available recorded value for that metric. |
| `requests.<metric>.latest_recorded` | Required when no `timeframe` / `dimension` is sent | boolean | No | Returns the last available recorded value for that metric. |

For each metric, send either `timeframe` with `dimension`, or at least one of
`earliest_recorded` and `latest_recorded`.

### Sample request

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

### Sample response

```json
{
  "data": {
    "9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2": 3290.4,
    "0c0aaed1-2b18-4a31-9137-03568e8366fa": 47.3
  }
}
```

If one metric cannot be processed, that metric key returns an object with an
`error` message while the rest of the metrics can still return values.

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

## Inspect metric formula

Returns the dependency tree for a calculated metric.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
GET /data/inspect/metric
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `metric` | Yes | string | No | Metric UUID. The metric must have a formula. |
| `details` | No | boolean | `false` | Includes expanded metadata for referenced metrics when `true`. |
| `context` | No | boolean | `false` | Includes diagnostics when `true`. |

### Sample request

```bash
curl -G '/data/inspect/metric' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'metric=9f1d8e39-54d9-4e51-8fd5-b1a7188ad6f2' \
  --data-urlencode 'details=false'
```

### Sample response

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

## Inspect formula

Validates an ad-hoc formula and returns its dependency tree.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
GET /data/inspect/formula
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `formula` | Yes | string | No | Formula expression. |
| `details` | No | boolean | `false` | Includes expanded metadata for referenced metrics when `true`. |
| `context` | No | boolean | `false` | Includes diagnostics when `true`. |

### Sample request

```bash
curl -G '/data/inspect/formula' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'formula=(@123+@456)/2' \
  --data-urlencode 'details=false'
```

### Sample response

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

## Inspect tag formula

Expands tags into metrics and returns the generated dependency tree.

Read permission over metrics is required to use this endpoint.

### Endpoint

```text
GET /data/inspect/tags
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `tags` | Yes | string or JSON string list | No | One tag, a comma-separated list, or a JSON list. |
| `merge` | No | `sum`, `mean` | `sum` | Aggregation strategy for tag expansion. |
| `details` | No | boolean | `false` | Includes expanded metadata for referenced metrics when `true`. |
| `context` | No | boolean | `false` | Includes diagnostics when `true`. |

### Sample request

```bash
curl -G '/data/inspect/tags' \
  -H 'Authorization: <API_KEY>' \
  -H 'Account: <ID_ACCOUNT>' \
  --data-urlencode 'tags=plant_1,plant_2' \
  --data-urlencode 'merge=sum' \
  --data-urlencode 'details=false'
```

### Sample response

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

## Context diagnostics

When `context=true`, data endpoints can include diagnostic information that helps
interpret the returned values.

```json
{
  "data": {
    "1715731200": 42.7,
    "1715734800": 41.3
  },
  "stats": {
    "data_points_read": 120,
    "raw_points_read": 120,
    "metric_block_points_read": 0
  },
  "confidence_score": {
    "score": 0.95,
    "penalties": {
      "cp_interpolation": 0.08,
      "cp_aggregation": 0.03
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

| Field | Description |
| --- | --- |
| `stats.data_points_read` | Total source data points read to produce the response. |
| `stats.raw_points_read` | Raw metric points read from full-data sources before aggregation, interpolation, or formula evaluation. |
| `stats.metric_block_points_read` | Pre-aggregated metric block points read when the request can use metric blocks. |
| `confidence_score.score` | Number between `0` and `1` that summarizes how much post-processing was needed to produce the series. Higher values indicate fewer adjustments. Can be `null` if the score could not be computed. |
| `confidence_score.penalties` | Breakdown of the adjustments that affected the score, such as interpolation or filtering. |
| `confidence_score.available` | Optional. When `false`, the data was returned but the confidence score could not be computed. |
| `warning` | Optional message returned when the request completed but some data quality condition should be reviewed. |
| `request` | Normalized request values. Useful when checking how query parameters were interpreted. |

## Error responses

Most errors that clients can fix are validation errors and return status `400`
with an `error` message and a stable `code` that clients can branch on. The
`error` value is safe to display, while `code` is intended for programmatic
handling.

```json
{
  "error": "Missing required parameter: metric",
  "code": "MISSING_REQUIRED_PARAMETER"
}
```

```json
{
  "error": "Parameter 'dimension' must be one of: mean, sum, max, min, first, last",
  "code": "INVALID_PARAMETER"
}
```

```json
{
  "error": "For 'metric' type, do not mix explicit 'from/to' with 'earliest_recorded'/'latest_recorded' flags.",
  "code": "INVALID_PARAMETER"
}
```

### Status codes

| Code | Description |
| --- | --- |
| `200` | Request processed successfully. |
| `400` | Missing or invalid parameters. |
| `401` | Missing or invalid credentials. |
| `403` | Clearance level is insufficient. |
| `413` | The requested response is too large. Shorten the time range or use a coarser resolution. |
| `500` | Unexpected server error. |
| `503` | Service temporarily unavailable. |
