# Pascal Editor — Setup

## Prerequisites

- [pnpm](https://pnpm.io/) 9+ (via [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`)
- Node.js 18+
- [Bun](https://bun.sh/) 1.3+ (optional — only needed to run the `bun:test` unit test suite)

## Quick Start

```bash
pnpm install
pnpm dev
```

The editor will be running at **http://localhost:3000**.

## Environment Variables (optional)

Copy `.env.example` to `.env` if you need:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Enables address search in the editor |
| `PORT` | No | Dev server port (default: 3000) |

The editor works fully without any environment variables.

## Monorepo Structure

```
├── apps/
│   └── editor/          # Next.js editor application
├── packages/
│   ├── core/            # @pascal-app/core — Scene schema, state, systems
│   ├── viewer/          # @pascal-app/viewer — 3D rendering
│   └── ui/              # Shared UI components
└── tooling/             # Build & release tooling
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build all packages |
| `pnpm check` | Lint and format check (Biome) |
| `pnpm check:fix` | Auto-fix lint and format issues |
| `pnpm check-types` | TypeScript type checking |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on submitting PRs and reporting issues.
