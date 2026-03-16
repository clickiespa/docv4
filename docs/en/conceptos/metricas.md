---
title: "Metrics and formulas"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Metrics and formulas

## What is a metric

A metric in Clickie is a time series of values associated with a real-world variable.

Common examples:

- Power consumption
- Temperature
- Water flow
- Flow of people
- Equipment status

## "My metrics" module

### All metrics

The main listing shows:

- Name
- Unit of measure (UOM)
- Source
- Creation date
- Actions available

### Metric Detail

From the detail they are managed:

- Identification and description
- Data source configuration
- Resolution and aggregation
- Tags and relationships with assets

## Metric selector

The selector is transversal and allows a metric to be reused without altering its original data.

### Capabilities

- Visually customize a metric by context
- Create virtual metrics per tag
- Build calculated metrics with formulas

## Calculation formulas

Metric IDs in `@número` format are used.

### Examples

| Formula | Description |
| --- | --- |
| `@111-@111[-1]` | Difference versus previous reading |
| `(@222+@333)/2` | Average of two metrics |
| `@444/1000` | Unit Conversion |
| `pow(@555,2)/@666` | Composite mathematical operation |
| `(@777>5000)?5000:@777` | Threshold limiter |

### Common functions

- `abs(x)`
- `pow(x,y)`
- `sqrt(x)`
- `log(x)`
- `exp(x)`

### Frequent operators

- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Logical: `&&`, `||`
- Conditional: `cond?A:B`