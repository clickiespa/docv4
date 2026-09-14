---
title: "Data exporter"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Data exporter

Download measurements as an **Excel (.xlsx)** file to work with them outside Clickie. Open **Metrics > Metrics Exporter** and choose metrics you can access.

## What the screen shows

:::screen id="exportador-opciones" src="../../assets/screenshots/v4.2.3/exportador-opciones.png" title="Export options (Spanish interface)" points="56,7;79,4;96,12;79,17;78,35;68,42;76,47;35,27;50,44;38,52;45,70;6,82;94,84"
1. **Period.** Choose start and end dates.
2. **Gear.** Open advanced options.
3. **Download .xlsx.** Query the full period and create Excel.
4. **Show UOM.** Include units in cells, saving them as text. Disable it to calculate with numbers.
5. **Time zone.** Defines the local date column.
6. **Cancel.** Close options without applying them.
7. **Apply.** Use the selected settings.
8. **Table.** Shows a preview; no metrics are selected yet.
9. **Status and progress.** Show the preview period and loading progress.
10. **Browse / Customize.** Choose metrics and processing.
11. **Search and filters.** Find catalog measurements.
12. **Checkboxes.** Include measurements in the export.
13. **Unit and references.** Identify catalog measurements.
:::


The preview may show only the start of the selected period. **The download covers the complete requested period**, using available data.

## Example: review daily consumption in Excel

1. Select **Consumo de energía** from **Edificio principal**.
2. Choose a complete week in **Period**.
3. In **Customize selection**, use daily resolution and sum if the metric contains interval consumption. Keep the defaults if you do not know its definition.
4. Open the gear icon, check the **Time zone** and turn off **Show UOM** if you need to calculate with the cells in Excel. Select **Apply**.
5. Check the first rows and select **Download .xlsx**. Keep the page open until it finishes.

## Read the file

The file contains one sheet named **Export**, with:

- **Timestamp UTC**: the numeric date reference.
- **UTC date** and **Local date**: the same instant in UTC and in the selected time zone.
- **One column per metric**: values using the selected processing, rounded to two decimal places.

With **Show UOM**, values that have a unit include it and are saved as text. Without it, values are saved as numbers. A blank cell means there is no value for that date; it does not mean zero.

The button stays disabled while an export is being prepared. If an error appears, check the period and selection before trying again.

See [Metric selector](../conceptos/selector.md) and [Metrics and formulas](../conceptos/metricas.md) to choose the appropriate processing.
