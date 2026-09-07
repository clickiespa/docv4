# Assets

## Endpoints
- [List assets](#list-assets)
- [Create asset](#create-asset)
- [Get asset](#get-asset)
- [Update asset](#update-asset)
- [Prepare asset file upload](#prepare-asset-file-upload)
- [Get asset root folder](#get-asset-root-folder)
- [Complete file upload](#complete-file-upload)
- [Cancel file upload](#cancel-file-upload)
- [Get file signed URL](#get-file-signed-url)
- [List folder contents](#list-folder-contents)
- [Delete file](#delete-file)
- [Delete folder](#delete-folder)
- [Delete asset](#delete-asset)

An asset is a physical entity with a specific real location and is mainly used as a central node on which other entities such as metrics or dashboards are associated. Each asset exists only within a specific account and has an asset type that is used to differentiate between assets and their designated function in one or more accounts.

Asset files are stored in folders. Every asset has one root folder where `folders.id_entity` points to the Asset entity and `folders.id_resource` stores `assets.id_asset`. Subfolders are linked only through `folders.id_folder_parent` and do not repeat `id_entity` or `id_resource`.

## List assets

Clearance level 7 or lower is required to use this endpoint.

### Endpoint
```
GET /assets
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
| `archived` | no | bool | Filter by archive state. Omit to return both active and archived assets. |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets
```

### Sample response
```json
{
  "status": "success",
  "message": "Assets retrieved",
  "data": [{"id_asset": 1, "asset_name": "Building", "asset_archived": false}],
  "context": null,
  "instance": "/assets"
}
```

## Create asset

Clearance level 5 or lower is required to use this endpoint.

Creating an asset also creates its root folder with `folder_name = asset_name`.

### Endpoint
```
POST /assets
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |
| `Content-Type` | yes | `application/json` | string |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_category` | yes | int | No | Asset category ID from [List categories](../Types/asset_categories.md#list-categories). |
| `id_location` | no | int | null | Location ID from [List locations](../Global_resources/locations.md#list-locations). |
| `asset_name` | yes | string | No | Display name |
| `asset_description` | no | string | null | Description |
| `asset_observations` | no | string | null | Notes |

### Sample request
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"id_category":1,"id_location":500010,"asset_name":"Building"}' \
  /assets
```

### Sample response
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_asset": 2, "asset_name": "Building", "asset_archived": false},
  "context": null,
  "instance": "/assets"
}
```

## Get asset

Clearance level 7 or lower is required to use this endpoint.

### Endpoint
```
GET /assets/{id_asset}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_asset}` | Asset numeric identifier | int |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets/2
```

### Sample response
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_asset": 2, "asset_name": "Building", "asset_archived": false},
  "context": null,
  "instance": "/assets/2"
}
```


## Update asset

Clearance level 5 or lower is required to use this endpoint.

When `asset_name` changes, the asset root folder is renamed to the same value.

### Endpoint
```
PUT /assets/{id_asset}
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
| `{id_asset}` | Asset numeric identifier | int |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `id_category` | no | int | null | Asset category ID from [List categories](../Types/asset_categories.md#list-categories). |
| `id_file_picture` | no | int | null | Picture file ID (icon management is currently restricted). |
| `id_location` | no | int | null | Location ID from [List locations](../Global_resources/locations.md#list-locations). |
| `asset_name` | no | string | null | Display name |
| `asset_description` | no | string | null | Description |
| `asset_observations` | no | string | null | Notes |
| `asset_archived` | no | bool | null | Archive state |

### Sample request
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"asset_description":"Updated"}' \
  /assets/2
```

### Sample response
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_asset": 2, "asset_name": "Building", "asset_archived": false},
  "context": null,
  "instance": "/assets/2"
}
```

## Prepare asset file upload

Clearance level 5 or lower is required to use this endpoint.

Creates file metadata with `file_uploaded = false`, resolves or creates the target folder inside the asset tree, and returns a presigned S3 `PUT` URL. The binary file must be uploaded directly to S3 using the returned URL. This endpoint uses `PrepareUploadRequest` and returns `PrepareUploadResponse`.

### Endpoint
```
POST /assets/{id_asset}/files/prepare-upload
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |
| `Content-Type` | yes | `application/json` | string |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_asset}` | Asset numeric identifier | int |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `file.name` | yes | string | No | Original filename including extension. |
| `file.type` | no | string | null | MIME type used for the S3 upload. |
| `file.size` | yes | int | No | File size in bytes. Must be between `2500` and `52428800`. |
| `target.id_folder` | no | int | null | Existing folder ID inside this asset tree. |
| `target.folder_path` | no | array[string] | null | Folder path relative to the asset root. Missing folders are created. |

### Sample request
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"file":{"name":"manual tecnico.pdf","type":"application/pdf","size":184234},"target":{"folder_path":["Visitas tecnicas","2026"]}}' \
  /assets/2/files/prepare-upload
```

### Sample response
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "asset": {"id_asset": 2, "asset_name": "Building"},
    "folder": {"id_folder": 456, "folder_name": "2026", "path": ["Building", "Visitas tecnicas", "2026"]},
    "file": {
      "id_file": 789,
      "file_name": "manual tecnico",
      "file_ext": "pdf",
      "file_type": "application/pdf",
      "file_size": 184234,
      "file_is_image": false,
      "file_uploaded": false,
      "file_key": "550e8400-e29b-41d4-a716-446655440000.pdf",
      "s3_key": "77/550e8400-e29b-41d4-a716-446655440000.pdf"
    },
    "upload": {
      "method": "PUT",
      "signed_url": "https://s3-presigned-url.example",
      "expires_in_seconds": 86400,
      "headers": {"Content-Type": "application/pdf"}
    },
    "download": {"signed_url": "https://s3-presigned-url.example"}
  },
  "context": null,
  "instance": "/assets/2/files/prepare-upload"
}
```

Supported status codes: `201`, `400`, `401`, `403`, `404`, `422`, `500`.

## Get asset root folder

Clearance level 7 or lower is required to use this endpoint.

Gets the asset root folder, creating it if the asset existed before root-folder support.

### Endpoint
```
GET /assets/{id_asset}/folders/root
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_asset}` | Asset numeric identifier | int |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets/2/folders/root
```

### Sample response
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_folder": 456, "folder_name": "Building", "id_resource": 2, "path": ["Building"]},
  "context": null,
  "instance": "/assets/2/folders/root"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `500`.

## Complete file upload

Clearance level 5 or lower is required to use this endpoint.

Marks a pending file as uploaded after validating the object exists in S3 with `HeadObject`. The endpoint is idempotent if the file is already uploaded. This endpoint uses `CompleteUploadRequest` and returns `CompleteUploadResponse`.

### Endpoint
```
POST /files/{id_file}/complete-upload
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |
| `Content-Type` | yes | `application/json` | string |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_file}` | File numeric identifier | int |

### Request body

| Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `status` | yes | string | No | Must be `uploaded`. |

### Sample request
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  -H "Content-Type: application/json" \
  -d '{"status":"uploaded"}' \
  /files/789/complete-upload
```

### Sample response
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_file": 789, "file_uploaded": true},
  "context": null,
  "instance": "/files/789/complete-upload"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `409`, `500`.

## Cancel file upload

Clearance level 5 or lower is required to use this endpoint.

Cancels a pending upload created by `prepare-upload`. The endpoint soft deletes the pending `files` row, attempts to delete the S3 object if it exists, and prunes empty subfolders created for that upload. The asset root folder is never deleted by this operation. Uploaded files cannot be cancelled; use `DELETE /files/{id_file}` for uploaded files. This endpoint returns `CancelUploadResponse`.

### Endpoint
```
POST /files/{id_file}/cancel-upload
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_file}` | Pending file numeric identifier returned by `prepare-upload` | int |

### Sample request
```bash
curl -X POST -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /files/789/cancel-upload
```

### Sample response
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_file": 789, "cancelled": true, "pruned_folder_ids": [457]},
  "context": null,
  "instance": "/files/789/cancel-upload"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `409`, `500`.

## Get file signed URL

Clearance level 7 or lower is required to use this endpoint.

Returns a presigned S3 download URL only when the file belongs to the requested account and `file_uploaded = true`.

### Endpoint
```
GET /files/{id_file}/signed-url
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_file}` | File numeric identifier | int |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /files/789/signed-url
```

### Sample response
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_file": 789, "available": true, "url": "https://s3-presigned-url.example"},
  "context": null,
  "instance": "/files/789/signed-url"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `500`.

## List folder contents

Clearance level 7 or lower is required to use this endpoint.

Lists subfolders and uploaded files in a folder that belongs to an asset in the requested account. Pending files are excluded unless `include_pending=true`.

### Endpoint
```
GET /folders/{id_folder}/contents
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_folder}` | Folder numeric identifier | int |

### Query parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `recursive` | no | bool | Include descendant folders and their files. Default `false`. |
| `include_pending` | no | bool | Include files with `file_uploaded = false`. Default `false`. |

### Sample request
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /folders/456/contents
```

### Sample response
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "folder": {"id_folder": 456, "folder_name": "Visitas tecnicas", "id_resource": null, "path": ["Building", "Visitas tecnicas"]},
    "folders": [{"id_folder": 457, "folder_name": "2026"}],
    "files": [{"id_file": 789, "file_name": "manual tecnico", "file_ext": "pdf", "file_type": "application/pdf", "file_size": 184234, "file_uploaded": true}]
  },
  "context": null,
  "instance": "/folders/456/contents"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `422`, `500`.

## Delete file

Clearance level 5 or lower is required to use this endpoint.

Soft deletes the file row and attempts inline S3 object cleanup for `{created_by}/{file_key}`.

### Endpoint
```
DELETE /files/{id_file}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_file}` | File numeric identifier | int |

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /files/789
```

### Sample response
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": {"id_file": 789, "deleted": true},
  "context": null,
  "instance": "/files/789"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `500`.

## Delete folder

Clearance level 5 or lower is required to use this endpoint.

Soft deletes a folder. Direct deletion of an active asset root folder is not allowed. Use `recursive=true` when the folder has content.

### Endpoint
```
DELETE /folders/{id_folder}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID as `Account: <ID_ACCOUNT>` | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_folder}` | Folder numeric identifier | int |

### Query parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `recursive` | no | bool | Delete child folders and files. Default `false`. |

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /folders/457?recursive=true
```

### Sample response
```json
{
  "status": "success",
  "message": "Element removed successfully",
  "data": {"id_folder": 457, "deleted": true},
  "context": null,
  "instance": "/folders/457"
}
```

Supported status codes: `200`, `400`, `401`, `403`, `404`, `409`, `500`.

## Delete asset

Clearance level 5 or lower is required to use this endpoint.

Deleting an asset soft deletes the asset, its root folder, descendant subfolders and files. Associated S3 objects are attempted for inline cleanup after the database soft deletes.

### Endpoint
```
DELETE /assets/{id_asset}
```

### Headers

| Header | Required | Description | Type |
| --- | --- | --- | --- |
| `Authorization` | yes | API key from your profile | string |
| `Account` | yes | Target account ID | int |

### Path parameter

| Parameter | Description | Type |
| --- | --- | --- |
| `{id_asset}` | Asset numeric identifier | int |

### Sample request
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /assets/2
```

### Sample response
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/assets/2"
}
```
