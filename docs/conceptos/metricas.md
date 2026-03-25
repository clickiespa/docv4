---
title: "Métricas y fórmulas"
version: "v4"
last_updated: "2026-03-25"
owner: "Product"
status: "stable"
---

# Métricas y fórmulas

## Captura de la sección

![Listado del módulo Mis métricas en Clickie](../assets/screenshots/modules/metrics.png)
*Vista del listado de métricas con columnas operativas y acciones de gestión.*

## Qué es una métrica

Una métrica en Clickie es una serie temporal de valores asociados a una variable del mundo real.

Ejemplos comunes:

- Consumo de energía
- Temperatura
- Caudal de agua
- Flujo de personas
- Estado de equipos

## Módulo "Mis métricas"

### Todas las métricas

El listado principal muestra:

- Nombre
- Unidad de medida (UOM)
- Fuente
- Fecha de creación
- Acciones disponibles

### Detalle de métrica

Desde el detalle se gestionan:

- Identificación y descripción
- Configuración de origen de datos
- Resolución y agregación
- Etiquetas y relaciones con activos

## Selector de métricas

El selector es transversal y permite reutilizar una métrica sin alterar su dato original.

### Capacidades

- Personalizar visualmente una métrica por contexto
- Crear métricas virtuales por etiqueta
- Construir métricas calculadas con fórmulas

## Fórmulas de cálculo

Se usan IDs de métricas en formato `@número`.

### Ejemplos

| Fórmula | Descripción |
| --- | --- |
| `@111-@111[-1]` | Diferencia contra lectura anterior |
| `(@222+@333)/2` | Promedio de dos métricas |
| `@444/1000` | Conversión de unidad |
| `pow(@555,2)/@666` | Operación matemática compuesta |
| `(@777>5000)?5000:@777` | Limitador por umbral |

### Funciones frecuentes

- `abs(x)`
- `pow(x,y)`
- `sqrt(x)`
- `log(x)`
- `exp(x)`

### Operadores frecuentes

- Aritméticos: `+`, `-`, `*`, `/`
- Comparación: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Lógicos: `&&`, `||`
- Condicional: `cond?A:B`
