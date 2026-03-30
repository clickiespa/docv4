# Registro de cambios

Las notas de la versión están organizadas por etiqueta FastAPI para cada versión de API expuesta en `/docs`.

## Versión 4.3.4 (2026-03-12)

### seguimiento
- Se actualizó la validación del activador del monitor, por lo que `trigger_parameters.id_users` debe ser una matriz de cadenas al crear o actualizar `/monitors/{id_monitor}/triggers`. Las cadenas separadas por comas ahora se rechazan con una respuesta `400`.

### documentos
- Se actualizaron ejemplos de documentación del activador del monitor para mostrar `id_users` como `array[string]`, cargas útiles de Postman del activador del monitor actualizadas y notas de cobertura de la hoja de ruta alineadas para la validación del activador.

## Versión 4.3.3 (2026-02-17)

### filtros
- Se agregó `GET /filters` para enumerar los registros con alcance de cuenta/entorno de la tabla `filters`.

### métricas
- Se actualizó `/metrics` para crear/actualizar la validación de carga útil para que `metric_force_availability` acepte modos enteros `0`, `1` o `2` en lugar de booleanos.
- Serialización de métricas actualizada para exponer `metric_force_availability` como modo entero en las respuestas API.

### documentos
- Navegación de documentación refinada para clientes, incluido un punto de entrada a la bandeja de entrada de documentos y métricas/referencias de búsqueda actualizadas, además de alineación de la hoja de ruta.
- Se agregaron filtros para la documentación del endpoint, colecciones de Postman actualizadas, cobertura de la hoja de ruta actualizada y páginas de inicio de documentación sincronizadas.
- Se actualizó `docs/README.md` para alinear el índice de etiquetas de ruta con la superficie API actual, incluida la cobertura explícita para `GET /monitor_templates`.
- Se agregó una sección de guías de endpoints de puerta de enlace en `docs/README.md` que enumera la documentación de estado, dispositivos, acciones, trabajos y registros.
- Se movió el enlace de la colección Postman de producción v4 al comienzo de `docs/README.md` como referencia rápida.
- Sincronicé la página de inicio raíz `README.md` con enlaces de índice de documentación para que ambos puntos de entrada apunten a las mismas guías principales y de puerta de enlace.

## Versión 4.3.2 (2026-01-25)

### panel_widgets
- Manejo ampliado de la configuración del widget del panel para admitir árboles form_data anidados con formularios principales, subformularios y actualizaciones y eliminaciones compatibles con id_form_data.
- Los valores predeterminados de configuración del widget ahora generan las entradas requeridas y al menos una entrada de subformulario cuando no se proporciona ninguna carga útil.
- La validación de la configuración del widget del panel ahora aplica las entradas requeridas y las restricciones de selección de opciones en las cargas útiles de creación.
- Se corrigió la persistencia del subformulario para que las entradas anidadas almacenen el identificador form_data principal como su `id_resource`.
- Análisis de form_data reforzado para manejar JSON con doble codificación para que los valores de configuración almacenados se representen correctamente.
- Rechaza los campos config_data que no están definidos en las entradas del formulario para evitar el almacenamiento de claves desconocidas.

### documentos
- Se actualizó la documentación del widget del panel, se actualizaron los ejemplos de la colección Postman y se alinearon las notas de cobertura de la hoja de ruta.

## Versión 4.3.1 (2026-01-21)

### seguimiento
- Se agregó manejo `trigger_parameters` para los activadores del monitor, almacenando la carga útil en datos del formulario codificados en el formulario del tipo de activador.
- Expuesto `GET /monitor_templates` a la lista de plantillas de notificación listas para monitorear.

### documentos
- Se actualizó la documentación y los ejemplos del activador del monitor, se agregó documentación de la plantilla del monitor, se actualizó la colección Postman, se actualizó la cobertura de la hoja de ruta y se alinearon las cargas útiles de muestra del activador.

## Versión 4.3.0 (2026-01-15)

### cuentas
- Las sesiones de Liquidación 1 pueden configurar o actualizar `id_environment` al crear o actualizar cuentas; otras autorizaciones permanecen limitadas al entorno de la sesión.
- Las respuestas de la cuenta ahora incluyen metadatos del entorno junto con `id_environment`.

### entornos
- Se agregó `GET /environments` para enumerar los entornos disponibles para la sesión autenticada.### buscar
- `/search/metrics` ahora traduce cargas útiles de filtro no válidas en respuestas `400` en lugar de errores `500` no detectados, lo que muestra comentarios de validación cuando se utilizan incorrectamente las relaciones u operadores.
- `/search/metrics` ahora trata las cargas útiles `resource_filter` faltantes o vacías como solicitudes de solo metadatos, omitiendo uniones de relaciones y cláusulas `DISTINCT` a menos que se proporcione explícitamente el alcance de los recursos.
- `/search/metrics` ahora enruta solicitudes de solo metadatos a través de una ruta de consulta dedicada mientras que las búsquedas con alcance de recursos se unen a `resource_relationships`, evitando errores cuando se omite `resource_filter`.
- `/search/metrics` ahora encapsula el filtrado `resource_relationships` dentro de la ruta de consulta con ámbito de recursos, dejando a `get_metrics_with_filters` centrado en la validación y el envío compartidos.
- `/search/metrics` ahora crea consultas de parámetros base por separado de las consultas con ámbito de recursos, aplicando uniones de relaciones solo después de construir la consulta base.
- `/search/metrics` ahora descarta `return_fields` desconocido y por defecto utiliza conjuntos de campos completos cuando ninguno es válido, mientras que solo `id_resource` está bloqueado para el filtrado de parámetros.
- `/search/metrics` ya no selecciona un literal `id_resource` para solicitudes de solo metadatos y solo agrega `id_resource` cuando los filtros de recursos están activos para evitar errores de selección de columnas mixtas.
- `/search/metrics` ahora siempre incluye `id_resource` cuando se proporciona `resource_filter`, independientemente de `return_fields`, mientras que las consultas de solo metadatos lo omiten por completo.

