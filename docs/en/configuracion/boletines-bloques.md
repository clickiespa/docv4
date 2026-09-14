---
title: "Newsletters: content blocks"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Newsletters: content blocks

Blocks make up the newsletter content. Add them from **Newsletter > Design > Add block** and drag them into reading order.

## Choose a block

Catalog names may appear in English.

| Block | What it shows | Example use |
| --- | --- | --- |
| **Free Text** | Text with HTML formatting. | A short note about a maintenance shutdown. |
| **Newsletter Header** | Title, subtitle and summary date or period. | “Resumen semanal · Planta de demostración”. |
| **KPI Snapshot** | Summary values per metric, with optional comparison and sparkline. | Weekly energy consumption compared with the previous week. |
| **Line, Bar & Area Chart** | Trends in lines, areas or bars; also supports one bar per metric. | Room temperature through the week or consumption by building. |
| **Metric Comparison Feedback** | A metric compared with another or with itself over another period. | Checking whether consumption fell from the previous week. |
| **Comparative Table** | A primary metric and comparison metrics, with optional percentages relative to the primary metric. | Total building consumption and each system's contribution. |
| **Monitoring History** | Summary or detailed history for selected monitors. | When **Temperatura fuera de rango** was in alarm. |

## Configure the data

1. **Block description**: identify its purpose in the editor. Use a short name, such as “Weekly consumption”.
2. **Metrics or monitors**: choose what data to display.
3. **Interval**: define the block's data period.
4. **Use last closed period**: use the most recent completed period instead of the current, potentially incomplete one.
5. **Presentation**: set the options offered by that type, such as title, legend, points, style or percentage.
6. **Preview**: check the result using a newsletter reference date.

Different blocks have different fields. Editing a block changes its description and options; to use another type, add a new block.

## Example: summarize a complete week

For **Resumen semanal**, add:

- **Newsletter Header** with the plant name and period.
- **KPI Snapshot** with **Consumo de energía**, a weekly interval and the last closed period.
- **Line, Bar & Area Chart** with **Temperatura ambiente** to see when temperature rose.
- **Monitoring History** with **Temperatura fuera de rango** and the same closed period.

The total, trend and events then refer to the same complete week.

## Read comparisons

In **Metric Comparison Feedback**, choose **Compare with another metric** or **Compare with itself**. Set the interval and offset on each side. **Invert trend** reverses the visual interpretation. By default, lower or equal values are considered favorable, as with consumption; invert it when higher values represent a better result.

In **Comparative Table**, percentages are relative to the primary metric. Compare equivalent quantities and units. An optional time pattern limits which hours enter the calculation.

For charts, **Lines / area** shows trends; **Bars over time** compares intervals; **Stacked bars** shows contributions; and **One bar per metric** compares summary values.

See also [Newsletters](./boletines.md).
