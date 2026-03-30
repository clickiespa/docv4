# Guía de documentación API v4

Bienvenido al centro de documentación de API v4.

Esta página está diseñada como una guía orientada al cliente para que pueda encontrar rápidamente el archivo de documentación correcto, comprender dónde está documentado cada grupo de endpoints y navegar por la plataforma con confianza.

## Referencias rápidas
- [Colección cartero (producción v4)](lambda-api-v4-v4.postman_collection.json): ejemplos de solicitudes ejecutables alineados con la superficie API `/v4`.

## Orden de lectura recomendado
1. Comience aquí: [Comenzando con v4](Getting_started_with_v4/getting_started.md)
2. Continúe con los grupos de endpoints a continuación según su caso de uso.
3. Consulte las últimas actualizaciones en [Registro de cambios](changelog.md).

## Documentación de endpoint por etiqueta de ruta

### `assets`
- [Endpoints de activos](Assets/assets.md) — `GET /assets`, `POST /assets`, `GET /assets/{id_asset}`, `PUT /assets/{id_asset}`, `DELETE /assets/{id_asset}`.

### `collaborators`
- [Endpoints de colaboradores](Collaborators/collaborators.md) — `GET /collaborators`, `POST /collaborators`, `GET /collaborators/{id_user}`, `PUT /collaborators/{id_user}`, `DELETE /collaborators/{id_user}`.

### `dashboards`
- [Endpoints de paneles](Dashboards/dashboards.md): paneles de control, widgets de panel, tipos de widgets y operaciones relacionadas.
- [Endpoints de widgets](Dashboards/widgets.md): catálogo de widgets y operaciones de widgets del panel.

### `data`
- [Ingestión y eliminación de datos](Metrics_and_data/data_ingestion_and_deletion.md): ingesta y eliminación de puntos de datos para `/metrics/{metric_identifier}/datapoints`.
- [Notas de datos heredados](Metrics_and_data/data_no_usar.md) — archivo de referencia histórica.

### `devices`
- [Endpoints de dispositivos](Devices/devices.md) — dispositivo CRUD y operaciones relacionadas.
- [Endpoints de modelos de dispositivos](Devices/device_models.md): modelos de dispositivos, tipos de modelos y fabricantes.
- [Endpoints de configuración de dispositivos](Setups/device_setups.md): endpoints de configuración/vinculación de dispositivos.
- [Endpoints de inventarios](Setups/inventories.md) — operaciones de inventario.

### `eav`
- [Endpoints de entidades](Entities/eav_entities.md): endpoints del catálogo de entidades EAV.

### `filters`
- [Filtra endpoints](Filters/filters.md) — `GET /filters`.

### `forms`
- [Endpoints de formularios](Forms/forms.md): formularios, entradas de formularios y tipos de entradas de formularios.

### `global_resources`
- [Endpoints de idiomas](Global_resources/languages.md)
- [Endpoints de zonas horarias](Global_resources/time_zones.md)
- [Endpoints de iconos](Global_resources/icons.md)
- [Endpoints de patrones de tiempo](Global_resources/time_patterns.md)

### `metrics`
- [Endpoints de métricas](Metrics_and_data/metrics.md) — métricas CRUD y operaciones métricas relacionadas.
- [Configurar endpoints de métricas](Setups/setup_metrics.md): endpoints de relación de configuración/métrica.

### `monitoring`
- [Monitorea endpoints](Monitors/monitors.md): monitorea y monitorea las operaciones de activación.
- [Supervisar el endpoint de las plantillas](Monitors/monitors.md#monitor-templates) — `GET /monitor_templates`.
- [Endpoint del monitor de tierra](Monitors/ground_monitor.md) — `GET /ground_monitor`.

### `newsletter`
- [Endpoints de plantillas](Global_resources/templates.md) — operaciones CRUD de plantilla.

### `scope`
- [Endpoints de cuentas](Scope/accounts.md)
- [Endpoints de entornos](Scope/environments.md)
- [Endpoints de roles](Scope/roles.md)
- [Endpoints de autorización](Scope/clearances.md)
- [Endpoints de relaciones](Scope/relationships.md)

### `search`
- [Endpoint de búsqueda de métricas](Search/Metrics.md) — `POST /search/metrics`.

### `setups`
- [Configura endpoints](Setups/setups.md)
- [Configurar endpoints de métricas](Setups/setup_metrics.md)
- [Endpoints de configuración de dispositivos](Setups/device_setups.md)

### `types`
- [Tipos de endpoints](Types/types.md)
- [Endpoints de categorías de activos](Types/asset_categories.md)
- [Endpoints de eventos de métricas](Types/metric_events.md)

### `uoms`
- [Endpoints de UOM](Uoms/uoms.md)
- [Endpoints de métodos](Global_resources/methods.md) — métodos de agregación e interpolación.

## Guías de endpoints específicas de la puerta de enlace

- [Endpoint de estado de la puerta de enlace](gateways/health.md) — `GET /health`.
- [Endpoint de dispositivos de puerta de enlace](gateways/devices.md) — `GET /devices` con notas de contrato de solicitud/respuesta centradas en la puerta de enlace.
- [Endpoints de acciones de puerta de enlace](gateways/actions.md) — `GET /devices/{identifier}/actions`, `POST /devices/{identifier}/actions`.
- [Endpoints de trabajos de puerta de enlace](gateways/jobs.md) — `GET /jobs/{job_id}`, `POST /jobs/{job_id}/cancel`, `GET /devices/{identifier}/jobs`.
- [Endpoints de registros de puerta de enlace](gateways/logs.md) — `GET /devices/{identifier}/logs`, `GET /devices/{identifier}/disk`, `GET /devices/{identifier}/backup/coverage`.

## Referencias adicionales
- [Registro de cambios](changelog.md)