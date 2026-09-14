---
title: "Datos y fuentes"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Datos y fuentes

Esta sección permite consultar de dónde llegan las mediciones y en qué equipos están instalados los dispositivos.

| Sección | Qué representa | Ejemplo |
| --- | --- | --- |
| Integraciones | Conexiones con fuentes externas de datos. | Mediciones que llegan desde otro sistema. |
| Instalaciones | El lugar o función que ocupa un equipo, asociado a un activo. | El medidor eléctrico del **Edificio principal**. |
| Dispositivos | Los equipos físicos registrados. | El equipo instalado actualmente en ese punto de medición. |

Una métrica es la medición consultable, como **Potencia eléctrica**. Una instalación vincula esa medición con su equipo y ubicación.

## Integraciones

Selecciona primero el tipo de integración del catálogo. Dentro de ese tipo, el listado muestra las conexiones de la cuenta.

1. **Nombre**: abre la integración.
2. **Última sincronización**: indica cuándo se registró su última sincronización.
3. **Métricas**: muestra la cantidad de mediciones asociadas.
4. **Habilitada**: indica si la integración está activa.
5. **Acciones**: ofrece las opciones disponibles para esa conexión.

En el detalle, **Métricas** muestra sus mediciones y **Configuración** permite editar la conexión. Los campos dependen del tipo de integración. Si una medición dejó de actualizarse, consulta su origen y la última sincronización antes de revisar el gráfico.

## Dispositivos e inventarios

Los dispositivos se agrupan en **Inventarios**. Abre un inventario para ver sus equipos; la tabla muestra identificador, modelo, ubicación, activo y estado de conexión. Usa la búsqueda y los filtros para encontrar uno.

En el detalle de un dispositivo, **Historial** muestra su registro y **Alias** permite consultar los identificadores alternativos asociados. Las opciones de modificación dependen de tus permisos.

## Consultar una instalación

1. Abre **Instalaciones** y busca el equipo o activo.
2. Revisa su tipo, modelo, estado y dispositivo instalado.
3. Abre **Métricas** para consultar las mediciones registradas.
4. Selecciona una métrica para ver sus datos.

Los filtros permiten acotar por activo, tipo, estado y modelo. El listado principal muestra instalaciones sin una instalación superior; los equipos conectados se consultan dentro de su instalación.

## Registrar o cambiar equipos

Si tienes permisos, **Nueva instalación** permite elegir el tipo y completar nombre, modelo y activo. En equipos que agrupan otros dispositivos, **Extender instalación** añade los elementos compatibles.

- **Instalar**: asigna un dispositivo al punto de instalación.
- **Desinstalar**: retira la asociación con el dispositivo actual.
- **Reemplazar**: cambia el equipo instalado; la pantalla avisa si se retira automáticamente el anterior.
- **Habilitar métricas**: selecciona las mediciones disponibles en el modelo para registrarlas.
- **Mover a gateway/nodo**: cambia la conexión al equipo superior elegido.

Las opciones dependen del tipo de equipo. Un gateway puede reunir nodos, sensores y otros dispositivos; abre cada elemento para revisar sus métricas y conexiones.

## Ejemplo: encontrar el consumo del edificio

Abre **Edificio principal > Instalaciones**, selecciona su medidor y entra en **Métricas > Consumo de energía**. Así puedes comprobar qué equipo aporta el dato que usas en el panel.

Consulta también [Activos](../organizacion/activos.md) y [Métricas](../conceptos/metricas.md).
