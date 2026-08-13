# MGD Config-Change States and Activation

This document is the public contract for `setup_gateway_config_changes`, the
tracked write log used by the MGD gateway configuration API.

All values are case-sensitive. The API does not create or accept the legacy
`requested` state.

## State domain

| State | Meaning | Terminal |
| --- | --- | --- |
| `on_hold` | The change is recorded but its target setup is not currently eligible for external processing. | No |
| `pending` | The change is eligible for the external configuration processor. | No |
| `in_progress` | The external processor has started the change. | No |
| `retry` | The external processor must attempt the change again. | No |
| `cancelled` | The change was cancelled. | Yes |
| `applied` | The change was applied successfully. | Yes |
| `failed` | Processing failed or was exhausted. | Yes |

## Allowed transitions

```text
on_hold     -> pending | cancelled
pending     -> in_progress | cancelled
in_progress -> retry | applied | failed
retry       -> cancelled | in_progress
```

`cancelled`, `applied`, and `failed` have no outgoing transitions. Sending the
current state again is an idempotent no-op.

Manual `PATCH` status endpoints accept only `in_progress`, `retry`, `failed`,
`applied`, and `cancelled`. `on_hold` and `pending` are controlled internally
by the API and reconciliation flow.

## Initial state and installation predicate

A tracked mutation starts as:

- `pending` when the target setup has an active main installation;
- `on_hold` when it does not.

The installation predicate requires an active `device_setups` row with
`setup_uninstall_date IS NULL`, a non-accessory device, and a device that has
not been deleted. Gateway and child setups are independent targets: installing
one does not promote changes belonging to another child.

Reads never create changes and never promote them.

## Reconciliation

Installing or replacing a device does not automatically promote held changes.
Call:

```http
POST /mgd/setups/{id_setup}/config-changes/reconcile
```

with:

```json
{
  "include_children": false
}
```

The endpoint promotes only `on_hold` changes whose target is installed. With
`include_children=true`, a gateway request also evaluates its child setups.
The response separates `promoted`, `unchanged`, `blocked`, and `demoted`
changes and includes `promoted_count`.

## Target isolation and conflicts

`id_resource` is interpreted together with `id_entity`; it is not a global
identifier. The API resolves the target through the canonical foreign-key
relationships for components, device configs, points, point groups, schedules,
extensions, and special days. Delete operations use the stored
`before_value` snapshot when the row is no longer present.

A new tracked mutation conflicts with another non-terminal change for the same
setup target. Gateway and child targets do not block one another. Rows created
by one operation share a `change_group_key` and are treated as one logical
change group.

## Notifications

After an effective mutation commits with `pending` status, API-V4 sends one
best-effort message to the configured MGD processor queue:

```json
{
  "id_setup_gateway": 123,
  "id_account": 456
}
```

The destination is configured with `MGD_CONFIG_CHANGES_QUEUE_URL`. `on_hold`
mutations, reads, idempotent writes, and manual status patches do not publish
this event. Queue retries, dead-letter handling, and processor behavior are
outside this API contract.

## Imports

An effective import records its normalized inserts and updates as terminal
`applied` changes under one `change_group_key`. By default an import rejects a
target that already has non-terminal changes. `force=true` cancels those
changes in the same transaction before writing the imported resources.

`dry_run=true` never cancels existing changes and rolls back both normalized
data writes and tracking rows.

## Response synchronization

MGD resource responses may expose a `config_sync` object with the target setup,
installation state, synchronization flag, status counts, and latest change.
Consumers should treat a target with non-terminal changes as potentially
different from the external canonical configuration until the processor marks
the changes terminal.

