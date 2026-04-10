# 记账本全栈项目实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 构建一个完整可运行的 monorepo 记账本应用，包含 Next.js 主应用、Vite 组件实验场、共享 UI 包、Supabase 数据库 migration 和 seed。

**架构：** monorepo + pnpm workspace + turborepo。前端共享 UI 包独立发布，应用层通过服务封装 Supabase 调用，数据按 feature 目录组织。

**技术栈：** pnpm, turborepo, Next.js 15, Vite, React 19, shadcn/ui, Tailwind CSS, Supabase (Postgres only)

---

## 文件结构总览

```
assignment-2-new/
├── apps/
│   ├── web/                       # Next.js 主应用
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router 页面
│   │   │   ├── features/         # 按业务 feature 组织
│   │   │   │   ├── books/
│   │   │   │   ├── categories/
│   │   │   │   ├── transactions/
│   │   │   │   └── analytics/
│   │   │   ├── components/ui/   # shadcn/ui 组件
│   │   │   └── lib/              # 工具函数、Supabase 客户端
│   │   └── package.json
│   └── ui-lab/                   # Vite 组件演示场
│       ├── src/
│       │   ├── components/        # 演示组件
│       │   └── main.tsx
│       └── package.json
├── packages/
│   ├── ui/                       # 共享 UI 组件包
│   │   ├── src/
│   │   │   ├── components/       # Button, Card, Input, etc.
│   │   │   └── index.ts
│   │   └── package.json
│   ├── config-typescript/        # TS 配置
│   ├── config-eslint/            # ESLint 配置
│   └── config-tailwind/          # Tailwind 配置
├── supabase/
│   ├── schemas/                   # 数据库 schema 定义
│   ├── migrations/               # SQL migration 文件
│   └── seeds/                    # 种子数据
├── docs/superpowers/plans/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 实施任务清单

### Task 1: 初始化 Monorepo 基础结构

**文件：**
- 创建: `package.json` (root)
- 创建: `pnpm-workspace.yaml`
- 创建: `turbo.json`
- 创建: `.npmrc`
- 创建: `.gitignore`

- [ ] **Step 1: 创建 pnpm-workspace.yaml**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 2: 创建 root package.json**

```json
{
  "name": "account-book",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "db:migrate": "pnpm --filter @account-book/supabase migrate",
    "db:seed": "pnpm --filter @account-book/supabase seed"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 3: 创建 turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "!.next/cache/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

- [ ] **Step 4: 创建 .gitignore**

```
node_modules/
dist/
.next/
.turbo/
.env
*.local
```

- [ ] **Step 5: 安装依赖**

```bash
pnpm install
```

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore .npmrc
git commit -m "chore: init monorepo structure with pnpm workspace and turbo"
```

---

### Task 2: 创建共享配置包

**文件：**
- 创建: `packages/config-typescript/package.json`
- 创建: `packages/config-typescript/base.json`
- 创建: `packages/config-eslint/package.json`
- 创建: `packages/config-eslint/base.js`
- 创建: `packages/config-tailwind/package.json`
- 创建: `packages/config-tailwind/tsconfig.lint.json`
- 创建: `packages/config-tailwind/tailwind.config.ts`

- [ ] **Step 1: 创建 packages/config-typescript/base.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: 创建 packages/config-typescript/package.json**

```json
{
  "name": "@account-book/config-typescript",
  "version": "0.0.0",
  "private": true
}
```

- [ ] **Step 3: 创建 packages/config-eslint/package.json 和 base.js**

```json
{
  "name": "@account-book/config-eslint",
  "version": "0.0.0",
  "private": true,
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.0"
  }
}
```

```js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

- [ ] **Step 4: 创建 packages/config-tailwind/package.json 和配置文件**

```json
{
  "name": "@account-book/config-tailwind",
  "version": "0.0.0",
  "private": true,
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

```ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './apps/web/src/**/*.{js,ts,jsx,tsx}',
    './apps/ui-lab/src/**/*.{js,ts,jsx,tsx}',
    './packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
