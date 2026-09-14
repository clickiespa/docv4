---
title: "Exportador de datos"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Exportador de datos

Descarga mediciones en un archivo **Excel (.xlsx)** para trabajar con ellas fuera de Clickie. Abre **Mis métricas > Exportador de Datos** y elige las métricas a las que tienes acceso.

## Qué muestra la pantalla

:::screen id="exportador-opciones" src="../assets/screenshots/v4.2.3/exportador-opciones.png" title="Opciones de exportación" points="56,7;79,4;96,12;79,17;78,35;68,42;76,47;35,27;50,44;38,52;45,70;6,82;94,84"
1. **Período.** Elige fechas inicial y final.
2. **Engranaje.** Abre las opciones avanzadas.
3. **Descargar .xlsx.** Consulta el período completo y genera Excel.
4. **Mostrar UOM.** Incluye la unidad en las celdas, guardándolas como texto. Desactívalo para calcular con números.
5. **Zona horaria.** Define la columna Fecha local.
6. **Cancelar.** Cierra las opciones sin aplicarlas.
7. **Aplicar.** Usa los ajustes elegidos.
8. **Tabla.** Muestra una vista previa; aquí aún no se han seleccionado métricas.
9. **Estado y progreso.** Indican el período de la vista previa y la carga.
10. **Explorar / Personalizar.** Elige las métricas y cómo procesarlas.
11. **Buscar y filtrar.** Encuentra mediciones en el catálogo.
12. **Casillas.** Añade mediciones a la exportación.
13. **Unidad y referencias.** Identifica las mediciones del listado.
:::


La vista previa puede mostrar sólo el inicio del período seleccionado. **La descarga incluye todo el período solicitado**, con los datos disponibles.

## Ejemplo: revisar el consumo diario en Excel

1. Selecciona **Consumo de energía** de **Edificio principal**.
2. Elige una semana completa en **Período**.
3. En **Personalizar selección**, usa resolución diaria y suma si la métrica contiene consumos por intervalo. Si no conoces su definición, conserva los valores predefinidos.
4. Abre el engranaje, comprueba la **Zona horaria** y desactiva **Mostrar UOM** si necesitas calcular con las celdas en Excel. Pulsa **Aplicar**.
5. Revisa las primeras filas y pulsa **Descargar .xlsx**. Mantén la página abierta hasta que termine.

## Leer el archivo

El archivo contiene una hoja **Export** con:

- **Timestamp UTC**: referencia numérica de la fecha.
- **Fecha UTC** y **Fecha local**: el mismo instante en UTC y en la zona elegida.
- **Una columna por métrica**: valores según el procesamiento seleccionado, redondeados a dos decimales.

Con **Mostrar UOM**, los valores que tienen unidad la incluyen y se guardan como texto. Sin esa opción, los valores se guardan como números. Una celda vacía indica que no hay valor para esa fecha; no equivale a cero.

El botón queda deshabilitado mientras se prepara una exportación. Si aparece un error, revisa el período y la selección antes de volver a intentarlo.

Consulta [Selector de métricas](../conceptos/selector.md) y [Métricas y fórmulas](../conceptos/metricas.md) para elegir el procesamiento adecuado.
