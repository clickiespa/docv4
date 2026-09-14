---
title: "Widgets"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Widgets

Elige el widget según la pregunta que quieres responder. Se añade desde **Paneles y reportes → Añadir widget**.

## Qué muestra la pantalla

:::screen id="widget-biblioteca" src="../assets/screenshots/v4.2.3/widget-biblioteca.png" title="Biblioteca de widgets" points="13,17;63,24.9;16.1,31.5;45,36.2;18.2,48;79.5,95.3;88.8,95.3;96.9,4.8"
1. **Pasos.** Biblioteca elige el tipo; Configurar ajusta sus datos; Revisar comprueba el resultado.
2. **Buscar.** Encuentra una visualización por nombre o por lo que quieres mostrar.
3. **Categorías.** Limita la biblioteca por el tipo de información.
4. **Resultados.** Indica cuántos widgets coinciden con la búsqueda y los filtros.
5. **Tarjetas.** Elige una visualización; su nombre y descripción resumen para qué sirve.
6. **Cancelar.** Cierra el asistente.
7. **Continuar.** Abre la configuración del widget elegido.
8. **Cerrar.** Sale del asistente desde la esquina superior.
:::


En cada tarjeta, lee el título, período, unidades y leyenda. Señala valores o elementos del gráfico para ver el detalle disponible. Algunas tarjetas tienen controles de período o actualización; otras muestran contenido fijo.

## Evolución y comparación

| Widget | Para qué sirve y ejemplo | Ajuste que conviene revisar |
| --- | --- | --- |
| **Gráfico de Línea** | Seguir cambios a lo largo del tiempo. Potencia eléctrica durante un día. | Período y resolución; comparación de períodos si está activada. |
| **Gráfico de Barras** | Comparar intervalos. Consumo de energía de cada día de la semana. | Barras agrupadas o apiladas. Apila sólo cantidades que tenga sentido sumar. |
| **Gráfico de Área** | Ver evolución y aportes al conjunto. Si tienes consumos por sector, observar cómo se distribuyen durante el día. | Apilado y unidades compatibles; no mezcles un total con sus partes. |
| **Mapa de Calor** | Localizar horarios o días con más actividad. Potencia eléctrica a lo largo de una semana. | Resolución y escala de color; consulta el valor de una celda para interpretarlo. |
| **Perfil temporal** | Comparar observaciones de una métrica por hora, día o mes. Revisar si el caudal suele elevarse a una misma hora. | Agrupación del eje horizontal. Cada punto conserva su fecha; no compara dos métricas en ejes X/Y. |
| **Barras y Líneas** | Observar dos comportamientos juntos. Potencia en barras y temperatura en línea. | Selecciones separadas para barras y líneas y unidad de cada eje. También admite fórmulas como líneas. |
| **Barras con Diferencia vs Línea** | Mostrar cuánto se aleja un valor de una referencia. Comparar consumo diario con una referencia configurada. | Referencia fija o métrica, en una unidad compatible. La banda representa la diferencia, no consumo adicional. |
| **Barras con Colores por Umbral** | Señalar valores que superan una referencia. Distinguir intervalos de potencia por encima de un límite operativo definido. | Color y referencia. Un valor igual al umbral pertenece al grupo que no lo supera. |

## Distribución

Estos widgets comparan partes de un total. Usa magnitudes compatibles y sin superposición. Si faltan lecturas, la participación visible puede corresponder sólo al total disponible.

| Widget | Para qué sirve y ejemplo | Ajuste que conviene revisar |
| --- | --- | --- |
| **Gráfico de Dona** | Ver cuánto aporta cada parte. Si hay mediciones por sector, consultar su participación en el consumo de la planta. | Métricas, agregación y período comunes. Lee cantidades y porcentajes en la leyenda. |
| **Gráfico de Tarta** | Comparar proporciones en un círculo. El mismo reparto por sectores, con pocas categorías. | Unidad común; evita demasiadas porciones difíciles de distinguir. |
| **Gráfico de Donut Comparativo** | Comparar grupos mediante anillos. Contrastar dos grupos de sectores con sus propias mediciones. | Cada anillo tiene su propio total: sus porcentajes no usan necesariamente el mismo denominador. |
| **Gráfico de Pareto** | Ordenar aportes de mayor a menor. Encontrar los sectores que concentran más consumo. | Orden y línea acumulada, si se usa. Revisa que el conjunto represente el total que buscas. |
| **Gráfico Waffle de Progreso** | Mostrar una proporción o avance con 100 celdas. Consumo registrado frente a una referencia del período. | Total de referencia cuando se use. Las celdas resumen la proporción; la leyenda conserva los valores precisos. |

## Indicadores

