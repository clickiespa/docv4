# AP-v4 source and authority map

This repository is a documentation repository. The active implementation and
local integration target are in `clickie-platform`.

## Authority by question

| Question | Primary source | Secondary evidence |
| --- | --- | --- |
| What endpoint should a client call? | The exact page under `docs/` and `docs/README.md` | Maintained Postman collection under `docs/lambda-api-v4-v4.postman_collection.json` |
| What is the current runtime behavior? | `clickie-platform/stacks/api/lambdas/ap-v4/` | AP-v4 contract and E2E tests under `clickie-platform/stacks/api/tests/` |
| What routes are registered? | `clickie-platform/stacks/api/lambdas/ap-v4/apis/route_base.py` | Generated OpenAPI and endpoint pages |
| What does MGD mean by a resource, state, or projection? | `docs/gateways/mgd_canonical_contract.md` plus the linked MGD guides | `clickie-platform` MGD repositories and contract tests |
| Which fields are accepted or returned? | Endpoint page's request/response tables and Pydantic model references | `schemas/` and `models/` in the active implementation |
| Which permissions apply? | The endpoint page's clearance note | `dependencies/` and the route's `Depends(...)` chain in the active implementation |
| What changed recently? | `docs/changelog.md` | Source repository changelog and deployment evidence |
| How do I execute an example request? | Postman collection and the endpoint page | Getting Started guide for host and headers |

## Active implementation map

The corresponding paths in `clickie-platform` are:

```text
stacks/api/lambdas/ap-v4/
├── main.py                  # FastAPI app, /dev and /v4 mounting, Mangum handler
├── apis/                    # Route modules and request orchestration
├── dependencies/            # Auth, clearance, tenant and related validation
├── schemas/                 # Pydantic request/response models
├── models/                  # SQLAlchemy models for clickie4 data
├── repository/              # Reads, writes, MGD state and integrations
├── helpers/                 # Logging, events, metrics and external adapters
├── core/                    # Settings and database session construction
└── requirements.txt         # Runtime dependencies
```

The stack wiring is in `clickie-platform/stacks/api/template.yaml`. AP-v4 is
the `APV4Function` resource and uses the `APV4DeploymentRevision` parameter for
its published revision. Do not use the historical `API-V4/` source tree in this
repository to infer current infrastructure, permissions, or database behavior.

## Reading an endpoint implementation

For a route question, inspect in this order:

1. The exact Markdown endpoint section.
2. The router module named in the route family table.
3. The route's `Depends(...)` functions and related dependency modules for
   authentication, account scope, entity lookup, and clearance.
4. The referenced schema for request validation and response shape.
5. The repository method for query, transaction, and integration behavior.
6. The relevant contract test before changing documentation or code.

For writes, also check the session/repository convention and any event or MGD
history side effect. For MGD, read the state and persistence guides before
reviewing one operation in isolation.

## Drift handling

If a docs page and the active implementation disagree:

1. Identify the exact route and source file.
2. Check the relevant contract test and Postman example.
3. State whether the mismatch is documentation drift or an implementation
   change still needing publication.
4. Update the endpoint page, indexes, Postman collections, roadmap, and
   changelog together when the public contract changes.

Do not silently copy behavior from the historical implementation or accept a
sample response as proof of the current contract.

