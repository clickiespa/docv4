---
title: "Dynamic overlay variables"
version: "v4"
last_updated: "2026-04-01"
owner: "Product"
status: "stable"
---

# Dynamic overlay variables

This guide explains how to write overlay variables and dynamic style modifiers in **Digital twins** content so authors can build value-aware labels without editing JavaScript or CSS.

:::module-strip
Overlays can react to the current value of a variable or compare it against other variables to change color, font weight, background or other CSS properties in real time.
:::

:::info
This syntax applies to text overlay content inside the **Digital twins** editor. The `[...]` block does not replace the value itself: it works as dynamic style metadata for the rendered variable.
:::

## Main workflow

:::steps
1. **Start with a plain variable**: use `{{variable_name}}` to print the current value.
2. **Add the modifier block**: write `[...]` immediately after the variable when style must react to the value.
3. **Define CSS properties**: inside the block, declare one or more properties using `property=(condition:value)`.
4. **Order rules from most specific to most general**: the first matching rule wins, so specific cases should come first.
5. **Use references when needed**: use `@other_variable` when the comparison depends on another dynamic value.
:::

## Basic variable

Use this format when you only want to print the current value:

```text
{{tank_level}}
```

The current Digital Twin core uses double braces. Do not use single braces for this syntax.

Example inside an overlay:

```text
Tank level: {{tank_level}} %
```

## Dynamic modifier block

Place the modifier block immediately after the variable:

```text
{{variable_name}}[css-property=(condition:css-value),(condition:css-value)]
```

You can define multiple CSS properties by separating them with `;`:

```text
{{variable_name}}[
color=(condition:css-value),(condition:css-value);
font-weight=(condition:css-value),(condition:css-value)
]
```

## Reading the syntax in plain language

- `{{tank_level}}` means "print the value of `tank_level`".
- `color=` means "apply text color".
- `(>80:red)` means "if the value is greater than 80, use red".
- `(*:#1f2937)` means "in every other case, use this fallback value".

## Rule order

Rules are evaluated from left to right. The first matching rule wins.

Practical priority rule:

- Put the most specific rule first.
- Put broader rules later.
- Use `*` last as the fallback.
- The `*` rule should only cover cases not matched by previous rules.

Expected example:

```text
{{Medidor}}[color=(<500:red),(500..2000:orange),(*:#1f2937)]
```

If `Medidor` is `300`, the expected result is `red`.

## Supported conditions

The current variable is always the left side of the comparison, so you only write the threshold or reference value on the right side.

| Format | Meaning | Example |
| --- | --- | --- |
| `>100` | Greater than a fixed number | `(>100:red)` |
| `>=100` | Greater than or equal to a fixed number | `(>=100:red)` |
| `<100` | Less than a fixed number | `(<100:blue)` |
| `<=100` | Less than or equal to a fixed number | `(<=100:blue)` |
| `=100` | Exactly equal to a fixed number | `(=100:green)` |
| `!=100` | Different from a fixed number | `(!=100:orange)` |
| `50..100` | Inclusive range from 50 to 100 | `(50..100:blue)` |
| `>50 & <100` | Open range between 50 and 100 | `(>50 & <100:blue)` |
| `>@limit` | Compare against another variable | `(>@limit:red)` |
| `>=@limit*1.1` | Compare against another variable with a multiplier | `(>=@limit*1.1:red)` |
| `<=@target+5` | Compare against another variable with an offset | `(<=@target+5:green)` |
| `@low..@high+10` | Inclusive range based on two variable references | `(@low..@high+10:blue)` |

## Reference values

The right side of a condition can be:

- A fixed number such as `100`, `75.5`, or `0`.
- Another variable using `@variable_name`.
- Another variable plus a simple adjustment such as `@limit+5`, `@limit-5`, `@limit*1.1`, or `@limit/2`.
- A short arithmetic chain such as `@target*1.1+5`.

To keep authoring simple, avoid parentheses inside conditions. If you use a short chain, evaluate it from left to right.

## Recommended CSS properties

Use standard CSS property names in kebab case:

- `color`
- `background-color`
- `font-weight`
- `font-size`
- `opacity`
- `border-color`
- `text-shadow`

## Copy-and-paste examples

Simple alarm colors:

```text
{{tank_level}}[color=(>100:red),(50..100:blue),(*:#1f2937)]
```

Expected result:

- Above 100: red
- From 50 to 100: blue
- Any other value: dark gray

Compare against a limit variable:

```text
{{pressure}}[color=(>@pressure_limit:#dc2626),(*:#16a34a)]
```

Expected result:

- Higher than `pressure_limit`: red
- Any other case: green

Compare against another variable with an extra margin:

```text
{{temperature}}[color=(>@temperature_target+5:#dc2626),(*:#1f2937)]
```

Expected result:

- More than 5 units above `temperature_target`: red
- Any other case: dark gray

Use multiple CSS properties at the same time:

```text
{{humidity}}[
color=(>80:#dc2626),(<30:#2563eb),(*:#1f2937);
font-weight=(>80:700),(<30:700),(*:400);
background-color=(>80:#fee2e2),(<30:#dbeafe),(*:transparent)
]
```

