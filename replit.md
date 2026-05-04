# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the "Mildly Concerning Behavior" multi-author blog platform built with Next.js + Prisma + SQLite.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server — health only)

### MCB Blog (artifacts/mcb-blog)
- **Framework**: Next.js 15 (App Router, SSR)
- **Database**: SQLite via Prisma (file: `artifacts/mcb-blog/prisma/dev.db`)
- **Auth**: NextAuth v4 (credentials-based)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Markdown**: react-markdown + remark-gfm
- **Animation**: Framer Motion (blob background)

## Artifacts

| Artifact | Path | Purpose |
|---|---|---|
| `mcb-blog` | `/` | Next.js blog platform |
| `api-server` | `/api/healthz` | Express health-check server |
| `mockup-sandbox` | `/__mockup` | Design canvas |

## Key Commands

### MCB Blog
- `pnpm --filter @workspace/mcb-blog run dev` — dev server
- `pnpm --filter @workspace/mcb-blog run prisma:push` — push schema to SQLite
- `pnpm --filter @workspace/mcb-blog run prisma:seed` — seed demo data
- `pnpm --filter @workspace/mcb-blog run build` — production build

### API Server
- `pnpm --filter @workspace/api-server run dev` — dev server

## Environment Variables (MCB Blog)

- `DATABASE_URL` — SQLite path (e.g. `file:./prisma/dev.db`)
- `NEXTAUTH_URL` — Full URL of the app (e.g. `https://yourapp.replit.app`)
- `NEXTAUTH_SECRET` — Random secret for JWT signing (use `SESSION_SECRET` env or set your own)

## Demo Accounts (seed data)

| Role | Email | Password |
|---|---|---|
| Admin | admin@mcb.dev | admin123 |
| Author | vera@mcb.dev | author123 |
| Author | marcus@mcb.dev | author123 |

## Features

- Homepage with featured + latest posts
- Individual post pages with Markdown rendering
- Like/upvote system
- Comment system (authenticated users)
- Post categories with category pages
- Author profiles
- Post editor (create/edit/delete) for authors
- Admin panel (manage users, posts, categories)
- Light/dark mode
- Animated blob background
- Responsive layout

## Blog Post Roles

- `author` — create, edit, delete own posts; comment
- `admin` — manage all posts, users, and categories
