---
title: "Selector de métricas"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Selector de métricas

Usa el selector para elegir qué datos muestra un widget, una herramienta o un cálculo. Puedes ajustar esta selección sin modificar los datos originales.

## Qué muestra la pantalla: seleccionar

:::screen id="selector-seleccionar" src="../assets/screenshots/v4.2.3/selector-seleccionar.png" title="Seleccionar métricas" points="16,15;19,23;91,26;86,19;21,32;45,34;79,34;97,33;88,94;75,94;97,7"
1. **Pasos.** Cambia entre buscar métricas y personalizar la selección.
2. **Búsqueda.** Escribe un nombre, UUID o referencia numérica.
3. **Filtros.** Abre los criterios que limitan la búsqueda.
4. **Cantidad.** Indica los resultados disponibles.
5. **Casillas.** Añade o quita métricas de la selección.
6. **Nombre y activo.** Comprueba qué se mide y dónde.
7. **Unidad.** Permite distinguir magnitudes.
8. **Referencias.** Copia el ID numérico o UUID; no cambia la selección.
9. **Personalizar.** Continúa con las métricas marcadas.
10. **Cancelar.** Cierra sin aplicar la selección nueva.
11. **Cerrar.** Sale de la ventana.
:::


## Filtros de búsqueda

:::screen id="selector-filtros" src="../assets/screenshots/v4.2.3/selector-filtros.png" title="Filtros de búsqueda" points="9,10;10,45;32,45;57,45;10,64;34,64;86,93"
1. **Filtros activos.** Muestran los criterios aplicados; en este ejemplo no hay ninguno.
2. **Alcance.** Elige dónde buscar. Métricas de activos habilita la búsqueda por activo y categoría.
3. **Tipo.** Limita por el tipo de métrica.
4. **Unidad de medida.** Busca magnitudes compatibles.
5. **Instalación.** Busca métricas de una instalación.
6. **Etiqueta.** Encuentra métricas por tag.
7. **Listo.** Cierra los filtros y vuelve a los resultados.
:::

## Qué muestra la pantalla: personalizar

:::screen id="selector-personalizar" src="../assets/screenshots/v4.2.3/selector-personalizar.png" title="Personalizar métricas" points="12,17;94,18;21,25;24,35;42,28;58,21;67,21;78,21;88,21;65,96;80,96;96,96;97,7"
1. **Pasos.** Vuelve al catálogo para añadir o quitar mediciones.
2. **Añadir.** Incorpora otra métrica, fórmula o definición por tag.
3. **Asa.** Arrastra para ordenar; también puedes usar Alt y flecha arriba o abajo.
4. **Color.** Identifica la serie en la visualización.
5. **Nombre.** Abre información y referencias de la métrica.
6. **Resolución.** Define la duración de cada intervalo. El encabezado aplica una opción a la selección compatible.
7. **Agregación.** Decide cómo resumir los valores de un intervalo.
8. **Interpolación.** Define cómo tratar huecos entre lecturas.
9. **Filtros.** Procesan los datos; no son los filtros de búsqueda. No disponibles indica que esa métrica no tiene filtros asociados.
10. **Cancelar.** Sale sin aplicar el borrador.
11. **Atrás.** Vuelve a buscar conservando el borrador.
12. **Confirmar.** Entrega las métricas elegidas al formulario original; después completa su guardado.
13. **Cerrar.** Sale de la ventana.
:::


Al señalar una fila aparecen acciones para editarla o quitarla. El lápiz cambia nombre mostrado, unidad o procesamiento; cambiar el texto de una unidad no convierte sus valores. Quitar retira la métrica de esta selección.

Si editas una fila, pulsa **Aplicar cambios** o **Descartar** antes de continuar. Después pulsa **Confirmar** y completa el guardado del formulario original cuando corresponda.

## Ejemplo: revisar potencia y temperatura

1. Busca **Potencia eléctrica** y marca la métrica de **Edificio principal**.
2. Añade **Temperatura ambiente** de **Sala de equipos**.
3. En Personalizar, conserva nombres y unidades y elige colores distinguibles.
4. Para revisar la evolución de un día, usa una resolución de 15 minutos y promedio si esas opciones son adecuadas para tus métricas.
5. Si estás en una ventana de selección, confirma. En el visor, cambia directamente el día.

Lee cada serie con su unidad: kW y °C no comparten una escala de magnitud. Usa un gráfico que permita diferenciarlas, como [Barras y Líneas](../analisis/widgets.md#evolucion-y-comparacion).

## Fórmulas y tags

**Métrica sintética** permite escribir una expresión con referencias a métricas. **Métrica por tag** combina las métricas que comparten una etiqueta; revisa la combinación elegida y qué métricas incluye esa etiqueta.

Consulta [Métricas y fórmulas](metricas.md) para elegir la agregación y el orden del cálculo. En el **Visor de datos**, el selector aparece integrado en pestañas y actualiza la vista mientras lo usas; el paso final Confirmar corresponde al selector que se abre como ventana.
