# Endpoints de trabajos: lineamientos de implementación

> El subsistema de empleos ya existe en los servicios compartidos construidos por Mati. Integre con ese almacenamiento en lugar de crear una nueva capa de persistencia. Estas notas describen los contratos esperados por la API de Clickiemota.

---

## OBTENER /trabajos/{job_id}

### Objetivo
Obtenga el estado y el resultado de un trabajo creado anteriormente.

### Comportamiento
* Recuperar el trabajo del repositorio de trabajos compartidos con la clave `job_id`.
* Asegúrese de que el trabajo pertenezca a la cuenta y al dispositivo autenticados.
* Devuelve el sobre completo del trabajo (estado, resultado, marcas de tiempo, modo de ejecución).

### Ejemplo de respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "job_id": "6b8f8d5a-2b0a-4b8c-b99f-4f61d1ae1a01",
    "identifier": "cm-001",
    "action_name": "restart_device",
    "status": "succeeded",
    "result": {"message": "Device reboot simulated", "took_ms": 1200},
    "submitted_at": "2025-09-29T12:00:00Z",
    "execution_mode": "stub"
  }
}
```

### Catálogo de errores
| HTTP | código | Cuando |
| ---- | ---- | ---- |
| 404 | no_encontrado | El trabajo no existe o no pertenece a la cuenta/dispositivo. |
| 500 | error_servidor_interno | Fallo inesperado del repositorio. |

---

## POST /trabajos/{job_id}/cancelar

### Objetivo
Cancele un trabajo en vuelo cuando todavía sea `created`, `queued` o `running`.

### Comportamiento
* Delegar la transición estatal al servicio de empleo compartido para que las reglas de coherencia sigan centralizadas.
* Cuando la cancelación se realice correctamente, devolverá la instantánea del trabajo actualizada.
* Si el trabajo ya es terminal, muestre `409 conflict` con `code: job_not_cancellable`.

### Ejemplo de respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "job_id": "6b8f8d5a-2b0a-4b8c-b99f-4f61d1ae1a01",
    "status": "canceled"
  }
}
```

### Catálogo de errores
| HTTP | código | Cuando |
| ---- | ---- | ---- |
| 404 | no_encontrado | Trabajo no encontrado. |
| 409 | trabajo_no_cancelable | El trabajo ya se encuentra en un estado terminal. |
| 500 | error_servidor_interno | Fallo inesperado al cancelar el trabajo. |

---

## OBTENER /dispositivos/{identificador}/trabajos

### Objetivo
Enumere trabajos para un dispositivo con paginación basada en cursor.

### Comportamiento
* Admite parámetros de consulta `status`, `limit` (1..200, predeterminado 50) y `cursor`.
* Delegar tokens de paginación al repositorio de trabajos compartidos (reutilizando la implementación de Mati).
* La respuesta debe incluir `items` y `next_cursor` en el sobre de lista estándar.

### Ejemplo de respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "job_id": "6b8f8d5a-2b0a-4b8c-b99f-4f61d1ae1a01",
        "action_name": "resend_data",
        "status": "succeeded",
        "submitted_at": "2025-09-29T12:00:00Z"
      }
    ],
    "next_cursor": null
  }
}
```

### Catálogo de errores
| HTTP | código | Cuando |
| ---- | ---- | ---- |
| 400 | error_validación | Límite o token de cursor no válido. |
| 404 | no_encontrado | Dispositivo no reconocido. |
| 500 | error_servidor_interno | Error inesperado al recuperar trabajos. |

---

### Notas para la integración con el sistema de empleo de Mati
* Utilice el cliente de repositorio de trabajos existente para lecturas/escrituras para mantener la deduplicación y las transiciones de estado consistentes en todos los servicios.
* Cada trabajo creado por `POST /devices/{identifier}/actions` debe persistir a través de este servicio compartido incluso en modo stub.
* Emitir registros de auditoría estructurados (`type="job_finalized"`) cuando los trabajos se completen o pasen a un estado terminal.