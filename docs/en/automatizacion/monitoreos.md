---
title: "Monitoring"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Monitoring

The **Monitoring** module evaluates conditions on metrics and generates automatic operational states for early detection, monitoring and communication.

:::module-strip
Monitoring turns behavioral data into operational alerts. The objective is to detect deviation, prioritize impact and communicate to the correct team with clear rules.
:::

## What does it contribute to the operation

Monitoring transforms continuous data into actionable signals.

In practice it allows:

- detect deviations in time,
- prioritize events by severity,
- and notify the right team at the right frequency.

## Monitoring list

Each monitoring includes:

- name,
- type,
- severity,
- current status,
- creation/update date,
- actions available.

Common monitor types:

- Notice
- Information
- Warning
- Bug
- Critical
- Alert
- Emergency
- Debugging

Operating states:

- OK
- Warning
- Alarm
- No data

## Recommended configuration flow

:::steps
1. **Create base monitoring**: From **Monitoring** choose **+ New monitoring** and define name, type, window and evaluation frequency.
2. **Define rules**: Enter monitoring, open **Rules** and assign metric, method (`Mayor que`, `Menor que`, `Dentro de rango`, `Fuera de rango`) and threshold.
3. **Configure Triggers**: In **Triggers** create event notification or forwarding and complete status, time pattern and recipients.
:::

## Practical example: power factor monitoring

Reference case for training:

- **Metric**: `F. de Pot.`
- **Rule**: go into alarm when in a 10-minute window at least 10% of the points are below 0.93.
- **Evaluation frequency**: every 5 min.

Clickie configuration in three logical steps:

:::steps
1. **Monitoring**: Name `Control de Factor de Potencia`, type `Alerta`, sampling window `10 min`, frequency `5 min`.
2. **Rule**: Name `F. de Pot.`, method `Menor que`, limit `0.93`, threshold `10%`.
3. **Trigger**: Type `Comunicacion`, trigger in state `ALARMA`, time pattern according to operation, notify responsible collaborators.
:::

:::monitoring-example-fpot
:::

Trigger types:

- Communication (notifications)
- Event forwarding (custom endpoint)

Common fields:

- trigger status,
- observations,
- time pattern,
- collaborator or recipient,
- title/summary/content of the communication.

## Design useful alerts

To avoid noise and alert fatigue:

- use severities consistent with the real impact,
- separate warning and criticism rules,
- define time windows according to the process,
- periodically review rules that do not add value.

## References

- [Metrics and formulas](../conceptos/metricas.md)
- [Metric Selector](../conceptos/selector.md)
- [Data viewer](../analisis/visor-datos.md)