# Entity attributes

## Endpoints

- [List definitions](#list-definitions)
- [Get definition](#get-definition)
- [Create definition](#create-definition)
- [Update definition](#update-definition)
- [Delete definition](#delete-definition)
- [List entity attribute catalog](#list-entity-attribute-catalog)
- [List entity values](#list-entity-values)
- [List resource values](#list-resource-values)
- [List resource value history](#list-resource-value-history)
- [Create resource values](#create-resource-values)
- [Update resource values](#update-resource-values)
- [Delete resource value](#delete-resource-value)
- [List assignments](#list-assignments)
- [Get assignment](#get-assignment)
- [Create assignment](#create-assignment)
- [Update assignment](#update-assignment)
- [Delete assignment](#delete-assignment)

Entity attributes implement the EAV pattern (`attribute_definitions`, `attribute_assignments`, and `attribute_values`). Paths use **`entity_name`** slugs instead of numeric `id_entity` values.

The resource-value implementation currently supports `user`, `metric`, `inventory`, and `globalcontext`. The entity catalog and assignment routes also require the target EAV entity to exist and have attributes enabled. See [EAV entities](./eav_entities.md).

All requests require `Authorization` and `Account` headers. Definition routes use the authenticated account session. Entity-scoped routes additionally check the method permission configured for the requested entity; the handlers do not declare one universal numeric clearance level.

### Sample headers

```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>",
  "Content-Type": "application/json"
}
```

## Scope rules

Definitions and assignments may set optional `id_account` and `id_environment` scope values:

| `id_environment` | `id_account` | Visible to |
| --- | --- | --- |
| `null` | `null` | All accounts and environments |
| set | `null` | All accounts in that environment |
| `null` | set | That account only |
| set | set | That account only; the account must belong to the environment |

When `id_account` is set, the row applies only to that account regardless of `id_environment`. Reads are filtered by the account in the `Account` header.

## List definitions

List definitions visible to the authenticated account.

Clearance note: the route has no fixed numeric minimum; an authenticated account session is required.

### Endpoint
```text
GET /definitions
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Query parameters
| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | No | string | No | Exact attribute type filter. |
| `code` | No | string | No | Exact attribute code filter. |
| `scope_key` | No | string | No | Exact scope-key filter. |
| `name` | No | string | No | Case-insensitive partial name filter. |
| `skip` | No | int | `0` | Number of records to skip. |
| `limit` | No | int | `100` | Maximum number of records to return. |

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response item: `ShowDefinition` (`List[ShowDefinition]`).

### Sample headers
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -G -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  --data-urlencode "type=float" --data-urlencode "limit=100" /definitions
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [{
    "id_attribute": 10,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "scope_key": "account:25",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null,
    "created_by": 1,
    "created_at": "2026-01-01T00:00:00",
    "updated_at": null
  }],
  "context": {},
  "instance": "/definitions"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Definitions retrieved successfully. |
| `400` | Account metadata is invalid or unavailable. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The authenticated user does not belong to the requested account. |
| `500` | Unexpected server error. |

## Get definition

Retrieve one definition visible to the authenticated account.

Clearance note: the route has no fixed numeric minimum; an authenticated account session is required.

### Endpoint
```text
GET /definitions/{id_attribute}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_attribute` | Yes | positive int | Definition identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response: `ShowDefinition`.

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /definitions/10
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_attribute": 10,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "scope_key": "account:25",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null,
    "created_by": 1,
    "created_at": "2026-01-01T00:00:00",
    "updated_at": null
  },
  "context": {},
  "instance": "/definitions/10"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Definition retrieved successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The authenticated user does not belong to the requested account. |
| `404` | The definition does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## Create definition

Create an attribute definition. For `type=options`, `options` must be a non-empty object; for every other type, `options` must be omitted or `null`.

Clearance note: the route has no fixed numeric minimum; an authenticated account session is required.

### Endpoint
```text
POST /definitions
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Query parameters
This endpoint does not accept query parameters.

### Request body
| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | Yes | string | No | Display name; maximum 45 characters. |
| `code` | No | string | `null` | Stable code; maximum 100 characters. |
| `scope_key` | Yes | string | No | Scope key; maximum 120 characters. |
| `description` | No | string | `null` | Help text. |
| `type` | Yes | string | No | `string`, `int`, `float`, `boolean`, `date`, `datetime`, `text`, `time`, or `options`. |
| `default` | No | string | `null` | Default value; maximum 255 characters. |
| `options` | No | object | `null` | Option-key map; required and non-empty when `type` is `options`. |
| `id_environment` | No | positive int | `null` | Environment scope. |
| `id_account` | No | positive int | `null` | Account scope; when set, it must match the `Account` header. |

### Pydantic models
- Request: `DefinitionCreate`.
- Response: `ShowDefinition`.

### Sample request
```json
{
  "name": "KPI factor",
  "code": "kpi_factor",
  "scope_key": "account:25",
  "description": "Multiplier used for KPI calculations",
  "type": "float",
  "default": "1",
  "id_account": 25
}
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_attribute": 10,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "scope_key": "account:25",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null,
    "created_by": 1,
    "created_at": "2026-01-01T00:00:00",
    "updated_at": null
  },
  "context": {},
  "instance": "/definitions"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `201` | Definition created successfully. |
| `400` | Invalid type, options, scope, or field value. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The authenticated user does not belong to the requested account. |
| `500` | Unexpected server error. |

## Update definition

Update one definition. Omitted fields remain unchanged; fields explicitly sent as `null` are cleared where the model allows it.

Clearance note: the route has no fixed numeric minimum; an authenticated account session is required.

### Endpoint
```text
PUT /definitions/{id_attribute}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_attribute` | Yes | positive int | Definition identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | No | string or null | `null` | New display name; maximum 45 characters. |
| `code` | No | string or null | `null` | New stable code; maximum 100 characters. |
| `scope_key` | No | string or null | `null` | New scope key; maximum 120 characters. |
| `description` | No | string or null | `null` | New help text. |
| `type` | No | string or null | `null` | New attribute type from the supported list. |
| `default` | No | string or null | `null` | New default value; maximum 255 characters. |
| `options` | No | object or null | `null` | Option-key map. |
| `id_environment` | No | positive int or null | `null` | New environment scope. |
| `id_account` | No | positive int or null | `null` | New account scope; when non-null it must match the `Account` header. |

An empty JSON object is valid and leaves the definition unchanged. The update handler validates a new `type`, but does not revalidate the relationship between `type` and `options`.

### Pydantic models
- Request: `DefinitionUpdate`.
- Response: `ShowDefinition`.

### Sample request
```json
{
  "description": "Updated multiplier used for KPI calculations",
  "default": "1.0"
}
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_attribute": 10,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "scope_key": "account:25",
    "description": "Updated multiplier used for KPI calculations",
    "type": "float",
    "default": "1.0",
    "options": null,
    "created_by": 1,
    "created_at": "2026-01-01T00:00:00",
    "updated_at": "2026-01-02T00:00:00"
  },
  "context": {},
  "instance": "/definitions/10"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Definition updated successfully. |
| `400` | Invalid type, scope, or field value. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The authenticated user does not belong to the requested account. |
| `404` | The definition does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## Delete definition

Delete one definition. Related assignments and values may be removed by the database foreign-key cascade.

Clearance note: the route has no fixed numeric minimum; an authenticated account session is required.

### Endpoint
```text
DELETE /definitions/{id_attribute}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `id_attribute` | Yes | positive int | Definition identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response: no body; the handler returns HTTP `204 No Content`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /definitions/10
```

### Sample response (204)
The response has no body.

### Status codes
| Status | Description |
| --- | --- |
| `204` | Definition deleted successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The authenticated user does not belong to the requested account. |
| `404` | The definition does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## List entity attribute catalog

List the definitions assigned to an entity. The response includes definition metadata and has null value fields when no resource value is present.

Clearance note: the authenticated account must have the entity's `read` permission.

### Endpoint
```text
GET /entities/{entity_name}/attributes
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | EAV entity slug with attributes enabled. |

### Query parameters
| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | No | string | No | Exact attribute type filter. |
| `code` | No | string | No | Exact attribute code filter. |
| `name` | No | string | No | Case-insensitive partial name filter. |
| `when_entity` | No | string | No | Conditional entity slug used by an assignment. |
| `when_id_resource` | No | positive int | No | Conditional resource identifier used by an assignment. |
| `skip` | No | int | `0` | Number of records to skip. |
| `limit` | No | positive int | `100` | Maximum number of records to return. |

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response item: `ShowAttributeItem` (`List[ShowAttributeItem]`).

### Sample request
```bash
curl -G -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  --data-urlencode "type=float" --data-urlencode "limit=100" /entities/metric/attributes
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [{
    "entity_name": "metric",
    "assignment_id": 21,
    "attribute_id": 10,
    "code": "kpi_factor",
    "name": "KPI factor",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null,
    "order": 0,
    "when_entity": null,
    "when_id_resource": null,
    "id_value": null,
    "value": null,
    "effective_at": null
  }],
  "context": {},
  "instance": "/entities/metric/attributes"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Attribute catalog retrieved successfully. |
| `400` | Account metadata is invalid or unavailable. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `read` permission. |
| `404` | The entity or `when_entity` does not exist or does not support attributes. |
| `500` | Unexpected server error. |

## List entity values

List current values for one entity across zero, one, or several resources. This route returns current rows only; use [List resource value history](#list-resource-value-history) for historized rows.

Clearance note: the authenticated account must have the entity's `read` permission.

### Endpoint
```text
GET /entities/{entity_name}/values
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, or `globalcontext`. |

### Query parameters
| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_resource` | No | positive int | No | Filter by one resource. |
| `id_resources` | No | string | No | Comma-separated resource IDs; takes precedence over `id_resource`. |
| `assignment_id` | No | positive int | No | Filter by assignment. |
| `code` | No | string | No | Exact attribute code filter. |
| `skip` | No | int | `0` | Number of records to skip. |
| `limit` | No | positive int | `100` | Maximum number of records to return. |

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response: `ShowBulkValues`, containing `ShowValueItem` entries.

### Sample request
```bash
curl -G -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  --data-urlencode "id_resources=1,2" --data-urlencode "code=kpi_factor" /entities/metric/values
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": {
    "entity_name": "metric",
    "values": [{
      "entity_name": "metric",
      "id_resource": 1,
      "assignment_id": 21,
      "attribute_id": 10,
      "code": "kpi_factor",
      "name": "KPI factor",
      "type": "float",
      "value": "1",
      "id_value": 80,
      "effective_at": "1900-01-01T00:00:00"
    }]
  },
  "context": {},
  "instance": "/entities/metric/values"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Current values retrieved successfully. |
| `400` | Account metadata or a query value is invalid. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `read` permission. |
| `404` | The entity does not exist or does not support attributes. |
| `500` | Unexpected server error. |

## List resource values

Return the attribute catalog for one resource, merged with its current values. An attribute with no stored value has `id_value`, `value`, and `effective_at` set to `null`.

Clearance note: the authenticated account must have the entity's `read` permission.

### Endpoint
```text
GET /entities/{entity_name}/resources/{id_resource}/values
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, or `globalcontext`. |
| `id_resource` | Yes | positive int | Resource identifier within the entity. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response item: `ShowAttributeItem` (`List[ShowAttributeItem]`).

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /entities/metric/resources/1/values
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [{
    "entity_name": "metric",
    "assignment_id": 21,
    "attribute_id": 10,
    "code": "kpi_factor",
    "name": "KPI factor",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null,
    "order": 0,
    "when_entity": null,
    "when_id_resource": null,
    "id_value": 80,
    "value": "1",
    "effective_at": "1900-01-01T00:00:00"
  }],
  "context": {},
  "instance": "/entities/metric/resources/1/values"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Resource values retrieved successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `read` permission. |
| `404` | The entity or resource does not exist, is outside the account scope, or does not support attributes. |
| `500` | Unexpected server error. |

## List resource value history

List all historized value rows for one resource. Results are ordered by `effective_at` descending and then `id_value` descending.

Clearance note: the authenticated account must have the entity's `read` permission.

### Endpoint
```text
GET /entities/{entity_name}/resources/{id_resource}/values/history
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, or `globalcontext`. |
| `id_resource` | Yes | positive int | Resource identifier within the entity. |

### Query parameters
| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `assignment_id` | No | positive int | No | Filter history by assignment. |
| `skip` | No | int | `0` | Number of records to skip. |
| `limit` | No | positive int | `100` | Maximum number of records to return. |

### Request body
This endpoint does not accept a request body.

### Response shape

The handler does not declare a FastAPI response model. The response `data` is an array with these fields:

| Field | Type | Description |
| --- | --- | --- |
| `id_value` | positive int | Value-row identifier. |
| `entity_name` | string | Requested entity slug. |
| `id_resource` | positive int | Requested resource identifier. |
| `assignment_id` | positive int | Assignment identifier. |
| `attribute_id` | positive int | Definition identifier. |
| `value` | string or null | Stored value. |
| `effective_at` | datetime | Business-effective timestamp. |

### Pydantic models

- Response: no declared FastAPI model; the dynamic history item shape is documented above.

### Sample request
```bash
curl -G -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  --data-urlencode "assignment_id=21" /entities/metric/resources/1/values/history
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [{
    "id_value": 80,
    "entity_name": "metric",
    "id_resource": 1,
    "assignment_id": 21,
    "attribute_id": 10,
    "value": "1",
    "effective_at": "1900-01-01T00:00:00"
  }],
  "context": {},
  "instance": "/entities/metric/resources/1/values/history"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Value history retrieved successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `read` permission. |
| `404` | The entity or resource does not exist, is outside the account scope, or does not support attributes. |
| `500` | Unexpected server error. |

## Create resource values

Create current values for a resource. If an item includes `effective_at`, the API appends a historized value instead of creating the default current row. A current value already present for the same assignment returns `409`.

Clearance note: the authenticated account must have the entity's `create` permission.

### Endpoint
```text
POST /entities/{entity_name}/resources/{id_resource}/values
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, or `globalcontext`. |
| `id_resource` | Yes | positive int | Resource identifier within the entity. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `values` | No | array | `[]` | Value items to create. |
| `values[].assignment_id` | Yes when an item is present | positive int | No | Assignment belonging to the requested entity. |
| `values[].value` | No | string or null | `null` | Value to store; normalized for boolean and options attributes. |
| `values[].effective_at` | No | datetime or null | `null` | Append a historical row instead of a default current row. |

### Pydantic models
- Request: `ValuesCreate` containing `ValueWriteItem` entries.
- Response item: `ShowAttributeItem` (`List[ShowAttributeItem]`).

### Sample request
```json
{
  "values": [
    {"assignment_id": 21, "value": "1"},
    {"assignment_id": 21, "value": "0.9", "effective_at": "2026-01-15T00:00:00"}
  ]
}
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Elements created successfully",
  "data": [],
  "context": {},
  "instance": "/entities/metric/resources/1/values"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `201` | Values created successfully. |
| `400` | Assignment does not apply, the value is invalid, or a request value is invalid. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `create` permission. |
| `404` | The entity, resource, or assignment does not exist or is outside the account scope. |
| `409` | A current value already exists for an item without `effective_at`. |
| `500` | Unexpected server error. |

## Update resource values

Update current values for a resource. By default every target assignment must already have a current value. Set `upsert=true` to create missing current rows. An item with `effective_at` always appends a historical row and ignores `upsert`.

Clearance note: the authenticated account must have the entity's `update` permission.

### Endpoint
```text
PUT /entities/{entity_name}/resources/{id_resource}/values
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, or `globalcontext`. |
| `id_resource` | Yes | positive int | Resource identifier within the entity. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `upsert` | No | bool | `false` | Create a current row when the assignment has no current value. |
| `values` | No | array | `[]` | Value items to update. |
| `values[].assignment_id` | Yes when an item is present | positive int | No | Assignment belonging to the requested entity. |
| `values[].value` | No | string or null | `null` | New value to store. |
| `values[].effective_at` | No | datetime or null | `null` | Append a historical row; this ignores `upsert`. |

### Pydantic models
- Request: `ValuesUpdate` containing `ValueWriteItem` entries.
- Response item: `ShowAttributeItem` (`List[ShowAttributeItem]`).

### Sample request
```json
{
  "upsert": true,
  "values": [{"assignment_id": 21, "value": "1.1"}]
}
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements updated successfully",
  "data": [],
  "context": {},
  "instance": "/entities/metric/resources/1/values"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Values updated successfully. |
| `400` | Assignment does not apply, no current value exists with `upsert=false`, the value is invalid, or a request value is invalid. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `update` permission. |
| `404` | The entity, resource, or assignment does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## Delete resource value

Delete one stored value row for a resource.

Clearance note: the authenticated account must have the entity's `delete` permission.

### Endpoint
```text
DELETE /entities/{entity_name}/resources/{id_resource}/values/{id_value}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, or `globalcontext`. |
| `id_resource` | Yes | positive int | Resource identifier within the entity. |
| `id_value` | Yes | positive int | Stored value-row identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response: no body; the handler returns HTTP `204 No Content`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /entities/metric/resources/1/values/80
```

### Sample response (204)
The response has no body.

### Status codes
| Status | Description |
| --- | --- |
| `204` | Value deleted successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `delete` permission. |
| `404` | The entity, resource, or value does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## List assignments

List assignments and their definition metadata for an entity.

Clearance note: the authenticated account must have the entity's `read` permission.

### Endpoint
```text
GET /entities/{entity_name}/assignments
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | EAV entity slug with attributes enabled. |

### Query parameters
| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `skip` | No | int | `0` | Number of records to skip. |
| `limit` | No | positive int | `100` | Maximum number of records to return. |

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response item: `ShowAssignment` (`List[ShowAssignment]`).

### Sample request
```bash
curl -G -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  --data-urlencode "skip=0" --data-urlencode "limit=100" /entities/metric/assignments
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [{
    "id_assignment": 21,
    "entity_name": "metric",
    "attribute_id": 10,
    "order": 0,
    "when_entity": null,
    "when_id_resource": null,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null
  }],
  "context": {},
  "instance": "/entities/metric/assignments"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Assignments retrieved successfully. |
| `400` | Account metadata is invalid or unavailable. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `read` permission. |
| `404` | The entity does not exist or does not support attributes. |
| `500` | Unexpected server error. |

## Get assignment

Retrieve one assignment and its definition metadata.

Clearance note: the authenticated account must have the entity's `read` permission.

### Endpoint
```text
GET /entities/{entity_name}/assignments/{id_assignment}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | EAV entity slug with attributes enabled. |
| `id_assignment` | Yes | positive int | Assignment identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response: `ShowAssignment`.

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /entities/metric/assignments/21
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_assignment": 21,
    "entity_name": "metric",
    "attribute_id": 10,
    "order": 0,
    "when_entity": null,
    "when_id_resource": null,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null
  },
  "context": {},
  "instance": "/entities/metric/assignments/21"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Assignment retrieved successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `read` permission. |
| `404` | The entity or assignment does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## Create assignment

Assign a definition to an entity. The operation is idempotent for the same logical key; if that assignment already exists, the existing assignment is returned with the route's `201` status.

Clearance note: the authenticated account must have the entity's `create` permission.

### Endpoint
```text
POST /entities/{entity_name}/assignments
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | EAV entity slug with attributes enabled. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `attribute_id` | Yes | positive int | No | Definition identifier. |
| `order` | No | int | `0` | Display order. |
| `when_entity` | No | string or null | `null` | Conditional entity slug. |
| `when_id_resource` | No | positive int or null | `null` | Conditional resource identifier. |
| `id_environment` | No | positive int or null | `null` | Environment scope; when set it must match the account environment. |
| `id_account` | No | positive int or null | Current `Account` header | Account scope; a non-null value must match the `Account` header. |

If `id_account` is omitted or sent as `null`, the assignment is stored for the account in the `Account` header. `when_entity` is resolved to an EAV entity and must exist when supplied.

### Pydantic models
- Request: `AssignmentCreate`.
- Response: `ShowAssignment`.

### Sample request
```json
{
  "attribute_id": 10,
  "order": 0,
  "when_entity": null,
  "when_id_resource": null
}
```

### Sample response (201)
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_assignment": 21,
    "entity_name": "metric",
    "attribute_id": 10,
    "order": 0,
    "when_entity": null,
    "when_id_resource": null,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null
  },
  "context": {},
  "instance": "/entities/metric/assignments"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `201` | Assignment created or the existing logical assignment returned. |
| `400` | Scope or request value is invalid. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `create` permission. |
| `404` | The entity, definition, or conditional entity does not exist or support attributes. |
| `500` | Unexpected server error. |

## Update assignment

Update an assignment. Omitted fields remain unchanged; fields explicitly sent as `null` are cleared where the model and scope permissions allow it.

Clearance note: the authenticated account must have the entity's `update` permission.

### Endpoint
```text
PUT /entities/{entity_name}/assignments/{id_assignment}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |
| `Content-Type` | Yes | Must be `application/json`. | string |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | EAV entity slug with attributes enabled. |
| `id_assignment` | Yes | positive int | Assignment identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `order` | No | int or null | `null` | New display order. |
| `when_entity` | No | string or null | `null` | New conditional entity slug. |
| `when_id_resource` | No | positive int or null | `null` | New conditional resource identifier. |
| `id_environment` | No | positive int or null | `null` | New environment scope. |
| `id_account` | No | positive int or null | `null` | New account scope; a non-null value must match the `Account` header. |

An empty JSON object is valid and leaves the assignment unchanged.

### Pydantic models
- Request: `AssignmentUpdate`.
- Response: `ShowAssignment`.

### Sample request
```json
{"order": 10}
```

### Sample response (200)
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {
    "id_assignment": 21,
    "entity_name": "metric",
    "attribute_id": 10,
    "order": 10,
    "when_entity": null,
    "when_id_resource": null,
    "id_environment": null,
    "id_account": 25,
    "name": "KPI factor",
    "code": "kpi_factor",
    "description": "Multiplier used for KPI calculations",
    "type": "float",
    "default": "1",
    "options": null
  },
  "context": {},
  "instance": "/entities/metric/assignments/21"
}
```

### Status codes
| Status | Description |
| --- | --- |
| `200` | Assignment updated successfully. |
| `400` | Scope or request value is invalid. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `update` permission. |
| `404` | The entity, assignment, or conditional entity does not exist or is outside the account scope. |
| `500` | Unexpected server error. |

## Delete assignment

Delete one assignment.

Clearance note: the authenticated account must have the entity's `delete` permission.

### Endpoint
```text
DELETE /entities/{entity_name}/assignments/{id_assignment}
```

### Headers
| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | Yes | API key generated from your profile | string |
| `Account` | Yes | Target account ID | int |

### Path parameters
| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | EAV entity slug with attributes enabled. |
| `id_assignment` | Yes | positive int | Assignment identifier. |

### Query parameters
This endpoint does not accept query parameters.

### Request body
This endpoint does not accept a request body.

### Pydantic models
- Response: no body; the handler returns HTTP `204 No Content`.

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  /entities/metric/assignments/21
```

### Sample response (204)
The response has no body.

### Status codes
| Status | Description |
| --- | --- |
| `204` | Assignment deleted successfully. |
| `401` | Authentication or authorizer context is invalid. |
| `403` | The entity does not grant the required `delete` permission. |
| `404` | The entity or assignment does not exist or is outside the account scope. |
| `500` | Unexpected server error. |
