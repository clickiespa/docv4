# Roles

Los roles definen el nivel de acceso otorgado a los colaboradores a los recursos que pertenecen a una cuenta.

## Puntos finales
- [Listar roles](#list-roles)

## Listar roles

Se requiere autorización con permiso de lectura sobre roles para utilizar este punto final.

### Punto final
```
GET /roles
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta

| Parámetro | Requerido | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- | --- |
| `skip` | no | entero | `0` | Desplazamiento para paginación |
| `limit` | no | entero | `100` | Número máximo de roles a devolver |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
     -H "Account: <ID_ACCOUNT>" \
     /roles?skip=0&limit=100
```

### Respuesta de muestra
```json
[
  {
    "id_role": 1,
    "role_name": "Admin",
    "role_description": "Full access to all features"
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
- `200` Roles recuperados exitosamente
- `400` Parámetros de consulta no válidos
- `401` Credenciales de autenticación faltantes o no válidas
- `403` Permisos insuficientes para enumerar roles
- `404` Punto final no encontrado
- `500` Error inesperado del servidor