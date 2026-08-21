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

Entity attributes implement the EAV pattern (`attribute_definitions`, `attribute_assignments`, `attribute_values`). Paths use **`entity_name`** slugs instead of numeric `id_entity`.

**Supported entities (v1):** `user`, `metric`, `inventory`, `globalcontext`

Clearance on each entity is enforced through existing `clearance_resources` rows in the database.

### Scope rules

Definitions and assignments may set optional `id_account` and `id_environment`:

| `id_environment` | `id_account` | Visible to |
| --- | --- | --- |
| `null` | `null` | All accounts and environments |
| set | `null` | All accounts in that environment |
| `null` | set | That account only |
| set | set | That account only (account must belong to the environment) |

When `id_account` is set, the row applies only to that account regardless of `id_environment`. Reads are always filtered by the `Account` header.

## List definitions

Clearance level 2 (Read) or lower is required.

### Endpoint

```
GET /definitions
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | No | string | No | Filter by attribute type |
| `code` | No | string | No | Filter by attribute code |
| `scope_key` | No | string | No | Filter by scope key |
| `name` | No | string | No | Partial name match |
| `skip` | No | int | `0` | Pagination offset |
| `limit` | No | int | `100` | Page size |

### Sample response (200)

```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [
    {
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
      "created_at": "2026-01-01 00:00:00",
      "updated_at": null
    }
  ],
  "context": {},
  "instance": "/definitions"
}
```

## Get definition

### Endpoint

```
GET /definitions/{id_attribute}
```

## Create definition

Clearance level 1 (Write) is required.

### Endpoint

```
POST /definitions
```

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | Yes | string | No | Display name |
| `code` | No | string | No | Stable code |
| `scope_key` | Yes | string | No | Scope key paired with `code` |
| `description` | No | string | No | Help text |
| `type` | Yes | string | No | `string`, `int`, `float`, `boolean`, `date`, `datetime`, `text`, `time`, `options` |
| `default` | No | string | No | Default value |
| `options` | No | object | No | Required when `type` is `options` |
| `id_environment` | No | int | No | Environment scope; `null` for all environments |
| `id_account` | No | int | No | Account scope; `null` for environment-wide or global |

## Update definition

### Endpoint

```
PUT /definitions/{id_attribute}
```

## Delete definition

### Endpoint

```
DELETE /definitions/{id_attribute}
```

## List entity attribute catalog

Returns assignments and definition metadata available for the entity in the current account. Clearance read permission on the target entity is required.

### Endpoint

```
GET /entities/{entity_name}/attributes
```

### Path parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `entity_name` | Yes | string | One of `user`, `metric`, `inventory`, `globalcontext` |

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | No | string | No | Filter by attribute type |
| `code` | No | string | No | Filter by code |
| `name` | No | string | No | Partial name match |
| `when_entity` | No | string | No | Conditional entity slug |
| `when_id_resource` | No | int | No | Conditional resource id |
| `skip` | No | int | `0` | Pagination offset |
| `limit` | No | int | `100` | Page size |

## List entity values

### Endpoint

```
GET /entities/{entity_name}/values
```

### Query parameters

| Parameter | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_resource` | No | int | No | Filter by one resource |
| `id_resources` | No | string | No | Comma-separated resource ids |
| `assignment_id` | No | int | No | Filter by assignment |
| `code` | No | string | No | Filter by attribute code |
| `skip` | No | int | `0` | Pagination offset |
| `limit` | No | int | `100` | Page size |

## List resource values

Merged catalog and current values for one resource (UI form equivalent).

### Endpoint

```
GET /entities/{entity_name}/resources/{id_resource}/values
```

## List resource value history

### Endpoint

```
GET /entities/{entity_name}/resources/{id_resource}/values/history
```

## Create resource values

Adds values for a resource. Returns `409` when a current value already exists for the same assignment. Clearance update permission on the target entity is required.

### Endpoint

```
POST /entities/{entity_name}/resources/{id_resource}/values
```

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `values` | Yes | array | No | Items to create |
| `values[].assignment_id` | Yes | int | No | Assignment id |
| `values[].value` | No | string | No | Stored value |
| `values[].effective_at` | No | datetime | No | When set, appends history instead of creating the current row |

## Update resource values

### Endpoint

```
PUT /entities/{entity_name}/resources/{id_resource}/values
```

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `upsert` | No | bool | `false` | When `true`, create the current row if missing |
| `values` | Yes | array | No | Items to update |
| `values[].assignment_id` | Yes | int | No | Assignment id |
| `values[].value` | No | string | No | New value |
| `values[].effective_at` | No | datetime | No | When set, appends history (ignores `upsert`) |

## Delete resource value

### Endpoint

```
DELETE /entities/{entity_name}/resources/{id_resource}/values/{id_value}
```

## List assignments

### Endpoint

```
GET /entities/{entity_name}/assignments
```

## Get assignment

### Endpoint

```
GET /entities/{entity_name}/assignments/{id_assignment}
```

## Create assignment

Idempotent: returns the existing row when the same logical key already exists.

### Endpoint

```
POST /entities/{entity_name}/assignments
```

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `attribute_id` | Yes | int | No | Definition id |
| `order` | No | int | `0` | Display order |
| `when_entity` | No | string | No | Conditional entity slug |
| `when_id_resource` | No | int | No | Conditional resource id |
| `id_environment` | No | int | No | Scope environment |
| `id_account` | No | int | No | Scope account |

## Update assignment

### Endpoint

```
PUT /entities/{entity_name}/assignments/{id_assignment}
```

## Delete assignment

### Endpoint

```
DELETE /entities/{entity_name}/assignments/{id_assignment}
```
