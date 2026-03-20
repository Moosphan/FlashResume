# 实现计划：移动端响应式适配

## 概述

基于现有 React 19 + TypeScript + Tailwind CSS 4 + Zustand 架构，通过新增 `useMediaQuery` Hook、`MobileTabNav` 组件、扩展 `uiStore` 状态，以及对现有布局和表单组件进行响应式改造，实现 Mobile（< 768px）、Tablet（768-1023px）、Desktop（≥ 1024px）三断点的完整移动端适配。每个任务增量构建，确保无孤立代码。

## 任务

- [x] 1. 基础设施：视口配置、全局样式与响应式 Hook
  - [x] 1.1 更新 `index.html` viewport meta 标签并扩展全局 CSS
    - 在 `index.html` 中设置 `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />`
    - 在 `src/index.css` 中添加 CSS 自定义属性：`--safe-area-top`、`--safe-area-bottom`、`--safe-area-left`、`--safe-area-right`（使用 `env(safe-area-inset-*, 0px)`）和 `--mobile-tab-height: 56px`
    - 添加全局触控目标辅助类 `.touch-target { min-width: 44px; min-height: 44px; }`
    - _需求: 1.1, 1.2, 1.3_

  - [x] 1.2 创建 `src/hooks/useMediaQuery.ts` 响应式断点检测 Hook
    - 实现 `useMediaQuery(query: string): boolean`，基于 `window.matchMedia` API
    - 导出 `useIsMobile(): boolean`（< 768px）和 `useIsTablet(): boolean`（768px - 1023px）
    - 导出 `BREAKPOINTS` 常量对象
    - 当 `window.matchMedia` 不可用时返回 `false`（降级到桌面端布局）
    - _需求: 2.1, 2.2_

  - [x] 1.3 扩展 `src/stores/uiStore.ts` 添加 `activeTab` 状态
    - 在 `UIStoreState` 接口中添加 `activeTab: 'editor' | 'preview'` 和 `setActiveTab` 方法
    - 默认值为 `'editor'`，纯运行时状态无需持久化
    - _需求: 2.3, 2.4_


  - [ ]* 1.4 为 `useMediaQuery` Hook 编写单元测试
    - 在 `src/hooks/__tests__/useMediaQuery.test.ts` 中测试 `useIsMobile`、`useIsTablet` 在不同视口宽度下的返回值
    - 测试 `window.matchMedia` 不可用时的降级行为
    - _需求: 2.1_

- [x] 2. 移动端布局切换与底部标签页导航
  - [x] 2.1 创建 `src/components/Layout/MobileTabNav.tsx` 底部标签页组件
    - 实现 `MobileTabNav` 组件，固定在屏幕底部，包含"编辑"和"预览"两个标签
    - 使用 `uiStore.activeTab` 和 `uiStore.setActiveTab` 控制状态
    - 适配 iOS 安全区域：底部 padding 使用 `env(safe-area-inset-bottom)`
    - 所有触控目标 ≥ 44x44px
    - 支持国际化（使用 `useLocale` 获取标签文字）
    - _需求: 2.2, 2.3, 2.4_

  - [x] 2.2 改造 `src/components/Layout/AppLayout.tsx` 实现移动端布局切换
    - 引入 `useIsMobile`、`useIsTablet` Hook
    - Mobile 断点下：根据 `activeTab` 条件渲染 Editor 或 Preview（互斥显示），隐藏拖拽分隔条，底部渲染 `MobileTabNav`
    - Tablet 断点下：保持左右分栏，默认 `editorWidthPct` 设为 55%，隐藏拖拽分隔条
    - Desktop 断点下：保持现有行为不变
    - 编辑面板在移动端底部预留 `var(--mobile-tab-height)` 的内边距，避免被 Tab 遮挡
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.5_

  - [ ]* 2.3 为 Tab 切换面板互斥显示编写属性测试
    - **Property 2: Tab 切换面板互斥显示**
    - **验证: 需求 2.3, 2.4**
    - 在 `src/components/Layout/__tests__/MobileTabNav.property.test.tsx` 中使用 fast-check 随机生成 `activeTab` 值，验证面板互斥

  - [ ]* 2.4 为移动端单面板布局编写属性测试
    - **Property 3: 移动端单面板布局**
    - **验证: 需求 2.1**
    - 在 `src/components/Layout/__tests__/AppLayout.mobile.property.test.tsx` 中随机生成 < 768px 的视口宽度，验证仅显示一个面板

  - [ ]* 2.5 为 AppLayout 移动端行为编写单元测试
    - 在 `src/components/Layout/__tests__/AppLayout.test.tsx` 中添加测试用例：移动端隐藏拖拽分隔条、平板端编辑面板宽度 55%、编辑面板底部预留 Tab 高度
    - _需求: 2.5, 2.6, 5.5_