Expected result:

- High humidity: red, bold, light red background
- Low humidity: blue, bold, light blue background
- Normal humidity: neutral styling

Compare against a dynamic operating band:

```text
{{flow}}[color=(@flow_min..@flow_max:#16a34a),(*:#dc2626)]
```

Expected result:

- Inside the allowed range: green
- Outside the allowed range: red

Use an open range:

```text
{{rpm}}[color=(>900 & <1200:#2563eb),(*:#1f2937)]
```

Expected result:

- Strictly between 900 and 1200: blue
- Any other case: dark gray

## Lora / Medidor examples

For a metric that moves between `0` and `4000`, these patterns are useful as copy-and-paste starting points.

Color by operating band:

```text
Lora: {{Medidor}}[color=(<500:#dc2626),(500..2000:#f59e0b),(2000..3000:#16a34a),(>3000:#2563eb),(*:#1f2937)]
```

Font weight by severity:

```text
Lora: {{Medidor}}[font-weight=(<500:800),(500..2000:700),(2000..3000:500),(>3000:400),(*:400)]
```

Font size by value band:

```text
Lora: {{Medidor}}[font-size=(<500:1.35em),(500..2000:1.15em),(2000..3000:1em),(>3000:0.9em),(*:1em)]
```

Background color as a status pill:

```text
Lora: {{Medidor}}[background-color=(<500:#fee2e2),(500..2000:#ffedd5),(2000..3000:#dcfce7),(>3000:#dbeafe),(*:transparent)]
```

Soft glow when the value is very high:

```text
Lora: {{Medidor}}[text-shadow=(>3000:"0 0 10px rgba(37,99,235,0.30)"),(*:none)]
```

Spacing tweak to make the high-value state feel lighter:

```text
Lora: {{Medidor}}[letter-spacing=(>3000:0.05em),(*:0)]
```

Opacity for a more muted high-value state:

```text
Lora: {{Medidor}}[opacity=(<500:1),(500..2000:1),(2000..3000:0.95),(>3000:0.85),(*:1)]
```

Combined example with several properties:

```text
Lora: {{Medidor}}[
color=(<500:#dc2626),(500..2000:#f59e0b),(2000..3000:#16a34a),(>3000:#2563eb),(*:#1f2937);
font-weight=(<500:800),(500..2000:700),(2000..3000:500),(>3000:400),(*:400);
font-size=(<500:1.35em),(500..2000:1.15em),(2000..3000:1em),(>3000:0.9em),(*:1em);
background-color=(<500:#fee2e2),(500..2000:#ffedd5),(2000..3000:#dcfce7),(>3000:#dbeafe),(*:transparent);
text-shadow=(>3000:"0 0 10px rgba(37,99,235,0.30)"),(*:none)
]
```

## Editable preview

In the overlay editor preview, variables should appear as badges instead of showing the raw modifier block.

Expected behavior:

- `{{Medidor}}` shows a badge with `Medidor`.
- `{{Medidor}}[...]` shows the same badge plus a pencil icon.
- The content inside `[...]` is hidden in the editable preview, but remains part of the saved source.

## Recommended parsing contract

For implementation, the backend should treat the modifier block as metadata for the rendered `dt-var`.

Recommended authoring input:

```text
{{temperature}}[color=(>@temperature_target+5:#dc2626),(*:#1f2937);font-weight=(>@temperature_target+5:700),(*:400)]
```

Recommended HTML output:

```html
<dt-var
    name="temperature"
    data-dt-modifiers='{"color":[{"condition":">@temperature_target+5","value":"#dc2626"},{"condition":"*","value":"#1f2937"}],"font-weight":[{"condition":">@temperature_target+5","value":"700"},{"condition":"*","value":"400"}]}'
></dt-var>
```

Recommended runtime behavior:

1. Keep a raw numeric value map in JavaScript, keyed by variable name.
2. When a variable refreshes, update its raw value before formatting the visible text.
3. Re-evaluate every `dt-var` with `data-dt-modifiers`.
4. Apply the first matching rule per CSS property.
5. If a rule references another variable that is still unavailable, skip that rule and continue with the next one.
6. Clear only the dynamic properties managed by the modifier engine before reapplying them.

## Edge cases

- If a variable value is not numeric, numeric comparisons should not match. The fallback should be used instead.
- If another variable is referenced but still has no value, the engine should skip that rule and continue searching.
- If no rule matches and there is no fallback, the current style should remain unchanged.
- If a CSS value contains `,` or `;`, wrap it in double quotes so parsing stays predictable.
- Use decimals with a dot, for example `1.5`, inside rules even if the UI later displays commas.
- Spaces should be optional but harmless. The parser should trim surrounding spaces before evaluating each rule.
- Comparisons should use freshly refreshed raw numeric values, not the formatted text shown on screen.

## References

- [Digital twins](./gemelos-digitales.md)
- [Metrics and formulas](../conceptos/metricas.md)
