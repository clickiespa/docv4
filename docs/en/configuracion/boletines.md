---
title: "Newsletters"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Newsletters

Newsletters allow you to share periodic information with defined audiences within the platform.
Each delivery combines dynamic, metrics-based content with editorial blocks and is automatically distributed according to your indicated schedule.

:::module-strip
Newsletters are designed to automate recurring reports, reduce manual tasks and keep teams and stakeholders aligned with the evolution of data.
:::

Each newsletter coordinates three components:

- **Recipients**: individual users or reusable groups of the platform.
- **Template**: visual structure and common styles for all shipments.
- **Content blocks**: sortable components for text, KPIs and graphics.

## When to create a newsletter

- When you need to communicate periodic results (daily, weekly or monthly) without manual exports.
- When you want to distribute dashboards or key metrics to a limited audience and maintain delivery history.

## Access and overview

- Path: **Settings -> Newsletters -> Newsletters**.
- The main table includes global search, filters by template and bulk actions.
- The **Create newsletter** button opens an initial form with a name and description.
- The list shows status (Active/Paused), template and health signals to detect stopped newsletters.

## Structure of the newsletter sheet

The detail header shows:

- status and quick action to activate or pause,
- internal identifier, template, time pattern and time zone,
- shipment summary (last/next shot and number of recipients),
- Contextual actions based on permissions (edit, duplicate, delete, send manually).

## Summary Tab

- Shipping history with totals sent/failed and delivery rate.
- Suppressed addresses to identify bounces or unsubscribes.
- Chronology of executions with upcoming shots and completed events.

## Design Tab

- Column of **content blocks** with order, editing and deletion.
- Interactive **Preview** with reference date to validate relative variables.
- For administrative profiles: debug mode and **Send now** action.

## Recipients Tab

- Audience table by type (user or group).
- Registration form with selector by recipient type.
- Support filters by account/language to reuse groups.
- Only active members of the platform are allowed.

## History Tab

- List of executed dispatches with status and time stamp.
- Detail view by dispatch to review recipients and diagnose errors.

## Settings tab

- Complete form: name, description, template, time pattern and time zone.
- Pattern/schedule changes recalculate upcoming shots.
- If the bulletin is paused, no programming is executed.

## Recommended content organization

:::steps
1. **Open context**: Start with a narrative block (Free Text) that explains objective and scope.
2. **Prioritize data**: Locate KPIs and trends by business importance.
3. **Close with action**: Add operational reminders or next steps.
4. **Validate before submit**: Use preview and debug mode to check calculations and visual consistency.
:::

## Available blocks

Current catalog:

- **Free Text**
- **KPI Snapshot**
- **Line Chart**
- **Bar Chart**

For details of parameters and use cases, review [Newsletters - Content Blocks](./boletines-bloques.md).

## Good operational practices- Keep only necessary blocks for easy reading.
- Coordinate template changes with style administrators.
- Review bounces periodically to clean up inactive audiences.
- Document the objective of the newsletter in description to facilitate reuse.

## Supplementary resources

- [Newsletters - Recipient Groups](./boletines-grupos.md)
- [Newsletters - Templates](./boletines-plantillas.md)
- [Newsletters - Content Blocks](./boletines-bloques.md)