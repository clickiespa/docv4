# Guía de documentación API v4

Bienvenido al centro de documentación de API v4.

Esta página está diseñada como una guía orientada al cliente para que pueda encontrar rápidamente el archivo de documentación correcto, comprender dónde está documentado cada grupo de terminales y navegar por la plataforma con confianza.

## Referencias rápidas
- [Colección cartero (producción v4)](lambda-api-v4-v4.postman_collection.json): ejemplos de solicitudes ejecutables alineados con la superficie API `/v4`.

## Orden de lectura recomendado
1. Comience aquí: [Comenzando con v4](Getting_started_with_v4/getting_started.md)
2. Continúe con los grupos de puntos finales a continuación según su caso de uso.
3. Consulte las últimas actualizaciones en [Registro de cambios](changelog.md).

## Documentación de punto final por etiqueta de ruta

### `assets`
- [Puntos finales de activos](Assets/assets.md) — `GET /assets`, `POST /assets`, `GET /assets/{id_asset}`, `PUT /assets/{id_asset}`, `DELETE /assets/{id_asset}`.

### `collaborators`
- [Puntos finales de colaboradores](Collaborators/collaborators.md) — `GET /collaborators`, `POST /collaborators`, `GET /collaborators/{id_user}`, `PUT /collaborators/{id_user}`, `DELETE /collaborators/{id_user}`.

### `dashboards`
- [Puntos finales de paneles](Dashboards/dashboards.md): paneles de control, widgets de panel, tipos de widgets y operaciones relacionadas.
- [Puntos finales de widgets](Dashboards/widgets.md): catálogo de widgets y operaciones de widgets del panel.

### `data`
- [Ingestión y eliminación de datos](Metrics_and_data/data_ingestion_and_deletion.md): ingesta y eliminación de puntos de datos para `/metrics/{metric_identifier}/datapoints`.
- [Notas de datos heredados](Metrics_and_data/data_no_usar.md) — archivo de referencia histórica.

### `devices`
- [Puntos finales de dispositivos](Devices/devices.md) — dispositivo CRUD y operaciones relacionadas.
- [Puntos finales de modelos de dispositivos](Devices/device_models.md): modelos de dispositivos, tipos de modelos y fabricantes.
- [Puntos finales de configuración de dispositivos](Setups/device_setups.md): puntos finales de configuración/vinculación de dispositivos.
- [Puntos finales de inventarios](Setups/inventories.md) — operaciones de inventario.

### `eav`
- [Puntos finales de entidades](Entities/eav_entities.md): puntos finales del catálogo de entidades EAV.

### `filters`
- [Filtra puntos finales](Filters/filters.md) — `GET /filters`.

### `forms`
- [Puntos finales de formularios](Forms/forms.md): formularios, entradas de formularios y tipos de entradas de formularios.

### `global_resources`
- [Puntos finales de idiomas](Global_resources/languages.md)
- [Puntos finales de zonas horarias](Global_resources/time_zones.md)
- [Puntos finales de iconos](Global_resources/icons.md)
- [Puntos finales de patrones de tiempo](Global_resources/time_patterns.md)

### `metrics`
- [Puntos finales de métricas](Metrics_and_data/metrics.md) — métricas CRUD y operaciones métricas relacionadas.
- [Configurar puntos finales de métricas](Setups/setup_metrics.md): puntos finales de relación de configuración/métrica.

### `monitoring`
- [Monitorea puntos finales](Monitors/monitors.md): monitorea y monitorea las operaciones de activación.
- [Supervisar el punto final de las plantillas](Monitors/monitors.md#monitor-templates) — `GET /monitor_templates`.
- [Punto final del monitor de tierra](Monitors/ground_monitor.md) — `GET /ground_monitor`.

### `newsletter`
- [Puntos finales de plantillas](Global_resources/templates.md) — operaciones CRUD de plantilla.

### `scope`
- [Puntos finales de cuentas](Scope/accounts.md)
- [Puntos finales de entornos](Scope/environments.md)
- [Puntos finales de roles](Scope/roles.md)
- [Puntos finales de autorización](Scope/clearances.md)
- [Puntos finales de relaciones](Scope/relationships.md)

### `search`
- [Punto final de búsqueda de métricas](Search/Metrics.md) — `POST /search/metrics`.

### `setups`
- [Configura puntos finales](Setups/setups.md)
- [Configurar puntos finales de métricas](Setups/setup_metrics.md)
- [Puntos finales de configuración de dispositivos](Setups/device_setups.md)

### `types`
- [Tipos de puntos finales](Types/types.md)
- [Puntos finales de categorías de activos](Types/asset_categories.md)
- [Puntos finales de eventos de métricas](Types/metric_events.md)

### `uoms`
- [Puntos finales de UOM](Uoms/uoms.md)
- [Puntos finales de métodos](Global_resources/methods.md) — métodos de agregación e interpolación.

## Guías de terminales específicas de la puerta de enlace

- [Punto final de estado de la puerta de enlace](gateways/health.md) — `GET /health`.
- [Punto final de dispositivos de puerta de enlace](gateways/devices.md) — `GET /devices` con notas de contrato de solicitud/respuesta centradas en la puerta de enlace.
- [Puntos finales de acciones de puerta de enlace](gateways/actions.md) — `GET /devices/{identifier}/actions`, `POST /devices/{identifier}/actions`.
- [Puntos finales de trabajos de puerta de enlace](gateways/jobs.md) — `GET /jobs/{job_id}`, `POST /jobs/{job_id}/cancel`, `GET /devices/{identifier}/jobs`.
- [Puntos finales de registros de puerta de enlace](gateways/logs.md) — `GET /devices/{identifier}/logs`, `GET /devices/{identifier}/disk`, `GET /devices/{identifier}/backup/coverage`.

## Referencias adicionales
- [Registro de cambios](changelog.md)