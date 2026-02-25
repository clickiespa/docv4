---
title: "Boletines"
version: "v4"
last_updated: "2026-02-25"
owner: "Product"
status: "stable"
---

# Boletines

Los boletines permiten compartir informacion periodica con audiencias definidas dentro de la plataforma.
Cada envio combina contenido dinamico basado en metricas con bloques editoriales y se distribuye automaticamente segun la programacion indicada.

:::module-strip
Boletines esta pensado para automatizar reportes recurrentes, reducir tareas manuales y mantener equipos y stakeholders alineados con la evolucion de datos.
:::

Cada boletin coordina tres componentes:

- **Destinatarios**: usuarios individuales o grupos reutilizables de la plataforma.
- **Plantilla**: estructura visual y estilos comunes para todos los envios.
- **Bloques de contenido**: componentes ordenables para texto, KPIs y graficos.

## Cuando crear un boletin

- Cuando necesitas comunicar resultados periodicos (diarios, semanales o mensuales) sin exportaciones manuales.
- Cuando quieres distribuir paneles o metricas clave a una audiencia acotada y mantener historial de envio.

## Acceso y vista general

- Ruta: **Configuracion -> Boletines -> Boletines**.
- La tabla principal incluye busqueda global, filtros por plantilla y acciones masivas.
- El boton **Crear boletin** abre un formulario inicial con nombre y descripcion.
- El listado muestra estado (Activo/Pausado), plantilla y senales de salud para detectar boletines detenidos.

## Estructura de la ficha del boletin

El encabezado del detalle muestra:

- estado y accion rapida para activar o pausar,
- identificador interno, plantilla, patron horario y zona horaria,
- resumen de envios (ultimo/proximo disparo y cantidad de destinatarios),
- acciones contextuales segun permisos (editar, duplicar, eliminar, enviar manualmente).

## Pestana Resumen

- Historial de envios con totales enviados/fallidos y tasa de entrega.
- Direcciones suprimidas para identificar rebotes o bajas.
- Cronologia de ejecuciones con proximos disparos y eventos completados.

## Pestana Diseno

- Columna de **bloques de contenido** con orden, edicion y eliminacion.
- **Vista previa** interactiva con fecha de referencia para validar variables relativas.
- Para perfiles administrativos: modo depuracion y accion **Enviar ahora**.

## Pestana Destinatarios

- Tabla de audiencia por tipo (usuario o grupo).
- Formulario de alta con selector por tipo de destinatario.
- Soporte de filtros por cuenta/idioma para reutilizar grupos.
- Solo se admiten miembros activos de la plataforma.

## Pestana Historial

- Lista de despachos ejecutados con estado y marca temporal.
- Vista de detalle por despacho para revisar destinatarios y diagnosticar fallos.

## Pestana Configuracion

- Formulario completo: nombre, descripcion, plantilla, patron horario y zona horaria.
- Cambios de patron/horario recalculan proximos disparos.
- Si el boletin esta pausado, no se ejecuta ninguna programacion.

## Organizacion recomendada de contenido

:::steps
1. **Abrir contexto**: Comenzar con un bloque narrativo (Free Text) que explique objetivo y alcance.
2. **Priorizar datos**: Ubicar KPIs y tendencias por importancia de negocio.
3. **Cerrar con accion**: Agregar recordatorios operativos o proximos pasos.
4. **Validar antes de enviar**: Usar vista previa y modo depuracion para revisar calculos y consistencia visual.
:::

## Bloques disponibles

Catalogo actual:

- **Free Text**
- **KPI Snapshot**
- **Line Chart**
- **Bar Chart**

Para detalle de parametros y casos de uso, revisar [Boletines - Bloques de contenido](./boletines-bloques.md).

## Buenas practicas operativas

- Mantener solo bloques necesarios para facilitar lectura.
- Coordinar cambios de plantilla con administradores de estilos.
- Revisar rebotes periodicamente para limpiar audiencias inactivas.
- Documentar objetivo del boletin en descripcion para facilitar reutilizacion.

## Recursos complementarios

- [Boletines - Grupos de destinatarios](./boletines-grupos.md)
- [Boletines - Plantillas](./boletines-plantillas.md)
- [Boletines - Bloques de contenido](./boletines-bloques.md)
