---
title: "Dynamic variables in overlays"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Dynamic variables in overlays

A variable inserts a metric's value into the text of a [digital twin](./gemelos-digitales.md). Add a condition to change its color when the value falls outside the expected range.

## Display a reading

1. In **Design > Variables**, create `temperatura_ambiente` and assign **Temperatura ambiente**.
2. Copy the variable reference.
3. Open a text overlay and insert it where the reading should appear.

```text
Room temperature: {{temperatura_ambiente}}
```

Configure the unit in the variable. If °C is already shown, do not add it again in the text.

## Example: highlight a high temperature

```text
Room temperature: {{temperatura_ambiente}}[color=(>28:#dc2626),(*:#1f2937)]
```

- `{{temperatura_ambiente}}` displays the variable's value.
- `>28` applies the rule when the value is above 28.
- `#dc2626` is the red color.
- `*` applies gray in all other cases.

The limit is illustrative. Changing the text color does not create a [monitor](../automatizacion/monitoreos.md) or send notifications.

## Available conditions

| Enter | To check |
| --- | --- |
| `>28`, `>=28`, `<18`, `<=18` | Greater, greater or equal, less, or less or equal to a value. |
| `=20`, `!=20` | Equal or different from a value. |
| `18..28` | Within a range including both limits. |
| `>18 & <28` | Within a range excluding its limits. |
| `>@limite_temperatura` | Greater than another variable. |
| `>@temperatura_objetivo+5` | Greater than another variable plus a margin. |
| `*` | Any case not matched earlier. |

Rules are read from left to right: the first match wins. Put `*` last and use a dot for decimals, such as `28.5`.

## Change more than one style

Separate properties with a semicolon:

```text
{{temperatura_ambiente}}[color=(>28:#dc2626),(*:#1f2937);font-weight=(>28:700),(*:400)]
```

This example displays a high value in red and bold. Properties such as `background-color`, `font-size` and `opacity` are also supported.

In the editing view, the variable appears as a badge; the saved content keeps its condition. Check the result with **View**. A reference to another variable needs an available value before it can be compared.
