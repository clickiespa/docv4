---
title: "Monitoreos"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Monitoreos

El modulo **Monitoreos** evalua condiciones sobre metricas y genera estados operativos automaticos para deteccion temprana, seguimiento y comunicacion.

:::module-strip
Monitoreos convierte comportamiento de datos en alertas operativas. El objetivo es detectar desvio, priorizar impacto y comunicar al equipo correcto con reglas claras.
:::

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

:::steps
1. **Crear monitoreo base**: Desde **Monitoreos** elegir **+ Nuevo monitoreo** y definir nombre, tipo, ventana y frecuencia de evaluacion.
2. **Definir reglas**: Ingresar al monitoreo, abrir **Reglas** y asignar metrica, metodo (`Mayor que`, `Menor que`, `Dentro de rango`, `Fuera de rango`) y umbral.
3. **Configurar disparadores**: En **Disparadores** crear notificacion o reenvio de evento y completar estado, patron de tiempo y destinatarios.
:::

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