| Widget | Para qué sirve y ejemplo | Ajuste que conviene revisar |
| --- | --- | --- |
| **Medidor** | Ubicar una medición dentro de una escala. Temperatura ambiente entre un mínimo y máximo configurados. | Límites de la escala. Su porcentaje indica posición dentro de ese rango, no cumplimiento de una meta. |
| **Medidor por rangos** | Mostrar en qué intervalo está un valor. Clasificar temperatura con rangos y nombres definidos por tu equipo. | Límites, nombres y colores. El texto identifica la categoría; no dependas sólo del color. |
| **Medidor Sólido** | Comparar mediciones con una referencia usando anillos. Mostrar consumo de sectores frente a una referencia común. | Misma unidad para todas las mediciones. Sin referencia positiva se usa una escala automática, no una meta. |
| **Instantánea de Métricas** | Leer de una a seis mediciones recientes o resumidas. Temperatura y caudal del Edificio principal. | Último valor o período; cuadrícula o tabla. Consulta la fecha de la lectura o el período resumido. |
| **Momentos** | Reunir valores de distintos momentos y cálculos entre ellos. Consumo de hoy, de ayer y una combinación de ambos. | Período, resumen, horario, desplazamiento y fórmula de cada momento. |
| **Momentos 2** | Reunir indicadores con referencias y estados. Consumo del período junto a una referencia y la diferencia. | Datos de cada indicador; Apariencia, Comparación y Estados son opcionales. Diferencia absoluta y cambio porcentual tienen significados distintos. |
| **Widget de Comparación** | Comparar una métrica principal con otras del período. Si tienes submediciones, mostrar cuánto representa cada sector respecto del consumo principal. | Principal, filas, resumen y horario. Un porcentaje no clasifica el resultado como bueno o malo; con referencia cero no se puede calcular. |

Los colores, estados y referencias los define quien configura el panel. No son límites oficiales ni recomendaciones automáticas. En Momentos 2, comprueba las fechas de cada indicador: pueden usar períodos propios.

## Tablas y listas

| Widget | Para qué sirve y ejemplo | Ajuste que conviene revisar |
| --- | --- | --- |
| **Tabla Comparativa por Periodo** | Comparar de uno a siete intervalos consecutivos, con valores o puntos de estado. Revisar temperatura de los últimos intervalos frente a límites definidos. | Hasta seis métricas con igual resolución; límites inferior y superior incluidos en el rango intermedio. El intervalo actual puede estar incompleto. |
| **Tabla Comparativa Dinámica** | Leer métricas por período y cambiar las fechas. Consultar consumo diario y temperatura del mismo mes. | Agregación de cada columna y resumen opcional. El resumen se calcula para todo el período; no es necesariamente la suma de las filas. |

## Contenido y mapas

| Widget | Para qué sirve y ejemplo | Ajuste que conviene revisar |
| --- | --- | --- |
| **Mapa de Ubicaciones** | Localizar activos. Mostrar dónde están las sedes cuando sus activos tienen coordenadas. | Activos incluidos; el selector permite ver una ubicación o todas. |
| **Reporte Embebido** | Consultar un reporte externo dentro del panel. Abrir un informe que tu equipo ya utiliza. | Dirección del reporte y permisos del servicio externo. Usa Abrir reporte si no se muestra dentro de la tarjeta. |
| **Contenido HTML** | Añadir texto o contenido de apoyo. Explicar el horario operativo del edificio en una nota breve. | Contenido y enlaces. Usa sólo la información necesaria para interpretar las mediciones. |
| **Imagen** | Mostrar una imagen, como un esquema del edificio. | Contener muestra la imagen completa; cubrir puede recortarla; estirar cambia sus proporciones. Para datos sobre un plano usa [Gemelos digitales](../modelado/gemelos-digitales.md). |

## Ajustes de lectura

