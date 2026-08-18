# Changelog

Release notes are organized by FastAPI tag for each API version exposed in `/docs`.

## Unreleased (2026-08-13)

### mgd
- MGD REST contracts now use `id_device_model_point`, `id_device_model_point_ids`, `id_gateway_schedule_type`, and numeric `schedule_scope_type` values (`0` for `everyday`, `1` for `special_day`).
- Point-group behavior cardinality is scoped by `(device config, point_group_name)`: multiple names are allowed, each name may have one `everyday` and one `special_day` behavior, `special_day` requires its matching `everyday`, and singular routes accept `scope` when a name has both behaviors.
- Added `GET /mgd/gateways/schedule-types` and `POST /mgd/setups/{id_setup}/config-changes/reconcile`.
- Documented the independent `on_hold`/`pending` installation flow, `retry` state, target conflict guard, `config_sync`, post-commit SQS event, and the `force` import option.
- Corrected the public transition contract so `pending -> on_hold` is a reconciliation-only demotion, clarified that accessories do not satisfy the main-installation predicate, and aligned manual status examples with the Pydantic contract.
- Renamed the tracked-change timestamp contract from `exported_at` to `scheduled_at` to match the database upgrade and API serialization.

### docs
- Synchronized the MGD Markdown guides, route indexes, roadmap coverage, and both published Postman collections with the current platform contract.
- Updated point-group examples and importer documentation to cover per-name behavior scopes, the everyday prerequisite, and singular-route disambiguation.
- Replaced the stale MGD smoke-test page with the current route, state, event, and importer contract coverage.

## Version 69 (2026-07-28)

Published at `/v4/`.

### mgd
- MGD flags now include a `resource` object (`type`, `id`, `label`) identifying the affected entity, so warnings clearly point to the schedule, point group, or device configuration involved.
- Enriched MGD read endpoints for gateway testing: device configs now expose `id_setup_gateway`; schedules include `is_active` and linked point groups; schedule special-days responses include the owning relay-control component; extensions expose `component_name` and full schedule link rows; device point detail returns serialized point groups, schedules, extensions, and special days.
- Added a reading guide to `docs/gateways/mgd_gateways.md` documenting the main GET payloads for gateways, devices, points, schedules, extensions, and schedule special days.

## Unreleased (2026-07-23)

### api
- Restricted CORS default origins from `*` to `https://my.clickie.io`, `https://clickie4.test`, and `http://clickie4.test` (exact match; parent `clickie.io` does not cover subdomains). Override with `CORS_ALLOW_ORIGINS`.

### mgd
- Moved the canonical gateway JSON importer into `API-V4/repository/import_gateway_configs.py` so Lambda packaging includes it; `assets/mgd/import_gateway_configs.py` remains a CLI shim.

## Unreleased (2026-07-22)

### devices
- Added `PUT /device_models/{id_device_model}` to update device model metadata, including `id_gateway_protocol` from `gateway_protocols` (SQL v4.1.20). Responses expose both `id_gateway_protocol` and the resolved `device_model_protocol` label.

