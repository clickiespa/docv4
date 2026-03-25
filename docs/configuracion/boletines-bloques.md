---
title: "Boletines - Bloques de contenido"
version: "v4"
last_updated: "2026-03-25"
owner: "Product"
status: "stable"
---

# Boletines - Bloques de contenido

Los bloques determinan qué información aparece en un boletín y en qué formato se presenta.
Cada bloque combina una plantilla visual con parámetros de configuración (títulos, métricas, ventanas temporales o HTML) y el orden final define la narrativa del envío.

## Captura de referencia

![Vista general del módulo Boletines](../assets/screenshots/modules/newsletters.png)
*Desde el detalle de cada boletín se gestionan los bloques de contenido y su orden de presentación.*

## Cómo funcionan los bloques

:::steps
1. **Selección del tipo**: Al crear un bloque se elige el tipo desde catálogo y se carga su formulario específico.
2. **Configuración**: Se completan campos según tipo con validaciones de consistencia.
3. **Descripción interna**: Documenta propósito del bloque para otros editores.
4. **Orden**: El drag and drop guarda la secuencia para la próxima ejecución.
5. **Previsualización**: Cada cambio se valida en vista previa con datos reales para una fecha elegida.
:::

## Resumen de bloques disponibles

| Bloque | Cuando usarlo |
| --- | --- |
| **Free Text** | Mensajes editoriales, disclaimers o contexto narrativo sin dependencia de métricas. |
| **KPI Snapshot** | Resumen rápido de indicadores críticos y comparaciones. |
| **Line Chart** | Evolución temporal de una o varias métricas con resolución alineada. |
| **Bar Chart** | Comparaciones por periodo o entre métricas (incluye stacking). |

## Free Text

**Propósito**: insertar HTML personalizado para introducciones, notas operativas o llamados a la acción.

Campos:

- **HTML** (obligatorio): contenido renderizado dentro de `{{ blocks }}`.

## KPI Snapshot

**Propósito**: responder rápidamente "cómo vamos" con tarjetas de indicadores agregados.

Campos:

- **Título** (obligatorio)
- **Subtítulo**
- **Métricas** (obligatorio, multiple)
- **Ventana** (obligatorio): `P1D`, `P1W`, `P1M`, `P1Y`
- **Usar último periodo cerrado**
- **Modo de comparación**
- **Mostrar sparkline**

Casos de uso:

- Consumo energético vs metas.
- Eficiencia operativa por línea o sede.
- Indicadores de mantenimiento con impacto en gasto diario.

## Line Chart

**Propósito**: visualizar tendencias temporales sincronizadas en una resolución común.

Campos:

- **Título** (obligatorio)
- **Subtítulo**
- **Métricas** (obligatorio, multiple, misma resolución)
- **Ventana** (obligatorio)
- **Usar último periodo cerrado**
- **Habilitar comparación**
- **Modo de comparación**
- **Mostrar leyenda**
- **Mostrar puntos**

Casos de uso:

- Tendencias de consumo por planta.
- Generación vs demanda.
- Comparación de estacionalidad contra año anterior.

## Bar Chart

**Propósito**: comparar magnitudes por periodo o por métrica individual.

Campos:

- **Título** (obligatorio)
- **Subtítulo**
- **Métricas** (obligatorio)
- **Ventana** (obligatorio)
- **Usar último periodo cerrado**
- **Modo de comparación**
- **Modo de barras** (obligatorio): `time`, `stacked_time`, `aggregate_per_metric`
- **Bucket** (opcional): hora, día, semana, mes

Casos de uso:

- Comparativas por turno/sede.
- Distribución de fuentes energéticas.
- Ranking de activos con desvío.

## Buenas prácticas al combinar bloques

- Alternar bloques narrativos y cuantitativos para mejorar legibilidad.
- Documentar dependencias en descripción interna del bloque.
- Mantener 5-6 bloques para evitar fatiga de lectura.
- Para escenarios excepcionales, duplicar boletin en lugar de editar sobre la marcha.

## Próximos pasos

- [Boletines](./boletines.md)
- [Boletines - Plantillas](./boletines-plantillas.md)
- [Boletines - Grupos de destinatarios](./boletines-grupos.md)
