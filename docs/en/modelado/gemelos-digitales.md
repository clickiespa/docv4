---
title: "Digital twins"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Digital twins

A digital twin displays measurements on an image, plan or diagram. It helps locate a value on the place or equipment it belongs to.

Open **Digital Twins** and select one to view it. The list shows its name, draft status and creation date.

## Editor controls

1. **Reload**: reload the editor view.
2. **Settings**: change the name, description, image, dimensions and fit-to-screen setting.
3. **New overlay**: add an element over the plan or image.
4. **Variables**: define the data displayed by overlays and copy a variable reference.
5. **Overlays**: open the list of elements to edit them.
6. **View**: open the viewing result in another tab.
7. **Publish**: make a draft twin available according to its assigned access.

Drafts stay outside general access until published. Design, edit and archive options depend on your permissions.

## Example: temperature on a room plan

1. Create **Sala de equipos** and use a simple plan as its image.
2. In **Design > Variables**, add `temperatura_ambiente` and select **Temperatura ambiente** as the source.
3. Set the value you want to read and its numeric format and unit.
4. Add a text overlay beside the measurement point and insert the variable.
5. Open **View** and check that the value is clear in its location.
6. Publish the twin when it is ready to share.

## Choose an overlay

| Element | Typical use |
| --- | --- |
| Background | Show the reference plan or diagram. |
| Container | Group related elements. |
| Rich text | Display names, values and short explanations. |
| Pointer | Mark equipment or a measurement point. |
| Clickable action | Open the configured action or destination when clicked. |
| Equipment control | Operate compatible equipment when the account has the required integration and permissions. |

**Visibility** defines whether the element appears initially. A **parent container** places the overlay inside another element.

For compatible thermostats, controls can show current temperature and humidity, change settings and lock the keypad. In compatible groups, **ClickieSmart** controls automatic climate management across the group's equipment. Use these controls only for equipment assigned to you.

To change a reading's color based on its value, see [Dynamic variables](./variables-dinamicas-en-superposiciones.md).
