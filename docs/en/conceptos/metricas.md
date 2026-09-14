---
title: "Metrics and formulas"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Metrics and formulas

A metric holds the values of a variable over time. Its name identifies what is measured; its unit gives the value meaning.

## What the screen shows

In the metric list:

:::screen id="metricas-lista" src="../../assets/screenshots/v4.2.3/metricas-lista.png" title="Metric catalog (Spanish interface)" points="2,8;54,10;72,10;96,16;10,43;16,30;52,31;68,30;86,31;4.5,29;96,43;10,81;87,88"
1. **Account and section.** Confirm which account you are reading.
2. **Search.** Find a metric by name, description or reference.
3. **Filter.** Narrow the results.
4. **New metric.** Open metric creation.
5. **ID.** Identifies the metric, including in formulas.
6. **Name and description.** Open measurement details.
7. **Unit of measure.** Distinguish energy, power and temperature.
8. **Metric source.** Shows where data comes from, such as Device, Calculated or API.
9. **Created.** Shows registration time; use the heading to sort.
10. **Checkboxes.** Select one or more metrics.
11. **Actions.** Open permitted operations; Export prepares a download.
12. **Page size.** Change the number of visible results.
13. **Pagination.** Browse the catalog pages.
:::


## Choosing the right metric

| Example metric | Question it answers | How to read it |
| --- | --- | --- |
| Consumo de energía | How much energy was consumed? | kWh over the period. |
| Potencia eléctrica | How much power was being used? | kW; useful for inspecting peaks and operating hours. |
| Temperatura ambiente | How did temperature change? | °C; inspect average, minimum or maximum. |
| Caudal de agua | At what rate was water flowing? | Volume per unit of time, according to the metric. This is not itself the volume consumed. |

Open a metric name to inspect its details, source and available data. Tabs contain data, configuration and relationships; available options depend on the metric type and your permissions.

## Choosing period, resolution and aggregation

**Period** is the date range. **Resolution** is the duration represented by each point or row. **Aggregation** is the operation used to summarize data in that interval.

| Question | Period | Resolution and aggregation |
| --- | --- | --- |
| At what time does power rise? | One complete day | 15 minutes; average for trends or maximum for peaks. |
| Which day consumed the most energy? | One complete week | One day; sum if the metric contains interval consumption. |
| What was each day's highest temperature? | One complete week | One day; maximum. |
| What was the water flow during the day? | One complete day | One hour; average. |

Start with **Use default** if you do not know the data type. Do not sum cumulative meter readings or period averages to obtain a total. Check the metric definition before changing its aggregation.

**Interpolation** determines how missing points are handled while preparing the series. An interpolated value is not a recorded reading. Keep the default unless you need a different way to fill the intervals.

A period such as today is still receiving data. Compare equivalent complete periods when comparing totals. **No data** does not mean zero.

## Creating a calculated metric

A formula combines metrics and numbers. For example, add sector consumption when all values use kWh and the sectors do not overlap, or calculate a sector's share of total consumption.

1. Open calculated metric creation from the metric list.
2. Enter a name describing the result and choose its unit.
3. Build the formula using the actual metric IDs. You can copy these from metric information in the selector.
4. Set resolution, aggregation and interpolation, then inspect the preview.
5. Save when the formula and selected period show the intended result.

The calculation mode provides two choices:

- **Calculate first, aggregate afterwards:** calculate each point, then summarize the results. Use it, for example, to inspect a ratio at each instant.
- **Aggregate first, calculate afterwards:** prepare each metric before applying the formula. Use it to calculate a sector's share from period consumption totals. This mode allows individual metric settings; a child metric's resolution cannot be coarser than the formula's.

Averaging instantaneous percentages and dividing period totals can give different results. Choose the method that answers your question. If a required input is missing or the divisor is zero, the result may be unavailable.

A formula added within the [selector](selector.md) belongs to that selection. Create it from the metric list when you need a reusable catalog metric.
