# MGD gateway contract tests

The route contract suite is separate from disposable-MySQL integration tests
and does not require production data or a live queue.

## Covered contract

- canonical gateway, component, device, device-config, point, group, schedule,
  special-day, extension, and bridge routes;
- collection GETs that return all associated device-config IDs without using
  `409` for multiplicity;
- gateway JSON projection in `applied` and `proposed` modes;
- `202` responses with a real `id_resource` after the entity write;
- API-owned confirmation on `applied` and compensation on `cancelled`/`failed`;
- cancellable states include `on_hold`, `pending`, and `retry`; a worker that
  arrives after a pending cancellation receives `409`;
- option-B use-edge promotion (group → schedule also promotes extensions
  already bound to that schedule);
- extension dispatch only when bound to a dispatchable schedule;
- graph 409s (`resource_has_active_change`,
  `related_resource_has_active_change`) and catalog `live_dependency`;
- state transitions, cancellation, reconciliation (`include_children` only on
  the gateway path), and target isolation;
- optional `scheduled_at` on individual and bulk status PATCH requests;
- sparse `before_value`/`after_value` behavior;
- post-commit SQS dispatch of `{id_setup_gateway, id_account}`, snapshot
  apply, `PATCH applied` of every materialized pending row, and replay;
- complete-snapshot importer reconciliation (upsert present rows and delete
  absent managed rows), idempotence, dry-run rollback, force, and strict
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
  stacks/api/tests/test_mgd_dispatch_bindings.py \
  stacks/api/tests/test_mgd_import_integration.py -q
```

The dump-based sweep is read-only for valid resources. A `500` in a controlled
case is a failure; domain collisions must be returned as `400`, `404`, or
`409` with a useful context.
