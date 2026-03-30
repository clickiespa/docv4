# Iconos

## Endpoints
- [Iconos de lista](#list-icons)
- [Obtener icono](#get-icon)

Lista de iconos disponibles para paneles y activos.

## Iconos de lista
Recupera el catálogo de definiciones de iconos que se pueden utilizar en paneles y activos.

Este endpoint no está disponible actualmente para todos los niveles de autorización.

### Endpoint
```
GET /icons
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `skip` | No | entero | `0` | Desplazamiento aplicado al conjunto de resultados |
| `limit` | No | entero | `50` | Número máximo de registros a devolver |
| `icon_name` | No | cadena | No | Filtra iconos por nombre (coincidencia parcial) |

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
  "/icons?icon_name=home"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Icons retrieved",
  "data": [
    {
      "id_icon": 1,
      "icon_name": "home",
      "icon_tags": "navigation,default"
    }
  ],
  "context": {},
  "instance": "/icons"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Icon list not available",
  "data": {},
  "context": {
    "errors": [
      "The filter provided is invalid"
    ]
  },
  "instance": "/icons"
}
```

### Códigos de estado
- `200`: la lista de iconos se recuperó correctamente.
- `400` — Error de validación en los filtros suministrados.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404`: no se pudieron encontrar los iconos.
- `500` — Error interno del servidor.

## Obtener icono
Recupera los metadatos de un icono específico por su identificador.

Este endpoint no está disponible actualmente para todos los niveles de autorización.

### Endpoint
```
GET /icons/{id_icon}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | Sí | Clave API generada desde su perfil | cadena |
| `Account` | Sí | ID de cuenta de destino | entero |

### Parámetros de ruta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_icon` | Sí | entero | Identificador numérico del icono |

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
  /icons/1
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_icon": 1,
    "icon_name": "home",
    "icon_tags": "navigation,default"
  },
  "context": {},
  "instance": "/icons/1"
}
```

### Respuestas de error
```json
{
  "status": "error",
  "message": "Icon not found",
  "data": {},
  "context": {
    "errors": [
      "Icon 1 does not exist"
    ]
  },
  "instance": "/icons/1"
}
```

### Códigos de estado
- `200`: icono recuperado correctamente.
- `400`: formato de identificador no válido.
- `401`: credenciales faltantes o no válidas.
- `403`: el nivel de autorización es insuficiente.
- `404` — No se encontró el icono.
- `500` — Error interno del servidor.