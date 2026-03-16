---
title: "Newsletters - Templates"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---
# Newsletters - Templates

Templates define visual structure and base styles for all newsletters.
They control headers, footer and container where dynamic blocks are injected.

:::module-strip
A well-designed template maintains brand identity, respects email policies and allows customizations without breaking the layout.
:::

## Access and listing

- Path: **Settings -> Newsletters -> Templates**.
- Table with name, description, creation date and number of associated newsletters.
- **Create template** requests name and description; the HTML is edited afterwards.
- Global templates appear differentiated from those of the account.

## When to create a new template

- To adapt visual identity (colors, fonts, logo) by brand or account.
- To manage disclaimers or specific legal footing per audience.
- To standardize repetitive components between multiple newsletters.
- To maintain variants (e.g. compact version) without affecting existing shipments.

## Template detail

Includes:

- identifier, author and description,
- counter of newsletters that use it,
- edit/delete actions based on permissions,
- Send test button (may be disabled depending on feature status).

## Preview tab

- Render the template with saved HTML to validate desktop and mobile.
- Helps detect layout breaks before impacting active newsletters.

## HTML Editor Tab

- Code editor for complex structures.
- Account templates: editable mode.
- Global templates: reading mode to avoid accidental changes.
- Recommended to duplicate before major changes.

## Settings tab

- Update name and description.
- Changes impact associated newsletters without reassigning staff.
- Audit log of the last change.

## Essential components of a template

- **Brand bar**: logo and main color.
- **Preheader**: `{{ preheader }}` for visible summary in trays.
- **Block container**: `{{ blocks }}` to inject bulletin content.
- **Footer**: generation date, account and cancellation (`{{ unsubscribe_url }}`).

## Variables and customization

| Marker type | Syntax | When replaced | Examples |
| --- | --- | --- | --- |
| Newsletter context | `{{ variable }}` | Once per shipment | `{{ platform_name }}`, `{{ brand_logo_url }}`, `{{ generated_at }}` |
| Personalization by recipient | `[variable]` | For each recipient | `[first_name]`, `[account_custom_field]`, `[unsubscribe_link]` |

### Frequent variables available

- `{{ brand_primary }}`
- `{{ brand_logo_url }}`
- `{{ brand_logo_width }}`
- `{{ platform_name }}`
- `{{ domain_url }}`
- `{{ account_name }}`
- `{{ generated_at }}`
- `{{ user_language }}`
- `{{ user_timezone }}`
- `{{ subject }}`
- `{{ preheader }}`
- `{{ unsubscribe_url }}`
- `{{ t_unsubscribe }}`
- `{{ blocks }}`

## Baseline template

The platform includes a base template with:

- responsive container,
- brand bar,
- center block for `{{ blocks }}`,
- mandatory footer with account and discharge context.

Recommendation: clone the base to create variants by segment or language, and document the scope of each variant.

## Operational recommendations

- Version relevant changes by duplicating template before editing.
- Document design restrictions in description (width, styles, compatibility).
- Coordinate global template changes with the design/platform team.
- Schedule periodic email compatibility checks.

## References

- [Newsletters](./boletines.md)
- [Newsletters - Content Blocks](./boletines-bloques.md)
- [Newsletters - Recipient Groups](./boletines-grupos.md)