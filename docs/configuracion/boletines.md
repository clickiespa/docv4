---
title: "Boletines"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Boletines

Un boletín envía por correo un resumen de datos a los colaboradores seleccionados, con una programación definida.

Abre **Configuración > Boletines**. El listado muestra el nombre, si está habilitado y la fecha de creación. Puedes buscarlo, filtrar por plantilla y abrir sus acciones.

## Qué encontrarás al abrirlo

| Sección o control | Para qué sirve |
| --- | --- |
| Cabecera | Consultar el estado, la plantilla, la programación y los totales del boletín. |
| Resumen | Revisar próximos envíos, envíos recientes y destinatarios. |
| Diseño | Añadir bloques, ordenarlos y generar una vista previa. |
| Destinatarios | Añadir colaboradores o listas y habilitar o deshabilitar cada destino. |
| Historial de envíos | Revisar los envíos de este boletín, sus resultados y errores. |
| Configuración | Cambiar nombre, descripción, plantilla, programación y zona horaria. |
| Habilitar / Deshabilitar | Permitir o detener los próximos envíos programados. |

## Ejemplo: Resumen semanal

1. Crea **Resumen semanal**. El boletín empieza deshabilitado.
2. En **Configuración**, elige la plantilla, la programación semanal y su zona horaria.
3. En **Diseño**, añade una cabecera, el consumo semanal y el historial de **Temperatura fuera de rango**.
4. En **Destinatarios**, selecciona el tipo de destino y añade colaboradores o una lista de la cuenta.
5. Genera una vista previa y revisa los datos, las unidades y el período.
6. Habilita el boletín cuando quieras comenzar los envíos programados.

## Revisar sin enviar

En **Diseño**, la columna izquierda contiene los bloques y la derecha, la vista previa.

1. **Añadir bloque**: incorpora un contenido.
2. **Asa de movimiento**: arrastra para cambiar el orden.
3. **Acciones del bloque**: modifica sus opciones o elimínalo.
4. **Fecha**: selecciona una de las fechas de referencia calculadas a partir de la programación.
5. **Actualizar**: genera la vista previa para esa fecha.

**La vista previa no envía correos.** En v4.2.3 no hay un botón **Enviar ahora** en esta pantalla. Si no hay fechas disponibles, configura primero la programación. Algunos administradores también ven **Depuración**, que añade información de diagnóstico a la vista previa.

## Consultar un envío

En **Historial de envíos**, abre un envío y selecciona un destinatario para consultar el contenido guardado, cuando esté disponible. El historial muestra sólo los envíos del boletín abierto.

La programación usa la zona horaria del boletín; las fechas que consultas se muestran en tu zona horaria. Si todavía no hubo envíos, algunas cifras aparecen como no disponibles.

Consulta [Bloques de contenido](./boletines-bloques.md), [Grupos de destinatarios](./boletines-grupos.md) y [Plantillas](./boletines-plantillas.md).
