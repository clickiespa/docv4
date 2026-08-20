# MGD gateway JSON projection

```http
GET /mgd/gateways/{id_setup}/config-json?projection=proposed
```

`projection=applied` reads only canonical rows. `projection=proposed` overlays
active `on_hold`, `pending`, `in_progress`, and `retry` proposals in creation
order. Both modes are read-only: they do not promote statuses, materialize
rows, send SQS, or write `config_changes`.

## Response

```json
{
  "id_setup": 501234,
  "id_setup_gateway": 501234,
  "projection": "proposed",
  "status": "complete",
  "active_change_ids": [901],
  "cancelled_change_ids": [],
  "failed_change_ids": [],
  "unresolved": [],
  "config": {
    "json_version": "v4.1",
    "components": {},
    "schedules": {}
  }
}
```

The `config` document is the functional shape consumed by the importer. It
uses gateway JSON keys such as component keys, `device_key`, schedule type and
number, and point IDs. The wrapper metadata retains IDs useful for diagnosis.

Creates without an integer ID are represented in the proposal layer by their
`resource_key`; the projection never fabricates an ID. If a proposed
relationship references another un-applied proposal, `unresolved` reports the
dependency and the document must not be dispatched.

Cancelled changes are excluded. A cancelled create is absent, a cancelled
update leaves the canonical value, and a cancelled delete leaves the resource.
Failed changes appear in `failed_change_ids` and `unresolved`; a new proposal
is required before retrying the business operation.

The API materializes the canonical entity only when the external worker calls
the status endpoint with `applied`. The entity write, generated ID, and status
update are one database transaction. SQS replay is a separate explicit
operation and does not alter this projection.

`400` means an invalid projection or request, `404` means an out-of-scope
gateway, and `409` means a deterministic relationship/dependency conflict.
An unexpected `500` is an implementation defect.
