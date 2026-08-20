# MGD gateway contract tests

The route contract suite is separate from disposable-MySQL integration tests
and does not require production data or a live queue.

## Covered contract

- canonical gateway, component, device, device-config, point, group, schedule,
  special-day, extension, and bridge routes;
- collection GETs that return all associated device-config IDs without using
  `409` for multiplicity;
- gateway JSON projection in `applied` and `proposed` modes;
- strict `202` proposal responses and absence of canonical rows before
  `applied`;
- API-owned dependency resolution and materialization on `applied`;
- state transitions, cancellation, reconciliation, and target isolation;
- sparse `before_value`/`after_value` behavior;
- post-commit SQS dispatch, message/request tracing, and replay;
- importer overwrite/upsert, idempotence, dry-run rollback, force, and strict
  validation;
- invalid paths, payloads, scopes, duplicate links, and deterministic `409`
  responses instead of unexpected `500` errors.

The endpoint sweep runs representative reads and controlled invalid mutation
cases against the local API and dump. Valid writes use disposable MySQL
integration fixtures so the dump is never modified.

## Canonical identity assertions

Every singular route uses the ID exposed by its parent collection. In
particular:

```text
/devices/{child}/configs/{config}/points/{id_device_model_point}
/devices/{child}/point-groups/{id_setup_gateway_point_group}
/schedules/{schedule}
/special-days/{special_day}
/extensions/{extension}
```

Name-based paths, query-string singular resolvers, aggregate point routes under
`/devices/{child}`, and a bare device-config mutation route are not part of the
contract.

## Running tests

From the active platform repository:

```bash
tmp/ap-v4-tests/bin/pytest \
  stacks/api/tests/test_mgd_api_contract.py \
  stacks/api/tests/test_mgd_change_states_contract.py \
  stacks/api/tests/test_mgd_import_integration.py -q
```

The dump-based sweep is read-only for valid resources. A `500` in a controlled
case is a failure; domain collisions must be returned as `400`, `404`, or
`409` with a useful context.
