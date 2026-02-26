# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev` (runs on port 3000)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (Biome)
- **Format:** `pnpm format` (Biome)
- **Check (lint + format):** `pnpm check`
- **Test:** `pnpm test` (Vitest)
- **Single test:** `pnpm vitest run src/path/to/test.test.ts`
- **DB generate migrations:** `pnpm db:generate`
- **DB push schema:** `pnpm db:push`
- **DB studio:** `pnpm db:studio`
- **Add shadcn component:** `pnpm dlx shadcn@latest add <component>`

## Architecture

This is a **TanStack Start** full-stack React app using file-based routing, built on Nitro as the server runtime.

### Tech Stack

- **Framework:** TanStack Start (React 19) with Nitro server
- **Routing:** TanStack Router — file-based routes in `src/routes/`
- **Data fetching:** TanStack Query (React Query) — provider in `src/integrations/tanstack-query/`
- **Forms:** TanStack Form
- **Tables:** TanStack Table
- **Database:** MySQL via Drizzle ORM — schema at `src/db/schema.ts`, connection at `src/db/index.ts`
- **Auth:** Better Auth with email/password — server config at `src/lib/auth.ts`, client at `src/lib/auth-client.ts`, API route at `src/routes/api/auth/$.ts`
- **Styling:** Tailwind CSS v4 with shadcn/ui (new-york style, lucide icons)
- **Validation:** Zod v4

### Path Aliases

Two alias systems are configured (both map to `./src/*`):
- `@/*` — tsconfig paths (used in IDE resolution)
- `#/*` — Node subpath imports in package.json (used at runtime, e.g., `import { auth } from '#/lib/auth'`)

### Key Structure

- `src/routes/` — File-based routes. TanStack Router auto-generates `src/routeTree.gen.ts` — **never edit this file**
- `src/routes/__root.tsx` — Root layout with providers (QueryClient, Header, DevTools)
- `src/components/` — App components; `src/components/ui/` is for shadcn components
- `src/lib/` — Shared utilities (`utils.ts` has the `cn()` helper for Tailwind class merging)
- `src/db/` — Drizzle ORM schema and database connection
- `src/integrations/` — Third-party integration wrappers (tanstack-query provider, better-auth header)
- `src/hooks/` — Custom React hooks

### Code Style

- **Biome** for linting and formatting: tabs for indentation, double quotes for JS/TS strings
- Biome excludes `src/routeTree.gen.ts` and `src/styles.css`
- Strict TypeScript (`noUnusedLocals`, `noUnusedParameters`, `strict`)
- Server functions use `createServerFn` from `@tanstack/react-start`
- API routes use the `server.handlers` pattern in route files
- Environment variables go in `.env.local` (gitignored)
