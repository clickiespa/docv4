---
title: "Boletines - Plantillas"
version: "v4"
last_updated: "2026-02-25"
owner: "Product"
status: "stable"
---

# Boletines - Plantillas

Las plantillas definen estructura visual y estilos base para todos los boletines.
Controlan cabeceras, pie de pagina y contenedor donde se inyectan bloques dinamicos.

:::module-strip
Una plantilla bien disenada mantiene identidad de marca, respeta politicas de correo y permite personalizaciones sin romper layout.
:::

## Acceso y listado

- Ruta: **Configuracion -> Boletines -> Plantillas**.
- Tabla con nombre, descripcion, fecha de creacion y cantidad de boletines asociados.
- **Crear plantilla** solicita nombre y descripcion; el HTML se edita despues.
- Plantillas globales aparecen diferenciadas de las de la cuenta.

## Cuando crear una plantilla nueva

- Para adaptar identidad visual (colores, tipografias, logotipo) por marca o cuenta.
- Para manejar disclaimers o pie legal especifico por audiencia.
- Para estandarizar componentes repetitivos entre multiples boletines.
- Para mantener variantes (por ejemplo, version compacta) sin afectar envios existentes.

## Detalle de plantilla

Incluye:

- identificador, autor y descripcion,
- contador de boletines que la usan,
- acciones de editar/eliminar segun permisos,
- boton de enviar prueba (puede estar deshabilitado segun estado de feature).

## Pestana Vista previa

- Renderiza la plantilla con HTML guardado para validar escritorio y movil.
- Ayuda a detectar quiebres de layout antes de impactar boletines activos.

## Pestana Editor HTML

- Editor de codigo para estructuras complejas.
- Plantillas de cuenta: modo editable.
- Plantillas globales: modo lectura para evitar cambios accidentales.
- Recomendado duplicar antes de cambios mayores.

## Pestana Configuracion

- Actualiza nombre y descripcion.
- Cambios impactan boletines asociados sin reasignar plantilla.
- Registro de auditoria del ultimo cambio.

## Componentes esenciales de una plantilla

- **Barra de marca**: logotipo y color principal.
- **Preheader**: `{{ preheader }}` para resumen visible en bandejas.
- **Contenedor de bloques**: `{{ blocks }}` para inyectar contenido del boletin.
- **Pie de pagina**: fecha generacion, cuenta y baja (`{{ unsubscribe_url }}`).

## Variables y personalizacion

| Tipo de marcador | Sintaxis | Cuando se reemplaza | Ejemplos |
| --- | --- | --- | --- |
| Contexto del boletin | `{{ variable }}` | Una vez por envio | `{{ platform_name }}`, `{{ brand_logo_url }}`, `{{ generated_at }}` |
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

Recomendacion: clonar la base para crear variantes por segmento o idioma, y documentar alcance de cada variante.

## Recomendaciones operativas

- Versionar cambios relevantes duplicando plantilla antes de editar.
- Documentar restricciones de diseno en descripcion (ancho, estilos, compatibilidad).
- Coordinar cambios de plantillas globales con el equipo de diseno/plataforma.
- Programar revisiones periodicas de compatibilidad de correo.

## Referencias

- [Boletines](./boletines.md)
- [Boletines - Bloques de contenido](./boletines-bloques.md)
- [Boletines - Grupos de destinatarios](./boletines-grupos.md)
