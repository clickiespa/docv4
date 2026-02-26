---
title: "Boletines - Plantillas"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---

# Boletines - Plantillas

Las plantillas definen estructura visual y estilos base para todos los boletines.
Controlan cabeceras, pie de página y contenedor donde se inyectan bloques dinámicos.

:::module-strip
Una plantilla bien diseñada mantiene identidad de marca, respeta políticas de correo y permite personalizaciones sin romper layout.
:::

## Acceso y listado

- Ruta: **Configuración -> Boletines -> Plantillas**.
- Tabla con nombre, descripción, fecha de creación y cantidad de boletines asociados.
- **Crear plantilla** solicita nombre y descripción; el HTML se edita después.
- Plantillas globales aparecen diferenciadas de las de la cuenta.

## Cuando crear una plantilla nueva

- Para adaptar identidad visual (colores, tipografías, logotipo) por marca o cuenta.
- Para manejar disclaimers o pie legal específico por audiencia.
- Para estandarizar componentes repetitivos entre múltiples boletines.
- Para mantener variantes (por ejemplo, versión compacta) sin afectar envíos existentes.

## Detalle de plantilla

Incluye:

- identificador, autor y descripción,
- contador de boletines que la usan,
- acciones de editar/eliminar según permisos,
- botón de enviar prueba (puede estar deshabilitado según estado de feature).

## Pestaña Vista previa

- Renderiza la plantilla con HTML guardado para validar escritorio y móvil.
- Ayuda a detectar quiebres de layout antes de impactar boletines activos.

## Pestaña Editor HTML

- Editor de código para estructuras complejas.
- Plantillas de cuenta: modo editable.
- Plantillas globales: modo lectura para evitar cambios accidentales.
- Recomendado duplicar antes de cambios mayores.

## Pestaña Configuración

- Actualiza nombre y descripción.
- Cambios impactan boletines asociados sin reasignar plantilla.
- Registro de auditoría del último cambio.

## Componentes esenciales de una plantilla

- **Barra de marca**: logotipo y color principal.
- **Preheader**: `{{ preheader }}` para resumen visible en bandejas.
- **Contenedor de bloques**: `{{ blocks }}` para inyectar contenido del boletín.
- **Pie de página**: fecha de generación, cuenta y baja (`{{ unsubscribe_url }}`).

## Variables y personalizacion

| Tipo de marcador | Sintaxis | Cuando se reemplaza | Ejemplos |
| --- | --- | --- | --- |
| Contexto del boletín | `{{ variable }}` | Una vez por envío | `{{ platform_name }}`, `{{ brand_logo_url }}`, `{{ generated_at }}` |
| Personalizacion por destinatario | `[variable]` | Por cada destinatario | `[first_name]`, `[account_custom_field]`, `[unsubscribe_link]` |

### Variables frecuentes disponibles

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

## Plantilla base de referencia

La plataforma incluye una plantilla base con:

- contenedor responsive,
- barra de marca,
- bloque central para `{{ blocks }}`,
- pie obligatorio con contexto de cuenta y baja.

Recomendación: clonar la base para crear variantes por segmento o idioma, y documentar alcance de cada variante.

## Recomendaciones operativas

- Versionar cambios relevantes duplicando plantilla antes de editar.
- Documentar restricciones de diseño en descripción (ancho, estilos, compatibilidad).
- Coordinar cambios de plantillas globales con el equipo de diseño/plataforma.
- Programar revisiones periódicas de compatibilidad de correo.

## Referencias

- [Boletines](./boletines.md)
- [Boletines - Bloques de contenido](./boletines-bloques.md)
- [Boletines - Grupos de destinatarios](./boletines-grupos.md)
