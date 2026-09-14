---
title: "Activos"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Activos

Un activo reúne la información de un lugar, equipo o sistema. En **Mis activos**, puedes abrir sus métricas, instalaciones, gemelos digitales y documentos.

## Recorrer los activos

:::screen id="activos-lista" src="../assets/screenshots/v4.2.3/activos-jerarquia.png" title="Activos del Edificio principal" points="22,10;53,11;72,11;85,11;3,26;8,40;29,40;53,40;71,40;89,32;99,41;10,91;88,91"
1. **Cuenta y sección.** Confirma en qué cuenta estás organizando los activos.
2. **Buscar.** Escribe el nombre, la descripción o el identificador de un activo.
3. **Filtrar.** Limita los elementos que aparecen en el listado.
4. **Nuevo activo.** Crea un edificio, una sala o un equipo.
5. **Selección.** Marca los activos sobre los que quieres trabajar.
6. **Expandir o contraer.** Muestra u oculta los subactivos sin salir del listado.
7. **Nombre y descripción.** Abre la ficha del activo. Las filas indentadas pertenecen al Edificio principal.
8. **Subactivos.** Indica cuántos elementos dependen directamente del activo.
9. **Categoría.** Clasifica el activo según el catálogo de la cuenta.
10. **Creado.** Muestra la fecha de creación; el encabezado permite ordenar.
11. **Acciones.** Abre las operaciones disponibles para ese activo según tus permisos.
12. **Tamaño de página.** Elige cuántos activos raíz aparecen a la vez.
13. **Paginación.** Recorre las páginas del listado.
:::

El listado principal muestra los activos de primer nivel. Los subactivos aparecen al expandir su activo superior o desde su detalle.

## Consultar un activo

:::screen id="activo-secciones" src="../assets/screenshots/v4.2.3/activo-secciones.png" title="Secciones del Edificio principal" points="8.8,13;17,13;25.1,13;36.5,13;48.2,13;58.3,13;69.5,13;79.7,13;88.8,13;1,26;59.2,40.4;77.7,40.4;85.7,40.4;7.2,71.4;13.7,69.1;67.2,54.5;82,60;95.8,71.4;9.2,93.5;85,93.5"
1. **Resumen.** Consultar datos generales y paneles vinculados.
2. **Activos.** Abrir o asociar subactivos.
3. **Métricas.** Consultar o asociar mediciones.
4. **Gemelos digitales.** Abrir las representaciones visuales.
5. **Boletines.** Consultar o asociar boletines.
6. **Instalaciones.** Ver equipos instalados y conexiones.
7. **Documentos.** Consultar archivos.
8. **Actividad.** Revisar eventos registrados.
9. **Contactos.** Consultar contactos de la cuenta y del activo.
10. **Configuración.** Cambiar datos y campos opcionales.
11. **Buscar.** Encontrar un panel vinculado.
12. **Filtrar.** Limitar el listado de paneles.
13. **Nuevo panel.** Crear un panel para este activo.
14. **Selección.** Marcar los paneles sobre los que quieres trabajar.
15. **Nombre.** Abrir Resumen operativo.
16. **Tipo.** Identificar la clase de panel.
17. **Creado.** Consultar u ordenar por fecha de creación.
18. **Acciones.** Abrir las operaciones disponibles según permisos.
19. **Tamaño de página.** Elegir cuántos paneles aparecen.
20. **Paginación.** Recorrer los resultados.
:::


Las pestañas y acciones visibles dependen de tus permisos. **Desvincular** quita una asociación; no elimina el recurso asociado.

## Ejemplo: encontrar la temperatura de una sala

1. Expande **Edificio principal** dentro de **Planta de demostración**.
2. Abre **Sala de equipos**.
3. Entra en **Métricas** y selecciona **Temperatura ambiente**.

Usa la misma estructura para agrupar plantas, edificios, áreas o equipos. Los nombres deben indicar qué encontrará quien abre cada activo.

## Cambiar un dato utilizado en indicadores

En **Configuración**, despliega **Atributos opcionales** cuando necesites completar un atributo. Si modificas un valor existente, elige cómo guardarlo:

- **Registrar el cambio y mantener el historial**: para un cambio real, como una ampliación de superficie. Los períodos anteriores conservan el valor previo.
- **Corregir y reemplazar el valor vigente**: para corregir un dato cargado por error. Puede cambiar los indicadores históricos que usan ese valor.

Consulta también [Métricas](../conceptos/metricas.md) y [Gemelos digitales](../modelado/gemelos-digitales.md).
