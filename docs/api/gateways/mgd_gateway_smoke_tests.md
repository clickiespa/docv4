# MGD Gateway Smoke Tests

This document describes the smoke-test set implemented for the MGD gateway API in `API-V4/tests/test_mgd_gateway_smoke.py`.

## Purpose

These smoke tests validate the HTTP contract and route wiring of the most critical MGD flows introduced around:

- component types keyed by `id_gateway_component_type`
- devices selected by `child_id_setup` and, only when needed, `id_setup_gateway_component`
- device points resolved from one device config
- point groups addressed from their relay_control device-config parent, resolved internally from the child setup
- special days created with `id_setup_gateway_component` in the body and resolved by `special_day_id`
- template apply
- config-change list and status update routes
- request validation for required fields and closed domains

They are intentionally **route-level smoke tests**, not full integration tests.

## How the tests run

The suite uses:

- `unittest` from the Python standard library
- `fastapi.testclient.TestClient`
- `app.dependency_overrides` to avoid MySQL-backed dependencies
- `unittest.mock.patch` to replace repository functions with controlled fakes
- local auth injection from the existing app middleware (`LOCAL_AUTH_*` settings patched in-memory)

Because of that, the tests verify:

- the route exists
- the request body/query/path are parsed correctly
- the route forwards the correct arguments to the repository layer
- the response envelope, status code, and headers are correct
- validation errors are exposed with the expected API format

They do **not** verify:

- real database persistence
- foreign-key enforcement by MySQL itself
- real SQS delivery
- end-to-end exporter behavior

## Command

Run the smoke tests from the repository root with:

```bash
source .venv/bin/activate
cd API-V4
python -m unittest tests.test_mgd_gateway_smoke -v
```

## Observed runner output

This is the successful output observed after the implementation:

```text
Ran 13 tests in 0.032s

OK
```

The environment also emitted two unrelated warnings during execution:

- a Pydantic v2 warning about a legacy config key in existing project code
- a deprecation warning in `helpers/logger.py` about `datetime.utcnow()`

Those warnings did not fail the smoke-test run.

## Coverage summary

The current smoke-test set contains 13 tests:

1. `test_get_gateway_component_type_smoke_uses_id_key`
2. `test_get_gateway_devices_smoke_forwards_component_filter`
3. `test_create_gateway_device_smoke_uses_body_component_and_sets_location`
4. `test_create_gateway_device_requires_device_key`
5. `test_get_gateway_device_smoke_forwards_component_query`
6. `test_delete_gateway_device_point_smoke_calls_delete_endpoint`
7. `test_create_point_group_smoke_uses_device_config_parent`
8. `test_get_point_group_smoke_uses_device_config_parent`
9. `test_create_gateway_special_day_smoke_uses_body_component`
10. `test_update_gateway_schedule_rejects_invalid_scope_value`
11. `test_apply_gateway_template_smoke_returns_change_group_payload`
12. `test_get_gateway_config_changes_smoke_forwards_filters`
13. `test_bulk_update_gateway_config_change_status_smoke_returns_rows`

## What each test proves

### 1. Component type detail uses the canonical id key

### Endpoint

```http
GET /mgd/gateways/component-types/{id_gateway_component_type}
```

### What it proves

- the component-type detail route is keyed by `id_gateway_component_type`
- the route no longer resolves catalog rows by `component_name`

### 2. Device list forwards the component filter

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices?id_setup_gateway_component=7001
```

### What it proves

- the list route is reachable
- `id_setup_gateway_component` is parsed from the query string
- the filter value is forwarded to `gateway_repository.list_gateway_devices(...)`

### 3. Device create uses `id_setup_gateway_component` in the body

### Endpoint

```http
POST /mgd/gateways/{id_setup}/devices
```

### What it proves

- the body carries the component selector
- the route returns `201`
- the route sets `Location` to the singular device selector form:

```text
/mgd/gateways/{id_setup}/devices/{child_id_setup}?id_setup_gateway_component={component_id}
```

### 4. Device create rejects missing `device_key`

### Endpoint

```http
POST /mgd/gateways/{id_setup}/devices
```

### What it proves

- `device_key` is mandatory at request-contract level
- the API exposes the validation error through the custom envelope

### 5. Singular device lookup forwards the component query selector

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}?id_setup_gateway_component=7001
```

### What it proves

- the singular route can individualize the device config when the child setup is ambiguous across components
- the route delegates the selector to `get_gateway_device_detail_by_selector(...)`

### 6. Point delete resolves only from the device selector

### Endpoint

```http
DELETE /mgd/gateways/{id_setup}/devices/{child_id_setup}/points/{name}?id_setup_gateway_component=7001
```

### What it proves

- the point route no longer requires `/components/...` in the path
- the route resolves a single device config first, then resolves the point from that device
- point deletes are wired to `setup_gateway_device_points` operations

### 7. Point-group create uses the device parent

### Endpoint

```http
POST /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups
```

### What it proves

- point-group creation resolves the relay_control `setup_gateway_device_configs` row from the child setup
- if no relay_control device config exists for the child, the route returns `404`
- the route returns the detailed point-group payload

### 8. Point-group detail uses the same device parent

### Endpoint

```http
GET /mgd/gateways/{id_setup}/devices/{child_id_setup}/point-groups/{point_group_name}
```

### What it proves

- the singular route is keyed by `point_group_name`, the same visible key exported in gateway JSON
- the route resolves the point group inside the selected device config

### 9. Special-day create resolves relay_control internally

### Endpoint

```http
POST /mgd/gateways/{id_setup}/special-days
```

### What it proves

- special-day creation no longer requires `id_setup_gateway_component` in the request body
- the API resolves the gateway `relay_control` component internally and still returns `id_setup_gateway_component` in the response
- the route selects the relay-control component from the body

### 10. Schedule rejects invalid `schedule_scope_type`

### Endpoint

```http
PUT /mgd/gateways/{id_setup}/schedules/{schedule_id}
```

### What it proves

- the request contract accepts only the closed domain `everyday | special_day`
- invalid scope values are rejected before repository execution

### 11. Template apply returns the expected change-group payload

### Endpoint

```http
POST /mgd/gateways/{id_setup}/templates/{id_gateway_config_template}/apply
```

### What it proves

- the route is wired
- the body is parsed correctly
- the route returns the expected `change_group_key` + `template_kind` structure

### 12. Config-change list forwards filters

### Endpoint

```http
GET /mgd/gateways/{id_setup}/config-changes
```

### What it proves

- the route is reachable
- the query filters are forwarded to the repository (`change_status`, `change_group_key`, `operation`)

### 13. Bulk config-change status update uses the PATCH update envelope

### Endpoint

```http
PATCH /mgd/gateways/{id_setup}/config-changes/status
```

### What it proves

- the bulk PATCH route is reachable
- the request body is mapped correctly
- the response uses the `PATCH` update envelope

## Important note about these smoke tests

These tests are ideal to catch:

- missing routes
- wrong request models
- broken response envelopes
- missing headers such as `Location`
- broken dependency injection / repository wiring
- accidental regressions in resource identification rules

For full confidence over the MGD canonical model, they should be complemented later with integration tests against a real MySQL schema created from `upgrade_v4.1.20_gw_json_structure.sql`.
