# Flash Resume

一款基于浏览器的在线简历制作工具，支持实时预览、多模板切换、PDF 导出，数据完全存储在本地，无需后端服务。

## 功能特性

- 多简历管理：创建、切换、重命名、删除多份简历
- 实时预览：左侧编辑、右侧 A4 比例实时渲染，支持缩放（按钮 / Ctrl+滚轮 / 触控板手势）
- 24 套行业模板：覆盖科技、金融、医疗、法律、教育、政府、零售、物流等行业，通过模板画廊按行业筛选
- 主题色自定义：通过取色器自由调整简历配色
- 拖拽排序：基于 dnd-kit 的模块拖拽排序，自由调整简历结构
- 自定义区块：可添加任意自定义内容模块
- 导入 / 导出：支持 JSON 格式的简历数据导入导出
- 高保真导出：基于 html-to-image（SVG foreignObject）+ jsPDF，导出样式与预览一致，支持 PDF / PNG / JPG 格式，PDF 组装在 Web Worker 中执行不阻塞 UI
- 字体离线友好：已移除 Google Fonts 依赖，预览与导出统一使用系统本地字体栈，提升 Safari 与线上环境稳定性
- 实时导出进度：导出过程中显示平滑进度动画
- 简历写作指南：内置教程面板，提供结构化的简历撰写技巧
- 自动保存：编辑内容自动保存至 localStorage
- 中英文切换：简历内容标签及日期格式支持中 / 英文切换
- 深色模式：支持 Light / Dark 主题切换
- 响应式布局：适配桌面端和移动端
- Toast 通知：操作反馈通过 Toast 提示

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 |
| 状态管理 | Zustand |
| 拖拽 | @dnd-kit/core + @dnd-kit/sortable |
| PDF 导出 | html-to-image（SVG foreignObject）+ jsPDF + Web Worker |
| 取色器 | react-colorful |
| 测试 | Vitest + Testing Library + fast-check |
| 代码规范 | ESLint + TypeScript ESLint |

## 项目结构

```
src/
├── components/
│   ├── Editor/          # 编辑表单（个人信息、经历、教育、项目、技能、自定义区块、排序列表）
│   ├── Gallery/         # 行业模板画廊（筛选面板、模板卡片、画廊覆盖层）
│   ├── Layout/          # 页面布局（AppLayout、Sidebar、ExportBar）
│   ├── Preview/         # 预览面板 + 24 套行业模板组件
│   ├── Tutorial/        # 简历写作教程面板
│   └── UI/              # 通用 UI 组件（模板选择器、取色器、主题切换、标签输入、确认弹窗、富文本编辑器）
├── data/                # 行业数据、预设简历、教程数据
├── hooks/               # useAutoSave、useDebounce、useLocale、useMediaQuery
├── services/            # exportService、renderEngine、pdfWorker、importService、storageService、templateRegistry、validationService
├── stores/              # resumeStore（简历数据）、uiStore（界面状态）
├── types/               # TypeScript 类型定义
└── utils/               # 校验工具、i18n 标签
```

## 快速开始

```bash
# 复制环境变量模板
cp .env.example .env.local

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint
```

## GA4 访问统计

项目已内置：

- `GA4` 前端埋点
- 可选的页面左下角访问量角标
- 可选的 `Cloudflare Worker` 统计中转示例：`cloudflare/ga4-counter-worker.mjs`

### 1. 配置前端环境变量

在 `.env.local` 中填写：

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

说明：

- `VITE_GA_MEASUREMENT_ID`：GA4 Web Data Stream 的 Measurement ID

如果你后续要开启左下角访问量角标，再额外配置：

```bash
VITE_VISITOR_COUNT_API_URL=https://your-worker-subdomain.workers.dev/stats
```

说明：

- `VITE_VISITOR_COUNT_API_URL`：GA4 统计中转接口地址；不填时仅保留 GA4 埋点，不显示页面角标

### 2. 可选：配置 Cloudflare Worker

`cloudflare/ga4-counter-worker.mjs` 需要以下环境变量：

- `GA4_PROPERTY_ID`：GA4 Property ID（纯数字）
- `GA4_START_DATE`：统计起始日期，例如 `2026-01-01`
- `GA4_SERVICE_ACCOUNT_EMAIL`：Google Service Account 邮箱
- `GA4_SERVICE_ACCOUNT_PRIVATE_KEY`：对应私钥
- `ALLOWED_ORIGIN`：你的站点域名，例如 `https://yourname.github.io`
- `COUNTER_CACHE_TTL`：缓存秒数，推荐 `60`

可直接复制模板：

```bash
cp cloudflare/wrangler.toml.example cloudflare/wrangler.toml
```

### 2.1 Worker 部署步骤

```bash
# 全局安装 wrangler（如未安装）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 进入 Worker 目录
cd cloudflare

# 复制配置模板
cp wrangler.toml.example wrangler.toml

# 设置敏感信息
wrangler secret put GA4_SERVICE_ACCOUNT_EMAIL
wrangler secret put GA4_SERVICE_ACCOUNT_PRIVATE_KEY

# 发布
wrangler deploy
```

发布成功后，把生成的 `/stats` 地址填回：

```bash
VITE_VISITOR_COUNT_API_URL=https://your-worker-subdomain.workers.dev/stats
```

Worker 返回格式：

```json
{
  "totalViews": 12345,
  "activeUsers": 3,
  "updatedAt": "2026-04-27T12:00:00.000Z"
}
```

### 3. 可选：左下角角标显示内容

页面左下角会显示：

- 累计访问量 `Visits / 访问`
- 当前活跃用户 `Live / 在线`

数据每 60 秒刷新一次。

## 数据模型

简历数据包含以下模块，均可独立编辑和排序：

- 个人信息（姓名、邮箱、电话、地址、网站、头像）
- 工作经历（公司、职位、时间段、描述）
- 项目经验（项目名、角色、时间段、描述）
- 教育背景（学校、学位、专业、时间段）
- 技能专长（技能名称 + 等级：初级 / 中级 / 高级 / 专家）
- 自定义区块（标题 + 富文本内容）

所有数据以 JSON 格式存储在浏览器 localStorage 中，无需登录或网络连接。

## License

CC BY-NC 4.0 — 允许自由使用和修改，禁止商业用途。详见 [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)。
