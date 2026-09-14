---
title: "Monitoring"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Monitoring

A monitor checks a metric at regular intervals and changes state when its rules are met. Triggers define when to notify people and who receives the notification.

## Read the list

1. **Name**: open the monitor and its settings.
2. **Status**: shows **OK**, **WARNING**, **ALARM** or **NO DATA**. No data does not mean the condition is normal.
3. **Frequency**: combines the sampling window and how often it is evaluated. “10 mins c/5 mins” checks the last ten minutes every five minutes.
4. **Type**: classifies the monitor's importance, such as notice, warning or critical. It is separate from its current status.
5. **New monitor and actions**: create or modify monitors according to your permissions.

Inside the monitor, **Overview** shows its details; **Rules**, its conditions; **Triggers**, its notifications; **History**, its status changes; and **Activity**, its recorded events.

## Example: Temperatura fuera de rango

The **Sala de equipos** should stay between 18 and 28 °C. These values illustrate the settings; use the limits for your installation.

1. Create **Temperatura fuera de rango**, with a **10-minute** window and **5-minute** frequency.
2. In **Rules**, add a rule for **Temperatura ambiente**.
3. Choose **Out of range**, a lower limit of **18**, upper limit of **28** and threshold of **90%**.
4. Save the enabled rule. It activates when the configured proportion of the window falls outside the band.
5. In **Triggers**, add a communication, select **ALARM** and choose the responsible recipients.
6. Check **History** to see when its status changed.

## Prepare a limit rule

:::screen id="monitoreo-regla" src="../../assets/screenshots/v4.2.3/monitoreo-regla.png" title="Temperature rule (Spanish interface)" points="32,13;32,28;85,36;93,47;33,54;64,64;85,79;38,80;83,93;94,93;97,7"
1. **Name.** Describe the condition so it is recognizable in the list.
2. **Description.** Add context needed to interpret it.
3. **Metric.** Select the measurement to evaluate.
4. **Method.** Choose the condition. The following fields depend on it.
5. **Upper limit.** For Greater than, set the value to exceed in the metric’s unit.
6. **Threshold.** Sets the proportion of the window that must meet the condition; it is not the temperature limit.
7. **Method help.** Explains its behavior and provides an example.
8. **Enabled.** Allows evaluation. It is off in this preparation example.
9. **Cancel.** Discard the draft.
10. **Save.** Save the rule configuration.
11. **Close.** Exit the form.
:::

## Choose a condition

| Method | What it checks | Typical use |
| --- | --- | --- |
| Greater than / Less than | Whether the value is above or below a limit for the specified proportion of the window. | Excessive power or low flow. |
| Within range / Out of range | Whether values are inside or outside two limits. | Temperature outside its operating band. |
| Increased / Decreased / Changed by at least a percentage | The change between the first and last value in the window. | A rapid increase in power. |
| Increased / Decreased / Changed by at least a value | The difference between the first and last value, in the metric's unit. | Temperature rising by several degrees. |
| Data volume decreased / increased | The number of points compared with the previous window of the same size. | Detecting a drop in measurement reception. |

Form fields change with the method. Read the explanation and example shown when you select it.

## Configure notifications

| Trigger control | Purpose |
| --- | --- |
| Type | Choose a communication or event forwarding, from the available options. |
| States | Choose which states activate the notification. |
| Time pattern | Limit notifications to specific days and times. |
| Time zone | Interpret that schedule in the account's time zone or in UTC. |
| Notify when the active window starts | Notify at the start of the schedule if the monitor is still in a selected state from an earlier change. |
| Repeat | Set the minimum interval between reminders while the state continues. |
| Enabled | Enable or disable this trigger. |

Without the start-of-window notification, a change outside the schedule is not sent later for that reason. Configure reminders only when the recipient needs follow-up.

See also [Metrics](../conceptos/metricas.md) and [Data viewer](../analisis/visor-datos.md).
