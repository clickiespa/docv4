---
title: "Metric Selector"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Metric selector

The **Metric Selector** is a cross-cutting tool that appears every time the user needs to choose data for visualization, monitoring or calculation.

:::module-strip
The Metric Selector is the gateway to converting available data into consistent decisions. It is used throughout the platform and avoids isolated configurations per module.
:::

## What is it for in business terms

The Metric Selector allows you to go from "available data" to "useful data" without requiring additional developments.

With the same interface, technical and business teams can:

- quickly find the correct metric,
- adapt its presentation to the use case,
- combine metrics to build executive indicators,
- and validate hypotheses before scaling a configuration.

## Where used

- Dashboards and reports
- Data viewer
- Monitoring
- Calculation formulas

## Recommended flow of use

:::steps
1. **Explore and select**: From the **Explore** tab, enter by category and select one or more metrics to operate.
2. **Review Current Selection**: Edit only the current context (display, monitoring or calculation) without affecting the original settings.
3. **Customize reading parameters**: Adjust color, name, unit of measurement, temporal resolution, aggregation and interpolation.
:::

From the **Explore** tab you can enter different categories and select one or more metrics.

The list normally displays:

- name,
- unit of measurement (UOM),
- metric identifier.

## Aggregation and interpolation (key criteria)

### Aggregation method

Aggregation summarizes raw data into a unified format for the selected time interval.

Common types:

- `Promedio`: average of values within the interval.
- `Máximo`: maximum value within the interval.
- `Mínimo`: minimum value within the interval.
- `Suma`: sum of values ​​within the interval.
- `Primer valor`: first value observed in the interval.
- `Último valor`: last value observed in the interval.

### Interpolation method

Interpolation estimates missing values between known points to maintain reading continuity.

Common types:

- `Lineal`: connect extremes with intermediate values.
- `Continuidad`: keeps the last known value.
- `Agujero negro`: does not complete missing items.
- `Relleno cero`: complete missing items with zero.

:::interpolation-examples
:::

## Virtual metrics per tag

The selector allows you to combine two or more real metrics into one virtual metric.

To create it, define:

- visible name,
- unique label,
- combination method (`suma` or `promedio`).

This makes it easier to consolidate indicators in business language without altering original sources.

## Calculated metrics

You can also create metrics calculated from formulas with metric IDs (for example `@111`).

The calculation is resolved on demand for the requested time range and maintains technical traceability of the result.

Typical cases:

- net consumption (`comprada - solar`),
- unit conversion,
- threshold limiters,
- nested conditionals for business rules.

## Good practices

- Define the business objective first and then choose metrics.
- Avoid mixing incompatible resolutions without reviewing the final result.
- Document reusable formulas to accelerate adoption among teams.
- Maintain clear metric names to facilitate global search.

## References

- [Metrics and formulas](./metricas.md)
- [Data viewer](../analisis/visor-datos.md)
- [Monitoring](../automatizacion/monitoreos.md)