# Logs & observability endpoints — implementation guidelines (lineamientos)

> These endpoints remain in **stub mode** for Phase A. Provide deterministic responses seeded from fixtures to unblock client integrations while the real telemetry pipeline is prepared.

---

## GET /devices/{identifier}/logs

### Objective
Return stubbed log lines for a device with optional filters.

### Behaviour
* Accept query params `since`, `until`, `level`, `limit` (1..5000, default 500), and `cursor`.
* Validate time ranges (`since < until`) and allowed log levels (`debug`, `info`, `warn`, `error`).
* Load logs from fixtures and slice them deterministically according to the filters.

### Successful response example
```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "items": [
      {"ts": "2025-09-29T01:00:00Z", "level": "info", "msg": "boot ok"},
      {"ts": "2025-09-29T01:05:02Z", "level": "warn", "msg": "ntp drift 2s"}
    ],
    "next_cursor": null
  }
}
```

### Error catalogue
| HTTP | code                  | When                                     |
| ---- | --------------------- | ---------------------------------------- |
| 404  | not_found             | Device missing a log fixture.            |
| 422  | invalid_parameters    | Time range invalid or level not allowed. |
| 500  | internal_server_error | Unexpected failure.                      |

---

## GET /devices/{identifier}/disk

### Objective
Expose stubbed disk/partition usage metrics.

### Behaviour
* Return partitions defined in fixtures with bounded jitter (e.g., ±5% usage) to emulate variability.

### Successful response example
```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "partitions": [
      {"mount": "/", "total_bytes": 2147483648, "used_bytes": 1048576000, "pct_used": 48.8},
      {"mount": "/data", "total_bytes": 8589934592, "used_bytes": 2147483648, "pct_used": 25.0}
    ]
  }
}
```

### Error catalogue
| HTTP | code                  | When                           |
| ---- | --------------------- | ------------------------------ |
| 404  | not_found             | Device missing a disk fixture. |
| 500  | internal_server_error | Unexpected failure.            |

---

## GET /devices/{identifier}/backup/coverage

### Objective
Report the backup coverage window (earliest and latest stored payload) so clients can determine valid replay ranges.

### Behaviour
* Accept optional query param `dataset` that maps to the datasets defined in the action fixtures (e.g., `telemetry`, `events`, `images`).
* Response should indicate the dataset resolved, `coverage_start_at`, and `coverage_end_at`.
* If the dataset has gaps, surface them under `gaps` with ISO-8601 intervals so the frontend can highlight missing ranges.

### Successful response example
```json
{
  "status": "success",
  "data": {
    "dataset": "telemetry",
    "coverage_start_at": "2025-06-01T00:00:00Z",
    "coverage_end_at": "2025-09-29T09:00:00Z",
    "gaps": [
      {"start": "2025-07-14T00:00:00Z", "end": "2025-07-14T06:00:00Z"}
    ]
  }
}
```

### Error catalogue
| HTTP | code                  | When                             |
| ---- | --------------------- | -------------------------------- |
| 404  | not_found             | Device missing a backup fixture. |
| 422  | invalid_parameters    | Dataset not supported.           |
| 500  | internal_server_error | Unexpected failure.              |

---

### Fixture notes
* Co-locate observability fixtures with the action fixtures under `src/fixtures/devices/` using keys such as `logs`, `disk`, and `backup`.
* Ensure responses stay deterministic for the same inputs to simplify contract testing.
