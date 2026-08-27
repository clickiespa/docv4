# Setup Metrics

Associations between setups and the metrics they expose.

## Endpoints
- [Metrics by setup](#metrics-by-setup)
- [Enable setup metrics](#enable-setup-metrics)
- [Setups by metric](#setups-by-metric)

## Metrics by setup

List every metric attached to the requested setup.

Clearance note: the route uses the `SetupMetric` entity permissions for `read`;
it has no fixed numeric clearance declared in the handler.

### Endpoint
```
GET /setups/{id_setup}/metrics
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | int | Numeric identifier of the setup whose metric associations you want to inspect. Retrieve it from [Get setup](./setups.md#get-setup). |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a request body.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/setups/3/metrics"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Metrics retrieved",
  "data": [
    {
      "id_setup_metric": 12,
      "id_setup": 3,
      "id_metric": 5,
      "id_device_model_setting": 44,
      "id_alias": null,
      "id_device_model_point": 701,
      "dms_attribute_name": "temperature"
    }
  ],
  "context": {},
  "instance": "/setups/3/metrics"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_setup_metric` | int | Numeric identifier of the setup-metric relationship. |
| `id_setup` | int | Setup identifier. See [Get setup](./setups.md#get-setup). |
| `id_metric` | int | Metric identifier linked to the setup. Retrieve it from [Get metric](../Metrics_and_data/metrics.md#get-metric). |
| `id_device_model_setting` | int | Device-model setting that generated or backs the metric association. |
| `id_alias` | int | Optional alias identifier used for display names. |
| `id_device_model_point` | int | Optional technical point identifier linked to the setup metric for gateway exports. |
| `dms_attribute_name` | string | Attribute name from `device_model_settings` associated through `id_device_model_setting`. |

### Status codes

| Status | Description |
| --- | --- |
| `200` | Setup metrics retrieved successfully. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks `SetupMetric` read permission. |
| `404` | The referenced setup does not exist. |
| `500` | Unexpected server error. |

### Pydantic models

- Response item: `ShowSetupMetric` (`List[ShowSetupMetric]`).

### Error response (403)
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

## Enable setup metrics

Create `setup_metrics` rows for a setup from `device_model_settings`. The API creates a new `metrics` row per setting (device source, UOM aggregation/interpolation) and links it through `setup_metrics`. An active `device_setups` installation is not required.

Clearance note: the route uses the `SetupMetric` entity permissions for `create`;
it has no fixed numeric clearance declared in the handler.

### Endpoint
```
POST /setups/{id_setup}/metrics
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_setup` | Yes | positive int | Setup whose model settings will be enabled. |

### Query parameters

This endpoint does not accept query parameters.

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `metrics` | No | array | `[]` | List of device model settings to enable. |
| `metrics[].id_device_model_setting` | Yes | int | No | Setting that belongs to the setup device model. A new metric is created automatically from this setting. |
| `metrics[].id_alias` | No | int | No | Optional alias identifier. |
| `metrics[].id_device_model_point` | No | int | No | Optional device model point link. |
| `metrics[].setup_metric_hidden` | No | bool | `false` | Hide the metric in UI lists. |
| `metrics[].setup_metric_order` | No | int | `100` | Display order. |
| `metrics[].setup_metric_transform` | No | string | No | Optional transform expression. |

### Sample request
```json
{
  "metrics": [
    {
      "id_device_model_setting": 44,
      "setup_metric_order": 10
    }
  ]
}
```

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Elements created successfully",
  "data": [
    {
      "id_setup_metric": 12,
      "id_setup": 901,
      "id_metric": 5,
      "id_device_model_setting": 44,
      "setup_metric_hidden": false,
      "setup_metric_order": 10,
      "setup_metric_transform": null,
      "dms_attribute_name": "active_energy"
    }
  ],
  "context": {},
  "instance": "/setups/901/metrics"
}
```

### Status codes

| Status | Description |
| --- | --- |
| `201` | Setup metrics created or returned when already enabled. |
| `400` | A setting does not belong to the setup model. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks `SetupMetric` create permission. |
| `404` | Setup or device model setting not found. |
| `500` | Unexpected server error. |

### Pydantic models

- Request: `SetupMetricsCreate` containing `SetupMetricEnableItem` entries.
- Response item: `ShowSetupMetric` (`List[ShowSetupMetric]`).

## Setups by metric

List every setup that uses the requested metric.

Clearance note: the route uses the `SetupMetric` entity permissions for `read`;
it has no fixed numeric clearance declared in the handler.

### Endpoint
```
GET /metrics/{metric_identifier}/setups
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `metric_identifier` | Yes | string | UUID that identifies the metric whose setup associations you want to inspect. You can obtain it from [List metrics](../Metrics_and_data/metrics.md#list-metrics). |

### Query parameters

This endpoint does not accept query parameters.

### Request body

This endpoint does not accept a request body.

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/metrics/<METRIC_UUID>/setups"
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Setups retrieved",
  "data": [
    {
      "id_setup_metric": 12,
      "id_setup": 3,
      "id_metric": 5,
      "id_device_model_setting": 44,
      "id_alias": null,
      "id_device_model_point": 701,
      "dms_attribute_name": "temperature"
    }
  ],
  "context": {},
  "instance": "/metrics/<METRIC_UUID>/setups"
}
```

### Response data attributes

| Field | Type | Description |
| --- | --- | --- |
| `id_setup_metric` | int | Numeric identifier of the setup-metric relationship. |
| `id_setup` | int | Setup identifier. See [Get setup](./setups.md#get-setup). |
| `id_metric` | int | Metric identifier linked to the setup. Retrieve it from [Get metric](../Metrics_and_data/metrics.md#get-metric). |
| `id_device_model_setting` | int | Device-model setting that generated or backs the metric association. |
| `id_alias` | int | Optional alias identifier used for display names. |
| `id_device_model_point` | int | Optional technical point identifier linked to the setup metric for gateway exports. |
| `dms_attribute_name` | string | Attribute name from `device_model_settings` associated through `id_device_model_setting`. |

### Status codes

| Status | Description |
| --- | --- |
| `200` | Setup associations retrieved successfully. |
| `401` | Authentication failed. |
| `403` | The authenticated user lacks `SetupMetric` read permission. |
| `404` | The referenced metric does not exist. |
| `500` | Unexpected server error. |

### Pydantic models

- Response item: `ShowSetupMetric` (`List[ShowSetupMetric]`).

### Error response (404)
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
