# AP-v4 agent context pack

This pack is the starting point for an AI agent that must answer questions
about, implement against, or document the Clickie API v4. It is intentionally a
navigation layer over the endpoint guides, not a second undocumented API
specification.

## Use this pack first

1. Classify the request by intent and route family in
   [`endpoint-routing.md`](endpoint-routing.md).
2. Open the linked endpoint guide before proposing a path, payload, query
   parameter, response shape, status code, or clearance.
3. For gateway configuration, read the MGD canonical contract and then the
   generated endpoint reference. The state, projection, persistence, and point
   guides are required when the question involves those behaviors.
4. Use [`source-map.md`](source-map.md) when documentation and implementation
   appear to disagree. It identifies which repository and file is authoritative
   for each kind of question.
5. Search the exact endpoint heading or HTTP path in the reference copy before
   searching the whole repository. The reference copy is included in the ZIP
   under `reference/docs/`.

## Stable API context

- Production base URL: `https://api.clickie.io/v4/`.
- Documentation paths are relative to that base URL. Do not repeat the host in
  endpoint links or invent a `/v4/v4` prefix.
- Authenticated requests normally require `Authorization` and `Account`.
  `Account` selects the account scope; it is not interchangeable with an
  arbitrary account ID in a request body.
- Standard responses use the envelope `status`, `message`, `data`, `context`,
  and `instance`. Individual endpoint pages may document intentionally different
  response details or status codes.
- The active implementation is maintained in the `clickie-platform` repository.
  The historical `API-V4/` directory in this repository is useful as context
  only and must not be treated as the current implementation source.

## What is in the package

| File | Purpose |
| --- | --- |
| `README.md` | Agent workflow, authority rules, and invariant API context. |
| `endpoint-routing.md` | Intent-to-documentation routing for every active AP-v4 route family. |
| `source-map.md` | Mapping between docs, active implementation, tests, and generated artifacts. |
| `reference/docs/` | Snapshot of the complete endpoint documentation tree, including MGD and the Postman collection copy. |

The ZIP is a portable snapshot. The Markdown files in the repository remain the
maintained source for the published documentation; regenerate or replace the
ZIP when endpoint documentation changes.

## Agent behavior rules

- Do not guess an endpoint from a similar resource. Follow the route family map
  and open the exact endpoint section.
- Do not assume CRUD symmetry. Some resources are read-only, some use special
  subroutes, and some `/data` routes are delegated to another Lambda.
- Do not infer a clearance from the HTTP verb or resource name. Read the
  endpoint guide and its implementation dependency chain.
- Do not copy an example identifier, account, token, secret, or production
  payload into code or tests. Examples are illustrative unless the guide says
  otherwise.
- When docs, Postman, and code disagree, report the disagreement and identify
  the smallest documentation or implementation update needed. Never silently
  merge incompatible contracts.
- Keep endpoint paths relative in documentation. Put the base URL only in the
  Getting Started guide.

