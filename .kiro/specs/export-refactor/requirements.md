# 需求文档：简历导出功能重构 (export-refactor)

## 简介

本文档定义了 FlashResume 导出功能重构的需求。重构的核心目标是将渲染引擎从 html2canvas 替换为 html-to-image（基于 SVG foreignObject），以提升样式保真度、导出速度，并减少包体积。重构保持公开 API 不变，确保上层组件（ExportBar）无需修改。

## 术语表

- **RenderEngine**：渲染引擎抽象层（renderEngine.ts），负责将 DOM 元素转换为 Canvas 或 DataURL
- **ExportService**：导出服务（exportService.ts），协调渲染引擎与输出生成，处理分页、进度回调等逻辑
- **ExportBar**：导出栏 UI 组件，提供用户触发导出的交互界面
- **OffscreenClone**：离屏克隆节点，用于在不影响页面显示的情况下准备导出内容
- **PageBreak**：分页断点，定义 PDF 多页导出时每页的起止位置
- **ProgressCallback**：进度回调函数，类型为 `(progress: number) => void`，用于报告导出进度（0-100）
- **A4**：标准 A4 纸张尺寸常量集合（595.28pt × 841.89pt，794px × 1123px）

## 需求

### 需求 1：渲染引擎抽象层

**用户故事：** 作为开发者，我希望有一个渲染引擎抽象层，以便将来可以灵活更换底层渲染实现而无需修改上层导出逻辑。

#### 验收标准

1. THE RenderEngine SHALL provide a `domToCanvas` method that accepts an HTMLElement and RenderOptions and returns a Promise resolving to an HTMLCanvasElement
2. THE RenderEngine SHALL provide a `domToDataURL` method that accepts an HTMLElement, RenderOptions, optional format ('png' or 'jpeg'), and optional quality parameter, and returns a Promise resolving to a string
3. WHEN `domToCanvas` is called with valid parameters, THE RenderEngine SHALL return a Canvas whose pixel width equals `options.width * options.pixelRatio` and pixel height equals `options.height * options.pixelRatio`
4. WHEN `domToCanvas` is called, THE RenderEngine SHALL delegate rendering to html-to-image using SVG foreignObject
5. WHEN a `filter` callback is provided in RenderOptions, THE RenderEngine SHALL apply the filter to exclude specified DOM nodes before rendering

### 需求 2：离屏克隆与暗色模式清理

**用户故事：** 作为用户，我希望导出的文件始终使用浅色主题，即使我当前使用暗色模式浏览简历。

#### 验收标准

1. WHEN preparing an element for export, THE ExportService SHALL create a deep clone of the element in an offscreen container
2. WHEN creating an OffscreenClone, THE ExportService SHALL set the clone width to A4.WIDTH_PX pixels and background to white
3. WHEN creating an OffscreenClone, THE ExportService SHALL remove all CSS class names with the `dark:` prefix and the `dark` class from the clone and all descendant elements
4. WHEN export completes or fails, THE ExportService SHALL remove the offscreen container from the document body

### 需求 3：PDF 导出

**用户故事：** 作为用户，我希望将简历导出为标准 A4 尺寸的 PDF 文件，支持多页分页且样式与预览一致。

#### 验收标准

1. WHEN `exportToPDF` is called with a valid element, THE ExportService SHALL return a Blob of type 'application/pdf'
2. WHEN the resume content height is less than or equal to A4.HEIGHT_PX, THE ExportService SHALL generate a single-page PDF
3. WHEN the resume content height exceeds A4.HEIGHT_PX, THE ExportService SHALL compute page breaks and generate a multi-page PDF
4. WHEN generating a multi-page PDF, THE ExportService SHALL ensure page breaks do not split child elements within 2 levels of nesting depth
5. WHEN generating each PDF page, THE ExportService SHALL draw a footer containing the person name and page number in format "current / total"
6. THE ExportService SHALL maintain the `exportToPDF(element, personName?, onProgress?)` function signature unchanged from the current API

### 需求 4：图片导出（PNG/JPG）

**用户故事：** 作为用户，我希望将简历导出为 PNG 或 JPG 图片，图片内容与预览一致。

#### 验收标准

