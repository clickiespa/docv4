# Scores

## Endpoints
- [List scores](#list-scores)

Scores expose monthly savings aggregates per asset. The endpoint automatically scopes the query to the non-archived assets that belong to the account sent in the `Account` header.

## List scores

Returns one aggregated row per active asset for the requested month and year. Clearance A1 administrators can access any account. All other authenticated users must belong to the requested account. No additional entity-specific clearance restriction is enforced for this endpoint.

### Endpoint
```text
GET /scores
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key from your profile. | string |
| `Account` | Yes | Account: `<ID_ACCOUNT>`. The endpoint resolves the active non-archived assets from this account and uses their `assets.id_asset` values as `id_clickie` in BigQuery. | int |

### Query parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `month` | No | int | Consumption month from `1` to `12`. Defaults to the current UTC month. |
| `year` | No | int | Consumption year. Defaults to the current UTC year. |

### Request body

This endpoint does not accept a request body.

### Pydantic models

- Response body: `ShowScore`

### Supported status codes

- `200`
- `400`
- `401`
- `403`
- `404`
- `500`

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/scores?month=6&year=2026"
```

### Sample response
```json
{
  "status": "success",
  "message": "1 elements obtained successfully",
  "data": [
    {
      "id_asset": 123,
      "cambio_tarifa": 1520.34,
      "ahorro_energia": 84.12,
      "total_oportunidad_ahorro": 115.5,
      "total_neto": 940.0,
      "score_ponderado": 0.8771276596,
      "score_ponderado_eq": 0.861
    }
  ],
  "context": {
    "query": {
      "month": "6",
      "year": "2026"
    }
  },
  "instance": "/scores"
}
```

### Error response example
```json
{
  "status": "error",
  "message": "User does not belong to the requested account",
  "data": null,
  "context": {
    "query": {
      "month": "6",
      "year": "2026"
    }
  },
  "instance": "/scores"
}
```

### Notes

- Archived assets (`asset_archived = true`) are excluded before the analytics query runs.
- Clearance A1 is required to bypass account membership checks. All other users must belong to the requested account.