El **período** decide qué fechas se consultan. La **resolución y agregación** deciden cómo se resumen sus datos; consulta [Métricas y fórmulas](../conceptos/metricas.md#elegir-periodo-resolucion-y-agregacion).

Cuando estén disponibles, los ajustes de presentación permiten mostrar u ocultar ejes, elegir etiquetas de valores y fijar decimales. Cambian la lectura visual, no la medición. Si una etiqueta no cabe, consulta el valor en el detalle del gráfico.

**Sin datos en este período** significa que no hay información disponible para esa selección. **Información incompleta** conserva las mediciones disponibles e identifica las faltantes. Un cero es un valor válido.

## Ejemplos de lectura

Las capturas usan datos ficticios del **Edificio principal**. Cada número identifica un elemento; pulsa el número para leer su explicación o **Ampliar captura** para verla en detalle.

### Leer cambios durante el día

:::screen id="widget-lineas" src="../assets/screenshots/v4.2.3/widget-lineas.png" title="Leer cambios durante el día" points="39,6;98,8;4,36;78,42;57,88;65,94"
1. **Título y contexto.** Identifican la medición y el lugar: consumo del Edificio principal.
2. **Período.** Muestra las fechas consultadas. El calendario permite elegir otras fechas cuando está habilitado.
3. **Escala y unidad.** Cada punto contiene energía consumida durante una hora, en kWh.
4. **Series.** Los aumentos diarios coinciden con el horario de actividad. Señala un punto para consultar su valor.
5. **Tiempo.** Sitúa cada lectura. Compara la misma hora entre días para detectar cambios de horario.
6. **Leyenda.** Relaciona cada color con su sector. Selecciona un nombre para ocultar o mostrar esa serie.
:::

### Comparar días completos

:::screen id="widget-barras" src="../assets/screenshots/v4.2.3/widget-barras.png" title="Comparar días completos" points="39,6;98,8;4,36;70,34;57,88;65,94"
1. **Título.** Aclara que la comparación es diaria.
2. **Período.** Incluye del 7 al 13 de septiembre; todos son días completos.
3. **Unidad.** La altura se lee en kWh. En este ejemplo se suman consumos horarios.
4. **Barras.** Cada grupo corresponde a un día y cada color a un sector. El fin de semana muestra menor consumo.
5. **Días.** Permiten comparar jornadas equivalentes. No compares un día en curso con uno completo sin considerar esa diferencia.
6. **Leyenda.** Identifica las series. Las barras están agrupadas para comparar sectores, sin sumar visualmente sus alturas.
:::

### Leer el aporte al consumo conjunto

:::screen id="widget-area" src="../assets/screenshots/v4.2.3/widget-area.png" title="Leer el aporte al consumo conjunto" points="39,6;98,8;4,36;77,48;57,88;65,94"
1. **Título.** Describe el consumo que se representa.
2. **Período.** Es común a las tres series.
3. **Escala.** Muestra la suma acumulada de las áreas, en kWh por intervalo horario.
4. **Áreas apiladas.** El espesor de cada franja muestra el aporte del sector. El borde superior representa la suma de los tres.
5. **Tiempo.** Permite localizar los horarios con mayor consumo conjunto.
6. **Leyenda.** Identifica cada franja. Apila sólo mediciones compatibles que no dupliquen un mismo consumo.
:::

### Entender qué sector aporta más

:::screen id="widget-dona" src="../assets/screenshots/v4.2.3/widget-dona.png" title="Entender qué sector aporta más" points="45,6;98,8;25,64;41,45;92,52"
1. **Título.** Define qué se reparte: el consumo eléctrico del edificio.
2. **Período.** Todos los sectores usan la misma semana.
3. **Total.** Es la suma de los tres sectores incluidos, en kWh.
4. **Porciones.** El porcentaje relaciona cada sector con ese total. Climatización representa alrededor del 41 % en este ejemplo.
5. **Leyenda y valores.** Conservan el nombre y consumo de cada sector. Úsalos cuando necesitas comparar cantidades exactas.
:::

### Consultar un resumen exacto

:::screen id="widget-instantanea" src="../assets/screenshots/v4.2.3/widget-instantanea.png" title="Consultar un resumen exacto" points="40,6;98,8;15,26;98,31"
1. **Título y subtítulo.** Explican qué período se resume y a qué edificio pertenece.
2. **Período.** Aquí se resume una semana; no se están mostrando las últimas lecturas instantáneas.
3. **Nombre.** Identifica cada sector de la misma unidad.
4. **Valor y unidad.** Muestran el total de energía de cada sector. Consulta la fecha o el período de un valor antes de interpretarlo como actual.
:::

### Distinguir valores, rangos y días incompletos

:::screen id="widget-periodos" src="../assets/screenshots/v4.2.3/widget-periodos.png" title="Distinguir valores, rangos y días incompletos" points="43,6;55,19;14,26;43,38;86,77"
1. **Título.** Describe la comparación; los rangos los configura tu equipo.
2. **Columnas.** Identifican las métricas. Cada fila corresponde a un intervalo diario.
3. **Asterisco.** Marca el período en curso. El 14 de septiembre sólo incluye las lecturas hasta las 12:00.
4. **Valor y estado.** Cada celda muestra el consumo y el rango en que cae. Consulta su detalle para leer el significado del color.
5. **Leyenda.** Define los rangos de este ejemplo: menos de 70, de 70 a 190 inclusive y más de 190 kWh. Son límites ficticios; sin datos es un estado distinto.
:::
