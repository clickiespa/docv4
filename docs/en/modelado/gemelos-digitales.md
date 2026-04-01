---
title: "Digital twins"
version: "v4"
last_updated: "2026-04-01"
owner: "Product"
status: "stable"
---
# Digital twins

**Digital Twins** represent assets in a visual view with real-time data from metrics, formulas, and tags.

:::module-strip
Digital twins combine visual context and operational data to help teams more quickly interpret the status of a facility, equipment or process.
:::

## What is this module for?

Digital twins connect operation and visual communication in the same environment.

Allows:

- show operational status of equipment and facilities,
- give graphic context to the data,
- and create more intuitive query experiences for technical and non-technical users.

## Module management

The main list allows you to review:

- name,
- status (`borrador` or `publicado`),
- creation date,
- actions available.

## Available actions

- **View**: open the operational twin.
- **Design**: edit variables and overlays.
- **Info**: review metadata and identifiers.
- **Settings**: adjust name, description and layout.
- **Archive**: hide without deleting.
- **Publish/Draft**: control the exposure status.

## Layout: recommended flow

:::steps
1. **Configure variables**: In **Design > Variables > + New variable** define name, data source, extraction, numerical format and UOM presentation.
2. **Configure Overlays**: In **Design > Overlays > + New Overlay** define type, visibility and fixed size.
3. **Validate final experience**: Open **View** to review reading, visual hierarchy and overlay action.
:::

Common overlay fields:

- overlay type,
- default visibility,
- fixed size.

Main types:

- Background layer
- Container
- Clickable action
- Rich text
- Pointer
- PLC control

## Specific design guides

- [Dynamic overlay variables](./variables-dinamicas-en-superposiciones.md)

## Recommended quality criteria

- Prioritize readability: fewer elements, better hierarchy.
- Avoid cluttering the view with redundant indicators.
- Maintain naming consistency between metric, variable and label.
- Publish only validated twins with end users.

## References

- [Assets](../organizacion/activos.md)
- [Metrics and formulas](../conceptos/metricas.md)
- [Metric Selector](../conceptos/selector.md)
- [Dynamic overlay variables](./variables-dinamicas-en-superposiciones.md)
