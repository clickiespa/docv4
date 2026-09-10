# Locations

## Endpoints
- [List locations](#list-locations)
- [Create location](#create-location)
- [Get location](#get-location)
- [Update location](#update-location)
- [Delete location](#delete-location)

Reusable geographic locations that can be linked to assets and devices within the active account.

## List locations
Retrieves the locations visible to the authenticated account. Results are filtered by the active `Account` header and may also include shared records with `id_account = null`.

Clearance with read permission on the `location` resource is required to use this endpoint.

### Endpoint
```
GET /locations
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID represented as `Account: <ID_ACCOUNT>` | int |

### Query parameters

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `skip` | No | Pagination offset. Default: `0`. | int |
| `limit` | No | Maximum number of rows to return. Default: `100`. | int |
| `search` | No | Partial match against `location_name`, `location_description`, `location_address`, `location_city`, `location_province`, `location_region`, and `location_country`. | string |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/locations?search=Planta&limit=20"
```

### Sample response
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [
    {
      "id_location": 500010,
      "id_account": 500001,
      "location_name": "Planta Norte",
      "location_description": "Main access",
      "location_address": "Av. Siempre Viva 123, Santiago, Chile",
      "location_city": "Santiago",
      "location_province": "Santiago",
      "location_region": "Región Metropolitana",
      "location_country": "Chile",
      "location_longitude": -70.669265,
      "location_latitude": -33.44889
    }
  ],
  "context": {},
  "instance": "/locations"
}
```

### Error responses
```json
{
  "status": "error",
  "message": "Insufficient permissions",
  "data": null,
  "context": {
    "headers": {
      "Account": "<ID_ACCOUNT>"
    }
  },
  "instance": "/locations"
}
```

### Status codes
- `200` — Locations retrieved successfully.
- `400` — Invalid pagination or query filters.
- `401` — Missing or invalid credentials.
- `403` — Clearance level is insufficient for the `location` resource.
- `404` — Not used for this collection endpoint.
- `500` — Internal server error.

## Create location
Creates a new account-scoped location. The API automatically assigns `id_account` from the active session.

Clearance with create permission on the `location` resource is required to use this endpoint.

### Endpoint
```
POST /locations
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID represented as `Account: <ID_ACCOUNT>` | int |
| `Content-Type` | Yes | `application/json` | string |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `location_name` | Yes | string | No | Display name of the location. Maximum length: `100`. |
| `location_description` | No | string | null | Free-form description. |
| `location_address` | Yes | string | No | Formatted address. Maximum length: `500`. |
| `location_city` | No | string | null | City extracted from the address data. |
| `location_province` | No | string | null | Province or state. |
| `location_region` | No | string | null | Administrative region. |
| `location_country` | No | string | null | Country name. |
| `location_longitude` | Yes | number | No | Longitude between `-180` and `180`. |
| `location_latitude` | Yes | number | No | Latitude between `-90` and `90`. |

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

### Sample request
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "location_name": "Planta Norte",
    "location_description": "Main access",
    "location_address": "Av. Siempre Viva 123, Santiago, Chile",
    "location_city": "Santiago",
    "location_province": "Santiago",
    "location_region": "Región Metropolitana",
    "location_country": "Chile",
    "location_longitude": -70.669265,
    "location_latitude": -33.44889
  }' \
  /locations
```

### Sample response
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_location": 500010,
    "id_account": 500001,
    "location_name": "Planta Norte",
    "location_description": "Main access",
    "location_address": "Av. Siempre Viva 123, Santiago, Chile",
    "location_city": "Santiago",
    "location_province": "Santiago",
    "location_region": "Región Metropolitana",
    "location_country": "Chile",
    "location_longitude": -70.669265,
    "location_latitude": -33.44889
  },
  "context": {},
  "instance": "/locations"
}
```

### Error responses
```json
{
  "status": "error",
  "message": "Input should be less than or equal to 90",
  "data": null,
  "context": {
    "body": {
      "location_latitude": 120
    }
  },
  "instance": "/locations"
}
```

### Status codes
- `201` — Location created successfully.
- `400` — Invalid payload.
- `401` — Missing or invalid credentials.
- `403` — Clearance level is insufficient for the `location` resource.
- `404` — Not used for this endpoint.
- `500` — Internal server error.

## Get location
Retrieves a single location visible to the authenticated account.

Clearance with read permission on the `location` resource is required to use this endpoint.

### Endpoint
```
GET /locations/{id_location}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID represented as `Account: <ID_ACCOUNT>` | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_location` | Yes | int | Numeric identifier returned by [List locations](#list-locations). |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /locations/500010
```

### Sample response
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_location": 500010,
    "id_account": 500001,
    "location_name": "Planta Norte",
    "location_description": "Main access",
    "location_address": "Av. Siempre Viva 123, Santiago, Chile",
    "location_city": "Santiago",
    "location_province": "Santiago",
    "location_region": "Región Metropolitana",
    "location_country": "Chile",
    "location_longitude": -70.669265,
    "location_latitude": -33.44889
  },
  "context": {},
  "instance": "/locations/500010"
}
```

### Status codes
- `200` — Location retrieved successfully.
- `400` — Invalid identifier.
- `401` — Missing or invalid credentials.
- `403` — Clearance level is insufficient for the `location` resource.
- `404` — The location does not exist or is not visible to the current account.
- `500` — Internal server error.

## Update location
Updates an existing location. Omitted fields keep their current value.

Clearance with update permission on the `location` resource is required to use this endpoint.

### Endpoint
```
PUT /locations/{id_location}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID represented as `Account: <ID_ACCOUNT>` | int |
| `Content-Type` | Yes | `application/json` | string |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_location` | Yes | int | Numeric identifier returned by [List locations](#list-locations). |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `location_name` | No | string | No | Display name of the location. Maximum length: `100`. |
| `location_description` | No | string | null | Free-form description. |
| `location_address` | No | string | No | Formatted address. Maximum length: `500`. |
| `location_city` | No | string | null | City extracted from the address data. |
| `location_province` | No | string | null | Province or state. |
| `location_region` | No | string | null | Administrative region. |
| `location_country` | No | string | null | Country name. |
| `location_longitude` | No | number | No | Longitude between `-180` and `180`. |
| `location_latitude` | No | number | No | Latitude between `-90` and `90`. |

### Sample request
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{
    "location_description": "Updated access point",
    "location_latitude": -33.4489
  }' \
  /locations/500010
```

### Sample response
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_location": 500010,
    "id_account": 500001,
    "location_name": "Planta Norte",
    "location_description": "Updated access point",
    "location_address": "Av. Siempre Viva 123, Santiago, Chile",
    "location_city": "Santiago",
    "location_province": "Santiago",
    "location_region": "Región Metropolitana",
    "location_country": "Chile",
    "location_longitude": -70.669265,
    "location_latitude": -33.4489
  },
  "context": {},
  "instance": "/locations/500010"
}
```

### Status codes
- `200` — Location updated successfully.
- `400` — Invalid payload.
- `401` — Missing or invalid credentials.
- `403` — Clearance level is insufficient for the `location` resource.
- `404` — The location does not exist or is not visible to the current account.
- `500` — Internal server error.

## Delete location
Soft deletes an existing location.

Clearance with delete permission on the `location` resource is required to use this endpoint.

### Endpoint
```
DELETE /locations/{id_location}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID represented as `Account: <ID_ACCOUNT>` | int |

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_location` | Yes | int | Numeric identifier returned by [List locations](#list-locations). |

### Sample request
```bash
curl -X DELETE \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  /locations/500010
```

### Sample response
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": {},
  "instance": "/locations/500010"
}
```

### Status codes
- `200` — Location deleted successfully.
- `400` — Invalid identifier.
- `401` — Missing or invalid credentials.
- `403` — Clearance level is insufficient for the `location` resource.
- `404` — The location does not exist or is not visible to the current account.
- `500` — Internal server error.
