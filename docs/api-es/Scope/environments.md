# Ambientes

/ tabla de contenidos

## Endpoints
- [Enumerar entornos](#list-environments)

Los entornos definen la agrupación de inquilinos de nivel superior para cuentas y recursos relacionados.

## Entornos de lista
Recupera los entornos disponibles para la sesión autenticada.

Se requiere un nivel de autorización 5 o inferior para utilizar este endpoint.

### Endpoint
```
GET /environments
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| Ninguno | Este endpoint no utiliza parámetros de ruta. | - |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| Ninguno | No | - | - | Este endpoint no acepta parámetros de consulta. |

### Sobre de respuesta
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {},
  "context": {},
  "instance": "/endpoint/path"
}
```

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
  /environments
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Environments retrieved",
  "data": [
    {
      "id_environment": 1,
      "environment_name": "Production",
      "environment_description": "Primary tenant environment"
    }
  ],
  "context": {},
  "instance": "/environments"
}
```

### Ejemplos de encabezados de respuesta
```json
{
  "Content-Type": "application/json"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Environments not available",
  "data": {},
  "context": {
    "errors": [
      "No environments found for this session"
    ]
  },
  "instance": "/environments"
}
```

### Códigos de estado
- `200`: la lista de entornos se recuperó correctamente.
- `400`: parámetros de solicitud no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontraron entornos.
- `500` — Error interno del servidor.