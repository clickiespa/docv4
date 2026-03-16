# OBTENER /salud

## Objetivo
Devuelve el estado operativo de la API de Clickiemota y repite la identidad autenticada. Utilizado por operadores y equilibradores de carga para validar la conectividad con la base de datos y el tiempo de ejecución.

## Autenticación
* **Obligatorio**: debe incluir la clave API de Clickie y los encabezados de cuenta.

## Solicitud
```http
GET /dev/clickiemottas/health HTTP/1.1
Host: api.clickie.io
Authorization: <api-key>
Account: 33
```

## Respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "service": "clickiemota",
    "version": "1.0",
    "uptime_ms": 3.14,
    "db": {
      "connected": true,
      "latency_ms": 7.52
    },
    "identity": {
      "account_id": 33,
      "account_identifier": "d01a3f87-7a1d-44d9-bfc9-16100ac34839",
      "user_id": "1",
      "user_email": "user@example.com"
    }
  }
}
```

## Catálogo de errores
| HTTP | código | Cuando |
| ---- | --------------------- | ----------------------------------------------- |
| 500 | error_servidor_interno | Cualquier falla inesperada (función o interrupción de la base de datos). |