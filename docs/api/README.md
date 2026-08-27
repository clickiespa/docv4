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

> **Scope note:** `mgd` is the AP-v4 gateway-configuration surface. The
> `gateways` and `ai` sections contain supporting-service reference guides and
> are not additional routes in the active AP-v4 `route_base.py` table.

### `ai`
- [AI analysis endpoints](ai/analysis.md)
- [AI assistants endpoints](ai/assistants.md)

### `assets`
- [Assets endpoints](Assets/assets.md) — asset CRUD plus asset file/folder operations: `POST /assets/{id_asset}/files/prepare-upload`, `GET /assets/{id_asset}/folders/root`, `POST /files/{id_file}/complete-upload`, `POST /files/{id_file}/cancel-upload`, `GET /files/{id_file}/signed-url`, `GET /folders/{id_folder}/contents`, `DELETE /files/{id_file}`, `DELETE /folders/{id_folder}`.

### `collaborators`
- [Collaborators endpoints](Collaborators/collaborators.md) — `GET /collaborators`, `POST /collaborators`, `GET /collaborators/{id_user}`, `PUT /collaborators/{id_user}`, `DELETE /collaborators/{id_user}`, `GET /collaborators/{id_user}/history`.

### `dashboards`
- [Dashboards endpoints](Dashboards/dashboards.md) — dashboards, dashboard widgets, widget types, and related operations.
- [Widgets endpoints](Dashboards/widgets.md) — widget catalog and dashboard widget operations.

### `data`
- [Data ingestion and deletion](Metrics_and_data/data_ingestion_and_deletion.md) — datapoint ingestion and deletion for `/metrics/{metric_identifier}/datapoints`.
- [Data extraction](Metrics_and_data/data.md) — Historical timeseries for `/data/metric`, `data/formula` and `data/tags`.

### `devices`
- [Devices endpoints](Devices/devices.md) — device CRUD and related operations.
- [Device models endpoints](Devices/device_models.md) — device models, model points, model types, and manufacturers.
- [Device setups endpoints](Setups/device_setups.md) — setup/device linkage endpoints.
- [Inventories endpoints](Setups/inventories.md) — inventory operations.

### `eav`
- [Entities endpoints](Entities/eav_entities.md) — EAV entities catalog endpoints.
- [Entity attributes endpoints](Entities/entity_attributes.md) — definitions, assignments, and values for `user`, `metric`, `inventory`, and `globalcontext`.

### `filters`
- [Filters endpoints](Filters/filters.md) — `GET /filters`.

### `forms`
- [Forms endpoints](Forms/forms.md) — forms, form inputs, and form input types.

### `gateways`
- [Gateway health endpoint](gateways/health.md) — `GET /health`.
- [Gateway devices endpoint](gateways/devices.md) — `GET /devices` with gateway-focused request/response contract notes.
- [Gateway actions endpoints](gateways/actions.md) — `GET /devices/{identifier}/actions`, `POST /devices/{identifier}/actions`.
- [Gateway jobs endpoints](gateways/jobs.md) — `GET /jobs/{job_id}`, `POST /jobs/{job_id}/cancel`, `GET /devices/{identifier}/jobs`.
- [Gateway logs endpoints](gateways/logs.md) — `GET /devices/{identifier}/logs`, `GET /devices/{identifier}/disk`, `GET /devices/{identifier}/backup/coverage`.
- [Gateway changelog](gateways/changelog.md) — gateway-specific release notes and documentation history.

### `mgd`
- [MGD canonical contract](gateways/mgd_canonical_contract.md) — route map, response fields, canonical identities, uniqueness rules, relationship semantics, and controlled ambiguity behavior.
- [MGD gateway configuration endpoints](gateways/mgd_gateways.md) — `/mgd/gateways`: template CRUD and apply, component/protocol/schedule-type catalogs, gateway configuration, components, child-device bindings, model points keyed by canonical IDs, point groups and their point/special-day bridges, per-name everyday/special-day behavior rules, special days, schedules using numeric scope IDs, extensions, config-change list/status endpoints with optional `scheduled_at`, cancellation including `pending`, reconciliation, replay, and complete-snapshot JSON imports.
- [MGD device points](gateways/mgd_points.md) — explicit device-config point routes, catalog IDs, filters, per-device overrides, atomic-creation contract, change locks, and reader JSON projection rules.
- [MGD device-config identity](gateways/mgd_device_config_model.md) — child setup versus device-config selectors, uniqueness, and eager writes under `/devices/{child}/configs`.
- [MGD config-change states](gateways/mgd_config_change_states.md) — eager-write state machine, option-B use-edge promotion, installation eligibility, compensation including `pending`, mutex 409s, optional `scheduled_at`, reconciliation, worker snapshot, and complete-snapshot import behavior.
- [MGD JSON projection](gateways/mgd_json_projection.md) — assembled `applied` and `proposed` gateway JSON responses after eager persist.
- [MGD eager persistence](gateways/mgd_proposal_storage.md) — real `id_resource`, `id_setup_target`, immutable history, API-owned compensation, SQS replay.
- [MGD gateway contract tests](gateways/mgd_gateway_smoke_tests.md) — route, state, event, timestamp, and complete-snapshot importer coverage that protects the public contract.

### `global_resources`
- [Languages endpoints](Global_resources/languages.md)
- [Locations endpoints](Global_resources/locations.md)
- [Time zones endpoints](Global_resources/time_zones.md)
- [Icons endpoints](Global_resources/icons.md)
- [Methods endpoints](Global_resources/methods.md) — aggregation and interpolation methods.
- [Templates endpoints](Global_resources/templates.md)
- [Time patterns reference](Global_resources/time_patterns.md) — not exposed by the current AP-v4 deployment.

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

### `scores`
- [Scores endpoints](Scores/scores.md) — `GET /scores`.

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

## Additional references
- [Changelog](changelog.md)
