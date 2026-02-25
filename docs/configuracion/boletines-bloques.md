---
title: "Boletines - Bloques de contenido"
version: "v4"
last_updated: "2026-02-25"
owner: "Product"
status: "stable"
---

# Boletines - Bloques de contenido

Los bloques determinan que informacion aparece en un boletin y en que formato se presenta.
Cada bloque combina una plantilla visual con parametros de configuracion (titulos, metricas, ventanas temporales o HTML) y el orden final define la narrativa del envio.

## Como funcionan los bloques

:::steps
1. **Seleccion del tipo**: Al crear un bloque se elige el tipo desde catalogo y se carga su formulario especifico.
2. **Configuracion**: Se completan campos segun tipo con validaciones de consistencia.
3. **Descripcion interna**: Documenta proposito del bloque para otros editores.
4. **Orden**: El drag and drop guarda la secuencia para la proxima ejecucion.
5. **Previsualizacion**: Cada cambio se valida en vista previa con datos reales para una fecha elegida.
:::

## Resumen de bloques disponibles

| Bloque | Cuando usarlo |
| --- | --- |
| **Free Text** | Mensajes editoriales, disclaimers o contexto narrativo sin dependencia de metricas. |
| **KPI Snapshot** | Resumen rapido de indicadores criticos y comparaciones. |
| **Line Chart** | Evolucion temporal de una o varias metricas con resolucion alineada. |
| **Bar Chart** | Comparaciones por periodo o entre metricas (incluye stacking). |

## Free Text

**Proposito**: insertar HTML personalizado para introducciones, notas operativas o llamados a la accion.

Campos:

- **HTML** (obligatorio): contenido renderizado dentro de `{{ blocks }}`.

## KPI Snapshot

**Proposito**: responder rapidamente "como vamos" con tarjetas de indicadores agregados.

Campos:

- **Titulo** (obligatorio)
- **Subtitulo**
- **Metricas** (obligatorio, multiple)
- **Ventana** (obligatorio): `P1D`, `P1W`, `P1M`, `P1Y`
- **Usar ultimo periodo cerrado**
- **Modo de comparacion**
- **Mostrar sparkline**

Casos de uso:

- Consumo energetico vs metas.
- Eficiencia operativa por linea o sede.
- Indicadores de mantenimiento con impacto en gasto diario.

## Line Chart

**Proposito**: visualizar tendencias temporales sincronizadas en una resolucion comun.

Campos:

- **Titulo** (obligatorio)
- **Subtitulo**
- **Metricas** (obligatorio, multiple, misma resolucion)
- **Ventana** (obligatorio)
- **Usar ultimo periodo cerrado**
- **Habilitar comparacion**
- **Modo de comparacion**
- **Mostrar leyenda**
- **Mostrar puntos**

Casos de uso:

- Tendencias de consumo por planta.
- Generacion vs demanda.
- Comparacion de estacionalidad contra ano anterior.

## Bar Chart

**Proposito**: comparar magnitudes por periodo o por metrica individual.

Campos:

- **Titulo** (obligatorio)
- **Subtitulo**
- **Metricas** (obligatorio)
- **Ventana** (obligatorio)
- **Usar ultimo periodo cerrado**
- **Modo de comparacion**
- **Modo de barras** (obligatorio): `time`, `stacked_time`, `aggregate_per_metric`
- **Bucket** (opcional): hora, dia, semana, mes

Casos de uso:

- Comparativas por turno/sede.
- Distribucion de fuentes energeticas.
- Ranking de activos con desvio.

## Buenas practicas al combinar bloques

- Alternar bloques narrativos y cuantitativos para mejorar legibilidad.
- Documentar dependencias en descripcion interna del bloque.
- Mantener 5-6 bloques para evitar fatiga de lectura.
- Para escenarios excepcionales, duplicar boletin en lugar de editar sobre la marcha.

## Proximos pasos

- [Boletines](./boletines.md)
- [Boletines - Plantillas](./boletines-plantillas.md)
- [Boletines - Grupos de destinatarios](./boletines-grupos.md)
