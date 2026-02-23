---
title: "Visor de datos"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Visor de datos

El **Visor de datos** funciona como una caja de arena para explorar metricas, validar comportamiento y transformar observaciones en decisiones accionables.

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

1. Ingresar a **Mis metricas** y abrir **Visor de datos**.
2. Definir el rango temporal de analisis.
3. Desde **Explorar**, seleccionar una o mas metricas.
4. En **Seleccion actual**, personalizar parametros si hace falta.
5. Si aplica, crear etiqueta para combinar metricas.
6. Si aplica, agregar formula de calculo.
7. Ajustar opciones de visualizacion y tipo de grafico.
8. Validar resultado final y decidir siguiente accion (exportar o promover a panel/reporte).

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
