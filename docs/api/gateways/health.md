# GET /health

## Objective
Return the operational status of the Clickiemota API and echo the authenticated identity. Used by load balancers and operators to validate connectivity against the database and runtime.

## Authentication
* **Required** — must include the Clickie API key and account headers.

## Request
```http
GET /dev/clickiemottas/health HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

## Successful response
```json
{
  "status": "success",
  "data": {
    "service": "clickiemota",
    "version": "1.0",
    "uptime_ms": 3.14,
    "db": {
      "connected": true,
      "latency_ms": 7.52
    },
    "identity": {
      "account_id": 33,
      "account_identifier": "d01a3f87-7a1d-44d9-bfc9-16100ac34839",
      "user_id": "1",
      "user_email": "user@example.com"
    }
  }
}
```

## Error catalogue
| HTTP | code                  | When                                                  |
| ---- | --------------------- | ----------------------------------------------------- |
| 500  | internal_server_error | Any unexpected failure (function or database outage). |

