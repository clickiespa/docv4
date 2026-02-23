---
title: "Metricas y formulas"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Metricas y formulas

## Que es una metrica

Una metrica en Clickie es una serie temporal de valores asociados a una variable del mundo real.

Ejemplos comunes:

- Consumo de energia
- Temperatura
- Caudal de agua
- Flujo de personas
- Estado de equipos

## Modulo "Mis metricas"

### Todas las metricas

El listado principal muestra:

- Nombre
- Unidad de medida (UOM)
- Fuente
- Fecha de creacion
- Acciones disponibles

### Detalle de metrica

Desde el detalle se gestionan:

- Identificacion y descripcion
- Configuracion de origen de datos
- Resolucion y agregacion
- Etiquetas y relaciones con activos

## Selector de metricas

El selector es transversal y permite reutilizar una metrica sin alterar su dato original.

### Capacidades

- Personalizar visualmente una metrica por contexto
- Crear metricas virtuales por etiqueta
- Construir metricas calculadas con formulas

## Formulas de calculo

Se usan IDs de metricas en formato `@numero`.

### Ejemplos

| Formula | Descripcion |
| --- | --- |
| `@111-@111[-1]` | Diferencia contra lectura anterior |
| `(@222+@333)/2` | Promedio de dos metricas |
| `@444/1000` | Conversion de unidad |
| `pow(@555,2)/@666` | Operacion matematica compuesta |
| `(@777>5000)?5000:@777` | Limitador por umbral |

### Funciones frecuentes

- `abs(x)`
- `pow(x,y)`
- `sqrt(x)`
- `log(x)`
- `exp(x)`

### Operadores frecuentes

- Aritmeticos: `+`, `-`, `*`, `/`
- Comparacion: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Logicos: `&&`, `||`
- Condicional: `cond?A:B`
