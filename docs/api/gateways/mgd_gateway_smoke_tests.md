# MGD Gateway Contract Tests

The MGD route-level suite protects the public contract used by the platform
configuration UI and its external configuration processor. It is intentionally
separate from database integration tests and does not require a production
database or a live SQS queue.

## Current coverage

The contract suite verifies:

- targeted extension mutations and the absence of obsolete bulk-delete routes;
- template CRUD and the component, protocol, and schedule-type catalogs;
- point collection filters (`point_type` and `writable`);
- primary-key point paths using `id_device_model_point`;
- point-group point deletion using the same primary key;
- the reconcile route at `/mgd/setups/{id_setup}/config-changes/reconcile`;
- the `force` import query parameter;
- independent gateway and child configuration scopes;
- device configuration creation without an artificial `setup_metrics`
  prerequisite;
- the exact state domain and transition machine;
- FK-scoped pending promotion, installation reconciliation, and target
  conflicts;
- post-commit SQS event payloads, local queue no-op behavior, and queue-failure
  isolation;
- importer normalization, idempotent applied tracking, and dry-run rollback.

## Contract assertions

### Canonical identifiers

The suite rejects the retired REST identifiers and protects these replacements:

| Resource | Current contract | Retired form |
| --- | --- | --- |
| Device point path | `{id_device_model_point}` | `{name}` |
| Point activation body | `id_device_model_point_ids` | `point_names` |
| Schedule type | `id_gateway_schedule_type` | `schedule_type` |
| Schedule scope | integer `0` or `1` | string `everyday` or `special_day` |
| Component type detail | `{id_gateway_component_type}` | `{component_name}` |

The response model may still include descriptive fields such as
`point_label`, `component_name`, and `schedule_type_key`. Those fields are
labels; they are not resource selectors for the REST routes.

### Config-change lifecycle

The suite verifies the exact states:

```text
on_hold -> pending -> in_progress -> retry -> in_progress
                                      \-> applied
                                      \-> failed
```

It also verifies cancellation edges and terminal-state behavior. Manual
status patches cannot force `on_hold` or `pending`; those states are managed by
effective writes and reconciliation.

### Import behavior

The importer tests cover the following contract:

- canonical root payloads and wrapped `data.config` payloads are normalized;
- effective imports create terminal `applied` tracking rows;
- a repeated equivalent import is idempotent;
- `dry_run=true` rolls back normalized rows and tracking rows;
- `force=true` is the explicit path for cancelling existing non-terminal
  changes before a real import;
- strict mode turns importer flags into hard errors.

### Event behavior

An effective mutation that commits as `pending` emits one message containing:

```json
{
  "id_setup_gateway": 123,
  "id_account": 456
}
```

The event is sent after the database commit. An unset queue is a local no-op,
and a queue send failure does not turn a committed HTTP mutation into a failed
database transaction.

## Running the implementation suite

The tests live with the active platform implementation. From that repository,
run the focused contract groups with the project test runner, for example:

```bash
pytest stacks/api/tests/test_mgd_api_contract.py \
       stacks/api/tests/test_mgd_change_states_contract.py \
       stacks/api/tests/test_mgd_events_contract.py \
       stacks/api/tests/test_mgd_importer_contract.py \
       stacks/api/tests/test_mgd_import_integration.py -q
```

The exact command may vary with the platform repository's virtual environment.
The test suite is not a substitute for validating the deployed API, the
external MGD processor, or the production queue policy.
