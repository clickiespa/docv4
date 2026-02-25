---
title: "Boletines - Grupos de destinatarios"
version: "v4"
last_updated: "2026-02-25"
owner: "Product"
status: "stable"
---

# Boletines - Grupos de destinatarios

Los grupos de destinatarios reunen personas que recibiran boletines en conjunto.
Funcionan como contenedores reutilizables para segmentar equipos y cohorts de usuarios con objetivos operativos comunes.

:::module-strip
Usar grupos aporta consistencia, reduce trabajo manual y mejora gobernanza cuando los boletines forman parte de acuerdos de servicio o reportes regulatorios.
:::

## Por que usar grupos en lugar de destinatarios sueltos

- Cada boletin hereda automaticamente cambios del grupo.
- Se reutilizan en multiples boletines e idiomas.
- Permiten delegar gestion de contactos con permisos limitados.
- El indicador de uso evita cambios con impacto no deseado en envios activos.
- Garantizan que solo usuarios vigentes de la plataforma reciban comunicacion.

## Acceso y listado

- Ruta: **Configuracion -> Boletines -> Grupos de destinatarios**.
- Tabla con busqueda, orden por fecha y acciones masivas.
- **Crear grupo** solicita nombre y descripcion.
- Columnas de miembros y uso ayudan a priorizar mantenimiento.

## Detalle de un grupo

Encabezado con:

- identificador interno,
- descripcion funcional,
- resumen de miembros,
- cantidad de boletines que lo consumen,
- acciones de edicion/eliminacion segun permisos.

## Pestana Resumen

- Tarjetas con totales de miembros y boletines vinculados.
- Fecha de ultima actualizacion.
- Atajos para crear boletin nuevo o duplicar grupo.

## Pestana Uso en boletines

- Tabla de solo lectura con boletines que usan el grupo.
- Estado y proxima ejecucion para evaluar impacto antes de editar audiencia.

## Pestana Miembros

- Tabla de miembros por fecha de incorporacion.
- **Agregar miembro** para vincular usuarios habilitados.
- Acciones por fila para pausar o quitar miembros.
- Contador de idiomas para revisar compatibilidad de plantillas.

## Pestana Configuracion

- Edicion de nombre y descripcion.
- Registro de auditoria (ultimo editor y fecha).
- Cambios se reflejan automaticamente en boletines que reutilizan el grupo.

## Mejores practicas

- Usar nombres de grupo descriptivos (ejemplo: "Equipo Operaciones LATAM").
- Revisar periodicamente indicador de uso y limpiar grupos obsoletos.
- Preferir administracion centralizada desde Grupos para sostener consistencia.
- Duplicar un grupo antes de pruebas para no afectar audiencias activas.

## Referencias

- [Boletines](./boletines.md)
- [Boletines - Plantillas](./boletines-plantillas.md)