1. WHEN `exportToPNG` is called with a valid element, THE ExportService SHALL return a Blob of type 'image/png'
2. WHEN `exportToJPG` is called with a valid element, THE ExportService SHALL return a Blob of type 'image/jpeg' with quality 0.92
3. WHEN exporting an image, THE ExportService SHALL ensure the image height is at least A4.HEIGHT_PX pixels
4. THE ExportService SHALL maintain the `exportToPNG(element, onProgress?)` and `exportToJPG(element, onProgress?)` function signatures unchanged from the current API

### 需求 5：进度回调

**用户故事：** 作为用户，我希望在导出过程中看到进度反馈，以了解导出的当前状态。

#### 验收标准

1. WHEN an onProgress callback is provided, THE ExportService SHALL invoke the callback with progress values between 0 and 100
2. WHEN reporting progress, THE ExportService SHALL ensure each subsequent progress value is strictly greater than the previous value
3. WHEN exporting a multi-page PDF, THE ExportService SHALL report per-page progress proportionally distributed between 65% and 90%
4. WHEN export completes successfully, THE ExportService SHALL have reported a final progress value of at least 92

### 需求 6：分页断点计算

**用户故事：** 作为用户，我希望多页 PDF 的分页位置合理，不会在内容块中间截断。

#### 验收标准

1. WHEN collecting breakpoints, THE ExportService SHALL traverse child elements up to 2 levels deep and record each element's top and bottom Y coordinates
2. WHEN computing page breaks, THE ExportService SHALL return an array whose first element is 0
3. WHEN computing page breaks, THE ExportService SHALL ensure the array is strictly increasing
4. WHEN computing page breaks, THE ExportService SHALL ensure adjacent break distances do not exceed the page content height
5. WHEN computing page breaks, THE ExportService SHALL ensure the last break plus page content height covers the total content height

### 需求 7：依赖替换与包体积优化

**用户故事：** 作为开发者，我希望移除 html2canvas 相关文件和依赖，减少项目包体积和维护成本。

#### 验收标准

1. WHEN the refactoring is complete, THE project SHALL use html-to-image as the sole DOM-to-image rendering dependency
2. WHEN the refactoring is complete, THE project SHALL have removed the `html2canvas` package from package.json
3. WHEN the refactoring is complete, THE project SHALL have deleted `src/lib/html2canvas.esm.js` and `src/lib/html2canvas-patched.ts`
4. THE project SHALL retain jsPDF as the PDF generation dependency

### 需求 8：JSON 导出与文件下载

**用户故事：** 作为用户，我希望将简历数据导出为 JSON 格式，并能通过浏览器下载所有导出文件。

#### 验收标准

1. WHEN `exportToJSON` is called with ResumeData, THE ExportService SHALL return a formatted JSON string with 2-space indentation
2. WHEN `downloadFile` is called with a Blob and filename, THE ExportService SHALL trigger a browser file download with the specified filename
3. THE ExportService SHALL maintain the `exportToJSON(data)` and `downloadFile(blob, filename)` function signatures unchanged from the current API

### 需求 9：错误处理

**用户故事：** 作为用户，我希望导出失败时能收到明确的错误提示，且不会导致页面异常。

#### 验收标准

1. IF html-to-image rendering fails, THEN THE ExportService SHALL propagate the error to the caller for UI-level error handling
2. IF the export process fails at any stage, THEN THE ExportService SHALL clean up the offscreen DOM container in a finally block
3. IF a Canvas memory allocation fails for oversized content, THEN THE ExportService SHALL attempt segmented rendering as a fallback strategy
4. IF cross-origin image resources fail to load, THEN THE RenderEngine SHALL configure CORS fetch options to handle external resources gracefully

### 需求 10：API 兼容性

**用户故事：** 作为开发者，我希望重构后的导出服务保持与现有 ExportBar 组件完全兼容，无需修改调用方代码。

#### 验收标准

1. THE ExportService SHALL export the same set of public functions as the current implementation: `exportToPDF`, `exportToPNG`, `exportToJPG`, `exportToJSON`, `downloadFile`
2. THE ExportService SHALL maintain identical function signatures and return types for all public functions
3. WHEN ExportBar calls any export function, THE ExportService SHALL behave identically from the caller's perspective in terms of input parameters and output types
