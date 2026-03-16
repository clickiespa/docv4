# Métodos

## Puntos finales
- [Métodos de agregación](#aggregation-methods)
- [Métodos de interpolación](#interpolation-methods)

Datos de referencia para métodos de agregación e interpolación.

## Métodos de agregación
Recupera el catálogo de funciones de agregación que se pueden asignar a métricas y unidades de medida.

Se requiere un nivel de autorización 6 o inferior para utilizar este punto final.

### Punto final
```
GET /methods/aggregation
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
  /methods/aggregation
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Methods retrieved",
  "data": [
    {
      "id_aggregation": 1,
      "aggregation_name": "avg",
      "aggregation_description": "Average of values",
      "aggregation_function": "AVG"
    }
  ],
  "context": {},
  "instance": "/methods/aggregation"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Aggregation methods not available",
  "data": {},
  "context": {
    "errors": [
      "Supported aggregations are temporarily unavailable"
    ]
  },
  "instance": "/methods/aggregation"
}
```

### Códigos de estado
- `200`: métodos de agregación recuperados correctamente.
- `400`: configuración de solicitud no válida.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontraron métodos de agregación.
- `500` — Error interno del servidor.

## Métodos de interpolación
Recupera el catálogo de estrategias de interpolación que se pueden aplicar al completar los puntos de datos faltantes.

Se requiere un nivel de autorización 6 o inferior para utilizar este punto final.

### Punto final
```
GET /methods/interpolation
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
  /methods/interpolation
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Methods retrieved",
  "data": [
    {
      "id_interpolation": 1,
      "interpolation_name": "linear",
      "interpolation_description": "Linearly interpolates between the closest samples",
      "interpolation_function": "LINEAR"
    }
  ],
  "context": {},
  "instance": "/methods/interpolation"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Interpolation methods not available",
  "data": {},
  "context": {
    "errors": [
      "Supported interpolations are temporarily unavailable"
    ]
  },
  "instance": "/methods/interpolation"
}
```

### Códigos de estado
- `200`: métodos de interpolación recuperados correctamente.
- `400`: configuración de solicitud no válida.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontraron métodos de interpolación.
- `500` — Error interno del servidor.