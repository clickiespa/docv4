# Device-config identity and relationships

## REST scope

A child setup is a setup resource. It may have zero, one, or several
`setup_gateway_device_configs`; its GET therefore does not pick a config by
inference and does not return `409` merely because several exist.

```text
GET  /mgd/gateways/{gateway}/devices
GET  /mgd/gateways/{gateway}/devices/{child}
GET  /mgd/gateways/{gateway}/devices/{child}/configs
POST /mgd/gateways/{gateway}/devices/{child}/configs
GET  /mgd/gateways/{gateway}/devices/{child}/configs/{config}
PUT  /mgd/gateways/{gateway}/devices/{child}/configs/{config}
DELETE /mgd/gateways/{gateway}/devices/{child}/configs/{config}
```

`GET /devices` lists each child once and reports:

- child-setup identity and role;
- main installation and installed device, if any;
- `id_device_status` read directly from `devices`;
- `asset` only where the parent resource exposes it;
- `has_device_config` and `id_setup_gateway_device_config_ids`.

The `child_id_setup` query is only a collection filter. The singular GET
returns the child setup and its associations without choosing a
configuration. Fields of `setup_gateway_device_config` are not exposed as if
they were properties of the child.

## Keys and uniqueness

| Resource | Identity |
| --- | --- |
| Child setup | `id_setup` |
| Device config | `id_setup_gateway_device_config` under `child` |
| Device point | `id_setup_gateway_device_point`; the endpoint also uses `id_device_model_point` |
| Point group | `id_setup_gateway_point_group` |

A device-config belongs at once to the gateway, the component, and the child.
References must belong to the same gateway, and the component must be
compatible with the device model/protocol when that catalog rule is defined.

Relevant constraints:

- `device_key` is unique inside the gateway;
- the logical link `(id_setup_gateway, id_setup_gateway_component, id_setup)`
  identifies a single configuration;
- an `id_device_model_point` appears once per device-config;
- point groups and their links use their table primary keys and unique keys;
- a `409` reports a collision or incompatible relationship, never multiplicity
  of a collection GET.

The `multiple_devices_for_setup` rule is evaluated only when the domain
requires it and does not turn the association GET into an ambiguous
operation. Deletes that accept `recursive=true` reach only dependents of the
selected config and keep `setup_gateway_config_changes` as history.

## Points and groups

Points are operated only under an explicit config:

```text
/mgd/gateways/{gateway}/devices/{child}/configs/{config}/points
/mgd/gateways/{gateway}/devices/{child}/configs/{config}/points/{id_device_model_point}
```

Groups are operated under the devices tree, but `{group}` is always
`id_setup_gateway_point_group`. There are no name or `scope` resolvers for
singular operations. `everyday` is a group rule; it is not accepted as an
invented device-config rule.

## Eager write

Operational `POST`, `PUT`, and `DELETE` persist the device-config table and
return `202` with the log. Clickie already shows the new value; the worker
confirms `applied` without creating the row again. `cancelled` and `failed`
compensate internally. The importer is the only reverse path that rewrites an
already-effective JSON document.

The historical singular-config routes under `/devices/{child}` and the
aggregated point collections at that level do not exist.
