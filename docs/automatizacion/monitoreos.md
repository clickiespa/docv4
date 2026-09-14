---
title: "Monitoreos"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Monitoreos

Un monitoreo revisa una métrica a intervalos y cambia de estado cuando se cumplen sus reglas. Los disparadores definen cuándo y a quién avisar.

## Leer el listado

1. **Nombre**: abre el monitoreo y su configuración.
2. **Estado**: muestra **OK**, **ADVERTENCIA**, **ALARMA** o **SIN DATOS**. Sin datos no significa que la condición sea normal.
3. **Frecuencia**: combina la ventana revisada y cada cuánto se evalúa. “10 mins c/5 mins” revisa los últimos diez minutos cada cinco minutos.
4. **Tipo**: clasifica la importancia del monitoreo, por ejemplo aviso, advertencia o crítico. Es distinto de su estado actual.
5. **Nuevo monitoreo y acciones**: permiten crear o modificar los monitoreos según tus permisos.

Dentro del monitoreo, **Resumen** muestra sus datos; **Reglas**, las condiciones; **Disparadores**, los avisos; **Historial**, los cambios de estado; y **Actividad**, los eventos registrados.

## Ejemplo: Temperatura fuera de rango

La **Sala de equipos** debe mantenerse entre 18 y 28 °C. Estos valores ilustran la configuración; usa los límites de tu instalación.

1. Crea **Temperatura fuera de rango**, con ventana de **10 minutos** y frecuencia de **5 minutos**.
2. En **Reglas**, añade una regla para **Temperatura ambiente**.
3. Elige **Fuera de rango**, límite inferior **18**, superior **28** y umbral **90 %**.
4. Guarda la regla habilitada. Se activa cuando la proporción configurada de la ventana queda fuera de la banda.
5. En **Disparadores**, añade una comunicación, selecciona **ALARMA** y los destinatarios responsables.
6. Revisa el **Historial** para ver cuándo cambió el estado.

## Preparar una regla de límite

:::screen id="monitoreo-regla" src="../assets/screenshots/v4.2.3/monitoreo-regla.png" title="Regla de temperatura: límite ficticio de 28 °C" points="32,13;32,28;85,36;93,47;33,54;64,64;85,79;38,80;83,93;94,93;97,7"
1. **Nombre.** Describe la condición para reconocerla en el listado.
2. **Descripción.** Añade el contexto necesario para interpretarla.
3. **Métrica.** Selecciona la medición que evaluará la regla.
4. **Método.** Decide qué comprobar. Los campos siguientes cambian según la condición.
5. **Límite superior.** Para Mayor que, define el valor que debe superarse en la unidad de la métrica.
6. **Umbral.** Define la proporción de la ventana que debe cumplir la condición; no es el límite de temperatura.
7. **Ayuda del método.** Explica su funcionamiento y ofrece un ejemplo.
8. **Habilitado.** Permite evaluar la regla. En la captura está desactivada mientras se prepara.
9. **Cancelar.** Descarta el borrador.
10. **Guardar.** Guarda la configuración de la regla.
11. **Cerrar.** Sale del formulario.
:::

## Elegir la condición

| Método | Qué comprueba | Uso habitual |
| --- | --- | --- |
| Mayor que / Menor que | Si el valor supera un límite o queda por debajo durante la proporción indicada de la ventana. | Potencia demasiado alta o caudal demasiado bajo. |
| Dentro del rango / Fuera de rango | Si los valores están dentro o fuera de dos límites. | Temperatura fuera de la banda de operación. |
| Aumentó / Disminuyó / Cambió al menos un porcentaje | La variación entre el primer y último valor de la ventana. | Un aumento rápido de potencia. |
| Aumentó / Disminuyó / Cambió al menos un valor | La diferencia entre el primer y último valor, en la unidad de la métrica. | Temperatura que sube varios grados. |
| Disminuyó / Aumentó el volumen de datos | La cantidad de puntos frente a la ventana anterior del mismo tamaño. | Detectar una caída en la recepción de mediciones. |

Los campos del formulario cambian según el método. Lee la explicación y el ejemplo que aparecen al seleccionarlo.

## Configurar los avisos

| Control del disparador | Para qué sirve |
| --- | --- |
| Tipo | Elegir una comunicación o el reenvío de un evento, según las opciones disponibles. |
| Estados | Elegir los estados que activan el aviso. |
| Patrón horario | Limitar los avisos a determinados días y horas. |
| Zona horaria | Interpretar ese horario en la zona de la cuenta o en UTC. |
| Avisar al comenzar el horario activo | Avisar al iniciar el horario si el monitoreo sigue en un estado seleccionado desde antes. |
| Repetición | Fijar el intervalo mínimo entre recordatorios mientras continúa el estado. |
| Habilitado | Activar o desactivar ese disparador. |

Sin el aviso al inicio del horario, un cambio ocurrido fuera del horario no se envía después por ese motivo. Configura los recordatorios sólo cuando el destinatario necesite seguimiento.

Consulta también [Métricas](../conceptos/metricas.md) y [Visor de datos](../analisis/visor-datos.md).
