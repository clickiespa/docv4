---
title: "Data and sources"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Data and sources

This section shows where measurements come from and where devices are installed.

| Section | What it represents | Example |
| --- | --- | --- |
| Integrations | Connections to external data sources. | Measurements received from another system. |
| Installations | The location or function occupied by equipment, linked to an asset. | The electricity meter in **Edificio principal**. |
| Devices | Registered physical equipment. | The device currently installed at that measurement point. |

A metric is a measurement you can view, such as **Potencia eléctrica**. An installation connects that measurement with its equipment and location.

## Integrations

First select an integration type from the catalog. Its list shows the account connections for that type.

1. **Name**: open the integration.
2. **Last synchronization**: see when its most recent synchronization was recorded.
3. **Metrics**: see the number of associated measurements.
4. **Enabled**: see whether the integration is active.
5. **Actions**: open the options available for that connection.

In the details, **Metrics** shows its measurements and **Settings** lets you edit the connection. Fields depend on the integration type. If a measurement stops updating, check its source and last synchronization before reviewing the chart.

## Devices and inventories

Devices are grouped into **Inventories**. Open an inventory to see its equipment; the table shows identifier, model, location, asset and connection status. Use search and filters to find a device.

In a device's details, **History** shows its records and **Aliases** shows its associated alternative identifiers. Editing options depend on your permissions.

## Open an installation

1. Open **Installations** and search for the equipment or asset.
2. Check its type, model, status and installed device.
3. Open **Metrics** to see the registered measurements.
4. Select a metric to view its data.

Filters narrow the list by asset, type, status and model. The main list shows installations without a parent; connected equipment is found inside its installation.

## Register or change equipment

If permitted, **New installation** lets you choose the type and enter its name, model and asset. For equipment that groups other devices, **Extend installation** adds compatible items.

- **Install**: assign a device to the installation point.
- **Uninstall**: remove the association with the current device.
- **Replace**: change the installed device; the screen indicates when the previous device will be removed automatically.
- **Enable metrics**: select measurements available on the model to register them.
- **Move to gateway/node**: change the connection to the chosen parent equipment.

Options depend on the equipment type. A gateway can group nodes, sensors and other devices; open each item to review its metrics and connections.

## Example: find the building's consumption

Open **Edificio principal > Installations**, select its meter and go to **Metrics > Consumo de energía**. This lets you check which device supplies the value used in your dashboard.

See also [Assets](../organizacion/activos.md) and [Metrics](../conceptos/metricas.md).