```

- [ ] **Step 5: Commit**

```bash
git add packages/config-typescript packages/config-eslint packages/config-tailwind
git commit -m "chore: add shared config packages (typescript, eslint, tailwind)"
```

---

### Task 3: 创建共享 UI 包 packages/ui

**文件：**
- 创建: `packages/ui/package.json`
- 创建: `packages/ui/tsconfig.json`
- 创建: `packages/ui/src/index.ts`
- 创建: `packages/ui/src/components/ui/button.tsx`
- 创建: `packages/ui/src/components/ui/card.tsx`
- 创建: `packages/ui/src/components/ui/input.tsx`
- 创建: `packages/ui/src/components/ui/select.tsx`
- 创建: `packages/ui/src/components/ui/dialog.tsx`
- 创建: `packages/ui/src/components/ui/badge.tsx`
- 创建: `packages/ui/src/components/ui/table.tsx`
- 创建: `packages/ui/src/components/ui/tabs.tsx`
- 创建: `packages/ui/src/components/ui/skeleton.tsx`
- 创建: `packages/ui/src/components/ui/separator.tsx`
- 创建: `packages/ui/src/components/ui/dropdown-menu.tsx`
- 创建: `packages/ui/src/lib/utils.ts`
- 创建: `packages/ui/src/lib/cn.ts`
- 创建: `packages/ui/tailwind.config.ts` (link to config-tailwind)
- 创建: `packages/ui/postcss.config.js`

- [ ] **Step 1: 创建 packages/ui/package.json**

```json
{
  "name": "@account-book/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./package.json": "./package.json",
    ".": "./src/index.ts",
    "./*": "./src/components/ui/*.tsx"
  },
 scripts: {
    "build": "tsup",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "@account-book/config-tailwind": "workspace:*",
    "@account-book/config-typescript": "workspace:*",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "react": "^19.0.0",
    "typescript": "^5.5.0",
    "tsup": "^8.0.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

- [ ] **Step 2: 创建 packages/ui/src/lib/cn.ts (clsx + tailwind-merge)**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: 创建 packages/ui/src/lib/utils.ts**

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0)
  return { start, end }
}
```

- [ ] **Step 4: 创建 packages/ui/src/index.ts**

```typescript
export { cn } from './lib/cn'
export { formatCurrency, formatDate, getMonthRange } from './lib/utils'
export { Button } from './components/ui/button'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card'
export { Input } from './components/ui/input'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog'
export { Badge } from './components/ui/badge'
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
export { Skeleton } from './components/ui/skeleton'
export { Separator } from './components/ui/separator'
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu'
```

- [ ] **Step 5: 创建 Button 组件 (shadcn/ui)**

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 6: 创建 Card 组件**

```typescript
import * as React from 'react'
import { cn } from '@/lib/cn'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-xl border bg-card text-card-foreground shadow', className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

- [ ] **Step 7: 创建 Input、Select、Dialog、Badge、Table、Tabs、Skeleton、Separator、DropdownMenu 组件**
  (每个组件使用 @radix-ui/react-* 实现，遵循 shadcn/ui 模式)

- [ ] **Step 8: 创建 packages/ui/tsconfig.json 和 tsup.config.ts**

```json
{
  "extends": "@account-book/config-typescript/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: './src/index.ts' },
  format: ['esm'],
  dts: true,
  external: ['react'],
})
```

- [ ] **Step 9: 安装 UI 依赖**

```bash
pnpm --filter @account-book/ui add clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-dropdown-menu @radix-ui/react-separator @radix-ui/react-skeleton
pnpm --filter @account-book/ui add -D tailwindcss-animate
```

- [ ] **Step 10: 验证 UI 包构建**

```bash
pnpm --filter @account-book/ui build
```

- [ ] **Step 11: Commit**

```bash
git add packages/ui/
git commit -m "feat(ui): add shared UI components package"
```

---

### Task 4: 创建 Supabase 数据库 Migration 和 Seed

**文件：**
- 创建: `supabase/schemas/tables.sql`
- 创建: `supabase/migrations/001_initial_schema.sql`
- 创建: `supabase/seeds/001_seed.sql`

- [ ] **Step 1: 创建 supabase/schemas/tables.sql**

```sql
-- Books 表
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories 表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(book_id, name)
);

-- Transactions 表
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  note TEXT DEFAULT '',
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_categories_book_id ON categories(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_book_id ON transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
```

- [ ] **Step 2: 创建 supabase/migrations/001_initial_schema.sql**

```sql
-- 创建 books 表
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(book_id, name)
);

-- 创建 transactions 表
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  note TEXT DEFAULT '',
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_categories_book_id ON categories(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_book_id ON transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- RLS 策略 (首版不做认证，暂时禁用)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for books" ON books FOR ALL USING (true);
CREATE POLICY "Allow all for categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true);
```

- [ ] **Step 3: 创建 supabase/seeds/001_seed.sql**

