# Gateways

See [MGD canonical contract](mgd_canonical_contract.md) for the route map,
resource identity, response fields, uniqueness rules, and relationship
semantics.
See [MGD gateway configuration endpoints](mgd_gateways.md) for endpoint-level
request and response examples.
See [MGD device points](mgd_points.md) for explicit config point routes,
catalog IDs, overrides, locks, and reader projection rules.
See [MGD device-config identity](mgd_device_config_model.md) for child versus
config selectors and eager writes under `/devices/{child}/configs`.
See [MGD config-change states](mgd_config_change_states.md) for the state
machine, eager write, option-B promotion, reconciliation, compensation,
mutex, and queue contract.
See [MGD JSON projection](mgd_json_projection.md) for the assembled gateway
document and `applied`/`proposed` behavior.
See [MGD eager persistence](mgd_proposal_storage.md) for real resource IDs,
immutable history, cancellation, and API-owned compensation.
See [MGD gateway contract tests](mgd_gateway_smoke_tests.md) for route, state,
event, and importer coverage.