### mgd
- Added `GET /mgd/gateways/component-protocols` to list seeded `gateway_component_protocols` rows with component and protocol identifiers.
- Renamed config-change status `error` to `failed` and added `in_progress` to the closed `change_status` domain.
- `GET /mgd/gateways` now defaults `only_with_active_device` to `true`.
- `DELETE /mgd/gateways/{id_setup}` now rejects gateways that still have dependent MGD resources (components, device configs, schedules, special days, extensions, device points, or point groups).
- `DELETE /mgd/gateways/{id_setup}/components/{id_setup_gateway_component}` accepts `recursive=true` to purge dependent MGD resources before deleting the component.
- `DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}` accepts `recursive=true` to purge device points and point groups for the selected component-scoped device config before detaching it.
- `DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/points/{name}` accepts `recursive=true` to remove point-group bridge rows before deleting the device point.
- Point-group routes now live under `/mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups`, keyed by `point_group_name` instead of `group_id`. The relay_control device config is resolved internally from the child setup.
- `DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}` accepts `recursive=true` to remove point-group point and special-day bridge rows before deleting the point group.
- `GET`/`POST /mgd/gateways/{id_setup}/special-days` now resolve the gateway `relay_control` component internally; `id_setup_gateway_component` is returned in responses but is no longer accepted as input.
- `GET`/`POST /mgd/gateways/{id_setup}/schedules` now resolve the gateway `relay_control` component internally; `id_setup_gateway_component` is returned in responses but is no longer accepted as input.
- `POST`/`PUT` special-days payloads now require `dates` entries in `dd-mm` format (for example `25-12`).
- `DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}` accepts `recursive=true` to remove linked extensions before deleting the schedule; point groups still block deletion.
- `POST /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions` always creates the extension and its schedule bridge in one request; all body fields are required.
- `DELETE /mgd/gateways/{id_setup}/schedules/{schedule_id}/extensions` removes linked rows from both `setup_gateway_extensions` and `setup_gateway_extension_schedules`.
- Reworked `change_status` into a closed, Python-managed domain (`on_hold`, `pending`, `in_progress`, `applied`, `cancelled`, `failed`; dropped `requested`) with validated transitions. New config changes now default to `on_hold`.
- Point writes on `setup_gateway_device_points` now flush every `on_hold` change of the gateway to `pending`, stamp `exported_at`, and emit one SQS event `{"id_setup_gateway": <id>}` (queue via `MGD_CONFIG_CHANGES_QUEUE_URL`, region via `MGD_EVENTS_REGION`; no-op when unset). External systems resolve `pending -> in_progress | cancelled` and `in_progress -> applied | cancelled | failed`.
- Added `GET /mgd/gateways/{id_setup}/config-changes` (filters: `change_status`, `change_group_key`, `operation`), `PATCH /mgd/gateways/{id_setup}/config-changes/{id_setup_gateway_config_change}/status`, and bulk `PATCH /mgd/gateways/{id_setup}/config-changes/status`.
- Device configs are addressed as lists under `/mgd/gateways/{id_setup}/devices` and `/mgd/gateways/{id_setup}/devices/{child_id_setup}` (filterable by `setup_gateway_component`) and as unique resources under `/mgd/gateways/{id_setup}/components/{id_setup_gateway_component}/devices/{child_id_setup}`. Points now nest under the component-scoped device.
- Added point-group CRUD and its bridge families under `/mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups` (keyed by `point_group_name`, with relay_control device-config resolution) plus a gateway special-days catalog (`/mgd/gateways/{id_setup}/special-days`). A shared validator allows one `everyday` and one `special_day` behavior per point-group name and requires `everyday` before `special_day`.
- Added `POST /mgd/gateways/{id_setup}/templates/{id_gateway_config_template}/apply` for `operating_schedule` and `operating_extension` templates, materialized under one `change_group_key`.
- `POST /mgd/gateways/{id_setup}/imports` now delegates to the canonical importer in `repository/import_gateway_configs.py` through `mgd_gateway_config_importer.py`.
- The importer still surfaces `duplicate_device_key` and `point_group_scope_conflict` flags (hard error under `strict`) while bypassing `setup_gateway_config_changes`.

### docs
- Rewrote `docs/gateways/mgd_gateways.md` into a condensed, resource-grouped reference and refreshed the Postman collections and roadmap coverage.

## Unreleased (2026-07-14)

### api
- Enabled CORS for API Gateway Lambda proxy integrations via FastAPI `CORSMiddleware`, returning `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers` (including `Authorization` and `Account`). Origins are configurable with `CORS_ALLOW_ORIGINS` (default `*`).

## Unreleased (2026-07-09)

### eav
- Removed `human_value` from entity attribute list, bulk value, and history responses.

### setups
- `POST /setups/{id_setup}/metrics` now accepts only `device_model_settings`; the API creates `metrics` rows automatically (device source, UOM defaults) and links them through `setup_metrics`, matching the legacy platform handler flow.

### mgd
- `device_key` is optional on `POST/PUT /mgd/gateways/{id_setup}/devices`; uniqueness is enforced per gateway (`id_setup_gateway`, `device_key`) when a key is provided.
- `setup_gateway_device_configs` now persists `id_setup_gateway` per SQL v4.1.20.
- Aligned `setup_gateway_components` with SQL v4.1.20: gateway owner column is `id_setup`, component type is stored as `id_gateway_component_type` (API still accepts and returns `component_name` from the catalog).
- Protocol and component-type catalog responses now expose `id_gateway_protocol` / `id_gateway_component_type` with `protocol_label`-based protocol lists.

