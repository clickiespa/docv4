# Filtros

/ tabla de contenidos

## Puntos finales
- [Listar filtros](#list-filters)

## Lista de filtros

Recupere todos los filtros disponibles para la cuenta y el entorno autenticados.

Se requiere un nivel de autorización 7 o inferior con permiso de lectura sobre filtros para utilizar este punto final.

### Punto final

```http
GET /filters
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | Cuenta: \<ID_ACCOUNT\> | entero |

### Parámetros de ruta

No aplicable.

### Parámetros de consulta

No aplicable.

### Cuerpo de la solicitud

No aplicable.

### Modelos Pydantic

- Cuerpo de respuesta: `ShowFilter` (`API-V4/schemas/filters.py`).

### Códigos de estado admitidos

-`200`
-`201`
-`400`
- `401`
- `403`
-`404`
-`500`

### Solicitud de muestra

```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /filters
```

### Respuesta de muestra

```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": [
    {
      "id_filter": 500001,
      "id_environment": 1,
      "id_account": 33,
      "filter_name": "Main plant assets",
      "filter_description": "Assets assigned to main plant",
      "filter_code": "{\"id_asset\":[1,2,3]}",
      "param_1_description": "Asset selector",
      "param_2_description": null,
      "created_at": "2026-02-24T00:00:00Z"
    }
  ],
  "context": {},
  "instance": "/filters"
}
```

### Ejemplo de respuesta de error

```json
{
  "status": "error",
  "message": "Unauthorized",
  "data": {},
  "context": {},
  "instance": "/filters"
}
```