---
title: "Asset matrix"
version: "v4.2.4"
last_updated: "2026-09-25"
owner: "Product"
status: "stable"
---

# Asset matrix

Compare several assets in one table: rows show their metrics or metric groups and columns show periods. Use it to review consumption across sites, areas or equipment without creating a separate card for each one.

:::screen id="matriz-ejemplo-real" src="../../assets/screenshots/v4.2.4/matriz-ejemplo-real.png" title="Example of a configured matrix" points="38,6;24,21;57,15;95,15;48,91"
1. **Context.** The title and description explain what is compared and its unit.
2. **Assets and groups.** Three example sites bring together operations, administration and services consumption.
3. **Periods.** Each column compares the same month across sites.
4. **Row total.** Summarizes each group's months using the selected operation.
5. **Overall total.** Summarizes included metrics without counting the same metric twice.
:::

Screenshot of a real widget configured with example assets and existing measurements. Site names and associations are illustrative.

## 1. Add the widget

Open a dashboard you can edit, select **Add widget**, find **Asset matrix** and continue. Enter a title and a description that explain the table, such as “Monthly consumption by site · kWh”.

## 2. Select and customize assets

Open the asset selector. In **Explore assets**, find and select the assets to compare. In **Customize**, drag to reorder them and adjust each asset. Removing an asset from this selection does not delete it from the account.

| Setting | Result |
| --- | --- |
| Name, color and icon | Change the asset's appearance in this widget without modifying its record. |
| Show metrics individually | Creates one row for each metric matching any of the specified tags, retaining its name. |
| Show grouped metrics | Combines the metrics for each tag into a row, keeping different units separate. |
| Tags | Determine which asset metrics are used. At least one tag is required in either mode. |
| Group name, icon and color | Identify each group with a meaningful name, such as “Air conditioning”. |
| Group combination | Choose sum, average, minimum or maximum across the group's metrics for each period. |

Enter comma-separated tags or select existing suggestions. The count helps check how many metrics match. Entering a tag does not assign it to any metric; a tag with no matches contributes no data.

Only metrics directly associated with the selected asset are included. Metrics belonging to descendant assets are not included automatically: select those assets too if needed. Individual mode matches any selected tag; grouped mode creates a separate group for each tag. A metric with several tags may appear in several groups.

## 3. Choose dates and calculations

| Setting | How to choose |
| --- | --- |
| Initial period | Today, week, month or year determines the opening dates. Use the calendar to view other dates. |
| Automatic resolution | Adjusts columns to the period: hours for a day, days for a week or month, and months for a year. It also adapts to custom ranges. |
| Fixed resolution | Keeps the chosen interval when dates change: 15 minutes, hour, day, week, month or year. |
| Aggregation | “From each metric” uses its own configuration. Alternatively choose sum, average, minimum or maximum to summarize readings in each column. |
| Totals column | Adds a sum, average, minimum or maximum of the row's column values on the right, or can be hidden. |
| Totals row | Available when aggregation and combination use sum. Summarizes the selection per unit without counting the same metric twice. |
| Units, year and decimals | Adjust presentation. Hiding units does not convert values. Show the year always, hide it or show it automatically across years. |

First, readings from **each metric within each period** are summarized. Next, metrics in each group are combined. Finally, the totals column summarizes that row's cells.

For example, two consumption metrics report 100 and 60 kWh in January, and 120 and 80 kWh in February. With **sum** as the group combination, the row shows 160 and 200 kWh. Its totals column shows 360 for sum or 180 for average. This average uses columns with data; it is not a weighted average of all original readings.

Use sum for interval consumption that can meaningfully be added, not cumulative meter readings. Do not include both a main meter and its submeters when calculating total consumption: the widget recognizes repeated metrics, but cannot infer that different measurements represent the same energy.

## 4. Review and save

In **Review**, check assets, tags, units, dates and totals before saving. If a row is missing, check its tags and that its metrics belong directly to the selected asset.

Collapse assets and scroll while keeping table headings as a reference. Periods without information retain their columns. An empty cell is not zero; future periods show no consumption. An asterisk identifies partial results when some of a group's data is missing.

**CSV** downloads include collapsed and off-screen rows, identify asset and unit and preserve numeric values for spreadsheets. **PNG** downloads capture the widget view.

See also [Widgets](widgets.md) and [Metrics and formulas](../conceptos/metricas.md).
