# Jobs endpoints — implementation guidelines (lineamientos)

> The jobs subsystem already exists in the shared services built by Mati. Integrate with that storage instead of creating a new persistence layer. These notes outline the contracts expected by the Clickiemota API.

---

## GET /jobs/{job_id}

### Objective
Fetch the status and result of a previously created job.

### Behaviour
* Retrieve the job from the shared jobs repository keyed by `job_id`.
* Ensure the job belongs to the authenticated account and device.
* Return the full job envelope (status, result, timestamps, execution mode).

### Successful response example
```json
{
  "status": "success",
  "data": {
    "job_id": "6b8f8d5a-2b0a-4b8c-b99f-4f61d1ae1a01",
    "identifier": "cm-001",
    "action_name": "restart_device",
    "status": "succeeded",
    "result": {"message": "Device reboot simulated", "took_ms": 1200},
    "submitted_at": "2025-09-29T12:00:00Z",
    "execution_mode": "stub"
  }
}
```

### Error catalogue
| HTTP | code | When |
| ---- | ---- | ---- |
| 404 | not_found | Job does not exist or does not belong to the account/device. |
| 500 | internal_server_error | Unexpected repository failure. |

---

## POST /jobs/{job_id}/cancel

### Objective
Cancel an in-flight job when it is still `created`, `queued`, or `running`.

### Behaviour
* Delegate the state transition to the shared jobs service so consistency rules remain centralised.
* When cancellation succeeds, return the updated job snapshot.
* If the job is already terminal, surface `409 conflict` with `code: job_not_cancellable`.

### Successful response example
```json
{
  "status": "success",
  "data": {
    "job_id": "6b8f8d5a-2b0a-4b8c-b99f-4f61d1ae1a01",
    "status": "canceled"
  }
}
```

### Error catalogue
| HTTP | code | When |
| ---- | ---- | ---- |
| 404 | not_found | Job not found. |
| 409 | job_not_cancellable | Job is already in a terminal state. |
| 500 | internal_server_error | Unexpected failure cancelling the job. |

---

## GET /devices/{identifier}/jobs

### Objective
List jobs for a device with cursor-based pagination.

### Behaviour
* Support query params `status`, `limit` (1..200, default 50), and `cursor`.
* Delegate pagination tokens to the shared jobs repository (reusing Mati's implementation).
* Response must include `items` and `next_cursor` in the standard list envelope.

### Successful response example
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "job_id": "6b8f8d5a-2b0a-4b8c-b99f-4f61d1ae1a01",
        "action_name": "resend_data",
        "status": "succeeded",
        "submitted_at": "2025-09-29T12:00:00Z"
      }
    ],
    "next_cursor": null
  }
}
```

### Error catalogue
| HTTP | code | When |
| ---- | ---- | ---- |
| 400 | validation_error | Invalid limit or cursor token. |
| 404 | not_found | Device not recognised. |
| 500 | internal_server_error | Unexpected failure retrieving jobs. |

---

### Notes for integration with Mati's job system
* Use the existing job repository client for reads/writes to keep deduplication and state transitions consistent across services.
* Every job created by `POST /devices/{identifier}/actions` must be persisted through this shared service even in stub mode.
* Emit structured audit logs (`type="job_finalized"`) when jobs complete or transition to a terminal state.
