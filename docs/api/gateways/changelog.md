# Changelog

All notable changes to the Clickiemota API v4 are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
-

### Changed
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