## Unreleased (2026-07-08)

### eav
- Added `/definitions` CRUD for `attribute_definitions` with account/environment scope rules (`NULL` means global within the other dimension).
- Added entity-scoped attribute endpoints for `user`, `metric`, `inventory`, and `globalcontext`: catalog (`GET /entities/{entity_name}/attributes`), bulk values (`GET /entities/{entity_name}/values`), resource values (`GET/POST/PUT /entities/{entity_name}/resources/{id_resource}/values`), history, and assignment CRUD under `/entities/{entity_name}/assignments`.
- Value writes use `SessionDAL.create`/`update`/`delete` with `clickie_events` logging; `POST` creates only, `PUT` updates with optional `upsert=true`, and per-item `effective_at` appends history.

## Unreleased (2026-07-07)

### mgd
- Moved the public MGD surface from `/mgd/*` to `/mgd/gateways/*`.
- Pivoted MGD gateway routes to setup-centric identifiers: `{id_setup}`, `{id_setup_gateway_component}`, and `{child_id_setup}`.
- `GET /mgd/gateways` now lists all gateway-role setups with child summaries, optional `only_with_active_device`, and `device_ip` from the SIM child setup (`device_model_role` id `8`).
- `POST /mgd/gateways` creates `setup_gateway_configs` without requiring an active gateway device installation.
- `GET/PUT/DELETE /mgd/gateways/{id_setup}` operate on setup-centric gateway detail; `PUT` updates only `setup_gateway_configs`; `DELETE` removes the config row.
- `POST /mgd/gateways/{id_setup}/devices` binds child setups by `{child_id_setup}` and requires at least one `setup_metrics` row; device fields in responses are optional when no installation exists.
- Added read-only catalog endpoints `GET /mgd/gateways/component-types`, `GET /mgd/gateways/component-types/{component_name}`, and `GET /mgd/gateways/protocols`.
- Enforced component catalog validation, duplicate component names, device binding rules (`accepts_devices`, protocol compatibility, gateway-scoped unique `device_key`), relay-control guards on extension creation, and conflict responses when deleting components with dependents.
- Normalized MGD and setup-install writes through `SessionDAL` (`create`/`update`/`delete` with `tracked_*` helpers for canonical gateway rows).
- Aligned `setup_gateway_device_configs` with SQL v4.1.20 by storing `id_setup` instead of `id_device_setup`.
- Aligned `setup_gateway_config_changes.created_by` with the upgrade SQL schema.
- Centralized MGD clearance dependencies in `dependencies/gateways/mgd.py`.

### setups
- Added `POST /setups/{id_setup}/metrics` to enable metrics from `device_model_settings` without requiring `device_setups`.
- Added `POST /setups/{id_setup}/devices` to install a device into a setup through `device_setups`.
- Device installation writes now use `SessionDAL.create`/`update` instead of direct `session.db` calls.

### docs
- Refreshed MGD gateway documentation with `/mgd/gateways` paths, provisioning flow notes, point-group limitations, sample `200` responses, and synchronized Postman collections.

## Version 4.3.9 (2026-06-24)

### accounts
- Updated collaborator clearance assignment logic so the seeded `AGD` and `AD` UBM digitizer clearances participate in the same ranking checks used by `POST /accounts/collaborators` and `PUT /accounts/collaborators/{collaborator_email}`.

### global_resources
- Added full CRUD for `/locations`, including `GET /locations`, `POST /locations`, `GET /locations/{id_location}`, `PUT /locations/{id_location}`, and `DELETE /locations/{id_location}`.
- Added pagination and text search over account-visible location metadata.
- Added account-scoped location creation with validated address and coordinate fields.

### assets
- Restored `id_location` support in `POST /assets`, reusing the shared location lookup dependency so assets can only reference visible locations.

### devices
- Restored `id_location` support in `POST /devices` and `PUT /devices/{id_device}`.
- Added `id_location` to device responses.

### scores
- Added `GET /scores` to return month/year score aggregates scoped to the non-archived assets of the requested `Account` header.
- Added explicit account-membership validation for non-admin users while still allowing role `1` sessions to query any account without a `user_accounts` row.
- Parameterized the analytics query with account asset identifiers, month, and year.

