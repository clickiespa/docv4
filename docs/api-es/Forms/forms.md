# formularios

Índice de puntos finales que exponen catálogos de formularios y definiciones de entrada.

- [Formularios de lista](#list-forms)
- [Obtener formulario](#get-form)
- [Listar entradas de formulario](#list-form-inputs)
- [Obtener entrada del formulario](#get-form-input)
- [Listar tipos de entrada de formulario](#list-form-input-types)

## Listar formularios
Devuelva los formularios paginados disponibles para la cuenta autenticada. Se requiere nivel de autorización 7.

### Punto final
```
GET /forms
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta
| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación. Predeterminado: 0 |
| `limit` | no | entero | Tamaño de página. Predeterminado: 100 |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" /forms?skip=0&limit=20
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "2 elements obtained successfully",
  "data": [
    {
      "id_form": 5,
      "id_environment": null,
      "id_account": 1,
      "form_name": "Widget config",
      "form_description": "Base form for widget configuration"
    }
  ],
  "context": {"query": {"skip": "0", "limit": "20"}},
  "instance": "/forms"
}
```

## Obtener formulario
Recuperar una única definición de formulario. Se requiere nivel de autorización 7.

### Punto final
```
GET /forms/{id_form}
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta
| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_form}` | Identificador de formulario | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" /forms/5
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_form": 5,
    "id_environment": null,
    "id_account": 1,
    "form_name": "Widget config",
    "form_description": "Base form for widget configuration"
  },
  "context": {"path": {"id_form": "5"}},
  "instance": "/forms/5"
}
```

## Listar entradas del formulario
Enumere las entradas que pertenecen a un formulario determinado. Se requiere nivel de autorización 7.

### Punto final
```
GET /form_inputs
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta
| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `id_form` | no | entero | Limitar el resultado a una forma específica |
| `skip` | no | entero | Desplazamiento para paginación. Predeterminado: 0 |
| `limit` | no | entero | Tamaño de página. Predeterminado: 100 |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" \
  "/form_inputs?id_form=5&skip=0&limit=50"
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "3 elements obtained successfully",
  "data": [
    {
      "id_form_input": 14,
      "id_form": 5,
      "id_input_type": 1,
      "input_name": "title",
      "input_description": "Widget title",
      "resource_type": null,
      "input_label": "Title",
      "input_default": null,
      "input_placeholder": "Line chart title",
      "input_select_options": null,
      "input_multiple": false,
      "input_attributes": null,
      "input_class": null,
      "input_order": 10,
      "input_required": true
    }
  ],
  "context": {"query": {"id_form": "5", "skip": "0", "limit": "50"}},
  "instance": "/form_inputs"
}
```

## Obtener entrada del formulario
Obtenga metadatos para una única entrada de formulario. Se requiere nivel de autorización 7.

### Punto final
```
GET /form_inputs/{id_form_input}
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetro de ruta
| Parámetro | Descripción | Tipo |
| --- | --- | --- |
| `{id_form_input}` | Identificador de entrada del formulario | entero |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" /form_inputs/14
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "Element obtained successfully",
  "data": {
    "id_form_input": 14,
    "id_form": 5,
    "id_input_type": 1,
    "input_name": "title",
    "input_description": "Widget title",
    "resource_type": null,
    "input_label": "Title",
    "input_default": null,
    "input_placeholder": "Line chart title",
    "input_select_options": null,
    "input_multiple": false,
    "input_attributes": null,
    "input_class": null,
    "input_order": 10,
    "input_required": true
  },
  "context": {"path": {"id_form_input": "14"}},
  "instance": "/form_inputs/14"
}
```

## Listar tipos de entrada de formulario
Devuelve el catálogo de tipos de entrada disponibles. Se requiere nivel de autorización 7.

### Punto final
```
GET /form_input_types
```

### Encabezados
| Encabezado | Requerido | Descripción | Tipo |
| --- | --- | --- | --- |
| `Authorization` | si | Clave API de tu perfil | cadena |
| `Account` | si | ID de cuenta de destino | entero |

### Parámetros de consulta
| Parámetro | Requerido | Tipo | Descripción |
| --- | --- | --- | --- |
| `skip` | no | entero | Desplazamiento para paginación. Predeterminado: 0 |
| `limit` | no | entero | Tamaño de página. Predeterminado: 100 |

### Solicitud de muestra
```bash
curl -H "Authorization: <API_KEY>" -H "Account: 1" /form_input_types?skip=0&limit=100
```

### Respuesta de muestra
```json
{
  "status": "success",
  "message": "11 elements obtained successfully",
  "data": [
    {"id_input_type": 1, "type_name": "text"},
    {"id_input_type": 2, "type_name": "select"}
  ],
  "context": {"query": {"skip": "0", "limit": "100"}},
  "instance": "/form_input_types"
}
```