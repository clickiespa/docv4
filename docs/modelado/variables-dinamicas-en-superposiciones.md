---
title: "Variables dinámicas en superposiciones"
version: "v4.2.3"
last_updated: "2026-09-14"
owner: "Product"
status: "stable"
---

# Variables dinámicas en superposiciones

Una variable inserta el valor de una métrica en el texto de un [gemelo digital](./gemelos-digitales.md). Puedes añadir una condición para cambiar su color cuando ese valor salga del rango esperado.

## Mostrar una lectura

1. En **Diseñar > Variables**, crea `temperatura_ambiente` y asígnale **Temperatura ambiente**.
2. Copia la referencia de la variable.
3. Abre una superposición de texto e insértala donde debe aparecer el dato.

```text
Temperatura de la sala: {{temperatura_ambiente}}
```

Configura la unidad en la variable. Si ya se muestra °C, no vuelvas a escribirla en el texto.

## Ejemplo: destacar una temperatura alta

```text
Temperatura de la sala: {{temperatura_ambiente}}[color=(>28:#dc2626),(*:#1f2937)]
```

- `{{temperatura_ambiente}}` muestra el valor de la variable.
- `>28` aplica la regla cuando el valor supera 28.
- `#dc2626` es el color rojo.
- `*` aplica el color gris en los demás casos.

El límite es ilustrativo. Cambiar el color del texto no crea un [monitoreo](../automatizacion/monitoreos.md) ni envía avisos.

## Condiciones disponibles

| Escribe | Para comprobar |
| --- | --- |
| `>28`, `>=28`, `<18`, `<=18` | Mayor, mayor o igual, menor, o menor o igual que un valor. |
| `=20`, `!=20` | Igual o distinto de un valor. |
| `18..28` | Dentro de un rango que incluye ambos límites. |
| `>18 & <28` | Dentro de un rango que excluye los límites. |
| `>@limite_temperatura` | Mayor que otra variable. |
| `>@temperatura_objetivo+5` | Mayor que otra variable más un margen. |
| `*` | Cualquier caso que no coincidió antes. |

Las reglas se leen de izquierda a derecha: gana la primera coincidencia. Deja `*` al final y usa punto para los decimales, por ejemplo `28.5`.

## Cambiar más de un estilo

Separa las propiedades con punto y coma:

```text
{{temperatura_ambiente}}[color=(>28:#dc2626),(*:#1f2937);font-weight=(>28:700),(*:400)]
```

Este ejemplo muestra el valor alto en rojo y negrita. También se admiten propiedades como `background-color`, `font-size` y `opacity`.

En la vista de edición, la variable aparece como una etiqueta; el contenido guardado conserva la condición. Revisa el resultado con **Ver**. Una referencia a otra variable necesita que ésta tenga un valor disponible para poder compararse.
