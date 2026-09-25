---
title: "Matriz de activos"
version: "v4.2.4"
last_updated: "2026-09-25"
owner: "Product"
status: "stable"
---

# Matriz de activos

Compara varios activos en una tabla: las filas muestran sus métricas o grupos de métricas y las columnas, los períodos. Es útil para revisar consumos de sedes, áreas o equipos sin crear una tarjeta por cada uno.

:::screen id="matriz-ejemplo-real" src="../assets/screenshots/v4.2.4/matriz-ejemplo-real.png" title="Ejemplo de una matriz configurada" points="38,6;24,21;57,15;95,15;48,91"
1. **Contexto.** El título y la descripción aclaran qué se compara y en qué unidad.
2. **Activos y grupos.** Tres sedes de ejemplo reúnen consumos de operación, administración y servicios.
3. **Períodos.** Cada columna permite comparar el mismo mes entre sedes.
4. **Total por fila.** Resume los meses de cada grupo con la operación configurada.
5. **Total del conjunto.** Resume las métricas incluidas sin contar dos veces una misma métrica.
:::

Captura de un widget real configurado con activos de ejemplo y mediciones existentes. Los nombres y asociaciones de las sedes son ilustrativos.

## 1. Añadir el widget

Abre un panel que puedas editar, pulsa **Añadir widget**, busca **Matriz de activos** y continúa. Completa el título y una descripción que ayude a interpretar la tabla, por ejemplo «Consumo mensual por sede · kWh».

## 2. Elegir y personalizar los activos

Abre el selector de activos. En **Explorar activos**, busca y selecciona los que quieres comparar. En **Personalizar**, ordénalos arrastrándolos y ajusta cada uno. Quitar un activo de esta selección no lo elimina de la cuenta.

| Ajuste | Resultado |
| --- | --- |
| Nombre, color e icono | Cambian cómo se presenta el activo en este widget; no modifican su ficha. |
| Mostrar las métricas individualmente | Crea una fila por cada métrica que tenga alguna de las etiquetas indicadas. Conserva el nombre de cada métrica. |
| Mostrar las métricas agrupadas | Combina las métricas de cada etiqueta en una fila, separando las unidades distintas. |
| Etiquetas | Determinan qué métricas del activo se utilizan. Debes indicar al menos una en cualquiera de los dos modos. |
| Nombre, icono y color de un grupo | Permiten identificar cada agrupación con un nombre comprensible, como «Climatización». |
| Combinación del grupo | Elige suma, promedio, mínimo o máximo entre sus métricas, para cada período. |

Escribe etiquetas separadas por comas o elige las sugerencias existentes. El contador ayuda a comprobar cuántas métricas coinciden. Escribir una etiqueta no la asigna a ninguna métrica; una etiqueta sin coincidencias no aporta datos.

La selección utiliza las métricas asociadas directamente al activo elegido. No incorpora automáticamente las de sus activos descendientes: selecciona esos activos también si los necesitas. En modo individual basta coincidir con alguna etiqueta; en modo agrupado cada etiqueta forma su propio grupo. Una métrica con varias etiquetas puede aparecer en más de un grupo.

## 3. Elegir fechas y cálculos

| Ajuste | Cómo elegirlo |
| --- | --- |
| Período inicial | Hoy, semana, mes o año determinan las fechas al abrir el widget. El calendario permite consultar otras fechas. |
| Resolución automática | Adapta las columnas al período: horas para un día, días para una semana o mes y meses para un año. También se adapta a rangos personalizados. |
| Resolución fija | Conserva el intervalo elegido aunque cambies las fechas: 15 minutos, hora, día, semana, mes o año. |
| Agregación | «De cada métrica» respeta su configuración. También puedes elegir suma, promedio, mínimo o máximo para resumir sus lecturas en cada columna. |
| Columna de totales | Añade a la derecha suma, promedio, mínimo o máximo de los valores de las columnas, o se oculta. |
| Fila de totales | Disponible cuando las agregaciones y combinaciones utilizan suma. Resume el conjunto por unidad y evita contar dos veces una misma métrica. |
| Unidades, año y decimales | Ajustan la presentación. Ocultar la unidad no convierte los valores. El año puede mostrarse siempre, ocultarse o aparecer automáticamente al cruzar años. |

Primero se resumen las lecturas de **cada métrica dentro de cada período**. Después se combinan las métricas del grupo. Por último, la columna de totales resume las celdas de esa fila.

Por ejemplo, dos métricas de consumo dan 100 y 60 kWh en enero, y 120 y 80 kWh en febrero. Con combinación **suma**, el grupo muestra 160 y 200 kWh. Su columna de totales muestra 360 si eliges suma, o 180 si eliges promedio. Ese promedio corresponde a las columnas con datos; no es un promedio ponderado de todas las lecturas originales.

Usa suma con consumos por intervalo que tenga sentido sumar, no con lecturas acumuladas de un contador. No incluyas a la vez un medidor general y sus submedidores para calcular consumo total: el widget reconoce métricas repetidas, pero no puede deducir que mediciones distintas representan la misma energía.

## 4. Revisar y guardar

Comprueba en **Revisar** los activos, las etiquetas, las unidades, las fechas y los totales antes de guardar. Si falta una fila, revisa sus etiquetas y que las métricas pertenezcan directamente al activo seleccionado.

Al consultar la matriz puedes plegar activos y desplazarte por la tabla manteniendo sus encabezados como referencia. Los períodos sin información conservan su columna. Una celda vacía no equivale a cero; los períodos futuros no muestran consumos. Un asterisco identifica resultados parciales cuando faltan datos de parte del grupo.

La descarga **CSV** incluye también las filas plegadas o fuera de pantalla, identifica activo y unidad y conserva valores numéricos para trabajar en una hoja de cálculo. La descarga **PNG** representa la vista del widget.

Consulta también [Widgets](widgets.md) y [Métricas y fórmulas](../conceptos/metricas.md).
