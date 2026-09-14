---
title: "Gemelos digitales"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Gemelos digitales

Un gemelo digital muestra mediciones sobre una imagen, plano o esquema. Sirve para ubicar un valor en el lugar o equipo al que pertenece.

Abre **Gemelos digitales** y selecciona uno para consultarlo. El listado muestra nombre, estado de borrador y fecha de creación.

## Controles del editor

1. **Recargar**: vuelve a cargar la vista del editor.
2. **Configuración**: cambia nombre, descripción, imagen, dimensiones y ajuste a pantalla.
3. **Nueva superposición**: añade un elemento sobre el plano o la imagen.
4. **Variables**: define los datos que mostrarán las superposiciones y permite copiar su referencia.
5. **Superposiciones**: abre la lista de elementos para modificarlos.
6. **Ver**: abre el resultado de consulta en otra pestaña.
7. **Publicar**: hace disponible un gemelo que todavía está en borrador, según los accesos asignados.

Un borrador queda fuera del acceso general hasta publicarse. Las opciones para diseñar, modificar o archivar dependen de tus permisos.

## Ejemplo: temperatura sobre el plano de una sala

1. Crea **Sala de equipos** y usa un plano simple como imagen.
2. En **Diseñar > Variables**, añade `temperatura_ambiente` y selecciona **Temperatura ambiente** como origen.
3. Define el valor que quieres consultar y su formato numérico y unidad.
4. Añade una superposición de texto junto al punto de medición e inserta la variable.
5. Abre **Ver** y comprueba que el valor se entiende en su ubicación.
6. Publica el gemelo cuando esté listo para compartirlo.

## Elegir una superposición

| Elemento | Uso habitual |
| --- | --- |
| Fondo | Mostrar el plano o esquema de referencia. |
| Contenedor | Agrupar elementos relacionados. |
| Texto enriquecido | Mostrar nombres, valores y explicaciones breves. |
| Puntero | Señalar un equipo o punto de medición. |
| Acción clicable | Abrir la acción o destino configurado al pulsar. |
| Control de equipo | Operar un equipo compatible cuando la cuenta dispone de esa integración y permisos. |

La **visibilidad** define si el elemento aparece inicialmente. Un **contenedor superior** permite colocar la superposición dentro de otro elemento.

En termostatos compatibles, los controles pueden mostrar temperatura y humedad actuales, cambiar ajustes y bloquear el teclado. En grupos compatibles, **ClickieSmart** controla la climatización automática de los equipos del grupo. Usa estos controles sólo para operar los equipos que tengas asignados.

Para cambiar el color de una lectura según su valor, consulta [Variables dinámicas](./variables-dinamicas-en-superposiciones.md).