- [x] 3. 检查点 - 确保基础布局切换功能正常
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 4. 顶部栏与侧边栏移动端适配
  - [x] 4.1 改造 `AppLayout.tsx` 中的 Header 区域
    - 移动端缩短或隐藏应用标题文字，仅保留 Logo 图标（使用 `useIsMobile` 条件渲染）
    - 确保所有 Header 按钮触控目标 ≥ 44x44px（语言切换按钮、主题切换按钮等）
    - _需求: 3.1, 3.2, 3.3_

  - [x] 4.2 改造 `src/components/Layout/ExportBar.tsx` 导出菜单移动端适配
    - 确保导出菜单从右侧弹出时不超出屏幕边界（移动端使用 `right-0` 定位）
    - 导入和导出按钮触控目标 ≥ 44x44px
    - _需求: 3.4, 3.3_

  - [x] 4.3 完善 `src/components/Layout/Sidebar.tsx` 移动端行为
    - 验证并确保选择简历后自动关闭（现有 `handleSelect` 已调用 `onClose()`）
    - 确保所有触控目标 ≥ 44x44px（检查确认/取消按钮的最小尺寸）
    - _需求: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 4.4 为侧边栏选择后自动关闭编写属性测试
    - **Property 4: 侧边栏选择后自动关闭**
    - **验证: 需求 4.3**
    - 在 `src/components/Layout/__tests__/Sidebar.property.test.tsx` 中随机生成简历列表，选择任意简历后验证 sidebar 关闭

- [x] 5. 编辑表单与富文本编辑器移动端适配
  - [x] 5.1 改造编辑表单组件的移动端布局
    - 在各表单组件（PersonalInfoForm、ExperienceForm、EducationForm 等）中，移动端将多列字段切换为单列堆叠布局
    - 确保所有文本输入框 `font-size` ≥ 16px（防止 iOS Safari 自动缩放）
    - 确保所有按钮和可交互元素触控目标 ≥ 44x44px
    - _需求: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 5.2 为文本输入框字体大小编写属性测试
    - **Property 5: 文本输入框字体大小**
    - **验证: 需求 5.2**
    - 在 `src/components/Editor/__tests__/font-size.property.test.tsx` 中渲染 Editor 表单，检查所有 text input 的 font-size ≥ 16px

  - [x] 5.3 改造 `src/components/UI/RichTextEditor.tsx` 移动端适配
    - 工具栏按钮移动端尺寸从 `w-7 h-7` 增大到 `min-w-[44px] min-h-[44px]`
    - 编辑区域移动端最小高度从 80px 增大到 120px
    - 处理虚拟键盘弹出时的滚动：使用 `visualViewport` API 或 `scrollIntoView({ block: 'nearest' })` 确保编辑区域可见
    - _需求: 6.1, 6.2, 6.3_

  - [ ]* 5.4 为 RichTextEditor 移动端行为编写单元测试
    - 在 `src/components/UI/__tests__/RichTextEditor.test.tsx` 中测试移动端工具栏按钮尺寸和编辑区域最小高度
    - _需求: 6.1, 6.2_

