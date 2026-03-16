# Unidades de medida (UOM)

## Puntos finales
- [Listar UOM](#list-uoms)
- [Crear unidad de medida](#create-uom)
- [Obtener unidad de medida](#get-uom)
- [Actualizar unidad de medida](#update-uom)
- [Eliminar unidad de medida](#delete-uom)

Una uom es una unidad de medida y se utiliza para definir la magnitud de una cantidad en una métrica. Hay uoms globales que se utilizan entre todas las cuentas y uoms locales que pertenecen a una cuenta.

## Listar UOM

### Punto final
```
GET /uoms
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación |
| `limit` | no | entero | Registros máximos para devolver |
| `owned` | no | booleano | Mostrar solo UOM de cuenta |
| `archived` | no | booleano | Incluir UOM archivadas |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" /uoms?skip=0&limit=10
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "UOMs retrieved",
  "data": [{"id_uom": 1, "uom_name": "Percentage"}],
  "context": null,
  "instance": "/uoms"
}
```

## Crear unidad de medida

### Punto final
```
POST /uoms
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Cuerpo de la solicitud

| Campo | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_aggregation` | si | entero | Identificador del método de agregación |
| `id_interpolation` | si | entero | Identificador del método de interpolación |
| `uom_name` | si | cadena | Nombre para mostrar |
| `uom_description` | no | cadena | Descripción opcional |
| `uom_unit` | si | cadena | Símbolo de unidad |

### Solicitud de muestra
```bash
curl -X POST \
  -H "Authorization: <API_KEY>" \
  -H "Account: 1" \
  -H "Content-Type: application/json" \
  -d '{"id_aggregation":1,"id_interpolation":1,"uom_name":"Degree","uom_unit":"°C"}' \
  /uoms
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element created successfully",
  "data": {"id_uom": 2, "uom_name": "Degree"},
  "context": null,
  "instance": "/uoms"
}
```

## Obtener unidad de medida

### Punto final
```
GET /uoms/{id_uom}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_uom}` | Identificador numérico de la UMD | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" /uoms/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {"id_uom": 2, "uom_name": "Degree"},
  "context": null,
  "instance": "/uoms/2"
}
```

## Actualizar unidad de medida

### Punto final
```
PUT /uoms/{id_uom}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |
| `Content-Type` | si | `application/json` | cadena |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_uom}` | Identificador numérico de la UMD | entero |

### Cuerpo de la solicitud
Al menos un campo de la tabla de creación.

### Solicitud de muestra
```bash
curl -X PUT \
  -H "Authorization: <API_KEY>" \
  -H "Account: 1" \
  -H "Content-Type: application/json" \
  -d '{"uom_description":"Updated"}' \
  /uoms/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element updated successfully",
  "data": {"id_uom": 2, "uom_name": "Degree"},
  "context": null,
  "instance": "/uoms/2"
}
```

## Eliminar unidad de medida

### Punto final
```
DELETE /uoms/{id_uom}
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta

| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_uom}` | Identificador numérico de la UMD | entero |

### Solicitud de muestra
```bash
curl -X DELETE -H "Authorization: <API_KEY>" -H "Account: 1" /uoms/2
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element deleted successfully",
  "data": null,
  "context": null,
  "instance": "/uoms/2"
}
```