### buscar
- Se agregó `POST /search/metrics` bajo la etiqueta `search` para filtrar métricas por activos vinculados o metadatos de métricas con paginación y campos de retorno personalizables. El cruce de relaciones se aplica solo cuando `resource_type` es `asset`.
- La búsqueda de métricas ahora puede atravesar `resource_relationships` en cualquier dirección usando un indicador `direction` explícito que resuelve los valores `resource_type` de `eav_entities` y devuelve valores `id_resource` que reflejan el `resource_ids` solicitado, de manera predeterminada en la dirección `child` cuando se omite.
- Los filtros de recursos aplican los operadores `in` o `not_in`, mientras que los filtros de parámetros se validan con el conjunto completo de operadores admitidos para evitar que las comparaciones no admitidas lleguen al generador de consultas.
- El identificador de entidad de métricas se fija en `7` durante el filtrado de relaciones para evitar búsquedas redundantes al evaluar consultas con ámbito de recursos.

### documentos
- Documenté el nuevo endpoint de búsqueda de métricas, actualicé la colección Postman y actualicé la cobertura de la hoja de ruta para el filtrado de métricas.

## Versión 4.2.0 (2025-12-15)


Esta versión consolida los cambios incluidos en la última combinación `development` → `main` (comenzando con la confirmación de combinación `a09eb62`). Utilice la lista de confirmación de esa fusión como fuente de verdad para cualquier nota de versión de seguimiento o ajustes del registro de cambios. Para las actualizaciones de la documentación 4.2.x, consulte la solicitud de extracción de fusión principal de desarrollo consolidado → para la versión de destino en lugar de los PR de características individuales para que las herramientas puedan recopilar mediante programación las confirmaciones relevantes desde un único punto de entrada.

### formularios
- Expone endpoints del catálogo para enumerar formularios y recuperar definiciones individuales (autorización 7 para operaciones de lectura).
- Los registros de formulario incluyen metadatos de alcance de cuenta/entorno además de nombres descriptivos y descripciones opcionales.

### formulario_entradas
- Enumera y recupera definiciones de entrada con alcance en un formulario (lea la autorización 7).
- Los metadatos de entrada cubren etiquetas, valores predeterminados, marcadores de posición, opciones de selección, indicadores de multiplicidad, requisitos de validación y metadatos de atributos utilizados por la representación de formularios personalizados.

### tipos_de_entrada_de_formulario
- Proporciona el catálogo de representadores de entrada (lea la autorización 7), como texto, selección, área de texto, selectores de recursos, formularios anidados y otras primitivas de la interfaz de usuario.### paneles de control
- Admite la creación y eliminación con autorización 2, actualizaciones con autorización 5 y lecturas con autorización 8.
- Los paneles almacenan relaciones principales opcionales (`id_parent_dashboard`) y metadatos de color; El filtrado archivado es opcional para autorizaciones 1 y 2 y el valor predeterminado es no archivado para autorizaciones superiores.

### panel_widgets
- Gestiona instancias de widgets del panel: creación/eliminación con autorización 6, lectura/actualización con autorización 7.
- La configuración del widget persiste en `form_data`; las respuestas de lista omiten `config_data`, mientras que las respuestas detalladas incluyen la configuración almacenada.
- Las actualizaciones parciales de `config_data` se fusionan con los valores existentes para que las claves no especificadas permanezcan intactas.

### widgets
- Endpoints del catálogo para widgets: creación/eliminación con autorización 1, actualizaciones con autorización 2, lecturas con autorización 7.
- Los widgets se vinculan a tipos de widgets y formularios opcionales utilizados para generar cargas útiles de configuración de widgets del panel.

### tipos de widgets
- Catálogo de solo lectura de definiciones de tipos de widgets (autorización 7) utilizado para clasificar widgets.

### cuentas
- Las sesiones de autorización 1 pueden enumerar o recuperar cualquier cuenta sin estar limitadas a las membresías o al encabezado `Account`, mientras que las autorizaciones superiores permanecen limitadas a sus cuentas vinculadas.
- La recuperación de cuentas mantiene salvaguardas de filtrado de archivos para roles superiores y alinea la paginación con los patrones del repositorio compartido.

### colaboradores
- La autorización 1 puede administrar colaboradores entre cuentas (crear, actualizar, eliminar) sin estar limitado al contexto actual del encabezado `Account`.
- Las API de colaborador ahora devuelven la carga útil del colaborador después de las operaciones de creación/actualización e incluyen consistentemente campos de marca de tiempo que coinciden con el esquema de la base de datos.

### usuarios
- Las asociaciones de cuentas de usuario alinean los valores predeterminados de `created_at` con las marcas de tiempo administradas por la base de datos para evitar que los valores proporcionados por el cliente anulen los valores predeterminados del servidor.