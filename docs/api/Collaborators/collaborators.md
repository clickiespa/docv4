# Collaborators

## Endpoints
- [List collaborators](#list-collaborators)
- [Create collaborator](#create-collaborator)
- [Get collaborator](#get-collaborator)
- [Update collaborator](#update-collaborator)
- [Delete collaborator](#delete-collaborator)
- [Collaborator event history](#collaborator-event-history)

Endpoints related to user management within an account.

Collaborator is the given name of a user registered on the platform.
A collaborator exists in a specific environment and can be [assigned to an account](../Scope/accounts.md#add-collaborator-to-account) to interact with.
A collaborator assigned to an account can interact with a defined set of resources based on the collaborator’s clearance level on the account.

## List collaborators

Retrieve all collaborators linked to the current account.

### Endpoint
```
GET /collaborators
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |

### Query parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `skip` | no | int | Offset for pagination |
| `limit` | no | int | Max records to return |
| `updated_at_from` | no | int | Inclusive UNIX timestamp in seconds for an incremental read. |
| `cursor` | no | string | Opaque cursor from the `X-Next-Updated-At-Cursor` response header. |

### Incremental reads

For the first page, provide `updated_at_from`. The API fixes the upper bound
to the current UTC second and compares the effective timestamp
(`updated_at`, or `created_at` when `updated_at` is null). Rows are ordered by
that timestamp and `id_user` in ascending order. If more rows remain, the
response includes `X-Next-Updated-At-Cursor`; pass it as `cursor` on the next
request with `skip=0`.

`updated_at_from` and `cursor` cannot be combined, and a non-zero `skip` with a
cursor returns `400`. Requests without either parameter keep the existing
offset pagination. The collection contains current account-visible users only;
it does not provide deletion tombstones. Use reconciliation or event history
when removals must be detected.

### Request headers example
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" \
  <HOST_NAME>/collaborators?updated_at_from=1788307200&limit=100
```

When another page exists, continue with the response header:

```http
X-Next-Updated-At-Cursor: <opaque-cursor>
```

### Sample response
```json
{
  "status": "success",
  "message": "Collaborators retrieved",
  "data": [{"id_user": 1, "user_email": "john@example.com"}],
  "context": null,
  "instance": "/collaborators"
}
```

 

## Create collaborator

Create a new collaborator for the current account.

### Endpoint
```
POST /collaborators
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |
| `Content-Type` | yes | `application/json` | string |

### Request body

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `user_email` | yes | string | Email address |
| `user_name` | yes | string | First name |
| `user_last_name` | yes | string | Last name |
| `id_role` | no | int | Role ID |
| `id_language` | no | int | Language ID (see [List languages](../Global_resources/languages.md#list-languages)) |
| `id_time_zone` | yes | int | Time zone ID (see [List time zones](../Global_resources/time_zones.md#list-time-zones)) |

### Sample request
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"user_email":"new@example.com","user_name":"New","user_last_name":"User","id_time_zone":1}' \
  <HOST_NAME>/collaborators
```

### Sample response
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_user": 2, "user_email": "new@example.com"},
  "context": null,
  "instance": "/collaborators"
}
```

## Get collaborator

Retrieve details for a specific collaborator.

### Endpoint
```
GET /collaborators/{id_user}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_user}` | Collaborator numeric identifier | int |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" <HOST_NAME>/collaborators/<ID_USER>
```

### Sample response
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_user": 2, "user_email": "new@example.com"},
  "context": null,
  "instance": "/collaborators/<ID_USER>"
}
```

## Update collaborator

Modify details of an existing collaborator.

### Endpoint
```
PUT /collaborators/{id_user}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |
| `Content-Type` | yes | `application/json` | string |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_user}` | Collaborator numeric identifier | int |

### Request body

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `user_email` | no | string | Email address |
| `user_name` | no | string | First name |
| `user_last_name` | no | string | Last name |
| `id_role` | no | int | Role ID |
| `id_language` | no | int | Language ID (see [List languages](../Global_resources/languages.md#list-languages)) |
| `id_time_zone` | no | int | Time zone ID (see [List time zones](../Global_resources/time_zones.md#list-time-zones)) |

Updating the email changes login credentials.

### Sample request
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Updated"}' \
  <HOST_NAME>/collaborators/<ID_USER>
```

### Sample response
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_user": 2, "user_email": "new@example.com"},
  "context": null,
  "instance": "/collaborators/<ID_USER>"
}
```

## Delete collaborator

Remove a collaborator from the current account.

### Endpoint
```
DELETE /collaborators/{id_user}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_user}` | Collaborator numeric identifier | int |

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" <HOST_NAME>/collaborators/<ID_USER>
```

### Sample response
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/collaborators/<ID_USER>"
}
```


## Collaborator event history

Retrieve clickie event history for a collaborator in the current account. Clearance 7 is required to use this endpoint.

### Endpoint
```
GET /collaborators/{id_user}/history
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key generated from your profile | string |
| `Account` | yes | Target account identifier. Use `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Required | Description | Type |
| --- | --- | --- | --- |
| `{id_user}` | yes | Collaborator numeric identifier from [Get collaborator](#get-collaborator) | int |

### Query parameters

| Parameter | Required | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `from` | no | Inclusive start of the time range in UNIX seconds. | int | `now - 7 days` when `to` is omitted; otherwise `to - 7 days` |
| `to` | no | Inclusive end of the time range in UNIX seconds. | int | `now` |
| `skip` | no | Offset for pagination. | int | `0` |
| `limit` | no | Maximum number of event rows to return. | int | `100` |
| `id_event_type` | no | Filter results by event type: `1` login, `2` creation, `3` modification, `4` deletion. | int | none |

`from` and `to` are optional and inclusive. If both are omitted, the endpoint
uses the last seven days. If only one is present, the missing boundary is
derived from that value or the current UTC time. An inverted explicit range
(`from > to`) returns `400`; the API does not swap the values.

### Request headers example
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
  "<HOST_NAME>/collaborators/<ID_USER>/history?from=1788307200&to=1788393600&skip=0&limit=100&id_event_type=3"
```

### Sample response
```json
{
  "status": "success",
  "message": "Elements obtained successfully",
  "data": [
    {
      "id_event": 1250,
      "id_resource": 42,
      "event_description": "API actualización de activo Main compressor",
      "event_changes": "{\"asset_name\":{\"before\":\"Old\",\"after\":\"Main compressor\"}}",
      "created_at": "2026-05-06T12:00:00Z",
      "event_type_description": "Modification",
      "entity_name": "assets"
    }
  ],
  "context": {},
  "instance": "/collaborators/<ID_USER>/history"
}
```

### Error responses
```json
{
  "status": "error",
  "message": "Element not found",
  "data": null,
  "context": {},
  "instance": "/collaborators/<ID_USER>/history"
}
```

### Status codes

| Status code | Description |
| --- | --- |
| `200` | Collaborator event history returned successfully |
| `400` | Invalid pagination parameters or an inverted time range (`from > to`) |
| `401` | Missing or invalid API key |
| `403` | The authenticated collaborator does not have access to the requested account |
| `404` | Collaborator was not found in the current account |
| `500` | Unexpected server error |

### Pydantic models

Response items use `CollaboratorEventHistoryItem` from `schemas.users.history`. The standard JSON response envelope contains `status`, `message`, `data`, `context`, and `instance` as described in the [Getting Started guide](../Getting_started_with_v4/getting_started.md).
