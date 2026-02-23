# Clickie Docs Platform

Repositorio de documentacion **docs-first** para Clickie.

## Arquitectura

- **Fuente unica de verdad**: Markdown en `/docs`
- **Presentacion web**: MkDocs genera sitio estatico en `/site`
- **Publicacion automatica**: GitHub Actions despliega a GitHub Pages
- **Sincronizacion documental**: `scripts/sync_to_gdocs.py` actualiza un Google Doc con el contenido de `/docs`

## Estructura

```text
/docs
  index.md
  metricas.md
  visor-datos.md
  monitoreos.md
  gemelos-digitales.md
/site
  .gitkeep
/scripts
  sync_to_gdocs.py
.github/workflows
  docs_pipeline.yml
mkdocs.yml
requirements.txt
README.md
```

## Desarrollo local

### 1. Instalar dependencias

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Levantar sitio de documentacion

```bash
mkdocs serve
```

Sitio local: `http://127.0.0.1:8000`

### 3. Build de produccion

```bash
mkdocs build --strict
```

Salida generada en `/site`.

## Sincronizacion a Google Docs

El script `scripts/sync_to_gdocs.py` reemplaza el contenido del documento destino de forma idempotente:

- Borra el contenido actual (excepto el nodo raiz del documento)
- Inserta nuevamente el contenido mergeado desde Markdown
- Aplica estilos de encabezado H1/H2/H3
- Aplica listas numeradas y con bullets
- Mantiene enlaces

### Variables de entorno

Opcion A (recomendada en CI):

- `GOOGLE_DOC_ID`: ID del documento destino
- `GOOGLE_SERVICE_ACCOUNT_FILE`: ruta a JSON de service account

Opcion B:

- `GOOGLE_DOC_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`: contenido JSON inline

### Ejecucion local

```bash
export GOOGLE_DOC_ID="<doc_id>"
export GOOGLE_SERVICE_ACCOUNT_FILE="/ruta/credenciales.json"
python scripts/sync_to_gdocs.py
```

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/docs_pipeline.yml`

Trigger:

- `push` a `main` **solo cuando cambia `/docs/**`**
- `workflow_dispatch` manual

Pipeline:

1. Instala dependencias Python
2. Build del sitio (`mkdocs build --strict`)
3. Ejecuta sincronizacion a Google Docs
4. Publica `site/` en GitHub Pages

## Secrets requeridos en GitHub

Configurar en `Settings > Secrets and variables > Actions`:

- `GOOGLE_DOC_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

> El service account debe tener permisos de edicion sobre el Google Doc destino.

## Como agregar nueva documentacion

1. Crear nuevo archivo Markdown en `/docs`.
2. Agregarlo al `nav` en `mkdocs.yml`.
3. Hacer commit/push a `main`.
4. El pipeline regenerara sitio + Google Doc automaticamente.
