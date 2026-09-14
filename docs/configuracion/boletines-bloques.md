---
title: "Boletines: bloques de contenido"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Boletines: bloques de contenido

Los bloques forman el contenido del boletín. Añádelos desde **Boletín > Diseño > Añadir bloque** y arrástralos para ordenar la lectura.

## Elegir un bloque

Los nombres del catálogo pueden aparecer en inglés.

| Bloque | Qué muestra | Ejemplo de uso |
| --- | --- | --- |
| **Free Text** | Texto con formato HTML. | Una nota breve sobre una parada de mantenimiento. |
| **Newsletter Header** | Título, subtítulo y fecha o período del resumen. | “Resumen semanal · Planta de demostración”. |
| **KPI Snapshot** | Valores resumidos por métrica, con comparación y minigráfico opcionales. | Consumo de energía de la semana frente a la anterior. |
| **Line, Bar & Area Chart** | Evolución en líneas, áreas o barras; también admite una barra por métrica. | Temperatura ambiente durante la semana o consumo por edificio. |
| **Metric Comparison Feedback** | Comparación de una métrica con otra o consigo misma en otro período. | Comprobar si bajó el consumo respecto de la semana anterior. |
| **Comparative Table** | Tabla de una métrica principal y otras comparativas, con porcentaje opcional respecto de la principal. | Consumo total del edificio y participación de cada sistema. |
| **Monitoring History** | Resumen o detalle del historial de los monitoreos seleccionados. | Cuándo estuvo en alarma **Temperatura fuera de rango**. |

## Configurar los datos

1. **Descripción del bloque**: identifica su función dentro del editor. Usa un nombre corto, como “Consumo semanal”.
2. **Métricas o monitoreos**: elige los datos que debe mostrar.
3. **Intervalo**: define el período de datos del bloque.
4. **Usar último intervalo cerrado**: usa el período completo más reciente en lugar del período actual, que puede estar incompleto.
5. **Presentación**: elige las opciones que ofrece ese tipo, como título, leyenda, puntos, estilo o porcentaje.
6. **Vista previa**: revisa el resultado usando una fecha de referencia del boletín.

No todos los bloques muestran los mismos campos. Al modificar un bloque puedes cambiar su descripción y opciones; para usar otro tipo, añade un bloque nuevo.

## Ejemplo: un resumen de la semana completa

Para **Resumen semanal**, añade:

- **Newsletter Header** con el nombre de la planta y el período.
- **KPI Snapshot** con **Consumo de energía**, intervalo semanal y último intervalo cerrado.
- **Line, Bar & Area Chart** con **Temperatura ambiente** para ver en qué momentos subió.
- **Monitoring History** con **Temperatura fuera de rango** y el mismo período cerrado.

Así el total, la evolución y los eventos se refieren a la misma semana completa.

## Leer las comparaciones

En **Metric Comparison Feedback**, elige **Comparar con otra métrica** o **Comparar consigo misma**. Configura el intervalo y desplazamiento de cada lado. **Invertir tendencia** invierte la interpretación visual. Por defecto, un valor menor o igual se considera favorable, como en el consumo; inviértelo cuando un valor mayor represente un mejor resultado.

En **Comparative Table**, el porcentaje se calcula respecto de la métrica principal. Compara magnitudes y unidades equivalentes. El patrón horario opcional limita qué horas entran en el cálculo.

En gráficos, **Líneas / área** sirve para ver la evolución; **Barras en el tiempo**, para comparar intervalos; **Barras apiladas**, para ver aportes; y **Una barra por métrica**, para comparar valores resumidos.

Consulta también [Boletines](./boletines.md).
