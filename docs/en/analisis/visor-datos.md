---
title: "Data viewer"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Data viewer

Open the metric visualizer from the metrics menu to inspect a period, compare measurements or try a visualization.

## What the screen shows

:::screen id="visor-seleccion" src="../../assets/screenshots/v4.2.3/visor-seleccion.png" title="Data viewer (Spanish interface)" points="50,20;93,14;11,63;31,63;53,63;91,57;5,69;91,71;6,82;91,84"
1. **Chart.** Shows the selection; no metrics are selected yet. See the Widgets examples to learn how to read values.
2. **Period.** Select chart dates.
3. **Browse metrics.** Find and select measurements.
4. **Customize selection.** Change order, colors and processing.
5. **Visualization options.** Choose a widget type and its settings.
6. **Minimize.** Collapse selection to give the chart more space.
7. **Search.** Find a measurement.
8. **Filters.** Narrow catalog results.
9. **Checkboxes.** Add or remove metrics.
10. **Unit and references.** Check the unit or copy the identifier.
:::


The [integrated selector](../conceptos/selector.md) updates the view when the selection changes. It does not require the Confirm button used by selection windows in other forms.

## Example: finding a power peak

1. Search for **Potencia eléctrica** from **Edificio principal**.
2. Use a line chart and select one complete day.
3. In Customize selection, use 15 minutes and maximum to inspect peaks, if that resolution suits the metric.
4. Point at the highest observations to read their time and value. On a line chart, drag across a horizontal area to zoom in.
5. Switch to average to inspect the usual trend and observe how the reading changes.

**Result:** you can identify when a high value occurred. The chart alone does not determine its cause.

## Comparing values consistently

- Use the same interval and aggregation when comparing consumption across days.
- Keep separate units and check each series' axis when displaying power and temperature together.
- If data is missing, try another period and read the series message. A gap does not mean zero consumption.

The selection is preserved in the page address. Copy it to restore this selection; anyone opening it needs access to the same metrics.

For a view you will consult often, create a widget in [Dashboards and reports](paneles.md). See [Widgets](widgets.md) to choose its presentation.
