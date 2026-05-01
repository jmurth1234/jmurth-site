# jmurth-site - Agent Guide

## Before You Finish

- Run `pnpm build` for code, Payload config, route, component, or dependency changes.
- Run `bash -n deploy.sh` and parse `docker-stack.yml` before changing deployment files:
  `ruby -e 'require "yaml"; YAML.load_file("docker-stack.yml")'`.
- Keep this repo on pnpm. Do not add `yarn.lock` or `package-lock.json`; use `pnpm-lock.yaml`.
- Treat production deploys as explicit user-approved work. If deploying, smoke test `/`, `/admin`, `/admin/login`, `/posts`, `/projects`, and `/api/pages?limit=1`.
- If touching a live Mongo volume, take a backup first. Use `mongodump --archive --gzip`
  from the running Mongo container and write the archive under ignored `backups/`.

## Project Map

- `src/app/(app)`: public Next.js App Router pages and global styles.
- `src/app/(payload)`: Payload admin and API routes.
- `src/collections`: Payload collection definitions.
- `src/globals`: Payload globals such as homepage and navigation.
- `src/components`: shared React components for the public site and forms.
- `src/content`: imported Markdown content for posts, pages, projects, and policies.
- `src/data`: import/seed helpers for Markdown-to-Payload data.
- `payload.config.ts`: Payload CMS configuration, Mongo adapter, globals, collections, and plugins.
- `Dockerfile`, `docker-stack.yml`, `traefik.yml`, `deploy.sh`: production Swarm deployment.

## Common Commands

| Task | Command | Notes |
|---|---|---|
| Install deps | `pnpm install` | Requires the committed lockfile. |
| Develop locally | `pnpm dev` | Uses Next and Payload in one app. |
| Clean dev start | `pnpm devsafe` | Removes `.next` first. |
| Production build | `pnpm build` | Required before finishing most code changes. |
| Payload CLI | `pnpm payload <command>` | Use for Payload tasks. |
| Generate types | `pnpm generate:types` | Updates `payload-types.ts`. |
| Seed/import data | `pnpm seed` | Reads from `src/content`. |

## Workflow: Public Site Changes

1. Edit public routes under `src/app/(app)` and reusable UI under `src/components`.
2. Keep content rendering conventions in `src/components/Markdown`, `RichText`, and summary components intact.
3. For Markdown content, add or edit files in `src/content`; do not hard-code imported content into route files.
4. Run `pnpm build`.

## Workflow: Payload Changes

1. Change collection schemas in `src/collections` or globals in `src/globals`.
2. Update related UI or data import code if the field shape changes.
3. Run `pnpm generate:types` when Payload types need to change.
4. Run `pnpm build`.

The generated admin route wrappers in `src/app/(payload)/admin/[[...segments]]` include a local guard that maps missing `segments` to `['login']`. Preserve that behavior if Payload regenerates those files; without it, `/admin` can error or redirect-loop.

## Workflow: Deployment Changes

1. Keep Docker builds pnpm-only. `.dockerignore` deliberately excludes accidental npm/yarn lockfiles.
2. Validate `deploy.sh`, `docker-stack.yml`, and `traefik.yml` locally.
3. Production deploy command is `./deploy.sh` from the server checkout with `.env` present.
4. After deploy, verify Swarm state with `docker stack ls` and `docker service ls --filter name=<stack>`.
5. Smoke test through Traefik with:
   `curl -H "Host: <site-host>" http://127.0.0.1:<http-port>/`.

For temporary stacks, set a different `STACK_NAME`, `HTTP_PORT`, `TRAEFIK_DASHBOARD_PORT`, and `SITE_HOST`. Do not register the production host rule from a test stack; use a test host header and remove the test stack when done.

## Decision Table

| If you need to change... | Use... | Notes |
|---|---|---|
| Public page layout | `src/app/(app)` plus `src/components` | Keep Payload data fetching patterns local to existing routes. |
| CMS schema | `src/collections` or `src/globals` | Regenerate types when field shapes change. |
| Static imported content | `src/content` | Run the seed/import path only when the user asks. |
| Local containers | `docker-compose.template.yml` | Copy to ignored `docker-compose.yml`. |
| Production deploy | `docker-stack.yml` and `deploy.sh` | Mongo is pinned to `4.4.6` for the existing live volume. |

## Key Rules

- Do not run `yarn` in this repo; run `pnpm install` and keep `pnpm-lock.yaml` authoritative.
- Do not bump the production Mongo major version while reusing `jmurth-site_mongodb_data`; plan a separate backup and migration.
- Do not expose secrets in docs or commits; use `.env` on the server and keep `.env*` ignored.
- Do not leave temporary Swarm stacks running; remove them with `docker stack rm <name>` after testing.
- Do not treat Tailwind/Browserslist warnings as build failures; do report new TypeScript, Next, or Payload errors.

## References

- Read `README.md` for human-facing setup and deployment notes.
- Read `payload.config.ts` before changing Payload behavior.
- Read `docker-stack.yml` and `deploy.sh` together before changing production deployment.
