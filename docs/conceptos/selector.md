---
title: "Selector de metricas"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Selector de metricas

El **Selector de metricas** es una herramienta transversal que aparece cada vez que el usuario necesita elegir datos para una visualizacion, un monitoreo o un calculo.

:::module-strip
El Selector de metricas es la puerta de entrada para convertir datos disponibles en decisiones consistentes. Se usa en toda la plataforma y evita configuraciones aisladas por modulo.
:::

## Para que sirve en terminos de negocio

El Selector de metricas permite pasar de "dato disponible" a "dato util" sin pedir desarrollos adicionales.

Con una misma interfaz, equipos tecnicos y de negocio pueden:

- encontrar rapido la metrica correcta,
- adaptar su presentacion al caso de uso,
- combinar metricas para construir indicadores ejecutivos,
- y validar hipotesis antes de escalar una configuracion.

## Donde se usa

- Paneles y reportes
- Visor de datos
- Monitoreos
- Formulas de calculo

## Flujo recomendado de uso

:::steps
1. **Explorar y seleccionar**: Desde la pestana **Explorar** ingresar por categorias y seleccionar una o mas metricas para operar.
2. **Revisar Seleccion actual**: Editar solo el contexto en curso (visualizacion, monitoreo o calculo) sin afectar la configuracion original.
3. **Personalizar parametros de lectura**: Ajustar color, nombre, unidad de medida, resolucion temporal, agregacion e interpolacion.
:::

Desde la pestana **Explorar** se puede ingresar a distintas categorias y seleccionar una o mas metricas.

En el listado se visualizan normalmente:

- nombre,
- unidad de medida (UOM),
- identificador de metrica.

## Agregacion e interpolacion (criterios clave)

### Metodo de agregacion

La agregacion resume datos crudos en un formato unificado para el intervalo de tiempo seleccionado.

Tipos habituales:

- `Promedio`: promedio de valores dentro del intervalo.
- `Maximo`: valor maximo dentro del intervalo.
- `Minimo`: valor minimo dentro del intervalo.
- `Suma`: suma de valores dentro del intervalo.
- `Primer valor`: primer valor observado en el intervalo.
- `Ultimo valor`: ultimo valor observado en el intervalo.

### Metodo de interpolacion

La interpolacion estima valores faltantes entre puntos conocidos para mantener continuidad de lectura.

Tipos habituales:

- `Lineal`: conecta extremos con valores intermedios.
- `Continuidad`: mantiene el ultimo valor conocido.
- `Agujero negro`: no completa faltantes.
- `Relleno cero`: completa faltantes con cero.

:::interpolation-examples
:::

## Metricas virtuales por etiqueta

El selector permite combinar dos o mas metricas reales en una metrica virtual.

Para crearla se define:

- nombre visible,
- etiqueta unica,
- metodo de combinacion (`suma` o `promedio`).

Esto facilita consolidar indicadores en lenguaje de negocio sin alterar fuentes originales.

## Metricas calculadas

Tambien se pueden crear metricas calculadas a partir de formulas con IDs de metrica (por ejemplo `@111`).

El calculo se resuelve bajo demanda para el rango temporal solicitado y mantiene trazabilidad tecnica del resultado.

Casos tipicos:

- consumo neto (`comprada - solar`),
- conversion de unidades,
- limitadores por umbral,
- condicionales anidados para reglas de negocio.

## Buenas practicas

- Definir primero el objetivo de negocio y despues elegir metricas.
- Evitar mezclar resoluciones incompatibles sin revisar el resultado final.
- Documentar formulas reutilizables para acelerar adopcion entre equipos.
- Mantener nombres de metricas claros para facilitar busqueda global.

## Referencias

- [Metricas y formulas](./metricas.md)
- [Visor de datos](../analisis/visor-datos.md)
- [Monitoreos](../automatizacion/monitoreos.md)
