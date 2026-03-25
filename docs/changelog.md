---
title: "Changelog"
version: "v4"
last_updated: "2026-03-25"
owner: "Product"
status: "stable"
---

# Changelog

## 2026-03-25

- Se incorporaron capturas reales de la plataforma Clickie en las secciones funcionales del manual (`conceptos`, `analisis`, `automatizacion`, `modelado`, `organizacion`, `configuracion`) y en la sección de acceso de `docs/index.md`.
- Se añadieron assets de screenshots en:
  - `docs/assets/screenshots/clickie-authentication-desktop.png`
  - `docs/assets/screenshots/clickie-authentication-mobile.png`
  - `docs/assets/screenshots/modules/*.png`
- Se copiaron las capturas a `public/assets/screenshots/` para visualización en la salida HTML del manual web React/Vite:
  - `public/assets/screenshots/clickie-authentication-desktop.png`
  - `public/assets/screenshots/clickie-authentication-mobile.png`
  - `public/assets/screenshots/modules/*.png`
- Se mejoró el estilo de imágenes en `src/manual.css` para render responsive dentro de contenidos Markdown.
- Se actualizó `scripts/generate_web_docs.mjs` para reescribir rutas relativas de imágenes y garantizar su visualización correcta en el HTML unificado generado.
- Se retiraron del `index.md` las capturas de login (usuario/password) para evitar desproporción visual en la portada del manual HTML.

## 2026-03-16

- Se incorporó la sección **API v4** en la navegación de `mkdocs.yml`, incluyendo estructura anidada por dominios de endpoint.
- Se habilitó la visibilidad de `docs/api/**` tanto en MkDocs como en la web pública generada por React/Vite.
- Se creó versión bilingüe para la web pública:
  - `docs/api-es/**`: traducción al español de la documentación API sin modificar `docs/api/**` original.
  - `docs/en/**`: traducción al inglés de la documentación funcional.
- Se agregó selector de idioma (ES/EN) en la topbar, con idioma por defecto en español y persistencia de preferencia en navegador.
- Se añadió `scripts/build_bilingual_docs.py` para regenerar automáticamente las carpetas traducidas.

## 2026-02-26

- Revisión ortográfica integral de la documentación en `/docs` (acentuación, tildes diacríticas y consistencia editorial en títulos y contenidos).
- Alineación de textos visibles del sitio web generado (`scripts/generate_web_docs.mjs`) para mantener ortografía consistente con la fuente Markdown.
- Ajustes de ortografía en `README.md` y navegación de `mkdocs.yml` (sin alterar rutas ni nombres de archivo).

## 2026-02-25

- Incorporación de la documentación completa de **Boletines** en `configuracion/`:
  - `boletines.md`
  - `boletines-bloques.md`
  - `boletines-grupos.md`
  - `boletines-plantillas.md`
- Reestructuración de `mkdocs.yml` para anidar Boletines dentro de un único menú de navegación.
- Ajuste de `scripts/generate_web_docs.mjs` para soportar navegación anidada en el sidebar web.
- Actualización de `src/App.jsx` y `src/manual.css` para activar y estilizar enlaces anidados.
- Mejora de usabilidad: submódulos de Boletines colapsados por defecto y toggle de expandir/colapsar al hacer clic en el nombre del grupo.
- Incorporación en `automatizacion/monitoreos.md` de un ejemplo práctico de monitoreo de factor de potencia (`F. de Pot.`) con esquema visual web-only en tres pasos: Monitoreo, Regla y Disparador.
- Regla editorial formalizada: cada cambio en documentación debe registrar su entrada en este changelog con fecha (`YYYY-MM-DD`).

## 2026-02-23

- Reorganización de documentación por dominios (`conceptos`, `analisis`, `automatizacion`, `modelado`, `organizacion`, `configuracion`).
- Incorporación de frontmatter editorial en todos los documentos Markdown.
- Actualización de `mkdocs.yml` para navegación semántica.
- Ajuste de `scripts/sync_to_gdocs.py` para ignorar frontmatter y respetar orden de `nav`.
