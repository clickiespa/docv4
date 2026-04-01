---
title: "Variables dinámicas en superposiciones"
version: "v4"
last_updated: "2026-04-01"
owner: "Product"
status: "stable"
---

# Variables dinámicas en superposiciones

Esta guía explica cómo escribir variables de overlay y modificadores de estilo dinámico en contenido de **Gemelos digitales** para construir etiquetas sensibles al valor sin editar JavaScript ni CSS.

:::module-strip
Las superposiciones pueden reaccionar al valor actual de una variable o compararse con otras variables para cambiar color, peso tipográfico, fondo u otras propiedades CSS en tiempo real.
:::

:::info
Esta sintaxis aplica al contenido de overlays de texto dentro del editor de **Gemelos digitales**. El bloque entre `[...]` no reemplaza el valor: funciona como metadato de estilo dinámico para la variable renderizada.
:::

## Flujo principal

:::steps
1. **Empezar con una variable simple**: usar `{{variable_name}}` para imprimir el valor actual.
2. **Agregar el bloque de modificadores**: escribir `[...]` inmediatamente después de la variable cuando el estilo deba reaccionar al valor.
3. **Definir propiedades CSS**: dentro del bloque, declarar una o más propiedades en formato `propiedad=(condicion:valor)`.
4. **Ordenar reglas de mayor a menor especificidad**: la primera coincidencia gana, por lo que conviene poner primero los casos más específicos.
5. **Usar referencias cuando haga falta**: emplear `@otra_variable` cuando la comparación dependa de otro valor dinámico.
:::

## Variable básica

Usa este formato cuando solo quieras imprimir el valor actual:

```text
{{tank_level}}
```

La sintaxis del core actual de Digital Twin usa doble llave. No uses llaves simples para este caso.

Ejemplo dentro de un overlay:

```text
Nivel de tanque: {{tank_level}} %
```

## Bloque de modificadores dinámicos

Coloca el bloque de modificadores inmediatamente después de la variable:

```text
{{variable_name}}[css-property=(condition:css-value),(condition:css-value)]
```

Puedes definir varias propiedades CSS separándolas con `;`:

```text
{{variable_name}}[
color=(condition:css-value),(condition:css-value);
font-weight=(condition:css-value),(condition:css-value)
]
```

## Cómo leer la sintaxis

- `{{tank_level}}` significa "mostrar el valor de `tank_level`".
- `color=` significa "aplicar color al texto".
- `(>80:red)` significa "si el valor es mayor que 80, usar rojo".
- `(*:#1f2937)` significa "en cualquier otro caso, usar este valor de fallback".

## Orden de reglas

Las reglas se evalúan de izquierda a derecha. La primera coincidencia gana.

Regla práctica de prioridad:

- Pon primero la regla más específica.
- Deja las reglas más amplias para después.
- Usa `*` al final como fallback.
- La regla `*` solo debe cubrir casos no resueltos por reglas anteriores.

Ejemplo esperado:

```text
{{Medidor}}[color=(<500:red),(500..2000:orange),(*:#1f2937)]
```

Si `Medidor` vale `300`, el resultado esperado es `red`.

## Condiciones soportadas

La variable actual siempre es el lado izquierdo de la comparación. Por eso solo se escribe el umbral o la referencia del lado derecho.

| Formato | Significado | Ejemplo |
| --- | --- | --- |
| `>100` | Mayor que un número fijo | `(>100:red)` |
| `>=100` | Mayor o igual que un número fijo | `(>=100:red)` |
| `<100` | Menor que un número fijo | `(<100:blue)` |
| `<=100` | Menor o igual que un número fijo | `(<=100:blue)` |
| `=100` | Igual exacto a un número fijo | `(=100:green)` |
| `!=100` | Distinto de un número fijo | `(!=100:orange)` |
| `50..100` | Rango inclusivo entre 50 y 100 | `(50..100:blue)` |
| `>50 & <100` | Rango abierto entre 50 y 100 | `(>50 & <100:blue)` |
| `>@limit` | Comparación contra otra variable | `(>@limit:red)` |
| `>=@limit*1.1` | Comparación contra otra variable con multiplicador | `(>=@limit*1.1:red)` |
| `<=@target+5` | Comparación contra otra variable con offset | `(<=@target+5:green)` |
| `@low..@high+10` | Rango inclusivo basado en dos referencias | `(@low..@high+10:blue)` |

