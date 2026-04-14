# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Account-book is a monorepo personal finance management application using Next.js 15 App Router, Supabase, and pnpm workspaces with Turborepo.

## Commands

```bash
pnpm dev          # Start development servers (web on :3000, ui-lab on :5173)
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm test         # Run tests
pnpm db:migrate   # Run Supabase migrations
pnpm db:seed      # Seed Supabase database
```

## Architecture

```
apps/
  web/           # Next.js 15 application
    src/app/     # App Router pages
    src/features/# Feature modules (books, transactions, categories, analytics, layout)
  ui-lab/        # UI component playground (Vite + React)

packages/
  config-*/      # Shared ESLint, Tailwind, TypeScript configs
  ui/            # Shared UI component library (Radix UI + shadcn/ui patterns)

supabase/
  migrations/    # SQL migration files
  schemas/        # Database schema definitions
  seeds/          # Seed data scripts
```

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server/Client components)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom component classes
- **UI Components**: Radix UI primitives (Dialog, Select, Tabs, etc.)
- **State**: React useState/useEffect (no external state library)
- **Package Manager**: pnpm 10.14+ with Turborepo

## Key Patterns

- **Feature modules**: Each feature (books, transactions, categories, analytics) has its own `services/`, `components/`, and `types/` directories
- **Server vs Client**: Database operations and data fetching are server-side; interactive components use `'use client'` directive
- **Shared UI library**: `@account-book/ui` package exports shared components used across apps
- **Environment variables**: Supabase credentials stored in `apps/web/.env.local` with `NEXT_PUBLIC_` prefix

## Database

Supabase project: `inamibjxvymsoiwfrjrj.supabase.co`

Main tables:
- `books` -账本
- `categories` - 收入/支出分类  
- `transactions` - 交易记录
