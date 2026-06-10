# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development (runs GraphQL codegen, then starts dev server)
bun run dev

# Production build (runs GraphQL codegen, then builds)
bun run build

# Start production server
bun run start

# Regenerate GraphQL types after changing .graphql files
bunx graphql-codegen
```

There are no test commands — this project has no test suite.

## Environment Variables

```
NEXT_PUBLIC_SERVER_URL=http://localhost:4000/graphql   # GraphQL API endpoint
NEXT_PUBLIC_MEDIA_URL=http://localhost:9000            # Media/file server (MinIO)
```

## Architecture

### Route Groups

- `src/app/(site)/` — authenticated app routes (wrapped with Header + Sidebar)
- `src/app/account/` — unauthenticated auth routes (login, register, verify, recovery)

Route protection is handled by the middleware at `src/proxy.ts`, which checks for a session cookie and redirects accordingly.

### GraphQL

All queries and mutations live as `.graphql` files under `src/graphql/`. After any change to these files, run codegen to regenerate `src/graphql/generated/output.ts`, which exports typed React hooks (e.g., `useLoginUserMutation`, `useFindProfileQuery`). Never edit `output.ts` directly.

Apollo Client is configured in `src/libs/apollo-client.ts` with `credentials: 'include'` for cookie-based auth.

### State Management

Two Zustand stores, both persisted to localStorage:

- `src/store/auth/auth.store.ts` — `isAuthenticated` boolean
- `src/store/sidebar/sidebar.store.ts` — `isCollapsed` boolean

Prefer the hooks in `src/hooks/` over importing stores directly: `useAuth()`, `useSidebar()`, `useCurrent()`.

### Component Layers

- `src/components/ui/common/` — shadcn/Radix UI primitives (Button, Input, Card, etc.)
- `src/components/ui/elements/` — small reusable presentational pieces (Heading, LiveBadge, ChannelAvatar, etc.)
- `src/components/features/` — feature-scoped components with business logic (auth forms, user settings)
- `src/components/layout/` — structural layout components (Header, Sidebar, LayoutContainer)

### Forms

Forms use React Hook Form + Zod. Schemas live in `src/schemas/`. Use the `<Form>` + `<Field>` components from `src/components/ui/common/` which wrap RHF context.

### Internationalization

Supported locales: `en`, `ru`. Translation files are in `public/languages/`. The locale is read from a cookie and resolved in `src/libs/i18n/request.ts` via next-intl.

### Path Alias

`@/*` maps to `src/*`. Use this alias for all internal imports.

### Styling

TailwindCSS v4 with PostCSS. Use `cn()` from `src/utils/tw-merge.ts` to conditionally merge class names. Prettier auto-sorts Tailwind classes on save.
