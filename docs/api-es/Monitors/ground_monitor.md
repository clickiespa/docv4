# Monitor de tierra

## Puntos finales
- [Obtener datos](#fetch-data)

Punto final que devuelve datos sobre el proceso de monitoreo terrestre.

## Obtener datos
Recuperar el estado actual del monitoreo terrestre.

### Punto final
```
GET /ground_monitor
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta del solicitante | entero |
| `account-id` | si | ID de cuenta para recuperar información | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" \
     -H "Account: <ID_ACCOUNT>" \
     -H "account-id: <TARGET_ACCOUNT_ID>" \
     /ground_monitor
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "130 elements obtained successfully",
  "data": [
    {
      "id_asset": 1,
      "asset_name": "Sample asset",
      "asset_archived": 0,
      "total_monitored_devices": 3,
      "disconnected_devices": "0",
      "na_devices": "0",
      "percentage_disconnected": "0.00"
    }
  ],
  "context": {},
  "instance": "/ground_monitor"
}
```

### Códigos de estado

| Estado | Descripción |
| --- | --- |
| `200` | Operación exitosa |
| `401` | No autorizado |
| `403` | Prohibido |
| `404` | No encontrado |
| `422` | Error de validación |
| `500` | Error interno del servidor |