# 实现计划：简历导出功能重构 (export-refactor)

## 概述

将导出渲染引擎从 html2canvas 替换为 html-to-image（SVG foreignObject），通过新建 renderEngine.ts 抽象层、重构 exportService.ts 内部实现、移除旧依赖，并保持公开 API 不变。使用 TypeScript 实现，fast-check 编写属性测试。

## Tasks

- [x] 1. 创建渲染引擎抽象层 renderEngine.ts
  - [x] 1.1 创建 `src/services/renderEngine.ts`，定义 `RenderOptions` 接口和 `RenderEngine` 接口
    - 实现 `domToCanvas` 方法：调用 html-to-image 的 `toCanvas`，传入 width/height/pixelRatio/backgroundColor/filter 参数
    - 实现 `domToDataURL` 方法：调用 html-to-image 的 `toCanvas` 后通过 Canvas API 转换为 DataURL，支持 format 和 quality 参数
    - 导出 `renderEngine` 单例对象
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 1.2 编写属性测试：Canvas 尺寸不变量
    - **Property 1: Canvas 尺寸不变量**
    - 使用 fast-check 生成随机 width/height/pixelRatio，验证 `domToCanvas` 返回的 Canvas 尺寸等于 `width * pixelRatio × height * pixelRatio`
    - **Validates: Requirement 1.3**

  - [ ]* 1.3 编写 renderEngine 单元测试
    - 测试 `domToCanvas` 正确调用 html-to-image 的 `toCanvas`
    - 测试 `domToDataURL` 正确返回指定格式的 DataURL
    - 测试 filter 回调被正确传递
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [x] 2. 重构 exportService.ts 使用 renderEngine
  - [x] 2.1 重构 `exportService.ts` 内部渲染调用
    - 将 `import html2canvas` 替换为 `import { renderEngine } from './renderEngine'`
    - 将 `elementToCanvas` 函数替换为调用 `renderEngine.domToCanvas`
    - 将图片导出中的 `elementToCanvas` + `canvas.toBlob` 替换为 `renderEngine.domToDataURL` + `dataURLToBlob` 辅助函数
    - 新增 `dataURLToBlob` 辅助函数用于 DataURL 到 Blob 的转换
    - 保持所有公开函数签名不变：`exportToPDF`, `exportToPNG`, `exportToJPG`, `exportToJSON`, `downloadFile`
    - _Requirements: 3.1, 3.6, 4.1, 4.2, 4.3, 4.4, 10.1, 10.2, 10.3_

  - [ ]* 2.2 编写属性测试：暗色模式类名完全清除
    - **Property 2: 暗色模式类名完全清除**
    - 使用 fast-check 生成包含随机 `dark:` 前缀类名的 DOM 树，验证 `stripDarkClasses` 后无任何 `dark:` 或 `dark` 类名残留
    - **Validates: Requirement 2.3**

  - [ ]* 2.3 编写属性测试：进度回调单调递增且有界
    - **Property 3: 进度回调单调递增且有界**
    - 收集导出过程中所有 onProgress 回调值，验证序列严格递增且所有值在 [0, 100] 范围内
    - **Validates: Requirements 5.1, 5.2**

- [x] 3. 重构分页逻辑并编写属性测试
  - [x] 3.1 提取并导出 `computePageBreaks` 和 `collectBreakpoints` 为可测试的纯函数
    - 确保函数签名和逻辑与现有实现一致
    - 导出 A4 常量和 PAGE_CONTENT_HEIGHT_PX 供测试使用
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 3.2 编写属性测试：分页断点结构有效性
    - **Property 4: 分页断点结构有效性**
    - 使用 fast-check 生成随机排序的断点数组（包含 0）和正的 totalHeight，验证 `computePageBreaks` 返回首元素为 0 且严格递增的数组
    - **Validates: Requirements 6.2, 6.3**

  - [ ]* 3.3 编写属性测试：分页断点最大间距约束
    - **Property 5: 分页断点最大间距约束**
    - 验证 `computePageBreaks` 返回的相邻断点间距不超过页面内容高度
    - **Validates: Requirement 6.4**

  - [ ]* 3.4 编写属性测试：分页断点覆盖完整内容
    - **Property 6: 分页断点覆盖完整内容**
    - 验证最后一个断点加上页面内容高度 >= totalHeight
    - **Validates: Requirement 6.5**

- [x] 4. Checkpoint - 确保核心功能完整
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 5. 移除 html2canvas 依赖和文件
  - [x] 5.1 删除 `src/lib/html2canvas.esm.js` 和 `src/lib/html2canvas-patched.ts`
    - _Requirements: 7.3_

  - [x] 5.2 从 `package.json` 中移除 `html2canvas` 依赖
    - 保留 `html-to-image` 和 `jspdf` 依赖
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 5.3 清理项目中所有对 html2canvas 的残留引用
    - 搜索并移除所有 import/require html2canvas 的语句
    - 确保无编译错误
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 6. 更新现有测试并补充 JSON 属性测试
  - [x] 6.1 更新 `src/services/__tests__/exportService.test.ts`
    - 更新 mock 从 html2canvas 改为 html-to-image / renderEngine
    - 确保现有 `exportToJSON` 和 `downloadFile` 测试继续通过
    - _Requirements: 8.1, 8.2, 8.3, 10.1, 10.2_

  - [ ]* 6.2 编写属性测试：JSON 序列化往返一致性
    - **Property 7: JSON 序列化往返一致性**
    - 使用 fast-check 生成随机 ResumeData 对象，验证 `exportToJSON` 后 `JSON.parse` 结果与原始数据深度相等
    - **Validates: Requirement 8.1**

- [x] 7. 集成验证与最终检查
  - [x] 7.1 确保所有导出函数的错误处理逻辑完整
    - 验证 html-to-image 渲染失败时错误正确传播
    - 验证 finally 块中离屏 DOM 清理逻辑
    - 验证 CORS 配置选项传递给 html-to-image
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 7.2 编写错误处理单元测试
    - 测试渲染失败时错误传播
    - 测试 finally 块中 offscreen 容器清理
    - _Requirements: 9.1, 9.2_

- [x] 8. Final checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户确认。

## Notes

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务引用了具体的需求编号以确保可追溯性
- 属性测试使用 fast-check（已在 devDependencies 中）
- html-to-image 已在 dependencies 中，无需额外安装
- 重构保持公开 API 签名不变，ExportBar 组件无需修改
