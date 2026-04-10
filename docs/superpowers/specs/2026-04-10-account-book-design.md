# 记账本全栈项目设计文档

**日期**: 2026-04-10  
**技术栈**: monorepo + pnpm + turborepo + Supabase + Next.js + shadcn/ui + Tailwind + React + Vite

---

## 1. 项目概述

### 1.1 项目目标
搭建一个全栈记账本应用，作为学习/作业导向的 MVP 版本。项目采用 monorepo 架构，体现现代前端工程化实践。

### 1.2 范围约束
- **首版不做登录**：单用户多账本模式
- **目标**：学习/作业展示
- **数据模型**：个人多账本
- **终端形态**：响应式 Web

### 1.3 明确排除的功能（首版）
- 用户认证/登录
- 多人协作/共享账本
- 预算管理
- 账户余额体系
- 文件导入导出
- 多币种
- 实时同步
- 移动端原生封装

---

## 2. 整体架构

### 2.1 Monorepo 结构

```
assignment-2-new/
├── apps/
│   ├── web/              # Next.js 主应用
│   └── ui-lab/           # Vite 组件实验场
├── packages/
│   ├── ui/               # 共享 UI 组件
│   ├── config-typescript/# TS 配置
│   ├── config-eslint/    # ESLint 配置
│   └── config-tailwind/  # Tailwind 配置
├── supabase/
│   ├── schemas/          # 数据库 schema
│   ├── migrations/       # 迁移文件
│   └── seeds/            # 种子数据
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### 2.2 应用职责

| 应用 | 技术 | 职责 |
|------|------|------|
| `apps/web` | Next.js | 主业务应用，页面路由、数据获取、表单提交 |
| `apps/ui-lab` | Vite | 组件演示环境，验证共享 UI 组件 |
| `packages/ui` | React | 共享 UI 组件、表单字段、布局壳、图表卡片 |
| `supabase` | Postgres | 数据库存储、migration、seed、类型生成 |

### 2.3 数据流

```
用户 → apps/web (Next.js) → 服务层 → Supabase Postgres
                                    ↓
apps/ui-lab (Vite) ← packages/ui ← 类型定义
```

---

## 3. 功能模块

### 3.1 仪表盘 (`/`)
- 本月收入
- 本月支出
- 本月结余
- 最近交易记录
- 分类支出占比
- 月度趋势图

### 3.2 账本管理 (`/books`)
- 查看账本列表
- 新建账本
- 编辑账本名称/描述
- 切换当前账本
- 删除账本（首版可选）

### 3.3 分类管理 (`/books/[bookId]/categories`)
- 分类列表
- 新建分类
- 编辑分类
- 删除分类
- 分类类型：`income` / `expense`

### 3.4 交易记录 (`/books/[bookId]/transactions`)
- 新增收入/支出记录
- 编辑记录
- 删除记录
- 按账本查看列表
- 按月份筛选
- 按分类筛选

### 3.5 统计分析 (`/books/[bookId]/analytics`)
- 月收入/支出汇总
- 按分类聚合
- 最近 6 个月趋势
- 统计卡片

---

## 4. 页面结构

| 路径 | 说明 |
|------|------|
| `/` | 仪表盘 |
| `/books` | 账本列表 |
| `/books/[bookId]` | 账本概览 |
| `/books/[bookId]/transactions` | 交易记录页 |
| `/books/[bookId]/categories` | 分类管理页 |
| `/books/[bookId]/analytics` | 统计分析页 |

全局导航：侧边栏用于账本切换和模块导航。

---

## 5. 数据库模型

### 5.1 `books` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 主键 |
| `name` | text | 账本名称 |
| `description` | text | 描述 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### 5.2 `categories` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 主键 |
| `book_id` | uuid | 外键 → books.id |
| `name` | text | 分类名称 |
| `type` | text | `income` 或 `expense` |
| `color` | text | 颜色标识 |
| `icon` | text | 图标 (可选) |
| `created_at` | timestamptz | 创建时间 |

约束：
- 同一个账本下分类名称唯一
- `type` 只能是 `income` 或 `expense`

### 5.3 `transactions` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 主键 |
| `book_id` | uuid | 外键 → books.id |
| `category_id` | uuid | 外键 → categories.id |
| `type` | text | `income` 或 `expense` |
| `amount` | numeric | 金额 (> 0) |
| `note` | text | 备注 |
| `transaction_date` | date | 交易日期 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

约束：
- `amount > 0`
- `type` 只能是 `income` 或 `expense`
- 交易类型应与分类类型一致（应用层保证）

---

## 6. 前端架构

### 6.1 分层设计

| 层级 | 位置 | 职责 |
|------|------|------|
| 业务层 | `apps/web` | 页面路由、数据获取、表单提交、业务状态 |
| 共享 UI 层 | `packages/ui` | 通用可复用组件 |
| 演示层 | `apps/ui-lab` | 组件演示、交互验证 |

### 6.2 Feature 拆分

`apps/web` 按业务 feature 组织：

```
apps/web/src/features/
├── books/
│   ├── components/
│   ├── services/
│   └── types/
├── categories/
│   ├── components/
│   ├── services/
│   └── types/
├── transactions/
│   ├── components/
│   ├── services/
│   └── types/
└── analytics/
    ├── components/
    ├── services/
    └── types/
```

### 6.3 状态管理

- 页面数据：服务端获取
- 表单状态：局部组件状态 + schema 校验
- 当前账本：URL 参数或轻量客户端状态
- 不引入重型状态库

---

## 7. 错误处理

### 7.1 表单校验错误
- 金额为空/小于等于 0
- 未选择分类
- 日期为空
- 分类名重复

### 7.2 数据约束错误
- 删除分类时仍有关联交易
- 交易类型与分类类型不一致
- 账本不存在

### 7.3 空数据状态
- 还没有账本
- 账本下还没有分类
- 还没有交易记录
- 当前月份没有统计数据

---

## 8. 测试策略

### 8.1 单元测试
- 金额汇总逻辑
- 月度分组
- 分类聚合
- 图表数据转换
- 表单 schema 校验

### 8.2 组件测试
- `TransactionForm`
- `CategoryForm`
- `StatCard`
- 空状态和错误状态组件

### 8.3 集成测试
- 创建账本
- 创建分类
- 新增交易
- 页面展示统计结果

---

## 9. 交付标准

第一版完成的判断标准：

- [ ] monorepo 可运行
- [ ] `apps/web` 可完成完整记账流程
- [ ] `apps/ui-lab` 可展示共享组件
- [ ] Supabase migration 可创建核心表
- [ ] 有 seed 数据方便演示
- [ ] 至少有一套基础统计页面
- [ ] 有基本测试覆盖关键逻辑
- [ ] 整体 UI 整洁，适合作业展示

---

## 10. Supabase 职责

首版 Supabase 仅承担：
- Postgres 数据库存储
- migration 管理
- seed 初始化演示数据
- 类型生成（给前端复用）

**不强依赖**：
- Auth
- Storage
- Realtime
- Edge Functions

---

## 11. 服务层设计

在 `apps/web` 内封装服务层，避免页面直接调用 Supabase：

- `bookService`
- `categoryService`
- `transactionService`
- `analyticsService`
