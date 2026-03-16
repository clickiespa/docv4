---
title: "Newsletters - Content Blocks"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Newsletters - Content Blocks

Blocks determine what information appears in a newsletter and in what format it is presented.
Each block combines a visual template with configuration parameters (titles, metrics, time windows or HTML) and the final order defines the narrative of the delivery.

## How blocks work

:::steps
1. **Type selection**: When creating a block, the type is chosen from the catalog and its specific form is loaded.
2. **Configuration**: Fields are completed according to type with consistency validations.
3. **Internal description**: Documents the purpose of the block for other editors.
4. **Order**: Drag and drop saves the sequence for the next execution.
5. **Preview**: Each change is validated in preview with real data for a chosen date.
:::

## Summary of available blocks

| Block | When to use |
| --- | --- |
| **Free Text** | Editorial messages, disclaimers or narrative context without dependence on metrics. |
| **KPI Snapshot** | Quick summary of critical indicators and comparisons. |
| **Line Chart** | Time evolution of one or more metrics with aligned resolution. |
| **Bar Chart** | Comparisons by period or between metrics (includes stacking). |

## Free Text

**Purpose**: Insert custom HTML for introductions, operational notes, or calls to action.

Fields:

- **HTML** (required): Rendered content within `{{ blocks }}`.

## KPI Snapshot

**Purpose**: Quickly answer "how are we doing" with added indicator cards.

Fields:

- **Title** (required)
- **Subtitle**
- **Metrics** (mandatory, multiple)
- **Window** (required): `P1D`, `P1W`, `P1M`, `P1Y`
- **Use last closed period**
- **Comparison mode**
- **Show sparkline**

Use cases:

- Energy consumption vs goals.
- Operational efficiency by line or headquarters.
- Maintenance indicators with impact on daily spending.

## Line Chart

**Purpose**: Visualize synchronized time trends at a common resolution.

Fields:

- **Title** (required)
- **Subtitle**
- **Metrics** (mandatory, multiple, same resolution)
- **Window** (required)
- **Use last closed period**
- **Enable comparison**
- **Comparison mode**
- **Show legend**
- **Show points**

Use cases:

- Consumption trends by plant.
- Generation vs demand.
- Comparison of seasonality against previous year.

## Bar Chart

**Purpose**: compare magnitudes by period or by individual metric.

Fields:

- **Title** (required)
- **Subtitle**
- **Metrics** (required)
- **Window** (required)
- **Use last closed period**
- **Comparison mode**
- **Bar mode** (mandatory): `time`, `stacked_time`, `aggregate_per_metric`
- **Bucket** (optional): hour, day, week, month

Use cases:

- Comparisons by shift/headquarters.
- Distribution of energy sources.
- Asset ranking with deviation.

## Good practices when combining blocks

- Alternate narrative and quantitative blocks to improve readability.
- Document dependencies in the internal description of the block.
- Maintain 5-6 blocks to avoid reading fatigue.
- For exceptional scenarios, duplicate newsletter instead of editing on the fly.

## Next steps

- [Newsletters](./boletines.md)
- [Newsletters - Templates](./boletines-plantillas.md)
- [Newsletters - Recipient Groups](./boletines-grupos.md)