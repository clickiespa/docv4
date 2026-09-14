---
title: "Boletines: plantillas"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Boletines: plantillas

Una plantilla define la estructura visual que comparten uno o más boletines: encabezado, espacio para los bloques y pie. Para cambiar qué datos se envían, edita los bloques del boletín.

Abre **Configuración > Boletines > Plantillas** y selecciona una plantilla.

## Controles de la plantilla

1. **Nombre, autor e identificador**: permiten reconocer la plantilla.
2. **Boletines asociados**: indica cuántos boletines la utilizan.
3. **Vista previa**: muestra el HTML guardado de la plantilla.
4. **Editor HTML**: modifica su estructura y estilos cuando tienes permisos.
5. **Configuración**: cambia nombre y descripción.
6. **Acciones**: abre las opciones permitidas para la plantilla.
7. **Enviar correo de prueba**: aparece deshabilitado en v4.2.3; no permite realizar un envío.

Las plantillas globales de Clickie son de sólo lectura para usuarios sin permiso de administración global.

## Usar una plantilla

1. Abre **Resumen semanal > Configuración**.
2. Selecciona una plantilla y guarda.
3. En **Diseño**, actualiza la vista previa para revisar la plantilla junto con los bloques y datos del boletín.

## Crear una plantilla propia

1. Crea la plantilla con nombre y descripción.
2. Abre **Editor HTML** y añade su contenido.
3. Guarda y revisa **Vista previa**.
4. Asígnala al boletín y revisa también la vista previa de su **Diseño**.

El editor requiere conocer HTML para correo. La vista previa de la plantilla muestra su estructura; la del boletín permite revisar el resultado con su contenido.

## Elementos que debes conservar al editar HTML

| Marcador | Contenido |
| --- | --- |
| `{{ blocks }}` | Bloques del boletín, en el orden definido en Diseño. |
| `{{ account_name }}` | Nombre de la cuenta. |
| `{{ generated_at }}` | Fecha de generación. |
| `{{ brand_logo_url }}` | Dirección del logotipo configurado. |
| `{{ unsubscribe_url }}` | Enlace para cancelar la suscripción. |

Conserva el espacio de bloques y el enlace de baja. Si cambias una plantilla compartida, el cambio se utilizará en los siguientes envíos de todos sus boletines asociados.

Consulta también [Boletines](./boletines.md) y [Bloques de contenido](./boletines-bloques.md).
