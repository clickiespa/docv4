---
title: "Widgets"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Widgets

Choose a widget according to the question you want to answer. Add one from your dashboard using **Add widget**.

## What the screen shows

:::screen id="widget-biblioteca" src="../../assets/screenshots/v4.2.3/widget-biblioteca.png" title="Widget library (Spanish interface)" points="13,17;63,24.9;16.1,31.5;45,36.2;18.2,48;79.5,95.3;88.8,95.3;96.9,4.8"
1. **Steps.** Library selects the type; Configure sets its data; Review checks the result.
2. **Search.** Find a visualization by name or purpose.
3. **Categories.** Filter the library by type of information.
4. **Results.** Counts widgets matching the search and filters.
5. **Cards.** Select a visualization; its name and description explain its purpose.
6. **Cancel.** Close the wizard.
7. **Continue.** Configure the selected widget.
8. **Close.** Exit the wizard from the upper corner.
:::

On each card, read the title, period, units and legend. Point at values or chart elements for available details. Some cards have period or refresh controls; others display fixed content.

## Trends and comparison

| Widget | Purpose and example | Setting to check |
| --- | --- | --- |
| **Line Chart** | Follow changes over time. Potencia eléctrica during one day. | Period and resolution; period comparison when enabled. |
| **Bar Chart** | Compare intervals. Consumo de energía for each day of a week. | Grouped or stacked bars. Stack only quantities that can meaningfully be added. |
| **Area Chart** | Follow trends and contributions. If you have sector consumption metrics, inspect their contributions throughout the day. | Stacking and compatible units; do not combine a total with its parts. |
| **Heat Map** | Find hours or days with more activity. Electrical power throughout a week. | Resolution and color scale; inspect a cell's value to interpret it. |
| **Time profile** | Compare one metric's observations by hour, day or month. Check whether water flow tends to rise at the same hour. | Horizontal grouping. Each point retains its date; this is not an X/Y comparison of two metrics. |
| **Bars and Lines** | Observe two behaviors together. Power as bars and temperature as a line. | Separate bar/line selections and each axis' unit. Lines also accept formulas. |
| **Bars with Difference to Line** | Show the distance from a reference. Compare daily consumption with a configured reference. | Fixed or metric reference with a compatible unit. The band represents the difference, not additional consumption. |
| **Bars with Threshold Colors** | Identify values above a reference. Distinguish power intervals above a defined operating threshold. | Color and reference. A value equal to the threshold belongs to the at-or-below group. |

## Distribution

These widgets compare parts of a total. Use compatible, nonoverlapping quantities. When readings are missing, displayed shares may refer only to the available total.

| Widget | Purpose and example | Setting to check |
| --- | --- | --- |
| **Doughnut Chart** | Show each part's contribution. With sector measurements, inspect each sector's share of plant consumption. | Common period, units and aggregation. Read quantities and percentages in the legend. |
| **Pie Chart** | Compare proportions in a circle. Show the same sector breakdown with a few categories. | Common unit; avoid too many small slices. |
| **Comparative Donut Chart** | Compare groups using rings. Contrast two sector groups using their own measurements. | Each ring has its own total; percentages do not necessarily share a denominator. |
| **Pareto Chart** | Rank contributions from largest to smallest. Find sectors concentrating the most consumption. | Ordering and optional cumulative line. Check that the selection represents the intended total. |
| **Waffle Progress Chart** | Show a share or progress using 100 cells. Recorded consumption against a period reference. | Reference total when used. Cells summarize the proportion; the legend preserves precise values. |

## Indicators

| Widget | Purpose and example | Setting to check |
| --- | --- | --- |
| **Gauge** | Place a measurement within a scale. Ambient temperature between configured bounds. | Scale limits. Its percentage indicates position within the range, not goal completion. |
| **Range gauge** | Show a value's interval. Classify temperature using ranges and names defined by your team. | Limits, labels and colors. Read the category text rather than relying only on color. |
| **Solid Gauge** | Compare measurements with a reference using rings. Show sector consumption against a common reference. | All measurements need the same unit. Without a positive reference, the automatic scale is not a goal. |
| **Instant Metrics Snapshot** | Read one to six recent or summarized measurements. Building temperature and water flow. | Latest value or period; grid or table. Check the reading date or summary period. |
| **Moments** | Bring together values for different moments and calculations between them. Today's consumption, yesterday's and a combination of both. | Each moment's period, summary, schedule, offset and formula. |
| **Moments 2** | Display indicators with references and states. Period consumption alongside a reference and the difference. | Each indicator's data; Appearance, Comparison and States are optional. Absolute difference and percentage change mean different things. |
| **Comparison Widget** | Compare a principal metric with other period values. With submeters, show each sector's share of the principal consumption. | Principal, rows, summary and schedule. A percentage does not classify a result as good or bad; a zero reference cannot yield a percentage. |

The dashboard author defines colors, states and references. They are not official limits or automatic recommendations. In Moments 2, check each indicator's dates: indicators can use independent periods.

## Tables and lists

| Widget | Purpose and example | Setting to check |
| --- | --- | --- |
| **Period Comparison Table** | Compare one to seven consecutive intervals with values or state dots. Review recent temperature intervals against configured limits. | Up to six metrics with the same resolution; both lower and upper limits belong to the middle range. The current interval may be incomplete. |
| **Dynamic Comparison Table** | Read metrics by period and change dates. Inspect daily consumption and temperature in one month. | Each column's aggregation and optional summary. The summary is calculated for the whole period; it is not necessarily the sum of displayed rows. |

