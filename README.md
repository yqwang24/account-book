# 记账本 (Account Book)

个人财务管家应用，支持多账本管理、交易记录、分类统计和收支分析。

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **样式**: Tailwind CSS
- **UI组件**: Radix UI
- **包管理**: pnpm + Turborepo

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
apps/
  web/           # Next.js 主应用
  ui-lab/        # UI 组件实验室
packages/
  ui/            # 共享 UI 组件库
supabase/
  migrations/    # 数据库迁移
  seeds/         # 种子数据
```

## 功能

- 多账本管理
- 交易记录（收入/支出）
- 分类管理
- 月度统计和趋势分析
- 分类占比饼图

## 部署

已配置 Vercel 部署，连接到 GitHub master 分支自动部署。

## 环境变量

需要在 `apps/web/.env.local` 中配置：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
