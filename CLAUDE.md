# fieldops

Field-service platform: scheduling API, notifications worker and a shared
types package. TypeScript, pnpm workspace.

<!-- Service-specific rules go in services/<name>/CLAUDE.md, not here. -->

## Commands
- Run `pnpm test` and `pnpm typecheck` from the service folder, not the root.
- Run `pnpm codegen` from the root to regenerate the API clients.

## Rules for every service
- Import shared types from `packages/shared`. Do not redefine them.
- Never edit `packages/shared/generated/`. Change the OpenAPI spec and run
  `pnpm codegen`.
- A change to two services is two commits, each starting with the service name.

## Done means
Type checks and tests pass in every service you changed.

## Pull requests
Write PR descriptions with the sections in `.github/pull_request_template.md`.