## Content and maps

| Widget | Purpose and example | Setting to check |
| --- | --- | --- |
| **Location Map** | Locate assets. Show sites whose assets have coordinates. | Included assets; the location selector shows one location or all of them. |
| **Embedded Report** | Read an external report inside the dashboard. Open a report your team already uses. | Report address and external service permissions. Use Open report if it cannot display inside the card. |
| **HTML Content** | Add supporting text or content. Explain the building's operating hours in a short note. | Content and links. Include only information needed to interpret the measurements. |
| **Image** | Display an image, such as a building diagram. | Contain preserves the complete image; cover may crop it; stretch changes its proportions. For data over a plan, use [Digital twins](../modelado/gemelos-digitales.md). |

## Reading settings

The **period** determines which dates are queried. **Resolution and aggregation** determine how data is summarized; see [Metrics and formulas](../conceptos/metricas.md#choosing-period-resolution-and-aggregation).

When available, presentation settings show or hide axes, choose value labels and set decimal precision. They change the visual reading, not the measurement. If a label does not fit, inspect the chart's detail.

**No data in this period** means information is unavailable for that selection. **Incomplete information** keeps available measurements and identifies missing ones. Zero is a valid value.

## Reading examples

Screenshots use fictional data for **Edificio principal** in the Spanish interface. Select a number to read its explanation, or **Enlarge screenshot** to inspect the image.

### Read changes during the day

:::screen id="widget-lineas" src="../../assets/screenshots/v4.2.3/widget-lineas.png" title="Read changes during the day" points="39,6;98,8;4,36;78,42;57,88;65,94"
1. **Title and context.** Identify the measurement and place: consumption in Edificio principal.
2. **Period.** Shows the dates being read. The calendar changes them when enabled.
3. **Scale and unit.** Each point contains energy used over one hour, in kWh.
4. **Series.** Daily increases match operating hours. Point to a value to read its details.
5. **Time.** Places each reading in time. Compare the same hour across days to find schedule changes.
6. **Legend.** Matches each color to a sector. Select a name to hide or show that series.
:::

### Compare complete days

:::screen id="widget-barras" src="../../assets/screenshots/v4.2.3/widget-barras.png" title="Compare complete days" points="39,6;98,8;4,36;70,34;57,88;65,94"
1. **Title.** Makes the daily comparison explicit.
2. **Period.** Covers September 7–13; all are complete days.
3. **Unit.** Heights are in kWh. This example sums hourly consumption.
4. **Bars.** Each group is one day; each color is a sector. Weekend consumption is lower.
5. **Days.** Let you compare equivalent periods. Consider incomplete data before comparing today with a complete day.
6. **Legend.** Identifies the series. Grouped bars compare sectors without adding their heights visually.
:::

### Read contributions to combined consumption

:::screen id="widget-area" src="../../assets/screenshots/v4.2.3/widget-area.png" title="Read contributions to combined consumption" points="39,6;98,8;4,36;77,48;57,88;65,94"
1. **Title.** Describes the consumption shown.
2. **Period.** Is shared by all three series.
3. **Scale.** Shows the stacked areas in kWh per hourly interval.
4. **Stacked areas.** Each band’s thickness represents a sector’s contribution. The top boundary is the sum of all three.
5. **Time.** Helps locate hours with higher combined consumption.
6. **Legend.** Identifies each band. Stack compatible measurements without counting the same consumption twice.
:::

### Understand which sector contributes most

:::screen id="widget-dona" src="../../assets/screenshots/v4.2.3/widget-dona.png" title="Understand which sector contributes most" points="45,6;98,8;25,64;41,45;92,52"
1. **Title.** Defines the breakdown: the building’s electricity consumption.
2. **Period.** All sectors use the same week.
3. **Total.** Sums the three included sectors, in kWh.
4. **Slices.** Percentages compare each sector with that total. Climatización accounts for about 41% in this example.
5. **Legend and values.** Keep each sector’s name and consumption. Use them to compare exact quantities.
:::

### Read an exact summary

:::screen id="widget-instantanea" src="../../assets/screenshots/v4.2.3/widget-instantanea.png" title="Read an exact summary" points="40,6;98,8;15,26;98,31"
1. **Title and subtitle.** Explain the summary and the building.
2. **Period.** This example summarizes one week; these are not latest instantaneous readings.
3. **Name.** Identifies each sector using the same unit.
4. **Value and unit.** Show each sector’s total energy. Check the reading date or summary period before treating a value as current.
:::

### Distinguish values, ranges and incomplete days

:::screen id="widget-periodos" src="../../assets/screenshots/v4.2.3/widget-periodos.png" title="Distinguish values, ranges and incomplete days" points="43,6;55,19;14,26;43,38;86,77"
1. **Title.** Describes the comparison; your team configures the ranges.
2. **Columns.** Identify the metrics. Each row is one daily interval.
3. **Asterisk.** Marks the current period. September 14 contains readings only up to noon.
4. **Value and state.** Each cell shows consumption and its range. Read its details for the meaning of the color.
5. **Legend.** Defines the example ranges: below 70, 70 through 190 inclusive, and above 190 kWh. These are fictional limits; no data is a separate state.
:::
