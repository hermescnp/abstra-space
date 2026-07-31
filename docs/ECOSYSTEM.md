# Dot Science ecosystem — Abstra Space

This monorepo (Pascal Editor / Abstra Space) is the **Science’s Laboratory** product: interactive spatial simulations. Cloud persistence will join the shared Dot Science backend; the editor stays **local-first**.

---

## Center of gravity

| Concern | Source of truth |
|---------|-----------------|
| **Center repo** | `hermescnp/dot-science-ai` |
| **Development Supabase project** | **`dot-science-ecosystem`** |
| **Project ref** | `hhroabzrhglzjlyavkeu` |
| **Project URL** | `https://hhroabzrhglzjlyavkeu.supabase.co` |
| **Shared packages** | `@hermescnp/supabase`, `@hermescnp/auth`, `@hermescnp/workspace-sdk` |
| **Schema** | Only in `dot-science-ai/supabase/migrations/` — never fork migrations here |

---

## This product's role

| | |
|--|--|
| **Global entity** | Space |
| **Unit entity** | Model |
| **Primary transformation** | Knowledge becomes explorable experience |
| **App slug** | `abstra-space` (`NEXT_PUBLIC_DOT_SCIENCE_APP=abstra-space`) |

Respect layer boundaries in `AGENTS.md` / `wiki/architecture/`: `packages/core` stays free of backend SDKs; cloud adapters live in `apps/editor` (or a dedicated package), not scattered through published `@pascal-app/*` if avoidable.

---

## Sibling products

| Product | Repo | Global entity | Unit entity |
|---------|------|---------------|-------------|
| Dot Science AI | `dot-science-ai` | — (center + landing) | — |
| Workspace | `dot-science-workspace` | Project | File |
| IAteneo | `IAteneo-network-of-thoughts` | Session | Intervention |
| Golden Papers | `golden-papers-ai` | Document | Block |
| Abstra Space | this repo | Space | Model |
| Affine Club | *(not created yet)* | Circle | Resonance |

### Five spaces

| Space | Abstra meaning |
|-------|----------------|
| Agora | Public spaces / exhibitions (`/agora`) |
| Studio | Create and edit environments (`/studio`) |
| Reviewer | Comment on spaces / models |
| Viewer | Explore + contextual agent |
| Deriver | VR, walkthroughs, tours |

---

## Current backend status

| Area | Status |
|------|--------|
| Auth | Google via `@hermescnp/auth` + Supabase (`dot-science-ecosystem`); local scenes still work signed out |
| Persistence | Browser IndexedDB + local SQLite via `@pascal-app/mcp` / `SqliteSceneStore` |
| API | Local scene REST under `apps/editor/app/api/scenes` |
| Cloud assets | Some catalog URLs on external Supabase Storage (assets only, not app DB) |
| Ecosystem onboarding | **Stage 4** — add cloud store; not a data migration |

---

## How to integrate

When Stage 4 runs:

1. ~~Add `@hermescnp/auth` + Supabase clients; enable Google sign-in.~~ **Done** (welcome Space form + account badge).
2. Implement a `SupabaseSceneStore` (or equivalent) behind the **same interface** as `SqliteSceneStore`; select by config.
3. Register Spaces as `public.entities` with `entity_kind = 'space'`; metadata in Postgres; large meshes/textures in workspace-scoped Storage (`space-assets`).
4. Keep offline / local-only mode working with no project configured.
5. Point `/agora` and `/studio` cloud listings at `entities`-backed queries when online.
6. Schema PRs go to **`dot-science-ai`**.

Local scene create still uses SQLite REST; sign-in is required to create from the welcome form (IAteneo/GP pattern) but does not yet gate cloud persistence.

---

## Rules

**Do**

- Prefer adapter-behind-interface over rewriting the editor around Supabase.
- Version scene documents; avoid one frequently overwritten JSON blob as the only store.
- Keep CDN/asset allowlists explicit (`PASCAL_ALLOWED_ASSET_ORIGINS`, etc.).

**Do not**

- Put backend imports into `packages/core`.
- Expect existing local SQLite scenes to auto-migrate to the cloud.
- Use one Supabase project per product for Abstra alone.

---

## Related docs

- [SETUP.md](../SETUP.md), [AGENTS.md](../AGENTS.md), `wiki/architecture/`
- Center: `dot-science-ai/docs/PLATFORM.md`, `ECOSYSTEM.md`
- Plans: `dot-science-workspace/docs/dot-science-supabase-migration-master-plan.md` (Stage 4)
