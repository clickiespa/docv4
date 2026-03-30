# Zonas horarias

## Endpoints
- [Listar zonas horarias](#list-time-zones)

Recuperar zonas horarias admitidas por la API.

## Listar zonas horarias
Devuelve la lista de zonas horarias admitidas, incluyendo opcionalmente las compensaciones UTC.

Se requiere un nivel de autorización 7 o inferior para utilizar este endpoint.

### Endpoint
```
GET /time_zones
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `id_time_zone` | No | entero | No | Filtra la respuesta por un identificador de zona horaria específico |
| `offsets` | No | booleano | `false` | Cuando `true`, incluye registros de compensación UTC |

### Encabezados de muestra
```json
{
  "Authorization": "<API_KEY>",
  "Account": "<ID_ACCOUNT>"
}
```

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
  -H "Account: <ID_ACCOUNT>" \
  "/time_zones?offsets=true"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Time zones retrieved",
  "data": [
    {
      "id_time_zone": 1,
      "time_zone": "UTC"
    },
    {
      "id_time_zone": 2,
      "id_offset": 8,
      "time_zone": "America/New_York",
      "offset": "-05:00",
      "offset_start": "2023-11-05T07:00:00Z",
      "offset_end": "2024-03-10T07:00:00Z",
      "offset_start_utc": "2023-11-05T07:00:00Z",
      "offset_end_utc": "2024-03-10T07:00:00Z"
    }
  ],
  "context": {},
  "instance": "/time_zones"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Time zones not available",
  "data": {},
  "context": {
    "errors": [
      "The requested time zone does not exist"
    ]
  },
  "instance": "/time_zones"
}
```

### Códigos de estado
- `200`: zonas horarias recuperadas correctamente.
- `400`: parámetros de solicitud no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — No se encontraron zonas horarias.
- `500` — Error interno del servidor.