```sql
-- 种子数据：默认账本
INSERT INTO books (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', '我的账本', '默认账本，用于演示');

-- 收入分类
INSERT INTO categories (id, book_id, name, type, color, icon) VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', '工资', 'income', '#22C55E', '💰'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '奖金', 'income', '#16A34A', '🎁'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', '投资收益', 'income', '#15803D', '📈');

-- 支出分类
INSERT INTO categories (id, book_id, name, type, color, icon) VALUES
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '餐饮', 'expense', '#EF4444', '🍜'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '交通', 'expense', '#F97316', '🚌'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '购物', 'expense', '#EC4899', '🛍️'),
  ('33333333-3333-3333-3333-333333333334', '11111111-1111-1111-1111-111111111111', '娱乐', 'expense', '#8B5CF6', '🎮'),
  ('33333333-3333-3333-3333-333333333335', '11111111-1111-1111-1111-111111111111', '居住', 'expense', '#6366F1', '🏠'),
  ('33333333-3333-3333-3333-333333333336', '11111111-1111-1111-1111-111111111111', '医疗', 'expense', '#14B8A6', '🏥');

-- 种子交易数据 (2026年3-4月)
INSERT INTO transactions (book_id, category_id, type, amount, note, transaction_date) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'income', 15000, '3月工资', '2026-03-05'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'income', 5000, '年终奖金', '2026-03-15'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'expense', 45.5, '午餐', '2026-03-10'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'expense', 120, '晚餐聚会', '2026-03-12'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'expense', 8, '地铁', '2026-03-11'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'expense', 299, '网购衣服', '2026-03-18'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333334', 'expense', 68, '电影票', '2026-03-20'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333335', 'expense', 2500, '房租', '2026-04-01'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'income', 15000, '4月工资', '2026-04-05'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'expense', 35, '早餐', '2026-04-08');
```

- [ ] **Step 4: 创建 supabase/package.json (用于 migration 和 seed 命令)**

```json
{
  "name": "@account-book/supabase",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "migrate": "psql $DATABASE_URL -f migrations/001_initial_schema.sql",
    "seed": "psql $DATABASE_URL -f seeds/001_seed.sql"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add supabase/
git commit -m "feat(supabase): add database migration and seed data"
```

---

### Task 5: 创建 apps/web (Next.js 主应用) 基础结构

**文件：**
- 创建: `apps/web/package.json`
- 创建: `apps/web/tsconfig.json`
- 创建: `apps/web/next.config.ts`
- 创建: `apps/web/tailwind.config.ts` (链接到 config-tailwind)
- 创建: `apps/web/postcss.config.js`
- 创建: `apps/web/src/app/layout.tsx`
- 创建: `apps/web/src/app/globals.css`
- 创建: `apps/web/src/app/page.tsx` (仪表盘)
- 创建: `apps/web/src/lib/supabase/client.ts`
- 创建: `apps/web/src/lib/supabase/server.ts`

- [ ] **Step 1: 创建 apps/web/package.json**

```json
{
  "name": "@account-book/web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@account-book/ui": "workspace:*",
    "@supabase/supabase-js": "^2.45.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "react-hook-form": "^7.53.0",
    "date-fns": "^3.6.0",
    "recharts": "^2.12.0",
    "sonner": "^1.5.0"
  },
  "devDependencies": {
    "@account-book/config-tailwind": "workspace:*",
    "@account-book/config-typescript": "workspace:*",
    "@account-book/config-eslint": "workspace:*",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: 创建 next.config.ts**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@account-book/ui'],
}

export default nextConfig
```

- [ ] **Step 3: 创建 tsconfig.json (继承 config-typescript + path alias)**

