---
title: "Newsletters: templates"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Newsletters: templates

A template defines the visual structure shared by one or more newsletters: header, space for blocks and footer. To change which data is sent, edit the newsletter's blocks.

Open **Configuration > Newsletters > Templates** and select a template.

## Template controls

1. **Name, creator and identifier**: identify the template.
2. **Associated newsletters**: see how many newsletters use it.
3. **Preview**: see the template's saved HTML.
4. **HTML editor**: edit its structure and styles when permitted.
5. **Settings**: change its name and description.
6. **Actions**: open the allowed template options.
7. **Send test email**: is disabled in v4.2.3 and cannot send an email.

Global Clickie templates are read-only for users without global administration permission.

## Use a template

1. Open **Resumen semanal > Settings**.
2. Select a template and save.
3. In **Design**, refresh the preview to review the template with the newsletter's blocks and data.

## Create your own template

1. Create the template with a name and description.
2. Open **HTML editor** and add its content.
3. Save and check **Preview**.
4. Assign it to a newsletter and also review its **Design** preview.

The editor requires knowledge of email HTML. The template preview shows its structure; the newsletter preview shows the result with its content.

## Elements to keep when editing HTML

| Placeholder | Content |
| --- | --- |
| `{{ blocks }}` | Newsletter blocks, in the order defined in Design. |
| `{{ account_name }}` | Account name. |
| `{{ generated_at }}` | Generation date. |
| `{{ brand_logo_url }}` | Configured logo URL. |
| `{{ unsubscribe_url }}` | Unsubscribe link. |

Keep the block space and unsubscribe link. Changes to a shared template apply to future sends from all newsletters that use it.

See also [Newsletters](./boletines.md) and [Content blocks](./boletines-bloques.md).