## Valores de referencia

El lado derecho de una condición puede ser:

- Un número fijo como `100`, `75.5` o `0`.
- Otra variable usando `@variable_name`.
- Otra variable con ajuste simple como `@limit+5`, `@limit-5`, `@limit*1.1` o `@limit/2`.
- Una cadena aritmética corta como `@target*1.1+5`.

Para mantener la autoría simple, evita paréntesis dentro de las condiciones. Si se usa una cadena corta, evalúala de izquierda a derecha.

## Propiedades CSS recomendadas

Usa nombres normales de CSS en kebab case:

- `color`
- `background-color`
- `font-weight`
- `font-size`
- `opacity`
- `border-color`
- `text-shadow`

## Ejemplos listos para copiar

Colores de alarma simples:

```text
{{tank_level}}[color=(>100:red),(50..100:blue),(*:#1f2937)]
```

Resultado esperado:

- Por encima de 100: rojo
- Entre 50 y 100: azul
- En cualquier otro caso: gris oscuro

Comparar contra una variable límite:

```text
{{pressure}}[color=(>@pressure_limit:#dc2626),(*:#16a34a)]
```

Resultado esperado:

- Mayor que `pressure_limit`: rojo
- En cualquier otro caso: verde

Comparar contra otra variable con margen adicional:

```text
{{temperature}}[color=(>@temperature_target+5:#dc2626),(*:#1f2937)]
```

Resultado esperado:

- Más de 5 unidades por encima de `temperature_target`: rojo
- En cualquier otro caso: gris oscuro

Usar varias propiedades CSS al mismo tiempo:

```text
{{humidity}}[
color=(>80:#dc2626),(<30:#2563eb),(*:#1f2937);
font-weight=(>80:700),(<30:700),(*:400);
background-color=(>80:#fee2e2),(<30:#dbeafe),(*:transparent)
]
```

Resultado esperado:

- Humedad alta: rojo, negrita, fondo rojo claro
- Humedad baja: azul, negrita, fondo azul claro
- Humedad normal: estilo neutro

Comparar contra una banda operativa dinámica:

```text
{{flow}}[color=(@flow_min..@flow_max:#16a34a),(*:#dc2626)]
```

Resultado esperado:

- Dentro del rango permitido: verde
- Fuera del rango permitido: rojo

Usar un rango abierto:

```text
{{rpm}}[color=(>900 & <1200:#2563eb),(*:#1f2937)]
```

Resultado esperado:

- Estrictamente entre 900 y 1200: azul
- En cualquier otro caso: gris oscuro

## Ejemplos Lora / Medidor

Para una métrica que se mueve entre `0` y `4000`, estos patrones son útiles como base de copy-paste.

Color por banda operativa:

```text
Lora: {{Medidor}}[color=(<500:#dc2626),(500..2000:#f59e0b),(2000..3000:#16a34a),(>3000:#2563eb),(*:#1f2937)]
```

Peso tipográfico por severidad:

```text
Lora: {{Medidor}}[font-weight=(<500:800),(500..2000:700),(2000..3000:500),(>3000:400),(*:400)]
```

Tamaño de fuente por banda:

```text
Lora: {{Medidor}}[font-size=(<500:1.35em),(500..2000:1.15em),(2000..3000:1em),(>3000:0.9em),(*:1em)]
```

Color de fondo como píldora de estado:

```text
Lora: {{Medidor}}[background-color=(<500:#fee2e2),(500..2000:#ffedd5),(2000..3000:#dcfce7),(>3000:#dbeafe),(*:transparent)]
```

