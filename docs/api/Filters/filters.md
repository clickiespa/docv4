# Filters

/table of contents

## Endpoints
- [List filters](#list-filters)

## List filters

Retrieve every filter available to the authenticated account and environment.

Clearance level 7 or lower with read permission over filters is required to use this endpoint.

### Endpoint

```http
GET /filters
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key generated from your profile | string |
| `Account` | yes | Account: \<ID_ACCOUNT\> | int |

### Path parameters

Not applicable.

### Query parameters

Not applicable.

### Request body

Not applicable.

### Pydantic models

- Response body: `ShowFilter` (`API-V4/schemas/filters.py`).

### Supported status codes

- `200`
- `201`
- `400`
- `401`
- `403`
- `404`
- `500`

### Sample request

```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /filters
```

### Sample response

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": [
    {
      "id_filter": 500001,
      "id_environment": 1,
      "id_account": 33,
      "filter_name": "Main plant assets",
      "filter_description": "Assets assigned to main plant",
      "filter_code": "{\"id_asset\":[1,2,3]}",
      "param_1_description": "Asset selector",
      "param_2_description": null,
      "created_at": "2026-02-24T00:00:00Z"
    }
  ],
  "context": {},
  "instance": "/filters"
}
```

### Error response example

```json
{
  "status": "error",
  "message": "Unauthorized",
  "data": {},
  "context": {},
  "instance": "/filters"
}
```
