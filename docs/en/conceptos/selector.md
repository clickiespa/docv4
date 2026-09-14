---
title: "Metric Selector"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Metric selector

Use the selector to choose data for a widget, tool or calculation. You can customize this selection without changing the original measurements.

## What the screen shows: selecting

:::screen id="selector-seleccionar" src="../../assets/screenshots/v4.2.3/selector-seleccionar.png" title="Choose metrics (Spanish interface)" points="16,15;19,23;91,26;86,19;21,32;45,34;79,34;97,33;88,94;75,94;97,7"
1. **Steps.** Switch between finding metrics and customizing the selection.
2. **Search.** Enter a name, UUID or numeric reference.
3. **Filters.** Open search criteria.
4. **Count.** Shows available results.
5. **Checkboxes.** Add or remove selected metrics.
6. **Name and asset.** Check what is measured and where.
7. **Unit.** Distinguishes quantities.
8. **References.** Copy the numeric ID or UUID without changing selection.
9. **Customize.** Continue with the selected metrics.
10. **Cancel.** Close without applying a new selection.
11. **Close.** Exit the window.
:::


## Search filters

:::screen id="selector-filtros" src="../../assets/screenshots/v4.2.3/selector-filtros.png" title="Search filters (Spanish interface)" points="9,10;10,45;32,45;57,45;10,64;34,64;86,93"
1. **Active filters.** Show applied criteria; none are active here.
2. **Scope.** Choose where to search. Asset metrics enables asset and category filters.
3. **Type.** Limit by metric type.
4. **Unit of measure.** Find compatible quantities.
5. **Installation.** Find installation metrics.
6. **Tag.** Find metrics by tag.
7. **Done.** Close filters and return to the results.
:::

## What the screen shows: customizing

:::screen id="selector-personalizar" src="../../assets/screenshots/v4.2.3/selector-personalizar.png" title="Customize metrics (Spanish interface)" points="12,17;94,18;21,25;24,35;42,28;58,21;67,21;78,21;88,21;65,96;80,96;96,96;97,7"
1. **Steps.** Return to the catalog to add or remove measurements.
2. **Add.** Include a metric, formula or tag definition.
3. **Handle.** Drag to reorder, or use Alt with the up/down arrow.
4. **Color.** Identifies the series in a visualization.
5. **Name.** Opens metric details and references.
6. **Resolution.** Sets interval duration. The heading applies a setting to compatible selections.
7. **Aggregation.** Decides how to summarize values within an interval.
8. **Interpolation.** Decides how to handle gaps between readings.
9. **Filters.** Process data; these are not catalog search filters. Unavailable means no filters are associated.
10. **Cancel.** Exit without applying the draft.
11. **Back.** Return to search while keeping the draft.
12. **Confirm.** Return the chosen metrics to the original form; complete its save action afterwards.
13. **Close.** Exit the window.
:::


Point to a row to reveal edit and remove actions. The pencil changes its displayed name, unit or processing; changing a unit label does not convert values. Remove takes the metric out of this selection.

When editing a row, choose **Apply changes** or **Discard** before continuing. Then select **Confirm** and complete the original form's save action when required.

## Example: inspecting power and temperature

1. Search for **Potencia eléctrica** and select the metric belonging to **Edificio principal**.
2. Add **Temperatura ambiente** from **Sala de equipos**.
3. In Customize, keep the names and units, and choose distinguishable colors.
4. To inspect a day's trend, use 15-minute resolution and average if appropriate for your metrics.
5. Confirm if you are using a selection window. In the viewer, change the day directly.

Read each series in its own unit: kW and °C do not share a magnitude scale. Choose a chart that distinguishes them, such as [Bars and Lines](../analisis/widgets.md#trends-and-comparison).

## Formulas and tags

A **synthetic metric** lets you enter an expression referencing metrics. A **tag metric** combines metrics sharing a tag; check the combination method and which metrics that tag includes.

See [Metrics and formulas](metricas.md) for aggregation and calculation order. In the **data viewer**, the selector appears in tabs and updates the visualization as you use it. The final Confirm action applies to the selector opened as a separate window.
