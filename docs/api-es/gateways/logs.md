# Registros y endpoints de observabilidad: pautas de implementación (lineamientos)

> Estos endpoints permanecen en **modo stub** para la Fase A. Proporcionar respuestas deterministas generadas desde accesorios para desbloquear integraciones de clientes mientras se prepara el proceso de telemetría real.

---

## OBTENER /dispositivos/{identificador}/logs

### Objetivo
Devuelve líneas de registro cortadas para un dispositivo con filtros opcionales.

### Comportamiento
* Acepte los parámetros de consulta `since`, `until`, `level`, `limit` (1..5000, predeterminado 500) y `cursor`.
* Validar rangos de tiempo (`since < until`) y niveles de registro permitidos (`debug`, `info`, `warn`, `error`).
* Cargue registros de dispositivos y divídalos de manera determinista según los filtros.

### Ejemplo de respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "items": [
      {"ts": "2025-09-29T01:00:00Z", "level": "info", "msg": "boot ok"},
      {"ts": "2025-09-29T01:05:02Z", "level": "warn", "msg": "ntp drift 2s"}
    ],
    "next_cursor": null
  }
}
```

### Catálogo de errores
| HTTP | código | Cuando |
| ---- | --------------------- | ---------------------------------------- |
| 404 | no_encontrado | Al dispositivo le falta un accesorio de registro.            |
| 422 | parámetros_inválidos | Rango de tiempo no válido o nivel no permitido. |
| 500 | error_servidor_interno | Fracaso inesperado.                      |

---

## GET /dispositivos/{identificador}/disco

### Objetivo
Exponer las métricas de uso de particiones/discos fragmentados.

### Comportamiento
* Particiones de retorno definidas en dispositivos con fluctuación limitada (por ejemplo, ±5% de uso) para emular la variabilidad.

### Ejemplo de respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "identifier": "cm-001",
    "partitions": [
      {"mount": "/", "total_bytes": 2147483648, "used_bytes": 1048576000, "pct_used": 48.8},
      {"mount": "/data", "total_bytes": 8589934592, "used_bytes": 2147483648, "pct_used": 25.0}
    ]
  }
}
```

### Catálogo de errores
| HTTP | código | Cuando |
| ---- | --------------------- | ------------------------------ |
| 404 | no_encontrado | Al dispositivo le falta un dispositivo de disco. |
| 500 | error_servidor_interno | Fracaso inesperado.            |

---

## GET /dispositivos/{identificador}/copia de seguridad/cobertura

### Objetivo
Informe la ventana de cobertura de la copia de seguridad (carga útil almacenada más temprana y más reciente) para que los clientes puedan determinar los rangos de reproducción válidos.

### Comportamiento
* Acepte el parámetro de consulta opcional `dataset` que se asigna a los conjuntos de datos definidos en los elementos de acción (por ejemplo, `telemetry`, `events`, `images`).
* La respuesta debe indicar el conjunto de datos resuelto, `coverage_start_at` y `coverage_end_at`.
* Si el conjunto de datos tiene lagunas, muéstrelas bajo `gaps` con intervalos ISO-8601 para que la interfaz pueda resaltar los rangos faltantes.

### Ejemplo de respuesta exitosa
```json
{
  "status": "success",
  "data": {
    "dataset": "telemetry",
    "coverage_start_at": "2025-06-01T00:00:00Z",
    "coverage_end_at": "2025-09-29T09:00:00Z",
    "gaps": [
      {"start": "2025-07-14T00:00:00Z", "end": "2025-07-14T06:00:00Z"}
    ]
  }
}
```

### Catálogo de errores
| HTTP | código | Cuando |
| ---- | --------------------- | -------------------------------- |
| 404 | no_encontrado | Al dispositivo le falta un dispositivo de respaldo. |
| 422 | parámetros_inválidos | Conjunto de datos no compatible.           |
| 500 | error_servidor_interno | Fracaso inesperado.              |

---

### Notas del partido
*Coubique los dispositivos de observabilidad con los dispositivos de acción bajo `src/fixtures/devices/` usando claves como `logs`, `disk` y `backup`.
* Garantizar que las respuestas sigan siendo deterministas para las mismas entradas para simplificar las pruebas del contrato.