---
title: "Monitoreos"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Monitoreos

El modulo **Monitoreos** evalua condiciones sobre metricas y genera estados operativos automaticos para deteccion temprana, seguimiento y comunicacion.

## Que aporta a la operacion

Monitoreos transforma datos continuos en senales accionables.

En la practica permite:

- detectar desvios a tiempo,
- priorizar eventos por severidad,
- y notificar al equipo correcto con la frecuencia adecuada.

## Listado de monitoreos

Cada monitoreo incluye:

- nombre,
- tipo,
- severidad,
- estado actual,
- fecha de creacion/actualizacion,
- acciones disponibles.

Tipos de monitor frecuentes:

- Aviso
- Informacion
- Advertencia
- Error
- Critico
- Alerta
- Emergencia
- Depuracion

Estados operativos:

- OK
- Advertencia
- Alarma
- Sin datos

## Flujo de configuracion recomendado

### 1. Crear monitoreo base

Desde **Monitoreos** seleccionar **+ Nuevo monitoreo** y completar:

- nombre,
- descripcion (opcional),
- tipo de monitor,
- ventana de muestreo,
- frecuencia de evaluacion.

### 2. Definir reglas

Ingresar al monitoreo creado, abrir **Reglas** y seleccionar **+ Nueva regla**.

Para cada regla se define:

- nombre y descripcion,
- metrica objetivo,
- metodo de evaluacion (`Mayor que`, `Menor que`, `Dentro de rango`, `Fuera de rango`),
- umbral o limites.

### 3. Configurar disparadores

Desde **Disparadores** seleccionar **+ Nuevo disparador**.

Tipos de disparador:

- Comunicacion (notificaciones)
- Reenvio de evento (endpoint personalizado)

Campos habituales:

- estado disparador,
- observaciones,
- patron de tiempo,
- colaborador o destinatario,
- titulo/resumen/contenido de la comunicacion.

## Diseno de alertas utiles

Para evitar ruido y fatiga de alertas:

- usar severidades coherentes con el impacto real,
- separar reglas de advertencia y critica,
- definir ventanas de tiempo acordes al proceso,
- revisar periodicamente reglas que no agregan valor.

## Referencias

- [Metricas y formulas](../conceptos/metricas.md)
- [Selector de metricas](../conceptos/selector.md)
- [Visor de datos](../analisis/visor-datos.md)
