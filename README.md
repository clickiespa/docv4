# Clickie Docs Platform (docv4)

Repositorio docs-first para Clickie.

## Arquitectura

- **Fuente única de verdad**: Markdown en `/docs`.
- **Salida documental**: MkDocs compila la documentación a `/site`.
- **Salida editorial externa**: `scripts/sync_to_gdocs.py` publica el contenido Markdown en Google Docs.
- **Sitio público**: GitHub Pages despliega la app React/Vite del repositorio, con contenido generado desde `/docs` mediante `scripts/generate_web_docs.mjs`.
- **Capa bilingüe web**:
  - `docs/api/**`: fuente original API en inglés (no se modifica).
  - `docs/api-es/**`: traducción al español de API.
  - `docs/en/**`: traducción al inglés de la documentación funcional.

> Google Doc es salida generada: no se edita manualmente como fuente primaria.

## Estructura actual

```text
/docs
  index.md
  changelog.md
  /conceptos
    index.md
    metricas.md
    selector.md
  /analisis
    visor-datos.md
    paneles.md
  /automatizacion
    monitoreos.md
  /modelado
    gemelos-digitales.md
  /organizacion
    activos.md
  /configuracion
    cuenta.md
    datos-y-fuentes.md
  /api
    README.md
    ...
  /api-es
    README.md
    ...
  /en
    index.md
    ...
/scripts
  build_bilingual_docs.py
  generate_web_docs.mjs
  sync_to_gdocs.py
.github/workflows
  docs_pipeline.yml
  site_deploy.yml
mkdocs.yml
requirements.txt
README.md
```

## Frontmatter editorial obligatorio

Cada archivo Markdown debe iniciar con:

```yaml
---
title: "<Título humano>"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---
```

Reglas:

- `title` debe coincidir con el H1.
- `last_updated` en formato `YYYY-MM-DD`.
- `status`: `stable`, `draft` o `deprecated`.

## Bloques visuales para el sitio público

Para enriquecer el diseño web sin perder Markdown como fuente, se pueden usar directivas `:::...` dentro de `/docs`.

Ejemplos:

```md
:::module-strip
Texto introductorio del módulo.
:::

:::steps
1. **Paso 1**: descripción.
2. **Paso 2**: descripción.
:::

:::learning-path title="Camino de aprendizaje recomendado"
1. **Base**: descripción.
2. **Operación**: descripción.
3. **Escalado**: descripción.
:::
```

Directivas soportadas actualmente:

- `module-strip`
- `intro-principle` (opcional `icon="◆"`)
- `access-box`
- `steps`
- `cards` (opcional `cols=3`)
- `learning-path` (opcional `title="..."`)
- `info`
- `info-yellow`

Notas:

- `scripts/generate_web_docs.mjs` interpreta estas directivas para la web React.
- `scripts/sync_to_gdocs.py` elimina automáticamente solo los wrappers `:::` y conserva el contenido para Google Docs.

## Sitio bilingüe (ES/EN)

- El selector de idioma está en la topbar del sitio público.
- Idioma por defecto: **Español**.
- La preferencia se persiste en `localStorage`.
- Para regenerar traducciones:

```bash
python scripts/build_bilingual_docs.py
```

Opciones:

```bash
python scripts/build_bilingual_docs.py --only api-es
python scripts/build_bilingual_docs.py --only en
```

## Desarrollo local

### 1. Instalar dependencias

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Ver sitio MkDocs

```bash
mkdocs serve
```

### 3. Build de validación

```bash
mkdocs build --strict
```

## Sync a Google Docs

Variables soportadas:

- `GOOGLE_DOC_ID`
- `GOOGLE_SERVICE_ACCOUNT_FILE` (ruta a JSON) **o** `GOOGLE_SERVICE_ACCOUNT_JSON` (inline)

Ejemplo local:

```bash
export GOOGLE_DOC_ID="<doc_id>"
export GOOGLE_SERVICE_ACCOUNT_FILE="/ruta/credenciales.json"
python scripts/sync_to_gdocs.py
```

Prueba sin API (parsing + merge + orden):

```bash
python scripts/sync_to_gdocs.py --dry-run
```

## CI/CD

### Workflow de docs

Archivo: `.github/workflows/docs_pipeline.yml`

- Trigger: cambios en `docs/**`, `mkdocs.yml`, `requirements.txt`, `scripts/sync_to_gdocs.py`.
- Pasos:
  1. `mkdocs build --strict`
  2. `sync_to_gdocs.py`

Secrets requeridos:

- `GOOGLE_DOC_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

### Workflow del sitio público

Archivo: `.github/workflows/site_deploy.yml`

- Trigger: cambios en `docs/**`, `src/**`, `public/**`, `scripts/generate_web_docs.mjs`, `mkdocs.yml`, `index.html`, `package.json`, `vite.config.js`.
- Pasos:
  1. Generar `src/manual.generated.html` desde `/docs`
  2. Build Vite
  3. Deploy a GitHub Pages

## Regla de reflejo en sitio público

Los cambios en `/docs` se reflejan en la web pública porque el workflow del sitio ejecuta `scripts/generate_web_docs.mjs` antes del build de React.

## Como agregar nueva documentación

1. Crear el archivo en la subcarpeta semántica correcta dentro de `/docs`.
2. Agregar frontmatter obligatorio y H1 consistente.
3. Enlazar el documento en `mkdocs.yml` dentro de la sección correspondiente.
4. Registrar el cambio en `/docs/changelog.md` con fecha (`YYYY-MM-DD`) y resumen del ajuste.
5. Verificar `mkdocs build --strict`.
6. Hacer push a `main`.
