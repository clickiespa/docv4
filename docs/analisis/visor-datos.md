---
title: "Visor de datos"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---

# Visor de datos

El **Visor de datos** funciona como una caja de arena para explorar métricas, validar comportamiento y transformar observaciones en decisiones accionables.

:::module-strip
Visor de datos es el entorno recomendado para validar una hipótesis antes de escalarla a paneles, reportes o monitoreos. Primero se contrasta el dato, después se comunica.
:::

## Valor para usuarios y clientes

Antes de fijar una vista en un panel o disparar alertas en Monitoreos, el Visor de datos permite responder preguntas clave:

- Qué está pasando realmente con la variable.
- Si el comportamiento es estable o anómalo.
- Qué resolución y configuración representan mejor el fenómeno.

Este paso reduce errores de interpretación y mejora la calidad de lo que luego se comunica en reportes.

## Casos de uso frecuentes

- Probar una métrica en distintos rangos de tiempo.
- Comparar series en una misma vista.
- Evaluar resolución, agregación e interpolación.
- Construir una visualización de validación antes de publicarla.
- Exportar datos para análisis externo.

## Flujo sugerido paso a paso

:::steps
1. **Abrir contexto de análisis**: Ingresar a **Mis métricas**, abrir **Visor de datos** y definir el rango temporal.
2. **Seleccionar fuentes**: Desde **Explorar** elegir métricas y, si aplica, agregar etiquetas o fórmulas.
3. **Ajustar lectura**: En **Selección actual** personalizar parámetros y elegir tipo de gráfico.
4. **Validar y escalar**: Revisar consistencia y decidir si exportar o promover a panel/reporte.
:::

## Tipos de visualización comunes

- Serie temporal
- Barras
- Tabla
- Indicadores resumidos

## Criterios para elegir una vista

- Si buscas tendencia: usar serie temporal.
- Si comparas periodos o categorías: usar barras.
- Si priorizas auditoría puntual: usar tabla.
- Si necesitas lectura ejecutiva rápida: usar indicadores resumidos.

## Exportador de datos

Desde el **Exportador de datos** se puede descargar información para análisis externo o integración con otros flujos.

Campos habituales de configuración:

- rango de fechas,
- conjunto de métricas,
- resolución,
- formato de salida.

## Buenas prácticas

- Validar unidades antes de comparar series.
- Revisar huecos de datos para evitar conclusiones erradas.
- Guardar configuraciones de análisis usadas por el equipo.
- Pasar a paneles solo visualizaciones que ya fueron validadas en Visor.

## Referencias

- [Selector de métricas](../conceptos/selector.md)
- [Paneles y reportes](./paneles.md)
- [Monitoreos](../automatizacion/monitoreos.md)