### docs
- Documented the scores and full locations CRUD endpoints, refreshed all Postman collections, restored the full `/assets/{id_asset}/files/*`, `/files/*`, and `/folders/*` requests in the `/v4` collections, updated the asset/device payload guides, and aligned the roadmap plus landing-page indexes with the new scores surface.

## Version 4.3.8 (2026-06-10)

### assets
- Added asset-scoped file upload preparation with root-folder creation, recursive folder path resolution, pending file metadata, and S3 presigned `PUT` URLs using `s3://clickie-storage-v4/{user_id}/{file_key}` object keys.
- Added upload completion, pending upload cancellation with empty-folder pruning, signed download URL, folder contents, file soft delete, folder soft delete, asset root folder lookup, root folder renaming on asset name updates, and asset delete cascade behavior.

### docs
- Documented the asset file/folder endpoints, refreshed Postman collections, and aligned roadmap coverage for asset storage operations.

## Version 4.3.7 (2026-05-05)

### collaborators
- Added `GET /collaborators/{id_user}/history` to return account-scoped `clickie_events` rows with `skip`/`limit` pagination and an `id_event_type` filter (`1` login, `2` creation, `3` modification, `4` deletion), language-formatted event descriptions, event type descriptions, entity names, and the admin-user history lookup exception; removed the redundant `GET /collaborators/{id_user}/login_history` endpoint.

### docs
- Documented the collaborator event history endpoint, refreshed Postman collections, and aligned the roadmap and documentation index with the new collaborator history surface.

### global_resources
- Added a Python transcription of the Spanish language catalog and helper lookup functions under `API-V4/langs.py` so Lambda code can reuse the existing labels when needed.

### events
- Updated `ClickieEventsLogger` to store `event_changes` with plain field keys, removing translation placeholders and dotted nesting from change names.
- Restored the `[API]` prefix, fixed `id_entity` mapping for plural/normalized model names, and aligned generated clickie event descriptions with the legacy PHP event helper, including affected-resource labels and custom-form parent context.

## Version 4.3.6 (2026-04-07)

### devices
- Replaced direct `device_model_settings` access with `GET /device_models/{id_device_model}/settings`.
- Kept `GET /devices/{id_device}/history` with `from`, `to`, `skip`, and `limit` query filters.
- Temporarily removed `GET /devices/history` while the route conflict (`id_device` parsing) is reviewed.

### setups
- `GET /setups/{id_setup}/metrics` now includes `dms_attribute_name`, sourced from `device_model_settings` through `setup_metrics.id_device_model_setting`.

### auth
- Enforced account membership checks by clearance (`id_clearance`) instead of role fallbacks: users with clearance above `A1` must belong to the requested `Account` header account.
- Removed role-based clearance inference for contexts that omit `id_clearance`.

### docs
- Audited `docs/` coverage in `docs/README.md` and added missing references for AI and gateway changelog guides.
- Normalized the route-tag index format so `gateways` is documented as a standard route-tag heading instead of a custom section heading, matching the rest of the endpoint groups.
- Reordered route-tag sections alphabetically to keep navigation consistent across documentation landing pages.
- Updated device and device model documentation, Postman collections, and roadmap coverage for the current API surface.

## Version 4.3.5 (2026-04-01)

### api
- Standardized API response envelopes for `2xx`, `4xx`, and `5xx` flows so responses consistently include `status`, `message`, `data`, `context`, and `instance`.
- Added explicit handling for `HTTPException` in the custom route layer to avoid raw FastAPI `detail` payloads leaking without the standard envelope.
- Added a default internal error envelope for uncaught exceptions to normalize `500` responses.

### docs
- Updated the Getting Started guide to explicitly state that the standard response envelope applies to success and error responses (`2xx`, `4xx`, and `5xx`).

## Version 4.3.4 (2026-03-12)

### monitoring
- Updated monitor trigger validation so `trigger_parameters.id_users` must be an array of strings when creating or updating `/monitors/{id_monitor}/triggers`. Comma-separated strings are now rejected with a `400` response.

### docs
- Updated monitor trigger documentation examples to show `id_users` as `array[string]`, refreshed monitor trigger Postman payloads, and aligned roadmap coverage notes for trigger validation.

## Version 4.3.3 (2026-02-17)

### filters
- Added `GET /filters` to list account/environment-scoped records from the `filters` table.

