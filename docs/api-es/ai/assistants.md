# Assistants

## Endpoints
- [Create thread](#create-thread)
- [List threads](#list-threads)
- [Get thread messages](#get-thread-messages)
- [Queue thread prompt](#queue-thread-prompt)
- [Update thread title](#update-thread-title)
- [Delete thread](#delete-thread)
- [Get execution](#get-execution)
- [Retry execution](#retry-execution)

Los endpoints `assistants` administran conversaciones, mensajes y ejecuciones asincronas del asistente.

## Headers

Todos los endpoints de esta pagina requieren:

| Header | Requerido | Tipo | Descripcion |
| --- | --- | --- | --- |
| `Authorization` | si | string | Credencial validada por el authorizer |
| `Account` | si | string | Cuenta asociada a la solicitud |

## Create thread

### Endpoint
```http
POST /ai/assistants/threads
```

### Body

No requiere body.

### Sample request
```bash
curl -X POST \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/assistants/threads
```

### Sample response
```json
{
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
  "title": "",
  "created_at": 1743000000
}
```

## List threads

### Endpoint
```http
GET /ai/assistants/threads
```

### Query parameters

| Parametro | Requerido | Tipo | Default | Descripcion |
| --- | --- | --- | --- | --- |
| `limit` | no | int | `20` | Maximo de threads a retornar. Debe ser `>= 1`. |
| `next_thread_id` | no | string | `null` | Cursor para continuar la paginacion. |

### Sample request
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  "/ai/assistants/threads?limit=20"
```

### Sample response
```json
{
  "threads": [
    {
      "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
      "title": "Consumo HVAC marzo",
      "created_at": 1743000000,
      "updated_at": 1743000360
    }
  ],
  "next_thread_id": null
}
```

## Get thread messages

### Endpoint
```http
GET /ai/assistants/threads/{thread_id}
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{thread_id}` | string | Identificador ULID del thread. |

### Query parameters

| Parametro | Requerido | Tipo | Default | Descripcion |
| --- | --- | --- | --- | --- |
| `limit` | no | int | `20` | Maximo de mensajes a retornar. Debe ser `>= 1`. |
| `before_message_id` | no | string | `null` | Retorna mensajes anteriores a ese `message_id`. |

### Sample request
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  "/ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N?limit=20"
```

### Sample response
```json
{
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
  "messages": [
    {
      "message_id": "01JQ8Y6Q8DY0Y85EQ1TQ6S6V4D",
      "timestamp": 1743000001,
      "role": "human",
      "content": "Resume el analisis del ultimo mes.",
      "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74",
      "metadata": {}
    },
    {
      "message_id": "01JQ8YB51JV1Q1J4J7MJP7Q3FQ",
      "timestamp": 1743000015,
      "role": "assistant",
      "content": "Estos son los hallazgos principales...",
      "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74",
      "metadata": {}
    }
  ],
  "has_more": false
}
```

## Queue thread prompt

### Endpoint
```http
POST /ai/assistants/threads/{thread_id}
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{thread_id}` | string | Thread donde se agregara el prompt humano. |

### Request body

| Campo | Requerido | Tipo | Default | Descripcion |
| --- | --- | --- | --- | --- |
| `prompt` | si | string | No | Texto del mensaje del usuario. |
| `config.history_limit` | no | int | `20` | Cantidad de mensajes previos a incluir en la ejecucion. |
| `config.tools_enabled.mcp_clickie_api` | no | bool | `false` | Habilita la herramienta MCP de Clickie API. |
| `config.tools_enabled.mcp_soporte` | no | bool | `false` | Habilita la herramienta MCP de soporte. |
| `config.llm_provider` | no | `openai` | `null` | Provider persistido para la ejecucion. |
| `config.llm_model` | no | `gpt-4o-mini` | `null` | Modelo persistido para la ejecucion. |

### Notes
- Solo puede existir una ejecucion activa (`QUEUE` o `IN_PROGRESS`) por thread.
- La ejecucion se procesa de forma asincrona por Lambda.

### Sample request
```bash
curl -X POST \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Resume el analisis del ultimo mes.",
    "config": {
      "history_limit": 10,
      "tools_enabled": {
        "mcp_clickie_api": true,
        "mcp_soporte": false
      },
      "llm_provider": "openai",
      "llm_model": "gpt-4o-mini"
    }
  }' \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N
```

### Sample response
```json
{
  "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74",
  "message_id": "01JQ8Y6Q8DY0Y85EQ1TQ6S6V4D",
  "status": "QUEUE"
}
```

### Error catalogue

| HTTP | `detail.error` | Cuando aplica |
| --- | --- | --- |
| `404` | n/a | El thread no existe o no pertenece al usuario autenticado. |
| `409` | `EXECUTION_IN_PROGRESS` | Ya existe una ejecucion activa para el thread. |

### Conflict example
```json
{
  "detail": {
    "error": "EXECUTION_IN_PROGRESS",
    "message": "There is already an active execution for this thread.",
    "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74"
  }
}
```

## Update thread title

### Endpoint
```http
PATCH /ai/assistants/threads/{thread_id}
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{thread_id}` | string | Thread a actualizar. |

### Request body

| Campo | Requerido | Tipo | Restricciones | Descripcion |
| --- | --- | --- | --- | --- |
| `title` | si | string | largo entre `1` y `255` | Nuevo titulo del thread. |

### Sample request
```bash
curl -X PATCH \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Consumo HVAC marzo"}' \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N
```

### Sample response
```json
{
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
  "title": "Consumo HVAC marzo",
  "updated_at": 1743000360
}
```

## Delete thread

### Endpoint
```http
DELETE /ai/assistants/threads/{thread_id}
```

### Path parameter

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{thread_id}` | string | Thread a eliminar. |

### Sample request
```bash
curl -X DELETE \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N
```

### Sample response
```json
{
  "deleted": true,
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N"
}
```

## Get execution

### Endpoint
```http
GET /ai/assistants/threads/{thread_id}/executions/{execution_id}
```

### Path parameters

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{thread_id}` | string | Thread dueño de la ejecucion. |
| `{execution_id}` | string | Identificador UUID de la ejecucion. |

### Sample request
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N/executions/84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74
```

### Sample response
```json
{
  "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74",
  "message_id": "01JQ8Y6Q8DY0Y85EQ1TQ6S6V4D",
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
  "status": "IN_PROGRESS",
  "updated_at": 1743000010,
  "execution": {
    "config": {
      "history_limit": 10,
      "history_from_message_id": null,
      "llm_provider": "openai",
      "llm_model": "gpt-4o-mini",
      "tools_enabled": {
        "mcp_clickie_api": true,
        "mcp_soporte": false
      },
      "account_id": "123"
    },
    "steps": [
      {
        "type": "message",
        "index": 0,
        "tool_name": null,
        "tool_call_id": null,
        "input": null,
        "output": null,
        "content": "Analizando contexto del thread",
        "truncated": null,
        "timestamp": 1743000005
      }
    ],
    "final_message_id": null,
    "error": null
  }
}
```

### Notes
- `status` es persistido por la ejecucion y suele moverse entre `QUEUE`, `IN_PROGRESS`, `FINISHED` y `FAILED`.
- `steps` refleja progreso incremental, llamadas a herramientas y mensajes intermedios.

## Retry execution

### Endpoint
```http
POST /ai/assistants/threads/{thread_id}/executions/{execution_id}/retry
```

### Path parameters

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `{thread_id}` | string | Thread dueño de la ejecucion. |
| `{execution_id}` | string | Ejecucion fallida a reintentar. |

### Request body

| Campo | Requerido | Tipo | Default | Descripcion |
| --- | --- | --- | --- | --- |
| `config.history_limit` | no | int | `20` | Cantidad de mensajes previos a incluir. |
| `config.tools_enabled.mcp_clickie_api` | no | bool | `false` | Habilita MCP Clickie API. |
| `config.tools_enabled.mcp_soporte` | no | bool | `false` | Habilita MCP soporte. |
| `config.llm_provider` | no | `openai` | `null` | Provider persistido para el nuevo intento. |
| `config.llm_model` | no | `gpt-4o-mini` | `null` | Modelo persistido para el nuevo intento. |

### Notes
- Solo admite reintento de ejecuciones con estado `FAILED`.
- Reutiliza el mensaje humano original; genera un `execution_id` nuevo.
- Si existe otra ejecucion activa para el mismo thread, el retry falla con `409`.

### Sample request
```bash
curl -X POST \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "history_limit": 20,
      "tools_enabled": {
        "mcp_clickie_api": true,
        "mcp_soporte": false
      }
    }
  }' \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N/executions/84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74/retry
```

### Sample response
```json
{
  "execution_id": "36c0f8d9-a881-4c56-9934-fd6cc87b6650",
  "message_id": "01JQ8Y6Q8DY0Y85EQ1TQ6S6V4D",
  "status": "QUEUE"
}
```

### Error catalogue

| HTTP | `detail.error` | Cuando aplica |
| --- | --- | --- |
| `404` | n/a | El thread o la ejecucion no existen, o no se encuentra el mensaje original del prompt. |
| `409` | `EXECUTION_NOT_FAILED` | La ejecucion indicada no esta en estado `FAILED`. |
| `409` | `EXECUTION_IN_PROGRESS` | Ya existe otra ejecucion activa para el thread. |