- [x] 6. 预览面板移动端适配
  - [x] 6.1 改造 `src/components/Preview/PreviewPanel.tsx` 移动端缩放与布局
    - 移动端默认缩放比例：`Math.floor(screenWidth / 794 * 100)`
    - 支持双指缩放手势（通过 touch events 实现 pinch-to-zoom）
    - 缩放控制按钮触控目标 ≥ 44x44px（从 `w-8 h-8` 增大）
    - 移动端缩放控制栏居中显示在底部，避开 `MobileTabNav` 遮挡（底部偏移 `var(--mobile-tab-height)` + 安全区域）
    - _需求: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 6.2 为预览面板移动端默认缩放计算编写属性测试
    - **Property 6: 预览面板移动端默认缩放计算**
    - **验证: 需求 7.1**
    - 在 `src/components/Preview/__tests__/PreviewPanel.zoom.property.test.tsx` 中随机生成移动端屏幕宽度，验证缩放公式 `Math.floor(w / 794 * 100)`

- [x] 7. 检查点 - 确保编辑和预览面板适配正常
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 8. 拖拽排序与模板画廊移动端适配
  - [x] 8.1 改造 `src/components/Editor/SortableSectionList.tsx` 触控拖拽支持
    - 在 `useSensors` 中添加 `TouchSensor`，设置激活距离阈值为 8px
    - 确保拖拽手柄触控目标 ≥ 44x44px（现有实现已满足）
    - _需求: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 8.2 为 SortableSectionList 触控拖拽编写单元测试
    - 在 `src/components/Editor/__tests__/SortableSectionList.test.tsx` 中验证 `TouchSensor` 配置和激活距离阈值
    - _需求: 8.1, 8.4_

  - [x] 8.3 改造 `src/components/Gallery/IndustryGalleryOverlay.tsx` 移动端布局
    - 移动端模板网格切换为单列布局，平板端切换为两列布局
    - 移动端内边距从 24px 缩减为 16px
    - 关闭按钮和模板选择按钮确保触控目标 ≥ 44x44px
    - _需求: 9.1, 9.2, 9.4, 9.5_

  - [x] 8.4 改造 `src/components/Gallery/FilterPanel.tsx` 滚动条隐藏
    - 移动端行业筛选标签支持水平滚动，隐藏滚动条（`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`）
    - _需求: 9.3_

  - [ ]* 8.5 为 Gallery 移动端适配编写单元测试
    - 在 `src/components/Gallery/__tests__/IndustryGalleryOverlay.test.tsx` 中测试移动端内边距和布局
    - _需求: 9.5_

- [x] 9. Toast 通知移动端适配
  - [x] 9.1 改造 `AppLayout.tsx` 中的 Toast 通知区域
    - 移动端 Toast 显示在屏幕顶部居中位置（从 `fixed bottom-4 right-4` 改为移动端 `fixed top-4 left-4 right-4`），避免被底部 Tab 遮挡
    - Toast 关闭按钮触控目标 ≥ 44x44px
    - 移动端 Toast 宽度适配屏幕，左右各留 16px 边距
    - _需求: 10.1, 10.2, 10.3_

  - [ ]* 9.2 为触控目标最小尺寸编写属性测试
    - **Property 1: 触控目标最小尺寸**
    - **验证: 需求 3.3, 4.4, 5.4, 6.1, 7.3, 8.3, 9.4, 10.2**
    - 在 `src/components/__tests__/touch-targets.property.test.tsx` 中渲染各组件，检查所有交互元素的 min-width/min-height ≥ 44px

- [x] 10. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有疑问请向用户确认。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务引用了具体的需求编号，确保可追溯性
- 检查点任务确保增量验证
- 属性测试验证通用正确性属性，单元测试验证具体示例和边界情况
- 实现语言：TypeScript + React（与现有项目一致）
