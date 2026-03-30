# Autorizaciones

Las autorizaciones representan el nivel de autorización que determina qué recursos puede administrar un colaborador dentro de una cuenta. El nivel `1` es el más restrictivo y el nivel `7` otorga el acceso más amplio.

Consulte [Permisos de recursos por matriz de autorización](https://www.google.com) para obtener una referencia cruzada de los recursos API, las operaciones y los niveles de autorización que pueden ejecutarlos.

## Endpoints
- [Listar autorizaciones](#list-clearances)
- [Recuperar mi autorización](#retrieve-my-clearance)

## Listar autorizaciones

Se requiere autorización con permiso de lectura sobre las autorizaciones para utilizar este endpoint.

### Endpoint
```
GET /clearances
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

Este endpoint no acepta parámetros de consulta.

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
     -H "Account: <ID_ACCOUNT>" \
     /clearances
```

### Respuesta de muestra
```json
[
  {
    "id_clearance": 1,
    "clearance_code": "A1",
    "clearance_description": "Entry level clearance"
  }
]
```

### Respuestas de error

`403 Forbidden`
```json
{
  "detail": "Insufficient permissions"
}
```

### Códigos de estado
- `200` Autorizaciones recuperadas exitosamente
- `400` Solicitud no válida
- `401` Credenciales de autenticación faltantes o no válidas
- `403` Permisos insuficientes para enumerar autorizaciones
- `404` Endpoint no encontrado
- `500` Error inesperado del servidor

## Recuperar mi autorización

Debe pertenecer a la cuenta solicitada para utilizar este endpoint.
Se requiere la autorización asociada con su membresía en la cuenta de destino para utilizar este endpoint.

### Endpoint
```
GET /clearances/me
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

Este endpoint no acepta parámetros de consulta.

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
     -H "Account: <ID_ACCOUNT>" \
     /clearances/me
```

### Respuesta de muestra
```json
{
  "id_clearance": 1,
  "clearance_code": "A1",
  "clearance_description": "Entry level clearance"
}
```

### Respuestas de error

`401 Unauthorized`
```json
{
  "detail": "No authorizer context"
}
```

### Códigos de estado
- `200` Liquidación recuperada exitosamente
- `400` Solicitud no válida
- `401` Credenciales de autenticación faltantes o no válidas
- `403` La persona que llama no pertenece a la cuenta
- `404` Endpoint no encontrado
- `500` Error inesperado del servidor