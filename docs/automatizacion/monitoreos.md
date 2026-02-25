---
title: "Monitoreos"
version: "v4"
last_updated: "2026-02-25"
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

## Ejemplo practico: monitoreo de factor de potencia

Caso de referencia para capacitacion:

- **Metrica**: `F. de Pot.`
- **Regla**: entrar en alarma cuando en una ventana de 10 min al menos el 10% de los puntos este por debajo de 0.93.
- **Frecuencia de evaluacion**: cada 5 min.

Configuracion en tres pasos logicos de Clickie:

:::steps
1. **Monitoreo**: Nombre `Control de Factor de Potencia`, tipo `Alerta`, ventana de muestreo `10 min`, frecuencia `5 min`.
2. **Regla**: Nombre `F. de Pot.`, metodo `Menor que`, limite `0.93`, umbral `10%`.
3. **Disparador**: Tipo `Comunicacion`, disparar en estado `ALARMA`, patron de tiempo segun operacion, notificar a colaboradores responsables.
:::

:::monitoring-example-fpot
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
