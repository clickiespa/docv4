---
title: "Newsletters"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Newsletters

A newsletter emails a data summary to selected collaborators on a defined schedule.

Open **Configuration > Newsletters**. The list shows the name, whether it is enabled and its creation date. You can search, filter by template and open its actions.

## What you will find inside

| Section or control | Purpose |
| --- | --- |
| Header | View the newsletter's status, template, schedule and totals. |
| Overview | Review upcoming sends, recent sends and recipients. |
| Design | Add and reorder blocks and generate a preview. |
| Recipients | Add collaborators or lists and enable or disable each destination. |
| Send history | Review this newsletter's sends, results and errors. |
| Settings | Change name, description, template, schedule and time zone. |
| Enable / Disable | Allow or stop upcoming scheduled sends. |

## Example: Resumen semanal

1. Create **Resumen semanal**. The newsletter starts disabled.
2. In **Settings**, choose the template, weekly schedule and its time zone.
3. In **Design**, add a header, weekly consumption and the history of **Temperatura fuera de rango**.
4. In **Recipients**, select the destination type and add collaborators or an account list.
5. Generate a preview and check values, units and period.
6. Enable the newsletter when you want scheduled sends to start.

## Review without sending

In **Design**, the left column contains blocks and the right column contains the preview.

1. **Add block**: add content.
2. **Drag handle**: drag to change the order.
3. **Block actions**: edit its options or delete it.
4. **Date**: select a reference date calculated from the schedule.
5. **Refresh**: generate the preview for that date.

**Previewing does not send emails.** There is no **Send now** button on this screen in v4.2.3. If dates are unavailable, configure the schedule first. Some administrators also see **Debug mode**, which adds diagnostic details to the preview.

## Review a send

In **Send history**, open a send and select a recipient to view its saved content, when available. History only shows sends for the newsletter you opened.

The schedule uses the newsletter's time zone; displayed dates use your time zone. Some figures appear as unavailable until the first send.

See [Content blocks](./boletines-bloques.md), [Recipient groups](./boletines-grupos.md) and [Templates](./boletines-plantillas.md).
