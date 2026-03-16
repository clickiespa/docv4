---
title: "Data viewer"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Data viewer

**Data Viewer** functions as a sandbox to explore metrics, validate behavior, and transform observations into actionable decisions.

:::module-strip
Data Viewer is the recommended environment to validate a hypothesis before scaling it to dashboards, reports or monitoring. First the data is compared, then it is communicated.
:::

## Value for users and customers

Before setting a view on a dashboard or triggering alerts in Monitoring, the Data Viewer helps you answer key questions:

- What is really happening with the variable.
- Whether the behavior is stable or abnormal.
- What resolution and configuration best represent the phenomenon.

This step reduces interpretation errors and improves the quality of what is later communicated in reports.

## Common use cases

- Test a metric in different time ranges.
- Compare series in the same view.
- Evaluate resolution, aggregation and interpolation.
- Build a validation visualization before publishing.
- Export data for external analysis.

## Suggested step-by-step flow

:::steps
1. **Open analysis context**: Enter **My metrics**, open **Data viewer** and define the time range.
2. **Select sources**: From **Explore** choose metrics and, if applicable, add labels or formulas.
3. **Adjust reading**: In **Current selection** customize parameters and choose graph type.
4. **Validate and scale**: Check consistency and decide whether to export or promote to dashboard/report.
:::

## Common display types

- Time series
- Bars
- Table
- Summary indicators

## Criteria for choosing a view

- If you are looking for a trend: use time series.
- If you compare periods or categories: use bars.
- If you prioritize a specific audit: use a table.
- If you need quick executive reading: use summary indicators.

## Data exporter

From the **Data Exporter** you can download information for external analysis or integration with other flows.

Common configuration fields:

- date range,
- set of metrics,
- resolution,
- output format.

## Good practices

- Validate units before comparing series.
- Review data gaps to avoid wrong conclusions.
- Save analysis configurations used by the device.
- Move to panels only visualizations that have already been validated in Viewer.

## References

- [Metric Selector](../conceptos/selector.md)
- [Dashboards and reports](./paneles.md)
- [Monitoring](../automatizacion/monitoreos.md)