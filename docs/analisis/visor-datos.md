---
title: "Visor de datos"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Visor de datos

El **Visor de datos** funciona como una caja de arena para explorar metricas, validar comportamiento y transformar observaciones en decisiones accionables.

:::module-strip
Visor de datos es el entorno recomendado para validar una hipotesis antes de escalarla a paneles, reportes o monitoreos. Primero se contrasta el dato, despues se comunica.
:::

## Valor para usuarios y clientes

Antes de fijar una vista en un panel o disparar alertas en Monitoreos, el Visor de datos permite responder preguntas clave:

- Que esta pasando realmente con la variable.
- Si el comportamiento es estable o anomalo.
- Que resolucion y configuracion representan mejor el fenomeno.

Este paso reduce errores de interpretacion y mejora la calidad de lo que luego se comunica en reportes.

## Casos de uso frecuentes

- Probar una metrica en distintos rangos de tiempo.
- Comparar series en una misma vista.
- Evaluar resolucion, agregacion e interpolacion.
- Construir una visualizacion de validacion antes de publicarla.
- Exportar datos para analisis externo.

## Flujo sugerido paso a paso

:::steps
1. **Abrir contexto de analisis**: Ingresar a **Mis metricas**, abrir **Visor de datos** y definir el rango temporal.
2. **Seleccionar fuentes**: Desde **Explorar** elegir metricas y, si aplica, agregar etiquetas o formulas.
3. **Ajustar lectura**: En **Seleccion actual** personalizar parametros y elegir tipo de grafico.
4. **Validar y escalar**: Revisar consistencia y decidir si exportar o promover a panel/reporte.
:::

## Tipos de visualizacion comunes

- Serie temporal
- Barras
- Tabla
- Indicadores resumidos

## Criterios para elegir una vista

- Si buscas tendencia: usar serie temporal.
- Si comparas periodos o categorias: usar barras.
- Si priorizas auditoria puntual: usar tabla.
- Si necesitas lectura ejecutiva rapida: usar indicadores resumidos.

## Exportador de datos

Desde el **Exportador de datos** se puede descargar informacion para analisis externo o integracion con otros flujos.

Campos habituales de configuracion:

- rango de fechas,
- conjunto de metricas,
- resolucion,
- formato de salida.

## Buenas practicas

- Validar unidades antes de comparar series.
- Revisar huecos de datos para evitar conclusiones erradas.
- Guardar configuraciones de analisis usadas por el equipo.
- Pasar a paneles solo visualizaciones que ya fueron validadas en Visor.

## Referencias

- [Selector de metricas](../conceptos/selector.md)
- [Paneles y reportes](./paneles.md)
- [Monitoreos](../automatizacion/monitoreos.md)
