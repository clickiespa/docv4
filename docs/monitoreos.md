# Monitoreos

El modulo de monitoreos evalua condiciones sobre metricas y genera estados operativos automáticos.

## Listado de monitoreos

Cada monitoreo incluye:

- Nombre
- Tipo
- Severidad
- Estado actual
- Fecha de creacion/actualizacion
- Acciones disponibles

Tipos de monitor frecuentes:

- Aviso
- Informacion
- Advertencia
- Error
- Critico
- Alerta
- Emergencia

Estados operativos:

- OK
- Advertencia
- Alarma
- Sin datos

## Detalle de monitoreo

Secciones tipicas del detalle:

- Resumen
- Reglas
- Disparadores
- Historial
- Actividad

## Crear un monitoreo

### 1. Configuracion base

- Nombre y descripcion
- Tipo de monitor
- Ventana de muestreo
- Frecuencia de evaluacion

### 2. Definir reglas

Para cada regla:

- Metrica objetivo
- Metodo de evaluacion (`Mayor que`, `Menor que`, `Dentro de rango`, `Fuera de rango`)
- Limites y umbrales

### 3. Configurar disparadores

Tipos de disparador:

- Comunicacion (notificaciones)
- Reenvio de evento (endpoint personalizado)

Configuracion adicional:

- Estado que dispara
- Ventana temporal (horas/dias/meses)
- Destinatarios y contenido del mensaje