### metrics
- Updated `/metrics` create/update payload validation so `metric_force_availability` accepts integer modes `0`, `1`, or `2` instead of booleans.
- Updated metric serialization to expose `metric_force_availability` as an integer mode in API responses.

### docs
- Refined documentation navigation for clients, including a docs inbox entrypoint, and refreshed metrics/search references plus roadmap alignment.
- Added filters endpoint documentation, refreshed Postman collections, updated roadmap coverage, and synchronized documentation landing pages.
- Updated `docs/README.md` to align the route-tag index with the current API surface, including explicit coverage for `GET /monitor_templates`.
- Added a gateway endpoint guides section in `docs/README.md` listing health, devices, actions, jobs and logs documentation.
- Moved the production v4 Postman collection link to the beginning of `docs/README.md` as a quick reference.
- Synchronized the root `README.md` landing page with documentation index links so both entrypoints point to the same core and gateway guides.

## Version 4.3.2 (2026-01-25)

### dashboard_widgets
- Expanded dashboard widget configuration handling to support nested form_data trees with main forms, subforms, and id_form_data-aware updates and deletes.
- Widget configuration defaults now seed required inputs and at least one subform entry when no payload is provided.
- Dashboard widget config validation now enforces required inputs and select-option constraints on creation payloads.
- Corrected subform persistence so nested entries store the parent form_data identifier as their `id_resource`.
- Hardened form_data parsing to handle double-encoded JSON so stored configuration values render correctly.
- Rejects config_data fields that are not defined in the form inputs to prevent storing unknown keys.

### docs
- Updated dashboard widget documentation, refreshed the Postman collection examples, and aligned the roadmap coverage notes.

## Version 4.3.1 (2026-01-21)

### monitoring
- Added `trigger_parameters` handling for monitor triggers, storing the payload in form data keyed to the trigger type form.
- Exposed `GET /monitor_templates` to list monitor-ready notification templates.

### docs
- Updated monitor trigger documentation and examples, added monitor template documentation, refreshed the Postman collection, updated the roadmap coverage, and aligned trigger sample payloads.

## Version 4.3.0 (2026-01-15)

### accounts
- Clearance 1 sessions can set or update `id_environment` when creating or updating accounts; other clearances remain scoped to the session environment.
- Account responses now include environment metadata alongside `id_environment`.

### environments
- Added `GET /environments` to list available environments for the authenticated session.

### search
- `/search/metrics` now translates invalid filter payloads into `400` responses instead of uncaught `500` errors, surfacing validation feedback when relationships or operators are misused.
- `/search/metrics` now treats missing or empty `resource_filter` payloads as metadata-only requests, skipping relationship joins and `DISTINCT` clauses unless resource scoping is explicitly provided.
- `/search/metrics` now routes metadata-only requests through a dedicated query path while resource-scoped searches join `resource_relationships`, avoiding errors when `resource_filter` is omitted.
- `/search/metrics` now encapsulates `resource_relationships` filtering inside the resource-scoped query path, leaving `get_metrics_with_filters` focused on shared validation and dispatch.
- `/search/metrics` now builds base parameter queries separately from resource-scoped queries, applying relationship joins only after the base query is constructed.
- `/search/metrics` now drops unknown `return_fields` and defaults to full field sets when none are valid, while only `id_resource` is blocked for parameter filtering.
- `/search/metrics` no longer selects a literal `id_resource` for metadata-only requests, and only appends `id_resource` when resource filters are active to avoid mixed-column selection errors.
- `/search/metrics` now always includes `id_resource` when a `resource_filter` is provided, regardless of `return_fields`, while metadata-only queries omit it entirely.

### search
- Added `POST /search/metrics` under the `search` tag to filter metrics by linked assets or metric metadata with customizable return fields and pagination. Relationship traversal applies only when `resource_type` is `asset`.
- Metrics search can now traverse `resource_relationships` in either direction using an explicit `direction` flag that resolves `resource_type` values from `eav_entities` and returns `id_resource` values that mirror the requested `resource_ids`, defaulting to the `child` direction when omitted.
- Resource filters enforce `in` or `not_in` operators while parameter filters validate against the full set of supported operators to prevent unsupported comparisons from reaching the query builder.
- The metrics entity identifier is pinned to `7` during relationship filtering to avoid redundant lookups when evaluating resource-scoped queries.

