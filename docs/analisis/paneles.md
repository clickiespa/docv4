---
title: "Paneles y reportes"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Paneles y reportes

Un panel reúne gráficos, indicadores, tablas y contenido que puedes volver a consultar. Abre **Paneles y reportes** y selecciona el nombre del panel.

## Un panel recién creado

:::screen id="panel-vacio" src="../assets/screenshots/v4.2.3/panel-vacio.png" title="Un panel recién creado" points="2,10;72,18;79.8,11;95.1,11;50,55"
1. **Nombre y cuenta.** Confirma qué panel estás modificando.
2. **Modo de edición.** Reorganiza y cambia el tamaño de las tarjetas cuando existan.
3. **Añadir widget.** Abre la biblioteca de visualizaciones.
4. **Menú del panel.** Accede a Información, Subpaneles, Modificar y Eliminar según permisos.
5. **Panel vacío.** Todavía no tiene widgets. Añade el primero para comenzar.
:::

## Qué muestra la pantalla: listado

1. **Búsqueda:** encuentra un panel por su nombre o descripción.
2. **Filtros:** limita el listado por las opciones disponibles, como tipo o archivado.
3. **Nombre:** abre el panel. El contador junto a él indica si tiene subpaneles.
4. **Tipo y fecha de creación:** distinguen el tipo de vista y cuándo se creó.
5. **Casillas y acciones:** muestra las operaciones permitidas sobre los paneles elegidos.

## Qué muestra la pantalla: panel abierto

1. **Pestañas de subpaneles:** cambian de vista dentro del panel. **Más** reúne las pestañas que no caben en la barra.
2. **Widgets:** muestran los datos o contenido. El título y subtítulo explican qué representa cada tarjeta.
3. **Período de un widget:** cambia las fechas de esa tarjeta cuando está habilitado. Comprueba los períodos antes de comparar tarjetas.
4. **Modo edición:** permite reorganizar los widgets y cambiar su tamaño si tienes permiso.
5. **Añadir widget:** abre la biblioteca y su configuración guiada.
6. **Menú de tres puntos del panel:** reúne Información, Subpaneles, Modificar y Eliminar según tus permisos.

Las opciones de edición aparecen sólo cuando tienes acceso para modificar el panel. Un reporte externo puede abrir contenido de otro servicio y requiere también acceso a ese servicio.

## Añadir un widget

1. En **Resumen operativo**, pulsa **Añadir widget**.
2. En **Biblioteca**, busca un tipo o filtra por Evolución y comparación, Distribución, Indicadores, Tablas y listas o Contenido y mapas.
3. Elige el widget y pulsa **Continuar**.
4. En **Configurar**, selecciona las métricas, el período y los ajustes. Revisa la vista previa.
5. En **Revisar**, prueba el ancho Compacto, Mediano o Ancho y pulsa **Añadir al dashboard**.

**Atrás** permite corregir la configuración. Si faltan campos, completa los señalados antes de continuar.

## Configurar el gráfico

:::screen id="widget-configuracion" src="../assets/screenshots/v4.2.3/widget-configuracion.png" title="Configuración de un gráfico de línea" points="12,13;16,27;47,35;36,45;46,55;19,63;46,69;74,27;94,38;76,97;84,97;95,97;97,7"
1. **Pasos.** Vuelve a Biblioteca o continúa a Revisar.
2. **Título.** Explica qué muestra la tarjeta.
3. **Subtítulo.** Añade el lugar u otro contexto breve.
4. **Métricas.** Abre el selector; la cuenta indica cuántas elegiste.
5. **Período inicial.** Define las fechas que se consultan al abrir el panel.
6. **Comparar con otro período.** Habilita la comparación temporal.
7. **Estilo de presentación.** Reúne relleno, suavizado, etiquetas, decimales, ejes y visibilidad del período para este gráfico.
8. **Vista previa.** Comprueba el resultado; aquí aún no se han elegido métricas.
9. **Período de la vista previa.** Prueba otras fechas para esta visualización.
10. **Cancelar.** Sale sin añadir la tarjeta.
11. **Atrás.** Regresa al paso anterior.
12. **Continuar.** Abre la revisión si la configuración está completa.
13. **Cerrar.** Sale del asistente.
:::

## Ejemplo: Resumen operativo

| Tarjeta | Datos | Para qué consultarla |
| --- | --- | --- |
| Potencia durante el día | Gráfico de Línea con Potencia eléctrica | Localizar cambios de horario y picos. |
| Consumo diario | Gráfico de Barras con Consumo de energía, por día | Comparar días completos. Usa suma sólo si contiene consumos por intervalo. |
| Condiciones del edificio | Instantánea de Métricas con Temperatura ambiente y Caudal de agua | Leer valores recientes junto con la fecha de cada lectura. |
| Nota de lectura | Contenido HTML con un texto breve | Aclarar el horario habitual de funcionamiento o el alcance del panel. |

Pon primero las tarjetas que responden las preguntas más frecuentes. Separa en subpaneles cuando cambie el tema, por ejemplo energía y condiciones del edificio.

## Leer las tarjetas

Comprueba **unidad, período y agregación** antes de comparar valores. Las tarjetas con datos incompletos lo indican; **sin datos** es distinto de cero. Actualizar vuelve a solicitar la información, pero no crea mediciones faltantes.

La dirección del panel conserva el subpanel abierto. Compartirla no cambia los permisos de quien la recibe.

Consulta [Widgets](widgets.md) para conocer el propósito y los ajustes de cada tipo.
