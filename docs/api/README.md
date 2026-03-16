# API v4 Documentation Guide

Welcome to the API v4 documentation hub.

This page is designed as a client-facing guide so you can quickly find the right documentation file, understand where each endpoint group is documented, and navigate the platform with confidence.

## Quick references
- [Postman collection (production v4)](lambda-api-v4-v4.postman_collection.json) — executable request examples aligned with the `/v4` API surface.

## Recommended reading order
1. Start here: [Getting Started with v4](Getting_started_with_v4/getting_started.md)
2. Continue with the endpoint groups below according to your use case.
3. Check the latest updates in the [Changelog](changelog.md).

## Endpoint documentation by route tag

### `assets`
- [Assets endpoints](Assets/assets.md) — `GET /assets`, `POST /assets`, `GET /assets/{id_asset}`, `PUT /assets/{id_asset}`, `DELETE /assets/{id_asset}`.

### `collaborators`
- [Collaborators endpoints](Collaborators/collaborators.md) — `GET /collaborators`, `POST /collaborators`, `GET /collaborators/{id_user}`, `PUT /collaborators/{id_user}`, `DELETE /collaborators/{id_user}`.

### `dashboards`
- [Dashboards endpoints](Dashboards/dashboards.md) — dashboards, dashboard widgets, widget types, and related operations.
- [Widgets endpoints](Dashboards/widgets.md) — widget catalog and dashboard widget operations.

### `data`
- [Data ingestion and deletion](Metrics_and_data/data_ingestion_and_deletion.md) — datapoint ingestion and deletion for `/metrics/{metric_identifier}/datapoints`.
- [Legacy data notes](Metrics_and_data/data_no_usar.md) — historical reference file.

### `devices`
- [Devices endpoints](Devices/devices.md) — device CRUD and related operations.
- [Device models endpoints](Devices/device_models.md) — device models, model types, and manufacturers.
- [Device setups endpoints](Setups/device_setups.md) — setup/device linkage endpoints.
- [Inventories endpoints](Setups/inventories.md) — inventory operations.

### `eav`
- [Entities endpoints](Entities/eav_entities.md) — EAV entities catalog endpoints.

### `filters`
- [Filters endpoints](Filters/filters.md) — `GET /filters`.

### `forms`
- [Forms endpoints](Forms/forms.md) — forms, form inputs, and form input types.

### `global_resources`
- [Languages endpoints](Global_resources/languages.md)
- [Time zones endpoints](Global_resources/time_zones.md)
- [Icons endpoints](Global_resources/icons.md)
- [Time patterns endpoints](Global_resources/time_patterns.md)

### `metrics`
- [Metrics endpoints](Metrics_and_data/metrics.md) — metrics CRUD and related metric operations.
- [Setup metrics endpoints](Setups/setup_metrics.md) — setup/metric relationship endpoints.

### `monitoring`
- [Monitors endpoints](Monitors/monitors.md) — monitors and monitor trigger operations.
- [Monitor templates endpoint](Monitors/monitors.md#monitor-templates) — `GET /monitor_templates`.
- [Ground monitor endpoint](Monitors/ground_monitor.md) — `GET /ground_monitor`.

### `newsletter`
- [Templates endpoints](Global_resources/templates.md) — template CRUD operations.

### `scope`
- [Accounts endpoints](Scope/accounts.md)
- [Environments endpoints](Scope/environments.md)
- [Roles endpoints](Scope/roles.md)
- [Clearances endpoints](Scope/clearances.md)
- [Relationships endpoints](Scope/relationships.md)

### `search`
- [Metrics search endpoint](Search/Metrics.md) — `POST /search/metrics`.

### `setups`
- [Setups endpoints](Setups/setups.md)
- [Setup metrics endpoints](Setups/setup_metrics.md)
- [Device setups endpoints](Setups/device_setups.md)

### `types`
- [Types endpoints](Types/types.md)
- [Asset categories endpoints](Types/asset_categories.md)
- [Metric events endpoints](Types/metric_events.md)

### `uoms`
- [UOMs endpoints](Uoms/uoms.md)
- [Methods endpoints](Global_resources/methods.md) — aggregation and interpolation methods.

## Gateway-specific endpoint guides

- [Gateway health endpoint](gateways/health.md) — `GET /health`.
- [Gateway devices endpoint](gateways/devices.md) — `GET /devices` with gateway-focused request/response contract notes.
- [Gateway actions endpoints](gateways/actions.md) — `GET /devices/{identifier}/actions`, `POST /devices/{identifier}/actions`.
- [Gateway jobs endpoints](gateways/jobs.md) — `GET /jobs/{job_id}`, `POST /jobs/{job_id}/cancel`, `GET /devices/{identifier}/jobs`.
- [Gateway logs endpoints](gateways/logs.md) — `GET /devices/{identifier}/logs`, `GET /devices/{identifier}/disk`, `GET /devices/{identifier}/backup/coverage`.

## Additional references
- [Changelog](changelog.md)