Brillo suave cuando el valor es muy alto:

```text
Lora: {{Medidor}}[text-shadow=(>3000:"0 0 10px rgba(37,99,235,0.30)"),(*:none)]
```

Ajuste de espaciado para hacer más liviano el estado alto:

```text
Lora: {{Medidor}}[letter-spacing=(>3000:0.05em),(*:0)]
```

Opacidad para un estado alto más atenuado:

```text
Lora: {{Medidor}}[opacity=(<500:1),(500..2000:1),(2000..3000:0.95),(>3000:0.85),(*:1)]
```

Ejemplo combinado con varias propiedades:

```text
Lora: {{Medidor}}[
color=(<500:#dc2626),(500..2000:#f59e0b),(2000..3000:#16a34a),(>3000:#2563eb),(*:#1f2937);
font-weight=(<500:800),(500..2000:700),(2000..3000:500),(>3000:400),(*:400);
font-size=(<500:1.35em),(500..2000:1.15em),(2000..3000:1em),(>3000:0.9em),(*:1em);
background-color=(<500:#fee2e2),(500..2000:#ffedd5),(2000..3000:#dcfce7),(>3000:#dbeafe),(*:transparent);
text-shadow=(>3000:"0 0 10px rgba(37,99,235,0.30)"),(*:none)
]
```

## Vista previa editable

En la vista previa del editor de overlays, las variables deberían verse como badges en lugar de mostrar el bloque crudo del modificador.

Comportamiento esperado:

- `{{Medidor}}` muestra un badge con `Medidor`.
- `{{Medidor}}[...]` muestra el mismo badge más un ícono de lápiz.
- El contenido dentro de `[...]` se oculta en la vista previa editable, pero permanece en la fuente guardada.

## Contrato recomendado de parsing

Para implementación, el backend debería tratar el bloque modificador como metadata del `dt-var` renderizado.

Entrada de autoría recomendada:

```text
{{temperature}}[color=(>@temperature_target+5:#dc2626),(*:#1f2937);font-weight=(>@temperature_target+5:700),(*:400)]
```

Salida HTML recomendada:

```html
<dt-var
    name="temperature"
    data-dt-modifiers='{"color":[{"condition":">@temperature_target+5","value":"#dc2626"},{"condition":"*","value":"#1f2937"}],"font-weight":[{"condition":">@temperature_target+5","value":"700"},{"condition":"*","value":"400"}]}'
></dt-var>
```

Comportamiento recomendado en runtime:

1. Mantener en JavaScript un mapa de valores numéricos crudos, indexado por nombre de variable.
2. Cuando una variable se refresca, actualizar primero su valor crudo antes de formatear el texto visible.
3. Re-evaluar cada `dt-var` con `data-dt-modifiers`.
4. Aplicar la primera regla coincidente por propiedad CSS.
5. Si una regla referencia otra variable todavía no disponible, omitir esa regla y seguir con la siguiente.
6. Limpiar solo las propiedades dinámicas administradas por el motor antes de reaplicarlas.

## Casos límite

- Si el valor de una variable no es numérico, las comparaciones numéricas no deberían coincidir. Debe usarse el fallback.
- Si se referencia otra variable que aún no tiene valor, el motor debería omitir esa regla y seguir buscando coincidencias.
- Si ninguna regla coincide y no existe fallback, el estilo actual debería quedar sin cambios.
- Si un valor CSS contiene `,` o `;`, conviene envolverlo en comillas dobles para que el parsing sea predecible.
- Usa decimales con punto, por ejemplo `1.5`, dentro de las reglas aunque luego la UI muestre comas.
- Los espacios deben ser opcionales pero inocuos. El parser debería hacer trim antes de evaluar cada regla.
- Las comparaciones deben hacerse contra valores numéricos crudos recién refrescados, no contra el texto formateado visible.

## Referencias

- [Gemelos digitales](./gemelos-digitales.md)
- [Métricas y fórmulas](../conceptos/metricas.md)
