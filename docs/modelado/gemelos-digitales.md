---
title: "Gemelos digitales"
version: "v4"
last_updated: "2026-02-23"
owner: "Product"
status: "stable"
---

# Gemelos digitales

Los Gemelos digitales representan activos en una vista visual con datos en tiempo real provenientes de metricas.

## Gestion del modulo

El listado principal permite revisar:

- Nombre
- Estado (`borrador` o `publicado`)
- Fecha de creacion
- Acciones

## Acciones disponibles

- **Ver**: abrir el gemelo operativo.
- **Disenar**: editar variables y superposiciones.
- **Info**: revisar metadatos e identificadores.
- **Configuracion**: ajustar nombre, descripcion y layout.
- **Archivar**: ocultar sin eliminar.
- **Publicar/Borrador**: controlar el estado de exposicion.

## Diseno de variables

Al crear una variable se define:

- Nombre y descripcion
- Origen de datos (metrica, formula, etiqueta)
- Tipo de extraccion (ultimo valor o por intervalo)
- Formato numerico
- Presentacion de UOM

## Diseno de superposiciones

Tipos principales:

- Capa de fondo
- Contenedor
- Accion clicable
- Texto enriquecido
- Puntero
- Control PLC

Parametros comunes:

- Tipo
- Identificador
- Visibilidad
- Tamano fijo

## Referencias

- [Activos](../organizacion/activos.md)
- [Metricas](../conceptos/metricas.md)
