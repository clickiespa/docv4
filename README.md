# Clickie Docs Platform (docv4)

Repositorio docs-first para Clickie.

## Arquitectura

- **Fuente unica de verdad**: Markdown en `/docs`.
- **Salida documental**: MkDocs compila la documentacion a `/site`.
- **Salida editorial externa**: `scripts/sync_to_gdocs.py` publica el contenido Markdown en Google Docs.
- **Sitio publico**: GitHub Pages despliega la app React/Vite del repositorio.

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
/scripts
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
title: "<Titulo humano>"
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

### 3. Build de validacion

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

### Workflow del sitio publico

Archivo: `.github/workflows/site_deploy.yml`

- Trigger: cambios en `src/**`, `public/**`, `index.html`, `package.json`, `vite.config.js`.
- Pasos:
  1. Build Vite
  2. Deploy a GitHub Pages

## Como agregar nueva documentacion

1. Crear el archivo en la subcarpeta semantica correcta dentro de `/docs`.
2. Agregar frontmatter obligatorio y H1 consistente.
3. Enlazar el documento en `mkdocs.yml` dentro de la seccion correspondiente.
4. Verificar `mkdocs build --strict`.
5. Hacer push a `main`.
