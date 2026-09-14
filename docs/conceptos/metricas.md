---
title: "Métricas y fórmulas"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Métricas y fórmulas

Una métrica reúne valores de una variable a lo largo del tiempo. Su nombre indica qué se mide; su unidad permite interpretar el valor.

## Qué muestra la pantalla

En **Mis métricas → Todas las métricas**:

:::screen id="metricas-lista" src="../assets/screenshots/v4.2.3/metricas-lista.png" title="Catálogo de métricas" points="2,8;54,10;72,10;96,16;10,43;16,30;52,31;68,30;86,31;4.5,29;96,43;10,81;87,88"
1. **Cuenta y sección.** Confirma dónde estás consultando.
2. **Buscar.** Encuentra una métrica por nombre, descripción o referencia.
3. **Filtrar.** Limita los resultados.
4. **Nueva métrica.** Abre la creación de una métrica.
5. **ID.** Identifica la métrica; también se usa en fórmulas.
6. **Nombre y descripción.** Abre el detalle de la medición.
7. **Unidad de medida.** Distingue magnitudes como energía, potencia y temperatura.
8. **Fuente de métrica.** Indica de dónde procede, por ejemplo Dispositivo, Calculado o API.
9. **Creado.** Muestra cuándo se registró; permite ordenar el listado.
10. **Casillas.** Selecciona una o varias métricas para operar sobre ellas.
11. **Acciones.** Abre las operaciones permitidas; Exportar prepara la descarga de datos.
12. **Tamaño de página.** Cambia la cantidad de resultados visibles.
13. **Paginación.** Recorre las páginas del catálogo.
:::


## Elegir la métrica correcta

| Métrica del ejemplo | Qué responde | Cómo leerla |
| --- | --- | --- |
| Consumo de energía | ¿Cuánta energía se consumió? | kWh del período. |
| Potencia eléctrica | ¿Cuánta potencia se estaba usando? | kW; permite revisar picos y horarios. |
| Temperatura ambiente | ¿Cómo cambió la temperatura? | °C; revisa promedio, mínimo o máximo. |
| Caudal de agua | ¿A qué ritmo circulaba el agua? | Una unidad de volumen por tiempo, según la métrica. No equivale por sí sola al volumen consumido. |

Abre el nombre de una métrica para consultar su detalle, origen y datos disponibles. Las pestañas reúnen sus datos, configuración y relaciones; las opciones varían según el tipo y tus permisos.

## Elegir período, resolución y agregación

**Período** es el rango consultado. **Resolución** es la duración de cada punto o fila. **Agregación** es la operación que resume los datos de cada intervalo.

| Pregunta | Período | Resolución y agregación |
| --- | --- | --- |
| ¿En qué horario sube la potencia? | Un día completo | 15 minutos; promedio para la evolución o máximo para los picos. |
| ¿Qué día consumió más energía? | Una semana completa | Un día; suma si la métrica contiene consumos por intervalo. |
| ¿Cuál fue la mayor temperatura de cada día? | Una semana completa | Un día; máximo. |
| ¿Qué caudal hubo durante la jornada? | Un día completo | Una hora; promedio. |

Empieza con **Usar predefinido** si no conoces el tipo de dato. No sumes lecturas acumuladas de un contador ni promedios de períodos para obtener un total. Confirma cómo está definida la métrica antes de cambiar su agregación.

La **interpolación** establece cómo tratar los puntos faltantes al preparar la serie. Un valor interpolado no es una lectura registrada. Mantén la opción predefinida salvo que necesites otra forma de completar los intervalos.

Un período como hoy todavía está recibiendo datos. Compara períodos completos equivalentes si necesitas comparar totales. **Sin datos** no significa cero.

## Crear una métrica calculada

Una fórmula combina métricas y números. Por ejemplo, puedes sumar consumos de sectores si todos usan kWh y no se superponen, o calcular qué porcentaje representa un sector respecto del total.

1. Abre la creación de una métrica calculada desde el listado.
2. Escribe un nombre que describa el resultado y selecciona su unidad.
3. Construye la fórmula con los ID reales de las métricas. El selector permite copiarlos desde la información de cada métrica.
4. Ajusta resolución, agregación e interpolación y revisa la vista previa.
5. Guarda cuando la fórmula y el período muestren el resultado esperado.

En **Cómo calcular la fórmula**:

- **Calcular primero, agrupar después:** calcula cada punto y después resume los resultados. Sirve, por ejemplo, para observar un cociente en cada instante.
- **Agrupar primero, calcular después:** prepara cada métrica antes de aplicar la fórmula. Sirve para calcular la participación de un sector a partir de los consumos totales del período. En este modo puedes ajustar cada métrica de la fórmula; su resolución no puede ser más gruesa que la de la fórmula.

Promediar porcentajes instantáneos y dividir totales del período puede dar resultados distintos. Elige según la pregunta que quieres responder. Si falta un dato necesario o el divisor es cero, el resultado puede quedar sin datos.

Una fórmula añadida dentro del [selector](selector.md) pertenece a esa selección. Para reutilizarla como una métrica del catálogo, créala desde **Mis métricas**.
