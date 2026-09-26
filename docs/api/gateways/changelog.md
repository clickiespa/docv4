# Changelog

All notable changes to the Clickiemota API v4 are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation audit — 2026-09-23
- `GET /v4/mgd/gateways/{id_setup}/config-changes` — Documented inclusive
  `from`/`to` UNIX-second filters over `created_at`, including inverted-range
  validation and composition with existing filters and pagination.
- MGD imports — Documented structured `400` validation for malformed device
  containers, missing physical point addresses, invalid schedules, and
  incomplete relay point groups, with rollback before commit.
- `PUT /v4/gateways/devices/{identifier}/config` — Documented body-level
  `subscription`, `mode=delete_specific`, `route`, `key`, and `missing_ok`.
- `POST /v4/gateways/devices/{identifier}/actions` — Documented `cache_only`
  and the `cache_not_found`, `device_rejected_request`, and
  `mqtt_bridge_unavailable` outcomes.

### Changed
- `POST /v4/mgd/gateways/{id_setup}/imports` — Documented the v4.3 per-device
  `special_days` list-only contract, including `special_days_invalid_format` in
  non-strict mode and `400` rejection in strict mode for legacy dictionaries.
- MGD importer documentation — Clarified `json_version >= v4.1`, component-level
  special-day mappings, `channel_configs` in component settings, ignored
  `connection.resource`, and the unchanged model-point catalog-gap behavior.

### Added
- `GET /v4/gateways/devices/{identifier}/config` — Added `device_read` query parameter; when set to `true`, bypasses the DynamoDB history cache and reads the configuration directly from the device via MQTT

### Changed
- MGD release `deploy/api/20260909T130511Z` (AP-v4 `Production`, Lambda
  version `32`) documents resource-centric `config-sync`, same-gateway retry
  wake-up, group cancellation by `change_group_key`, and the v4.3 importer
  contract.
- History examples now use inclusive `from`/`to` UNIX-second filters; omitted
  boundaries use the seven-day window and inverted ranges return `400`.
- MGD documentation — replaced proposal-only storage with eager write and
  compensation; documented option-B use-edge promotion, graph/catalog 409s,
  per-row sync, gateway snapshot apply, and cancellable states including
  `pending` with transactional compensation.
- MGD documentation — synchronized the canonical child-config routes,
  gateway JSON projection, config-change pagination/replay, cancellation rules,
  sparse history semantics, complete-snapshot importer reconciliation, and the explicit
  distinction between proposal-storage preparation and strict proposal-only
  activation.
- Endpoints related to configurations now filter *CMWS* from the device identifier to not use it on MQTT interactions nor saving the config on the database.
- `PUT /v4/gateways/devices/{identifier}/config` - Changed query param `subscription` to a body field.
- `GET /v4/gateways/devices/{identifier}/config` — Configuration reads now serve from DynamoDB (`cm-config-history`) instead of the SQL `devices.device_configuration` column; falls back to MQTT if no history entry exists
- `PUT /v4/gateways/devices/{identifier}/config` — Configuration writes now persist to DynamoDB (`cm-config-history`) via `save_cm_config` instead of updating the SQL `devices` table
- `GET /v4/gateways/devices` — Updated route prefix from `/dev/clickiemottas/` to `/v4/gateways/`
- `GET /v4/gateways/devices/{identifier}` — Updated route prefix from `/dev/clickiemottas/` to `/v4/gateways/`
- `GET /v4/gateways/devices/{identifier}/config` — Updated route prefix from `/dev/clickiemottas/` to `/v4/gateways/`
- `PUT /v4/gateways/devices/{identifier}/config` — Updated route prefix from `/dev/clickiemottas/` to `/v4/gateways/`
- `GET /v4/gateways/health` — Updated route prefix from `/dev/clickiemottas/` to `/v4/gateways/`

### Fixed
-

### Deprecated
-

### Removed
-

### Security
- 

## [Previous Releases]

---

### Guidelines for Changelog Entries

- **Added** — New features or endpoints
- **Changed** — Changes to existing functionality
- **Fixed** — Bug fixes
- **Deprecated** — Features marked for future removal
- **Removed** — Deleted features or endpoints
- **Security** — Security patches or vulnerability fixes

### Format for Each Entry

```markdown
- [ENDPOINT] — Brief description of change (e.g., `GET /devices/{id}` — Added status field to response)
```
