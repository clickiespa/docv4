---
title: "Selector de métricas"
version: "v4"
last_updated: "2026-02-26"
owner: "Product"
status: "stable"
---

# Selector de métricas

El **Selector de métricas** es una herramienta transversal que aparece cada vez que el usuario necesita elegir datos para una visualización, un monitoreo o un cálculo.

:::module-strip
El Selector de métricas es la puerta de entrada para convertir datos disponibles en decisiones consistentes. Se usa en toda la plataforma y evita configuraciones aisladas por módulo.
:::

## Para qué sirve en términos de negocio

El Selector de métricas permite pasar de "dato disponible" a "dato útil" sin pedir desarrollos adicionales.

Con una misma interfaz, equipos técnicos y de negocio pueden:

- encontrar rápido la métrica correcta,
- adaptar su presentacion al caso de uso,
- combinar métricas para construir indicadores ejecutivos,
- y validar hipótesis antes de escalar una configuración.

## Donde se usa

- Paneles y reportes
- Visor de datos
- Monitoreos
- Fórmulas de cálculo

## Flujo recomendado de uso

:::steps
1. **Explorar y seleccionar**: Desde la pestaña **Explorar** ingresar por categorías y seleccionar una o más métricas para operar.
2. **Revisar Selección actual**: Editar solo el contexto en curso (visualización, monitoreo o cálculo) sin afectar la configuración original.
3. **Personalizar parámetros de lectura**: Ajustar color, nombre, unidad de medida, resolución temporal, agregación e interpolación.
:::

Desde la pestaña **Explorar** se puede ingresar a distintas categorías y seleccionar una o más métricas.

En el listado se visualizan normalmente:

- nombre,
- unidad de medida (UOM),
- identificador de métrica.

## Agregación e interpolación (criterios clave)

### Método de agregación

La agregación resume datos crudos en un formato unificado para el intervalo de tiempo seleccionado.

Tipos habituales:

- `Promedio`: promedio de valores dentro del intervalo.
- `Máximo`: valor máximo dentro del intervalo.
- `Mínimo`: valor mínimo dentro del intervalo.
- `Suma`: suma de valores dentro del intervalo.
- `Primer valor`: primer valor observado en el intervalo.
- `Último valor`: último valor observado en el intervalo.

### Método de interpolación

La interpolación estima valores faltantes entre puntos conocidos para mantener continuidad de lectura.

Tipos habituales:

- `Lineal`: conecta extremos con valores intermedios.
- `Continuidad`: mantiene el último valor conocido.
- `Agujero negro`: no completa faltantes.
- `Relleno cero`: completa faltantes con cero.

:::interpolation-examples
:::

## Métricas virtuales por etiqueta

El selector permite combinar dos o más métricas reales en una métrica virtual.

Para crearla se define:

- nombre visible,
- etiqueta única,
- método de combinación (`suma` o `promedio`).

Esto facilita consolidar indicadores en lenguaje de negocio sin alterar fuentes originales.

## Métricas calculadas

También se pueden crear métricas calculadas a partir de fórmulas con IDs de métrica (por ejemplo `@111`).

El cálculo se resuelve bajo demanda para el rango temporal solicitado y mantiene trazabilidad técnica del resultado.

Casos típicos:

- consumo neto (`comprada - solar`),
- conversión de unidades,
- limitadores por umbral,
- condicionales anidados para reglas de negocio.

## Buenas prácticas

- Definir primero el objetivo de negocio y después elegir métricas.
- Evitar mezclar resoluciones incompatibles sin revisar el resultado final.
- Documentar fórmulas reutilizables para acelerar adopción entre equipos.
- Mantener nombres de métricas claros para facilitar búsqueda global.

## Referencias

- [Métricas y fórmulas](./metricas.md)
- [Visor de datos](../analisis/visor-datos.md)
- [Monitoreos](../automatizacion/monitoreos.md)
