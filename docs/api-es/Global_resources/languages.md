# Idiomas

## Puntos finales
- [Listar idiomas](#list-languages)

Idiomas disponibles para perfiles de colaboradores.

## Listar idiomas
Recupera el catálogo de idiomas que los colaboradores pueden seleccionar en sus perfiles.

Se requiere un nivel de autorización 7 o inferior para utilizar este punto final.

### Punto final
```
GET /languages
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

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
  /languages
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Languages retrieved",
  "data": [
    {
      "id_language": 1,
      "language_code": "en",
      "language_name": "English"
    }
  ],
  "context": {},
  "instance": "/languages"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Languages not available",
  "data": {},
  "context": {
    "errors": [
      "No languages have been configured for this account"
    ]
  },
  "instance": "/languages"
}
```

### Códigos de estado
- `200`: la lista de idiomas se recuperó correctamente.
- `400`: filtros de solicitud no válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — No se encontraron idiomas.
- `500` — Error interno del servidor.