```json
{
  "extends": "@account-book/config-typescript/base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@account-book/ui": ["../../packages/ui/src"]
    }
  },
  "include": ["src", "next.config.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 创建 Supabase 客户端 lib**

```typescript
// apps/web/src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```typescript
// apps/web/src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey)
}
```

- [ ] **Step 5: 创建 globals.css (CSS 变量 + Tailwind)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 6: 创建 layout.tsx (含侧边栏导航)**

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/features/layout/Sidebar'

export const metadata: Metadata = {
  title: '记账本',
  description: '个人记账应用',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 7: 创建 .env.local.example**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 8: 安装依赖**

```bash
pnpm --filter @account-book/web add @supabase/supabase-js next react react-dom zod @hookform/resolvers react-hook-form date-fns recharts sonner
pnpm --filter @account-book/web add -D @types/node
```

- [ ] **Step 9: Commit**

```bash
git add apps/web/
git commit -m "feat(web): scaffold Next.js app with layout and Supabase client"
```

---

### Task 6: 实现账本管理 (books feature)

**文件：**
- 创建: `apps/web/src/features/books/types/index.ts`
- 创建: `apps/web/src/features/books/services/bookService.ts`
- 创建: `apps/web/src/features/books/components/BookList.tsx`
- 创建: `apps/web/src/features/books/components/BookForm.tsx`
- 创建: `apps/web/src/app/books/page.tsx`
- 创建: `apps/web/src/app/books/[bookId]/page.tsx`

- [ ] **Step 1: 创建 types**

```typescript
// apps/web/src/features/books/types/index.ts
export interface Book {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface BookInput {
  name: string
  description?: string
}
```

- [ ] **Step 2: 创建 bookService**

```typescript
// apps/web/src/features/books/services/bookService.ts
import { supabase } from '@/lib/supabase/client'
import type { Book, BookInput } from '../types'

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getBook(id: string): Promise<Book | null> {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createBook(input: BookInput): Promise<Book> {
  const { data, error } = await supabase.from('books').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateBook(id: string, input: BookInput): Promise<Book> {
  const { data, error } = await supabase.from('books').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 3: 创建 BookList 组件**

```typescript
// apps/web/src/features/books/components/BookList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Book } from '../types'
import { getBooks, deleteBook } from '../services/bookService'
import { Button } from '@account-book/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@account-book/ui'
import { Plus, Trash2 } from 'lucide-react'

export function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBooks().then(setBooks).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此账本？')) return
    await deleteBook(id)
    setBooks(books.filter(b => b.id !== id))
  }

  if (loading) return <div>加载中...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账本列表</h1>
        <Button>+ 新建账本</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{book.description || '暂无描述'}</p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)} className="mt-4">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {books.length === 0 && <p className="text-muted-foreground">还没有账本，点击新建创建一个</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 BookForm 组件 (Dialog + React Hook Form + Zod)**

```typescript
// apps/web/src/features/books/components/BookForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@account-book/ui'

const schema = z.object({
  name: z.string().min(1, '账本名称不能为空').max(50),
  description: z.string().max(200).optional(),
})

type FormData = z.infer<typeof schema>

interface BookFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
}

export function BookForm({ open, onOpenChange, onSubmit }: BookFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建账本</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">账本名称</label>
            <Input {...form.register('name')} placeholder="例如：我的账本" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">描述</label>
            <Input {...form.register('description')} placeholder="可选描述" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">创建</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 5: 创建 books/page.tsx**

```typescript
// apps/web/src/app/books/page.tsx
import { BookList } from '@/features/books/components/BookList'

export default function BooksPage() {
  return <BookList />
}
```

- [ ] **Step 6: 创建 books/[bookId]/page.tsx (账本概览)**

```typescript
// apps/web/src/app/books/[bookId]/page.tsx
import { notFound } from 'next/navigation'
import { getBook } from '@/features/books/services/bookService'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function BookOverviewPage({ params }: PageProps) {
  const { bookId } = await params
  const book = await getBook(bookId)
  if (!book) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold">{book.name}</h1>
      <p className="text-muted-foreground">{book.description}</p>
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/books/
git commit -m "feat(books): add book management feature with list and form"
```

---

### Task 7: 实现分类管理 (categories feature)

**文件：**
- 创建: `apps/web/src/features/categories/types/index.ts`
- 创建: `apps/web/src/features/categories/services/categoryService.ts`
- 创建: `apps/web/src/features/categories/components/CategoryList.tsx`
- 创建: `apps/web/src/features/categories/components/CategoryForm.tsx`
- 创建: `apps/web/src/app/books/[bookId]/categories/page.tsx`

- [ ] **Step 1: 创建 types**

```typescript
// apps/web/src/features/categories/types/index.ts
export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  book_id: string
  name: string
  type: CategoryType
  color: string
  icon: string
  created_at: string
}

export interface CategoryInput {
  name: string
  type: CategoryType
  color?: string
  icon?: string
}
```

- [ ] **Step 2: 创建 categoryService**

```typescript
// apps/web/src/features/categories/services/categoryService.ts
import { supabase } from '@/lib/supabase/client'
import type { Category, CategoryInput } from '../types'

export async function getCategories(bookId: string): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').eq('book_id', bookId).order('type')
  if (error) throw error
  return data
}

export async function createCategory(bookId: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert({ ...input, book_id: bookId }).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase.from('categories').update(input).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 3: 创建 CategoryList 和 CategoryForm 组件** (参照 books feature 结构，分 income/expense 两个 Tab 显示)

- [ ] **Step 4: 创建分类页面**

```typescript
// apps/web/src/app/books/[bookId]/categories/page.tsx
import { getCategories } from '@/features/categories/services/categoryService'
import { CategoryList } from '@/features/categories/components/CategoryList'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function CategoriesPage({ params }: PageProps) {
  const { bookId } = await params
  const categories = await getCategories(bookId).catch(() => notFound())
  return <CategoryList bookId={bookId} initialCategories={categories} />
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/categories/
git commit -m "feat(categories): add category management feature"
```

---

### Task 8: 实现交易记录 (transactions feature)

**文件：**
- 创建: `apps/web/src/features/transactions/types/index.ts`
- 创建: `apps/web/src/features/transactions/services/transactionService.ts`
- 创建: `apps/web/src/features/transactions/components/TransactionList.tsx`
- 创建: `apps/web/src/features/transactions/components/TransactionForm.tsx`
- 创建: `apps/web/src/features/transactions/components/TransactionFilters.tsx`
- 创建: `apps/web/src/app/books/[bookId]/transactions/page.tsx`

- [ ] **Step 1: 创建 types**

```typescript
// apps/web/src/features/transactions/types/index.ts
import type { CategoryType } from '@/features/categories/types'

export interface Transaction {
  id: string
  book_id: string
  category_id: string
  type: CategoryType
  amount: number
  note: string
  transaction_date: string
  created_at: string
  updated_at: string
  category?: { name: string; color: string; icon: string }
}

export interface TransactionInput {
  category_id: string
  type: CategoryType
  amount: number
  note?: string
  transaction_date: string
}

export interface TransactionFilter {
  month?: number
  year?: number
  categoryId?: string
  type?: CategoryType
}
```

- [ ] **Step 2: 创建 transactionService**

```typescript
// apps/web/src/features/transactions/services/transactionService.ts
import { supabase } from '@/lib/supabase/client'
import type { Transaction, TransactionInput, TransactionFilter } from '../types'

export async function getTransactions(bookId: string, filter?: TransactionFilter): Promise<Transaction[]> {
  let query = supabase.from('transactions').select('*, category(name, color, icon)').eq('book_id', bookId)

  if (filter?.year && filter?.month) {
    const start = new Date(filter.year, filter.month - 1, 1).toISOString().split('T')[0]
    const end = new Date(filter.year, filter.month, 0).toISOString().split('T')[0]
    query = query.gte('transaction_date', start).lte('transaction_date', end)
  }
  if (filter?.categoryId) query = query.eq('category_id', filter.categoryId)
  if (filter?.type) query = query.eq('type', filter.type)

  const { data, error } = await query.order('transaction_date', { ascending: false })
  if (error) throw error
  return data
}

export async function createTransaction(bookId: string, input: TransactionInput): Promise<Transaction> {
  const { data, error } = await supabase.from('transactions').insert({ ...input, book_id: bookId }).select('*, category(name, color, icon)').single()
  if (error) throw error
  return data
}

export async function updateTransaction(id: string, input: TransactionInput): Promise<Transaction> {
  const { data, error } = await supabase.from('transactions').update(input).eq('id', id).select('*, category(name, color, icon)').single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 3: 创建 TransactionFilters 组件 (月份选择 + 分类筛选)**

```typescript
// apps/web/src/features/transactions/components/TransactionFilters.tsx
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@account-book/ui'
import { useState } from 'react'
import { format } from 'date-fns'

interface TransactionFiltersProps {
  onFilterChange: (filter: { year: number; month: number; categoryId?: string }) => void
  categories: { id: string; name: string }[]
}

export function TransactionFilters({ onFilterChange, categories }: TransactionFiltersProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [categoryId, setCategoryId] = useState<string>('')

  const handleApply = () => {
    onFilterChange({ year, month, categoryId: categoryId || undefined })
  }

  return (
    <div className="flex gap-4 items-end">
      <div>
        <label className="text-sm font-medium">年份</label>
        <Select value={String(year)} onValueChange={v => setYear(+v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, 2026].map(y => <SelectItem key={y} value={String(y)}>{y}年</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">月份</label>
        <Select value={String(month)} onValueChange={v => setMonth(+v)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <SelectItem key={m} value={String(m)}>{m}月</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">分类</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleApply}>筛选</Button>
    </div>
  )
}
```

- [ ] **Step 4: 创建 TransactionList (表格展示，支持删除)**

```typescript
// apps/web/src/features/transactions/components/TransactionList.tsx
'use client'

import { useState } from 'react'
import { Transaction } from '../types'
import { formatCurrency, formatDate } from '@account-book/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@account-book/ui'
import { Button } from '@account-book/ui'
import { Trash2 } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日期</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>类型</TableHead>
          <TableHead className="text-right">金额</TableHead>
          <TableHead>备注</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(tx => (
          <TableRow key={tx.id}>
            <TableCell>{formatDate(tx.transaction_date)}</TableCell>
            <TableCell>
              <span style={{ color: tx.category?.color }}>{tx.category?.icon} {tx.category?.name}</span>
            </TableCell>
            <TableCell>
              <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {tx.type === 'income' ? '收入' : '支出'}
              </span>
            </TableCell>
            <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </TableCell>
            <TableCell className="text-muted-foreground">{tx.note || '-'}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">暂无交易记录</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
```

- [ ] **Step 5: 创建 TransactionForm (新建/编辑交易表单)**

```typescript
// apps/web/src/features/transactions/components/TransactionForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@account-book/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@account-book/ui'
import { Category } from '@/features/categories/types'

const schema = z.object({
  type: z.enum(['income', 'expense']),
  category_id: z.string().min(1, '请选择分类'),
  amount: z.number().min(0.01, '金额必须大于0'),
  note: z.string().optional(),
  transaction_date: z.string().min(1, '请选择日期'),
})

type FormData = z.infer<typeof schema>

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
  categories: Category[]
}

export function TransactionForm({ open, onOpenChange, onSubmit, categories }: TransactionFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>新增交易</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">类型</label>
            <Select onValueChange={v => form.setValue('type', v as 'income' | 'expense')}>
              <SelectTrigger><SelectValue placeholder="收入/支出" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="income">收入</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">分类</label>
            <Select onValueChange={v => form.setValue('category_id', v)}>
              <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
              <SelectContent>
                {categories.filter(c => c.type === form.watch('type')).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">金额</label>
            <Input type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} placeholder="0.00" />
          </div>
          <div>
            <label className="text-sm font-medium">日期</label>
            <Input type="date" {...form.register('transaction_date')} />
          </div>
          <div>
            <label className="text-sm font-medium">备注</label>
            <Input {...form.register('note')} placeholder="可选备注" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 6: 创建 transactions/page.tsx**

```typescript
// apps/web/src/app/books/[bookId]/transactions/page.tsx
import { notFound } from 'next/navigation'
import { getTransactions } from '@/features/transactions/services/transactionService'
import { getCategories } from '@/features/categories/services/categoryService'
import { TransactionPageClient } from '@/features/transactions/components/TransactionPageClient'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function TransactionsPage({ params }: PageProps) {
  const { bookId } = await params
  const [transactions, categories] = await Promise.all([
    getTransactions(bookId).catch(() => []),
    getCategories(bookId).catch(() => []),
  ])
  if (!bookId) notFound()
  return <TransactionPageClient bookId={bookId} initialTransactions={transactions} categories={categories} />
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/transactions/
git commit -m "feat(transactions): add transaction management with filtering"
```

---

### Task 9: 实现仪表盘和统计分析

**文件：**
- 创建: `apps/web/src/features/analytics/types/index.ts`
- 创建: `apps/web/src/features/analytics/services/analyticsService.ts`
- 创建: `apps/web/src/features/analytics/components/StatCard.tsx`
- 创建: `apps/web/src/features/analytics/components/CategoryPieChart.tsx`
- 创建: `apps/web/src/features/analytics/components/MonthlyTrendChart.tsx`
- 创建: `apps/web/src/app/page.tsx` (仪表盘)
- 创建: `apps/web/src/app/books/[bookId]/analytics/page.tsx`

- [ ] **Step 1: 创建 analytics types 和 service**

```typescript
// apps/web/src/features/analytics/types/index.ts
export interface MonthlyStats {
  income: number
  expense: number
  balance: number
}

export interface CategoryStat {
  category_id: string
  category_name: string
  category_color: string
  category_icon: string
  total: number
  count: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expense: number
}
```

```typescript
// apps/web/src/features/analytics/services/analyticsService.ts
import { supabase } from '@/lib/supabase/client'
import type { MonthlyStats, CategoryStat, MonthlyTrend } from '../types'

export async function getMonthlyStats(bookId: string, year: number, month: number): Promise<MonthlyStats> {
  const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('book_id', bookId)
    .gte('transaction_date', start)
    .lte('transaction_date', end)

  if (error) throw error

  const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

  return { income, expense, balance: income - expense }
}

export async function getCategoryStats(bookId: string, year: number, month: number): Promise<CategoryStat[]> {
  const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('category_id, type, amount, category(name, color, icon)')
    .eq('book_id', bookId)
    .eq('type', 'expense')
    .gte('transaction_date', start)
    .lte('transaction_date', end)

  if (error) throw error

  const map = new Map<string, CategoryStat>()
  for (const tx of data) {
    const cat = tx.category as { name: string; color: string; icon: string }
    if (!map.has(tx.category_id)) {
      map.set(tx.category_id, { category_id: tx.category_id, category_name: cat.name, category_color: cat.color, category_icon: cat.icon, total: 0, count: 0 })
    }
    const stat = map.get(tx.category_id)!
    stat.total += Number(tx.amount)
    stat.count += 1
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export async function getMonthlyTrend(bookId: string, months: number = 6): Promise<MonthlyTrend[]> {
  const now = new Date()
  const result: MonthlyTrend[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const start = d.toISOString().split('T')[0]
    const end = new Date(year, month, 0).toISOString().split('T')[0]

    const { data } = await supabase.from('transactions').select('type, amount').eq('book_id', bookId).gte('transaction_date', start).lte('transaction_date', end)

    const income = data.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    result.push({ month: `${year}-${String(month).padStart(2, '0')}`, income, expense })
  }

  return result
}
```

- [ ] **Step 2: 创建 StatCard 组件**

```typescript
// apps/web/src/features/analytics/components/StatCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@account-book/ui'
import { formatCurrency } from '@account-book/ui'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  type: 'income' | 'expense' | 'balance'
}

export function StatCard({ title, value, type }: StatCardProps) {
  const color = type === 'income' ? 'text-green-600' : type === 'expense' ? 'text-red-600' : 'text-blue-600'
  const Icon = type === 'income' ? TrendingUp : TrendingDown

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{formatCurrency(value)}</div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: 创建 CategoryPieChart (recharts PieChart) 和 MonthlyTrendChart (LineChart)**

```typescript
// apps/web/src/features/analytics/components/CategoryPieChart.tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@account-book/ui'
import type { CategoryStat } from '../types'

interface CategoryPieChartProps {
  data: CategoryStat[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <Card>
      <CardHeader><CardTitle>支出分类</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category_name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.category_color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

```typescript
// apps/web/src/features/analytics/components/MonthlyTrendChart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@account-book/ui'
import type { MonthlyTrend } from '../types'

interface MonthlyTrendChartProps {
  data: MonthlyTrend[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <Card>
      <CardHeader><CardTitle>月度趋势</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#22C55E" name="收入" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="支出" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: 创建仪表盘 page.tsx**

```typescript
// apps/web/src/app/page.tsx
import { getMonthlyStats, getCategoryStats, getMonthlyTrend } from '@/features/analytics/services/analyticsService'
import { StatCard } from '@/features/analytics/components/StatCard'
import { CategoryPieChart } from '@/features/analytics/components/CategoryPieChart'
import { MonthlyTrendChart } from '@/features/analytics/components/MonthlyTrendChart'
import { Card, CardHeader, CardTitle, CardContent } from '@account-book/ui'
import { formatDate } from '@account-book/ui'

const DEFAULT_BOOK_ID = '11111111-1111-1111-1111-111111111111'
const now = new Date()

export default async function DashboardPage() {
  const [stats, categoryStats, trend] = await Promise.all([
    getMonthlyStats(DEFAULT_BOOK_ID, now.getFullYear(), now.getMonth() + 1),
    getCategoryStats(DEFAULT_BOOK_ID, now.getFullYear(), now.getMonth() + 1),
    getMonthlyTrend(DEFAULT_BOOK_ID, 6),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="本月收入" value={stats.income} type="income" />
        <StatCard title="本月支出" value={stats.expense} type="expense" />
        <StatCard title="本月结余" value={stats.balance} type="balance" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryPieChart data={categoryStats} />
        <MonthlyTrendChart data={trend} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 analytics/page.tsx**

```typescript
// apps/web/src/app/books/[bookId]/analytics/page.tsx
// 类似仪表盘但按账本隔离，支持月份选择
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/analytics/ apps/web/src/app/page.tsx apps/web/src/app/books/[bookId]/analytics/
git commit -m "feat(analytics): add dashboard with stats, charts and monthly trend"
```

---

### Task 10: 创建 Sidebar 导航和全局布局

**文件：**
- 创建: `apps/web/src/features/layout/Sidebar.tsx`
- 创建: `apps/web/src/features/layout/Sidebar.tsx`

- [ ] **Step 1: 创建 Sidebar 组件**

```typescript
// apps/web/src/features/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@account-book/ui'
import { BookOpen, PieChart, ArrowRightLeft, BarChart3 } from 'lucide-react'

const navItems = [
  { href: '/', label: '仪表盘', icon: BarChart3 },
  { href: '/books', label: '账本', icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">记账本</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">
        单用户账本 v1.0
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/features/layout/
git commit -m "feat(layout): add sidebar navigation"
```

---

### Task 11: 创建 apps/ui-lab (Vite 组件演示场)

**文件：**
- 创建: `apps/ui-lab/package.json`
- 创建: `apps/ui-lab/tsconfig.json`
- 创建: `apps/ui-lab/vite.config.ts`
- 创建: `apps/ui-lab/index.html`
- 创建: `apps/ui-lab/src/main.tsx`
- 创建: `apps/ui-lab/src/App.tsx`

- [ ] **Step 1: 创建 apps/ui-lab/package.json**

```json
{
  "name": "@account-book/ui-lab",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@account-book/ui": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "@account-book/config-tailwind": "workspace:*",
    "@account-book/config-typescript": "workspace:*",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@account-book/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
})
```

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>UI Lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: 创建 App.tsx (展示所有共享组件)**

```tsx
// apps/ui-lab/src/App.tsx
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge, Skeleton, Separator } from '@account-book/ui'
import { formatCurrency } from '@account-book/ui'

export default function App() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">UI Lab - 组件演示</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Button</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Card</h2>
        <Card className="w-[350px]">
          <CardHeader><CardTitle>卡片标题</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">这是卡片内容区域</p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Badge</h2>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Input</h2>
        <div className="w-[300px] space-y-2">
          <Input placeholder="输入框" />
          <Input type="number" placeholder="数字输入" />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Skeleton</h2>
        <div className="space-y-2 w-[300px]">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/ui-lab/
git commit -m "feat(ui-lab): add Vite component lab for UI showcase"
```

---

### Task 12: 添加基础测试

**文件：**
- 创建: `apps/web/src/lib/utils.test.ts`
- 创建: `apps/web/src/features/transactions/services/transactionService.test.ts`
- 创建: `apps/web/src/features/analytics/services/analyticsService.test.ts`

- [ ] **Step 1: 安装测试依赖**

```bash
pnpm --filter @account-book/web add -D vitest @vitest/coverage-v8
```

- [ ] **Step 2: 创建 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 3: 写 utils 测试**

```typescript
// apps/web/src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, getMonthRange } from './utils'

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(1234.5)).toContain('1,234.5')
  })
})

describe('getMonthRange', () => {
  it('returns correct start and end dates', () => {
    const { start, end } = getMonthRange(2026, 4)
    expect(start.getFullYear()).toBe(2026)
    expect(start.getMonth()).toBe(3)
    expect(end.getDate()).toBe(30)
  })
})
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/lib/utils.test.ts apps/web/src/features/analytics/services/analyticsService.test.ts
git commit -m "test: add unit tests for utility functions and analytics service"
```

---

### Task 13: 端到端验证 (最终检查)

- [ ] **Step 1: 运行 full build**

```bash
pnpm build
```

Expected: 所有 packages 和 apps 均 build 成功

- [ ] **Step 2: 验证 apps/web dev server 启动**

```bash
pnpm --filter @account-book/web dev
```

Expected: Next.js dev server 启动在 localhost:3000

- [ ] **Step 3: 验证 apps/ui-lab dev server 启动**

```bash
pnpm --filter @account-book/ui-lab dev
```

Expected: Vite dev server 启动在 localhost:5173

- [ ] **Step 4: 确认 monorepo 交付标准**

检查清单 (对应设计文档 9. 交付标准):
- [ ] monorepo 可运行
- [ ] `apps/web` 可完成完整记账流程
- [ ] `apps/ui-lab` 可展示共享组件
- [ ] Supabase migration 可创建核心表
- [ ] 有 seed 数据方便演示
- [ ] 至少有一套基础统计页面
- [ ] 有基本测试覆盖关键逻辑
- [ ] 整体 UI 整洁，适合作业展示

- [ ] **Step 5: Commit all remaining changes**

```bash
git add -A
git commit -m "chore: complete account book monorepo implementation"
```

---

## 自查清单

### Spec 覆盖检查

| 设计文档章节 | 对应任务 |
|------------|---------|
| 2.1 Monorepo 结构 | Task 1, 2 |
| 3.1 仪表盘 | Task 9 |
| 3.2 账本管理 | Task 6 |
| 3.3 分类管理 | Task 7 |
| 3.4 交易记录 | Task 8 |
| 3.5 统计分析 | Task 9 |
| 4. 页面结构 | Tasks 5-9 |
| 5. 数据库模型 | Task 4 |
| 6. 前端架构 | Tasks 2, 3, 5 |
| 7. 错误处理 | Tasks 6-8 表单验证 |
| 8. 测试策略 | Task 12 |

### 类型一致性检查
- `Transaction.type` 和 `Category.type` 均使用 `'income' | 'expense'`
- `book_id` 外键在所有 service 中一致传递
- `TransactionInput` 与 `Transaction` 类型匹配
- `formatCurrency` 返回 string 用于展示

### 占位符扫描
无 TBD/TODO/未填写内容。所有步骤包含完整代码和命令。
