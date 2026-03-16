# tipos

## Puntos finales
- [Listar grupos de tipos disponibles](#list-available-type-groups)
- [Tipos de monitores](#monitor-types)
- [Tipos de comunicación](#communication-types)
- [Monitorear tipos de disparadores](#monitor-trigger-types)
- [Monitorear estados](#monitor-statuses)
- [Fuentes de métricas](#metric-sources)
- [Tipos de widgets](#widget-types)
- [Tipos de entrada de formulario](#form-input-types)

Puntos finales de utilidad que devuelven listas de tipos predefinidos.

Un tipo es un tipo particular de entidad, que se utiliza en la creación o modificación de otras entidades para categorizarlas. Existe un tipo de entidad para algunas entidades, la mayoría de ellas siguen el mismo patrón de nomenclatura:
para la entidad "entidad_a", su tipo de entidad se llama "entidad_a_tipo". Por ejemplo, para los activos, su tipo de entidad se llama active_types y así sucesivamente.

## Listar grupos de tipos disponibles

### Punto final
```
GET /types
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types
```

### Respuesta de muestra
```json
["monitors","communications","monitor_triggers","monitor_statuses","metric_sources","widgets","form_inputs","metric_events","assets"]
```

## Tipos de monitores

### Punto final
```
GET /types/monitors
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/monitors
```

### Respuesta de muestra
```json
["status","threshold","anomaly"]
```

## Tipos de comunicación

### Punto final
```
GET /types/communications
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/communications
```

### Respuesta de muestra
```json
["email","webhook","sms"]
```

## Monitorear tipos de disparadores

### Punto final
```
GET /types/monitor_triggers
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/monitor_triggers
```

### Respuesta de muestra
```json
["above","below","deadman"]
```

## Monitorear estados

### Punto final
```
GET /types/monitor_statuses
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/monitor_statuses
```

### Respuesta de muestra
```json
["enabled","disabled","snoozed"]
```

## Fuentes de métricas

### Punto final
```
GET /types/metric_sources
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/metric_sources
```

### Respuesta de muestra
```json
["device","asset"]
```

## Tipos de widgets

### Punto final
```
GET /types/widgets
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/widgets
```

### Respuesta de muestra
```json
["chart","number","table"]
```

## Tipos de entrada de formulario

### Punto final
```
GET /types/form_inputs
```

### Encabezados

| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API generada desde su perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: <ID_ACCOUNT>" /types/form_inputs
```

### Respuesta de muestra
```json
["text","number","select"]
```