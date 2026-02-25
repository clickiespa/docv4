---
title: "Changelog"
version: "v4"
last_updated: "2026-02-25"
owner: "Product"
status: "stable"
---

# Changelog

## 2026-02-25

- Incorporacion de la documentacion completa de **Boletines** en `configuracion/`:
  - `boletines.md`
  - `boletines-bloques.md`
  - `boletines-grupos.md`
  - `boletines-plantillas.md`
- Reestructuracion de `mkdocs.yml` para anidar Boletines dentro de un unico menu de navegacion.
- Ajuste de `scripts/generate_web_docs.mjs` para soportar navegacion anidada en el sidebar web.
- Actualizacion de `src/App.jsx` y `src/manual.css` para activar y estilizar enlaces anidados.
- Mejora de usabilidad: submodulos de Boletines colapsados por defecto y toggle de expandir/colapsar al hacer clic en el nombre del grupo.
- Incorporacion en `automatizacion/monitoreos.md` de un ejemplo practico de monitoreo de factor de potencia (`F. de Pot.`) con esquema visual web-only en tres pasos: Monitoreo, Regla y Disparador.
- Regla editorial formalizada: cada cambio en documentacion debe registrar su entrada en este changelog con fecha (`YYYY-MM-DD`).

## 2026-02-23

- Reorganizacion de documentacion por dominios (`conceptos`, `analisis`, `automatizacion`, `modelado`, `organizacion`, `configuracion`).
- Incorporacion de frontmatter editorial en todos los documentos Markdown.
- Actualizacion de `mkdocs.yml` para navegacion semantica.
- Ajuste de `scripts/sync_to_gdocs.py` para ignorar frontmatter y respetar orden de `nav`.
