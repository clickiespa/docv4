# AP-v4 endpoint routing guide

Use this table to choose the next document. The paths are relative to
`https://api.clickie.io/v4/`. The implementation paths point to the active
source in `clickie-platform`, not the historical `API-V4/` tree in this
documentation repository.

## Route families

| User intent or route | Read next | Active implementation area |
| --- | --- | --- |
| Collaborators and collaborator history | [`Collaborators/collaborators.md`](../../Collaborators/collaborators.md) | `stacks/api/lambdas/ap-v4/apis/users/`, `repository/users/` |
| Accounts and account users/clearances | [`Scope/accounts.md`](../../Scope/accounts.md), [`Scope/clearances.md`](../../Scope/clearances.md) | `apis/scope/`, `dependencies/`, `repository/scope/` |
| Environments, roles, or resource relationships | [`Scope/environments.md`](../../Scope/environments.md), [`Scope/roles.md`](../../Scope/roles.md), [`Scope/relationships.md`](../../Scope/relationships.md) | `apis/scope/` |
| Assets, uploads, folders, signed URLs | [`Assets/assets.md`](../../Assets/assets.md) | `apis/assets/`, `apis/global_resources/route_files.py`, `repository/assets.py` |
| Dashboards or dashboard widgets | [`Dashboards/dashboards.md`](../../Dashboards/dashboards.md), [`Dashboards/widgets.md`](../../Dashboards/widgets.md) | `apis/dashboards/`, `repository/dashboards/` |
| Devices, history, incremental reads, or device actions | [`Devices/devices.md`](../../Devices/devices.md) | `apis/devices/route_devices.py`, `repository/devices/` |
| Device models, points, settings, types, or manufacturers | [`Devices/device_models.md`](../../Devices/device_models.md) | `apis/devices/`, `models/devices/`, `repository/devices/` |
| Device-to-setup associations or inventories | [`Setups/device_setups.md`](../../Setups/device_setups.md), [`Setups/inventories.md`](../../Setups/inventories.md) | `apis/setups/`, `apis/devices/` |
| Forms, form inputs, or input types | [`Forms/forms.md`](../../Forms/forms.md) | `apis/route_forms.py`, `models/forms/`, `schemas/` |
| Languages, locations, icons, time zones, methods, or templates | The relevant pages under [`Global_resources/`](../../Global_resources/) | `apis/global_resources/`, `apis/uoms/`, `apis/route_templates.py` |
| Metrics and metric events | [`Metrics_and_data/metrics.md`](../../Metrics_and_data/metrics.md), [`Types/metric_events.md`](../../Types/metric_events.md) | `apis/metrics_and_processes/`, `repository/metrics_and_processes/` |
| Historical data, formulas, tags, snapshots, or inspection | [`Metrics_and_data/data.md`](../../Metrics_and_data/data.md) | `apis/route_data.py` and the external data-fetcher Lambda |
| Data ingestion or deletion | [`Metrics_and_data/data_ingestion_and_deletion.md`](../../Metrics_and_data/data_ingestion_and_deletion.md) | AP-v4 adapters plus the external Core Data Lambdas |
| Monitors, triggers, rules, history, or ground monitor | [`Monitors/monitors.md`](../../Monitors/monitors.md), [`Monitors/ground_monitor.md`](../../Monitors/ground_monitor.md) | `apis/monitors/`, `repository/monitoring/` |
| Setups and setup metrics | [`Setups/setups.md`](../../Setups/setups.md), [`Setups/setup_metrics.md`](../../Setups/setup_metrics.md) | `apis/setups/`, `repository/setups.py`, `repository/setup_metrics.py` |
| Types, asset categories, or catalog values | [`Types/types.md`](../../Types/types.md), [`Types/asset_categories.md`](../../Types/asset_categories.md) | `apis/route_types.py`, `apis/metrics_and_processes/` |
| UOMs, aggregation, or interpolation | [`Uoms/uoms.md`](../../Uoms/uoms.md), [`Global_resources/methods.md`](../../Global_resources/methods.md) | `apis/uoms/`, `repository/uoms.py` |
| EAV entities, definitions, assignments, values, or history | [`Entities/eav_entities.md`](../../Entities/eav_entities.md), [`Entities/entity_attributes.md`](../../Entities/entity_attributes.md) | `apis/eav/`, `apis/route_eav_entities.py`, `models/eav/` |
| Filters or metric search | [`Filters/filters.md`](../../Filters/filters.md), [`Search/Metrics.md`](../../Search/Metrics.md) | `apis/route_filters.py`, `apis/route_search.py` |
| Scores | [`Scores/scores.md`](../../Scores/scores.md) | `apis/route_scores.py`, `repository/scores.py` |
| Gateway configuration under `/mgd` | Start with [`gateways/mgd_canonical_contract.md`](../../gateways/mgd_canonical_contract.md), then [`gateways/mgd_endpoint_reference.md`](../../gateways/mgd_endpoint_reference.md) | `apis/gateways/`, `repository/mgd_*.py`, `repository/gateways.py` |
| MGD point bindings or effective values | [`gateways/mgd_points.md`](../../gateways/mgd_points.md), [`gateways/mgd_json_projection.md`](../../gateways/mgd_json_projection.md) | `apis/gateways/`, `repository/gateway_catalog.py`, `repository/mgd_projection_*.py` |
| MGD pending/applied/cancel/retry/reconcile behavior | [`gateways/mgd_config_change_states.md`](../../gateways/mgd_config_change_states.md), [`gateways/mgd_proposal_storage.md`](../../gateways/mgd_proposal_storage.md) | `repository/mgd_changes.py`, `repository/mgd_gateway_config_importer.py` |
| MGD gateway actions and traceability | [`gateways/actions.md`](../../gateways/actions.md), [`gateways/mgd_gateway_smoke_tests.md`](../../gateways/mgd_gateway_smoke_tests.md) | `apis/gateways/`, `repository/gateway_actions.py`, `helpers/mgd_events.py` |

## Active route prefixes

The following prefixes are registered by the AP-v4 router and are the complete
starting set for endpoint lookup:

```text
/collaborators
/mgd/gateways
/mgd
/accounts
/environments
/relationships
/methods
/uoms
/metrics
/types
/types/metric_events
/types/assets
/types/device_models
/monitors
/monitor_templates
/languages
/locations
/time_zones
/icons
/clearances
/roles
/entities
/entity_attributes
/assets
/files
/folders
/dashboards
/widgets
/forms
/form_inputs
/form_input_types
/templates
/data
/devices
/ground_monitor
/device_models
/device_model_manufacturers
/setups
/inventories
/filters
/scores
/search/metrics
```

`/dev` and `/v4` are mounting prefixes of the same Lambda application, not
separate endpoint contracts. The public documentation uses the `/v4` base URL.

## Routes that need special handling

### `/data` and `/data/*`

These routes are documented in this repository, but their data-fetching work is
delegated to a separate Core Data/fetcher Lambda. For implementation questions,
read the AP-v4 adapter and the external service contract; do not assume that the
AP-v4 repository owns the complete query engine.

### `/mgd/*`

MGD is part of AP-v4, not a separate Lambda. Read the canonical contract before
the operation reference because resource identity, eager persistence, locks,
state transitions, and JSON projection affect almost every endpoint.

### `/gateways/*`, `/ai/*`

The gateway health/devices/jobs/logs pages and the AI pages are supporting
service references in the documentation hub. They are not additional routes in
the active AP-v4 `route_base.py` table. Do not route an AP-v4 implementation
change to them without confirming the owning service.

