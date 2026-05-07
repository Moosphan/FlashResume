# Flash Resume

[中文](./README.md) | [English](./README.en.md)

A browser-based resume editor built with React + TypeScript. It supports local storage, live preview, multiple template switching, and export to `PDF / PNG / JPG / JSON`.

## Preview

<p align="center">
  <img src="./flashresume_light_theme.png" alt="Light theme editor" width="49%" />
  <img src="./flashresume_dark.png" alt="Dark theme editor" width="49%" />
</p>

<p align="left">
  <img src="./flashresume_templates.png" alt="Template gallery" width="49%" />
</p>

## Features

- Multi-resume management: create, switch, rename, and delete multiple resumes
- Live preview: edit on the left, A4-scale preview on the right, with zoom support
- 24 industry templates: tech, finance, healthcare, legal, education, government, retail, logistics, and more
- Template gallery: filter templates by industry
- Custom theme color: adjust the primary color with a color picker
- Drag-and-drop section ordering powered by `dnd-kit`
- Custom sections with rich text content
- Local storage: data is automatically saved to `localStorage`
- Bilingual UI: supports both Chinese and English labels and date formats
- Export: supports `PDF / PNG / JPG / JSON`
- Tutorial panel with built-in resume writing guidance
- Dark mode: supports both Light and Dark themes
- Responsive layout for desktop and mobile

## Tech Stack

| Category | Technology |
|------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| State management | Zustand |
| Drag and drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Export | `html-to-image` + `jsPDF` + Web Worker |
| Testing | Vitest + Testing Library + fast-check |
| Linting | ESLint + TypeScript ESLint |

## Architecture

### Frontend Structure

- `components/Editor`: form editing area, including personal info, experience, education, projects, skills, and custom sections
- `components/Preview`: A4 preview panel and template components
- `components/Gallery`: template gallery and filter panel
- `components/Layout`: overall layout, export bar, sidebar, and mobile navigation
- `components/Tutorial`: resume writing tutorial panel
- `components/UI`: shared UI components

### State Management

- `resumeStore`: resume data, template, theme color, and resume list
- `uiStore`: UI state, toast messages, tutorial panel, current tab, and theme mode

### Service Layer

- `storageService`: `localStorage` read/write helpers
- `templateRegistry`: template registration and lookup
- `exportService`: image / PDF / JSON export entry
- `renderEngine`: DOM to Canvas / DataURL rendering wrapper
- `pdfWorker` / `pdfWorkerClient`: PDF assembly and worker communication
- `importService`: JSON import
- `validationService`: form and data validation

## PDF Export Pipeline

PDF export does not assemble the DOM directly. Instead, it uses a two-stage pipeline:

1. Clone the preview DOM into an offscreen container
2. Render the DOM into a high-resolution bitmap with `html-to-image`
3. Slice multi-page content by computed page breaks
4. Send page bitmaps to a Web Worker
5. Assemble the final PDF in the worker with `jsPDF` to avoid blocking the main thread

Current characteristics:

- Export output stays as close as possible to the live preview
- Supports multi-page pagination
- Supports export progress feedback
- PDF assembly runs in a Web Worker

## Data Model

Each resume contains the following modules, and each one can be edited and reordered independently:

- Personal information: name, email, phone, address, website, avatar
- Work experience: company, role, date range, description
- Projects: project name, role, date range, description
- Education: school, degree, major, date range
- Skills: skill name and level
- Custom sections: title + rich text content

Data is stored in browser `localStorage` by default, with no backend required.

## Project Structure

```text
src/
├── components/
│   ├── Editor/
│   ├── Gallery/
│   ├── Layout/
│   ├── Preview/
│   ├── Tutorial/
│   └── UI/
├── data/
├── hooks/
├── services/
├── stores/
├── types/
└── utils/
```

## Quick Start

```bash
npm install
npm run dev
```

Other common commands:

```bash
# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## Development Notes

- The current UI version label is `v1.0`
- The project version is `1.0.0`
- A preset resume is injected by default so templates can be previewed immediately in local development
- On mobile, the editor keeps an offscreen preview instance mounted so export always has an available DOM source

## GA4 Analytics

The project includes optional GA4 page analytics and a visitor count badge.

Frontend environment variables:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_VISITOR_COUNT_API_URL=https://your-worker-subdomain.workers.dev/stats
```

Related Cloudflare Worker files:

- `cloudflare/ga4-counter-worker.mjs`
- `cloudflare/wrangler.toml.example`

Main worker environment variables:

- `GA4_PROPERTY_ID`
- `GA4_START_DATE`
- `GA4_SERVICE_ACCOUNT_EMAIL`
- `GA4_SERVICE_ACCOUNT_PRIVATE_KEY`
- `ALLOWED_ORIGIN`
- `COUNTER_CACHE_TTL`

Deployment steps:

```bash
npm install -g wrangler
wrangler login
cd cloudflare
cp wrangler.toml.example wrangler.toml
wrangler secret put GA4_SERVICE_ACCOUNT_EMAIL
wrangler secret put GA4_SERVICE_ACCOUNT_PRIVATE_KEY
wrangler deploy
```

## License

CC BY-NC 4.0  
See [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

## QA

Troubleshooting notes are available in [QA.md](./QA.md).
