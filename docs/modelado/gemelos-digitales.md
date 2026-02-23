---
title: "Gemelos digitales"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Gemelos digitales

Los **Gemelos digitales** representan activos en una vista visual con datos en tiempo real provenientes de metricas, formulas y etiquetas.

## Para que sirve este modulo

Gemelos digitales conecta operacion y comunicacion visual en un mismo entorno.

Permite:

- mostrar estado operativo de equipos e instalaciones,
- dar contexto grafico a los datos,
- y crear experiencias de consulta mas intuitivas para usuarios tecnicos y no tecnicos.

## Gestion del modulo

El listado principal permite revisar:

- nombre,
- estado (`borrador` o `publicado`),
- fecha de creacion,
- acciones disponibles.

## Acciones disponibles

- **Ver**: abrir el gemelo operativo.
- **Disenar**: editar variables y superposiciones.
- **Info**: revisar metadatos e identificadores.
- **Configuracion**: ajustar nombre, descripcion y layout.
- **Archivar**: ocultar sin eliminar.
- **Publicar/Borrador**: controlar el estado de exposicion.

## Diseno: flujo recomendado

### 1. Configurar variables

Dentro de **Disenar > Variables > + Nueva variable** se define:

- nombre y descripcion,
- origen de datos (metrica, formula de calculo o etiqueta),
- tipo de extraccion (`ultimo valor`, `valor desde intervalo`, `valor desde patron de tiempo`),
- formato numerico,
- presentacion de UOM.

### 2. Configurar superposiciones

Dentro de **Disenar > Superposiciones > + Nueva superposicion** se define:

Campos comunes:

- tipo de superposicion,
- visibilidad predeterminada,
- tamano fijo.

Tipos principales:

- Capa de fondo
- Contenedor
- Accion clicable
- Texto enriquecido
- Puntero
- Control PLC

### 3. Validar experiencia final

Abrir **Ver** para comprobar lectura, jerarquia visual y comportamiento de acciones clicables.

## Criterios de calidad recomendados

- Priorizar legibilidad: menos elementos, mejor jerarquia.
- Evitar saturar la vista con indicadores redundantes.
- Mantener consistencia de nombres entre metrica, variable y etiqueta.
- Publicar solo gemelos validados con usuarios finales.

## Referencias

- [Activos](../organizacion/activos.md)
- [Metricas y formulas](../conceptos/metricas.md)
- [Selector de metricas](../conceptos/selector.md)