### docs
- Documented the new metrics search endpoint, updated the Postman collection, and refreshed the roadmap coverage for metrics filtering.

## Unreleased (2026-07-02)

### mgd
- Added the first MGD-oriented `/mgd` API surface, including gateway templates, gateway root CRUD, gateway components, configured gateway devices, gateway device point activation, top-level schedule listings, component schedule listings, detailed component schedule bindings, JSON imports, schedule extensions, schedule special-day associations, and gateway extension catalog endpoints.
- Gateway identifiers are now resolved by `devices.device_custom_id`, while child gateway devices are validated against `device_model_roles.role_subinstallable_roles` and tied to child setups through `device_setups` plus `setups.id_setup_gateway`.
- Schedule reads now surface schedules outside `relay_control` with flags, while schedule writes remain restricted to `relay_control` components.
- `/mgd` mutating endpoints now record `pending` rows in `setup_gateway_config_changes` for the MGD entities introduced by the v4.1.20 gateway structure upgrade. The JSON import endpoint intentionally skips `config_changes` logging.
- Gateway deletes now soft-delete only the gateway device and return `409` when the gateway setup still has child setups.

### devices
- Added `device_model_points` CRUD under `/device_models/{id_device_model}/points`.
- Added `/device_models/{id_device_model}/points/{point_label}/setting` with semantic-name matching against `device_model_settings` until an explicit SQL relation is defined.
- Device model responses now expose `id_device_model_role` and `device_model_protocol`.

### setups
- Setup and setup-metric models/schemas now expose `id_device_model_role`, `setup_role`, and `id_device_model_point` so gateway endpoints can resolve child setups and technical point bindings.

### docs
- Added the MGD gateway configuration guide and updated device model documentation for technical points.
- Refreshed the docs landing page, repository README index, and roadmap coverage notes for the new gateway configuration surface.

## Version 4.2.0 (2025-12-15)


This release consolidates the changes shipped in the latest `development` → `main` merge (starting with merge commit `a09eb62`). Use that merge's commit list as the source of truth for any follow-up release note or changelog adjustments. For 4.2.x documentation updates, reference the consolidated development → main merge pull request for the targeted release rather than individual feature PRs so tooling can programmatically collect the relevant commits from a single entry point.

### forms
- Exposes catalog endpoints to list forms and retrieve individual definitions (clearance 7 for read operations).
- Form records include environment/account scoping metadata plus descriptive names and optional descriptions.

### form_inputs
- Lists and fetches input definitions scoped to a form (read clearance 7).
- Input metadata covers labels, defaults, placeholders, select options, multiplicity flags, validation requirements, and attribute metadata used by custom form rendering.

### form_input_types
- Provides the catalog of input renderers (read clearance 7) such as text, select, textarea, resource pickers, nested forms, and other UI primitives.

### dashboards
- Supports creation and deletion with clearance 2, updates with clearance 5, and reads with clearance 8.
- Dashboards store optional parent relationships (`id_parent_dashboard`) and color metadata; archived filtering is optional for clearances 1–2 and defaults to non-archived for higher clearances.

### dashboard_widgets
- Manages dashboard widget instances: creation/deletion with clearance 6, read/update with clearance 7.
- Widget configuration is persisted in `form_data`; list responses omit `config_data` while detail responses include the stored configuration.
- Partial updates to `config_data` merge with existing values so unspecified keys remain intact.

### widgets
- Catalog endpoints for widgets: creation/deletion with clearance 1, updates with clearance 2, reads with clearance 7.
- Widgets link to widget types and optional forms used to seed dashboard widget configuration payloads.

### widget_types
- Read-only catalog of widget type definitions (clearance 7) used to classify widgets.

### accounts
- Clearance 1 sessions can list or fetch any account without being scoped to memberships or the `Account` header, while higher clearances remain scoped to their linked accounts.
- Account retrieval keeps archived-filtering safeguards for higher roles and aligns pagination with the shared repository patterns.

### collaborators
- Clearance 1 can manage collaborators across accounts (create, update, delete) without being limited to the current `Account` header context.
- Collaborator APIs now return the collaborator payload after create/update operations and consistently include timestamp fields that match the database schema.

### users
- User-account associations align `created_at` defaults with database-managed timestamps to avoid client-provided values overriding server defaults.
