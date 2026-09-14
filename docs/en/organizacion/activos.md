---
title: "Assets"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Assets

An asset brings together information about a place, piece of equipment or system. In **Assets**, you can open its metrics, installations, digital twins and documents.

## Browse assets

:::screen id="activos-lista" src="../../assets/screenshots/v4.2.3/activos-jerarquia.png" title="Asset hierarchy (Spanish interface)" points="22,10;53,11;72,11;85,11;3,26;8,40;29,40;53,40;71,40;89,32;99,41;10,91;88,91"
1. **Account and section.** Confirm which account you are browsing.
2. **Search.** Find an asset by name, description or identifier.
3. **Filter.** Limit the items shown.
4. **New asset.** Create a building, room or system.
5. **Selection.** Select assets to work with.
6. **Expand or collapse.** Show or hide sub-assets in the list.
7. **Name and description.** Open the asset. Indented rows belong to Edificio principal.
8. **Sub-assets.** Counts direct children.
9. **Category.** Classifies the asset using the available catalog.
10. **Created.** Shows creation time; use the heading to sort.
11. **Actions.** Opens the operations available for that asset.
12. **Page size.** Choose how many root assets appear.
13. **Pagination.** Browse pages of the list.
:::


The main list shows top-level assets. Sub-assets appear when you expand their parent or open its details.

## Open an asset

:::screen id="activo-secciones" src="../../assets/screenshots/v4.2.3/activo-secciones.png" title="Asset sections (Spanish interface)" points="8.8,13;17,13;25.1,13;36.5,13;48.2,13;58.3,13;69.5,13;79.7,13;88.8,13;1,26;59.2,40.4;77.7,40.4;85.7,40.4;7.2,71.4;13.7,69.1;67.2,54.5;82,60;95.8,71.4;9.2,93.5;85,93.5"
1. **Overview.** Read general details and linked dashboards.
2. **Assets.** Open or link sub-assets.
3. **Metrics.** Read or link measurements.
4. **Digital twins.** Open visual representations.
5. **Newsletters.** Read or link newsletters.
6. **Installations.** See equipment and connections.
7. **Documents.** Browse files.
8. **Activity.** Review events.
9. **Contacts.** Read account and asset contacts.
10. **Settings.** Edit details and optional fields.
11. **Search.** Find a linked dashboard.
12. **Filter.** Limit dashboard results.
13. **New dashboard.** Create a dashboard for this asset.
14. **Selection.** Select dashboards to work with.
15. **Name.** Open Resumen operativo.
16. **Type.** Identify the dashboard type.
17. **Created.** Read or sort by creation date.
18. **Actions.** Open permitted operations.
19. **Page size.** Choose how many dashboards appear.
20. **Pagination.** Browse results.
:::


Visible tabs and actions depend on your permissions. **Unlink** removes an association; it does not delete the linked resource.

## Example: find a room's temperature

1. Expand **Edificio principal** in **Planta de demostración**.
2. Open **Sala de equipos**.
3. Go to **Metrics** and select **Temperatura ambiente**.

Use the same structure to group plants, buildings, areas or equipment. Names should describe what people will find when they open each asset.

## Change a value used by indicators

In **Settings**, expand **Optional asset fields** when you need to fill in an attribute. When changing an existing value, choose how to save it:

- **Record change and keep history**: use this for a real change, such as an increase in floor area. Earlier periods keep the previous value.
- **Correct and replace current value**: use this to correct a value entered by mistake. It can change historical indicators that use that value.

See also [Metrics](../conceptos/metricas.md) and [Digital twins](../modelado/gemelos-digitales.md).
