# Asistentes

## Endpoints
- [Crear hilo](#create-thread)
- [Listar hilos](#list-threads)
- [Recibir mensajes del hilo](#get-thread-messages)
- [Aviso de hilo de cola](#queue-thread-prompt)
- [Actualizar título del hilo](#update-thread-title)
- [Eliminar hilo](#delete-thread)
- [Obtener ejecución](#get-execution)
- [Reintentar la ejecución](#retry-execution)

Los endpoints `assistants` administran conversaciones, mensajes y ejecuciones asincronas del asistente.

## encabezados

Todos los endpoints de esta página requieren:

| Encabezado | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `Authorization` | si | cadena | Credencial validada por el autorizador |
| `Account` | si | cadena | Cuenta asociada a la solicitud |

## Crear hilo

### Endpoint
```http
POST /ai/assistants/threads
```

### Cuerpo

No requiere cuerpo.

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/assistants/threads
```

### Respuesta de muestra
```json
{
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
  "title": "",
  "created_at": 1743000000
}
```

## Listar hilos

### Endpoint
```http
GET /ai/assistants/threads
```

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `limit` | no | entero | `20` | Máximo de hilos a retonar. Debe ser `>= 1`. |
| `next_thread_id` | no | cadena | `null` | Cursor para continuar la paginación. |

### Solicitud de muestra
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  "/ai/assistants/threads?limit=20"
```

### Respuesta de muestra
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

## Recibir mensajes del hilo

### Endpoint
```http
GET /ai/assistants/threads/{thread_id}
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{thread_id}` | cadena | Identificador ULID del hilo. |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `limit` | no | entero | `20` | Máximo de mensajes a regresar. Debe ser `>= 1`. |
| `before_message_id` | no | cadena | `null` | Retorna mensajes anteriores a ese `message_id`. |

### Solicitud de muestra
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  "/ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N?limit=20"
```

### Respuesta de muestra
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

## Mensaje de hilo de cola

### Endpoint
```http
POST /ai/assistants/threads/{thread_id}
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{thread_id}` | cadena | Hilo donde se agregara el rapid humano. |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `prompt` | si | cadena | No | Texto del mensaje del usuario. |
| `config.history_limit` | no | entero | `20` | Cantidad de mensajes previos a incluir en la ejecución. |
| `config.tools_enabled.mcp_clickie_api` | no | booleano | `false` | Habilita la herramienta MCP de Clickie API. |
| `config.tools_enabled.mcp_soporte` | no | booleano | `false` | Habilite la herramienta de soporte MCP. |
| `config.llm_provider` | no | `openai` | `null` | Proveedor persistido para la ejecucion. |
| `config.llm_model` | no | `gpt-4o-mini` | `null` | Modelo persistido para la ejecucion. |

### Notas
- Solo puede existir una ejecución activa (`QUEUE` o `IN_PROGRESS`) por hilo.
- La ejecucion se procesa de forma asincrona por Lambda.

### Solicitud de muestra
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

### Respuesta de muestra
```json
{
  "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74",
  "message_id": "01JQ8Y6Q8DY0Y85EQ1TQ6S6V4D",
  "status": "QUEUE"
}
```

### Catálogo de errores

| HTTP | `detail.error` | Cuando aplica |
| --- | --- | --- |
| `404` | n/a | El hilo no existe o no pertenece al usuario autenticado. |
| `409` | `EXECUTION_IN_PROGRESS` | Ya existe una ejecución activa para el hilo. |

### Ejemplo de conflicto
```json
{
  "detail": {
    "error": "EXECUTION_IN_PROGRESS",
    "message": "There is already an active execution for this thread.",
    "execution_id": "84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74"
  }
}
```

## Actualizar título del hilo

### Endpoint
```http
PATCH /ai/assistants/threads/{thread_id}
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{thread_id}` | cadena | Hilo para actualizar. |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- | --- |
| `title` | si | cadena | largo entre `1` y `255` | Nuevo título del hilo. |

### Solicitud de muestra
```bash
curl -X PATCH \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Consumo HVAC marzo"}' \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N
```

### Respuesta de muestra
```json
{
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N",
  "title": "Consumo HVAC marzo",
  "updated_at": 1743000360
}
```

## Eliminar hilo

### Endpoint
```http
DELETE /ai/assistants/threads/{thread_id}
```

### Parámetro de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{thread_id}` | cadena | Hilo y eliminación. |

### Solicitud de muestra
```bash
curl -X DELETE \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N
```

### Respuesta de muestra
```json
{
  "deleted": true,
  "thread_id": "01JQ8Y2NQ0QJ8S2R3A7R5JYV4N"
}
```

## Obtener ejecución

### Endpoint
```http
GET /ai/assistants/threads/{thread_id}/executions/{execution_id}
```

### Parámetros de ruta
| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{thread_id}` | cadena | Hilo dueño de la ejecucion. |
| `{execution_id}` | cadena | Identificador UUID de la ejecución. |

### Solicitud de muestra
```bash
curl \
  -H "Authorization: <TOKEN>" \
  -H "Account: <ACCOUNT_ID>" \
  /ai/assistants/threads/01JQ8Y2NQ0QJ8S2R3A7R5JYV4N/executions/84bc5e7e-2b9b-4c58-9ef7-6d6fd8bc7f74
```

### Respuesta de muestra
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

### Notas
- `status` es persistente por la ejecucion y suele moverse entre `QUEUE`, `IN_PROGRESS`, `FINISHED` y `FAILED`.
- `steps` refleja el progreso incremental, llamadas a herramientas y mensajes intermedios.

## Reintentar la ejecución

### Endpoint
```http
POST /ai/assistants/threads/{thread_id}/executions/{execution_id}/retry
```

### Parámetros de ruta

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| `{thread_id}` | cadena | Hilo dueño de la ejecucion. |
| `{execution_id}` | cadena | Ejecucion fallida a reintentar. |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `config.history_limit` | no | entero | `20` | Cantidad de mensajes anteriores a incluir. |
| `config.tools_enabled.mcp_clickie_api` | no | booleano | `false` | Habilita MCP Clickie API. |
| `config.tools_enabled.mcp_soporte` | no | booleano | `false` | Habilita soporte MCP. |
| `config.llm_provider` | no | `openai` | `null` | Proveedor persistido para el nuevo intento. |
| `config.llm_model` | no | `gpt-4o-mini` | `null` | Modelo persistido para el nuevo intento. |

### Notas
- Solo admite retento de ejecuciones con estado `FAILED`.
- Reutilizar el mensaje humano original; genera un `execution_id` nuevo.
- Si existe otra ejecución activa para el mismo hilo, el reintento falla con `409`.

### Solicitud de muestra
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

### Respuesta de muestra
```json
{
  "execution_id": "36c0f8d9-a881-4c56-9934-fd6cc87b6650",
  "message_id": "01JQ8Y6Q8DY0Y85EQ1TQ6S6V4D",
  "status": "QUEUE"
}
```

### Catálogo de errores

| HTTP | `detail.error` | Cuando aplica |
| --- | --- | --- |
| `404` | n/a | El hilo o la ejecucion no existe, o no se encuentra el mensaje original del aviso. |
| `409` | `EXECUTION_NOT_FAILED` | La ejecucion indicada no esta en estado `FAILED`. |
| `409` | `EXECUTION_IN_PROGRESS` | Ya existe otra ejecucion activa para el hilo. |