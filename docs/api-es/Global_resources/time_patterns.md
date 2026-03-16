# Patrones de tiempo

## Puntos finales
- [Crear u obtener patrón](#create-or-get-pattern)
- [Obtener patrón por ID](#get-pattern-by-id)

Programaciones reutilizables para activadores de monitores.

## Crear u obtener patrón
Crea un patrón de tiempo si no existe y devuelve su representación normalizada.

Se requiere un nivel de autorización 7 o inferior para utilizar este punto final.

### Punto final
```
GET /time_patterns
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `hours` | No | cadena | No | Lista de horas separadas por comas en formato de 24 horas |
| `dayweek` | No | cadena | No | Lista separada por comas de números de días laborables (1 a 7) |
| `daymonth` | No | cadena | No | Lista de valores de día del mes separados por comas |
| `months` | No | cadena | No | Lista de números de meses separados por comas (1 a 12) |

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
  "/time_patterns?hours=0,12&dayweek=1,5"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {
    "id_time_pattern": 1,
    "pattern_name": "0,12|1,5|*|*",
    "pattern_hours": "0,12",
    "pattern_days_of_week": "1,5",
    "pattern_days_of_month": null,
    "pattern_months": null
  },
  "context": {},
  "instance": "/time_patterns"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Time pattern could not be processed",
  "data": {},
  "context": {
    "errors": [
      "Parameter hours must contain numeric values"
    ]
  },
  "instance": "/time_patterns"
}
```

### Códigos de estado
- `200` — Patrón de tiempo recuperado exitosamente.
- `201`: se creó un patrón de tiempo durante la solicitud.
- `400`: uno o más parámetros de consulta no son válidos.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se pudo resolver el patrón de tiempo solicitado.
- `500` — Error interno del servidor.

## Obtener patrón por ID
Recupera un patrón único por su identificador.

Se requiere un nivel de autorización 7 o inferior para utilizar este punto final.

### Punto final
```
GET /time_patterns/{id_time_pattern}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_time_pattern` | Sí | entero | Identificador numérico del patrón |

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
  /time_patterns/1
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_time_pattern": 1,
    "pattern_name": "0,12|1,5|*|*",
    "pattern_hours": "0,12",
    "pattern_days_of_week": "1,5",
    "pattern_days_of_month": null,
    "pattern_months": null
  },
  "context": {},
  "instance": "/time_patterns/1"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Time pattern not found",
  "data": {},
  "context": {
    "errors": [
      "Time pattern 1 does not exist"
    ]
  },
  "instance": "/time_patterns/1"
}
```

### Códigos de estado
- `200`: patrón de tiempo recuperado correctamente.
- `400`: formato de identificador no válido.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se encontró el patrón de tiempo.
- `500` — Error interno del servidor.