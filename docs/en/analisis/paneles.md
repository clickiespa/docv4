---
title: "Dashboards and reports"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Dashboards and reports

A dashboard brings together charts, indicators, tables and content for repeated use. Open the dashboards section and select a dashboard name.

## A newly created dashboard

:::screen id="panel-vacio" src="../../assets/screenshots/v4.2.3/panel-vacio.png" title="A newly created dashboard (Spanish interface)" points="2,10;72,18;79.8,11;95.1,11;50,55"
1. **Name and account.** Confirm which dashboard you are editing.
2. **Edit mode.** Reorder and resize cards once they exist.
3. **Add widget.** Open the visualization library.
4. **Dashboard menu.** Open Information, Subdashboards, Edit and Delete according to permissions.
5. **Empty dashboard.** No widgets have been added yet. Add the first one to begin.
:::

## What the screen shows: list

1. **Search:** find a dashboard by name or description.
2. **Filters:** narrow the list using available options, such as type or archived status.
3. **Name:** open the dashboard. Its counter indicates child dashboards.
4. **Type and creation date:** identify the view type and when it was created.
5. **Checkboxes and actions:** access permitted operations for selected dashboards.

## What the screen shows: open dashboard

1. **Subdashboard tabs:** switch between views inside the dashboard. **More** contains additional tabs.
2. **Widgets:** display measurements or content. Titles and subtitles explain what each card represents.
3. **Widget period:** change that card's dates when enabled. Check periods before comparing cards.
4. **Edit mode:** rearrange and resize widgets when you have permission.
5. **Add widget:** open the library and guided configuration.
6. **Dashboard three-dot menu:** access information, subdashboards, modification and deletion according to your permissions.

Editing controls appear only when you can modify the dashboard. An external report may open another service's content and also requires access to that service.

## Adding a widget

1. In **Resumen operativo**, select **Add widget**.
2. In **Library**, search for a type or filter by Trends and comparison, Distribution, Indicators, Tables and lists, or Content and maps.
3. Choose a widget and select **Continue**.
4. In **Configure**, select metrics, period and settings. Inspect the preview.
5. In **Review**, try Compact, Medium or Wide and select **Add to dashboard**.

Use **Back** to revise the settings. Complete any marked required fields before continuing.

## Configure the chart

:::screen id="widget-configuracion" src="../../assets/screenshots/v4.2.3/widget-configuracion.png" title="Chart configuration (Spanish interface)" points="12,13;16,27;47,35;36,45;46,55;19,63;46,69;74,27;94,38;76,97;84,97;95,97;97,7"
1. **Steps.** Return to Library or move to Review.
2. **Title.** Explain what the card shows.
3. **Subtitle.** Add the place or another short context.
4. **Metrics.** Open the selector; the count shows how many are selected.
5. **Initial period.** Sets the dates queried when opening the dashboard.
6. **Compare with another period.** Enables period comparison.
7. **Presentation style.** Contains fill, smoothing, labels, decimals, axes and period visibility for this chart.
8. **Preview.** Inspect the result; no metrics have been selected yet.
9. **Preview period.** Try other dates for this visualization.
10. **Cancel.** Exit without adding the card.
11. **Back.** Return to the previous step.
12. **Continue.** Open review when the configuration is complete.
13. **Close.** Exit the wizard.
:::

## Example: Resumen operativo

| Card | Data | When to use it |
| --- | --- | --- |
| Power during the day | Line Chart with Potencia eléctrica | Find changes in operating hours and peaks. |
| Daily consumption | Bar Chart with Consumo de energía, grouped by day | Compare complete days. Use sum only for interval consumption data. |
| Building conditions | Instant Metrics Snapshot with Temperatura ambiente and Caudal de agua | Read recent values alongside each reading's date. |
| Reading note | HTML Content with a short explanation | Clarify operating hours or the dashboard's scope. |

Place the most frequently used cards first. Use subdashboards for separate topics, such as energy and building conditions.

## Reading the cards

Check **unit, period and aggregation** before comparing values. Cards identify incomplete information; **no data** is different from zero. Refresh requests information again but does not create missing measurements.

The dashboard address preserves the open subdashboard. Sharing it does not change the recipient's permissions.

See [Widgets](widgets.md) for the purpose and settings of each type.
