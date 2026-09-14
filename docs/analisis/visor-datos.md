---
title: "Visor de datos"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Visor de datos

Abre **Mis métricas → Visor de Datos** para consultar un período, comparar mediciones o probar una visualización.

## Qué muestra la pantalla

:::screen id="visor-seleccion" src="../assets/screenshots/v4.2.3/visor-seleccion.png" title="Visor antes de seleccionar métricas" points="50,20;93,14;11,63;31,63;53,63;91,57;5,69;91,71;6,82;91,84"
1. **Gráfico.** Muestra la selección; aquí aún no hay métricas elegidas. Consulta los ejemplos de Widgets para aprender a leer los datos.
2. **Período.** Elige las fechas del gráfico.
3. **Explorar métricas.** Busca y selecciona las mediciones.
4. **Personalizar selección.** Cambia orden, colores y procesamiento.
5. **Opciones de visualización.** Elige el tipo de widget y sus ajustes.
6. **Minimizar.** Contrae la selección para dar más espacio al gráfico.
7. **Buscar.** Encuentra una medición.
8. **Filtros.** Limita los resultados del catálogo.
9. **Casillas.** Añade o quita métricas.
10. **Unidad y referencias.** Comprueba la unidad o copia el identificador.
:::


El [selector integrado](../conceptos/selector.md) actualiza la vista al cambiar la selección. No necesita el botón Confirmar de la ventana de selección de otros formularios.

## Ejemplo: encontrar un pico de potencia

1. Busca **Potencia eléctrica** de **Edificio principal**.
2. Usa un gráfico de línea y selecciona un día completo.
3. En Personalizar selección, elige 15 minutos y máximo para revisar picos, si la métrica admite esa resolución.
4. Señala los puntos más altos para leer su hora y valor. En el gráfico de línea puedes arrastrar sobre una zona horizontal para ampliarla.
5. Cambia a promedio si quieres revisar la evolución habitual y observa cómo cambia la lectura.

**Resultado:** puedes identificar cuándo ocurrió un valor alto. El gráfico no determina por sí solo su causa.

## Comparar sin mezclar significados

- Para comparar días de consumo, usa el mismo intervalo y la misma agregación.
- Para observar potencia y temperatura juntas, conserva sus unidades y revisa los ejes de cada serie.
- Si faltan datos, prueba otro período y revisa el mensaje de la serie. Un hueco no equivale a un consumo nulo.

La selección se conserva en la dirección de la página. Puedes copiarla para recuperar esta selección; quien la abra necesita acceso a las mismas métricas.

Si vas a consultar esta vista con frecuencia, crea un widget en [Paneles y reportes](paneles.md). Revisa el [catálogo de widgets](widgets.md) para elegir la presentación.
