# 需求文档：移动端响应式适配

## 简介

FlashResume 是一个基于 React + TypeScript 的在线简历编辑器。当前应用主要针对桌面端设计，在移动设备（iOS / Android）上的阅读和编辑体验不佳。本需求旨在对整个应用进行移动端响应式适配，使用户能够在手机和平板上流畅地浏览、编辑和导出简历。

## 术语表

- **App（应用）**: FlashResume 简历编辑器 Web 应用
- **Mobile_Viewport（移动视口）**: 屏幕宽度小于 768px 的设备视口
- **Tablet_Viewport（平板视口）**: 屏幕宽度在 768px 至 1023px 之间的设备视口
- **Editor_Panel（编辑面板）**: 包含个人信息、工作经历、教育背景、技能、项目等表单的编辑区域
- **Preview_Panel（预览面板）**: 以 A4 纸张比例展示简历实时预览的区域
- **Sidebar（侧边栏）**: 用于管理多份简历的左侧导航面板
- **Header（顶部栏）**: 包含 Logo、导出按钮、语言切换、主题切换的顶部导航栏
- **Tab_Navigation（标签页导航）**: 移动端用于在编辑面板和预览面板之间切换的标签页组件
- **Gallery_Overlay（模板画廊）**: 全屏展示行业模板的浮层组件
- **Touch_Target（触控目标）**: 可点击或可触控的交互元素
- **Export_Menu（导出菜单）**: 包含 PDF、PNG、JPG、JSON 导出选项的下拉菜单
- **RichText_Editor（富文本编辑器）**: 用于编辑工作经历描述等内容的 contentEditable 编辑器
- **DnD_Section_List（拖拽排序列表）**: 支持拖拽排序的简历章节列表组件

## 需求

### 需求 1：移动端视口与元信息配置

**用户故事：** 作为移动端用户，我希望应用在手机浏览器中正确缩放和渲染，以便获得原生般的浏览体验。

#### 验收标准

1. THE App SHALL 在 HTML 文档中包含 viewport meta 标签，设置 `width=device-width, initial-scale=1.0, viewport-fit=cover`
2. THE App SHALL 使用 CSS `env(safe-area-inset-*)` 适配 iOS 刘海屏和底部安全区域
3. WHEN 用户在移动设备上访问应用时，THE App SHALL 禁止页面双指缩放以避免与应用内缩放手势冲突

### 需求 2：移动端布局切换

**用户故事：** 作为移动端用户，我希望编辑和预览区域以纵向堆叠方式展示，并能通过标签页快速切换，以便在小屏幕上高效操作。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE App SHALL 将 Editor_Panel 和 Preview_Panel 从左右并排布局切换为纵向全屏布局
2. WHILE Mobile_Viewport 处于活跃状态时，THE App SHALL 在底部显示 Tab_Navigation，提供"编辑"和"预览"两个标签页
3. WHEN 用户点击 Tab_Navigation 中的"编辑"标签时，THE App SHALL 全屏显示 Editor_Panel 并隐藏 Preview_Panel
4. WHEN 用户点击 Tab_Navigation 中的"预览"标签时，THE App SHALL 全屏显示 Preview_Panel 并隐藏 Editor_Panel
5. WHILE Mobile_Viewport 处于活跃状态时，THE App SHALL 隐藏桌面端的可拖拽分隔条
6. WHILE Tablet_Viewport 处于活跃状态时，THE App SHALL 保持左右并排布局，但将默认编辑面板宽度比例调整为 55%

### 需求 3：顶部栏移动端适配

**用户故事：** 作为移动端用户，我希望顶部导航栏在小屏幕上紧凑排列且所有功能可用，以便快速访问核心操作。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE Header SHALL 将操作按钮紧凑排列，确保所有按钮在单行内可见
2. WHILE Mobile_Viewport 处于活跃状态时，THE Header SHALL 将应用标题文字缩短或隐藏，仅保留 Logo 图标
3. THE Header 中所有 Touch_Target SHALL 保持最小尺寸 44x44 像素，符合 iOS 和 Android 触控规范
4. WHILE Mobile_Viewport 处于活跃状态时，THE Export_Menu SHALL 以从右侧弹出的方式显示，确保下拉菜单不超出屏幕边界

### 需求 4：侧边栏移动端适配

**用户故事：** 作为移动端用户，我希望侧边栏以抽屉方式弹出并可轻松关闭，以便管理多份简历。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE Sidebar SHALL 默认隐藏，通过顶部栏的汉堡菜单按钮触发滑出
2. WHEN 用户点击 Sidebar 外部的遮罩层时，THE Sidebar SHALL 关闭并滑回屏幕左侧
3. WHEN 用户在 Sidebar 中选择一份简历后，THE Sidebar SHALL 自动关闭
4. THE Sidebar 中所有 Touch_Target SHALL 保持最小尺寸 44x44 像素

### 需求 5：编辑表单移动端适配

**用户故事：** 作为移动端用户，我希望表单输入框和按钮在小屏幕上易于操作，以便高效填写简历内容。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE Editor_Panel 中的表单输入框 SHALL 以全宽单列布局排列
2. THE Editor_Panel 中所有文本输入框 SHALL 设置 `font-size` 不小于 16px，防止 iOS Safari 自动缩放
3. WHILE Mobile_Viewport 处于活跃状态时，THE Editor_Panel 中的多列表单字段（如姓名和职位并排）SHALL 切换为单列堆叠布局
4. THE Editor_Panel 中所有按钮和可交互元素 SHALL 保持最小触控目标尺寸 44x44 像素
5. WHILE Mobile_Viewport 处于活跃状态时，THE Editor_Panel SHALL 在底部预留足够的内边距，避免内容被 Tab_Navigation 遮挡

### 需求 6：富文本编辑器移动端适配

**用户故事：** 作为移动端用户，我希望富文本编辑器在触屏设备上易于使用，以便编辑工作经历描述等内容。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE RichText_Editor 的工具栏按钮 SHALL 保持最小触控目标尺寸 44x44 像素
2. WHILE Mobile_Viewport 处于活跃状态时，THE RichText_Editor 的编辑区域 SHALL 设置最小高度为 120px，提供充足的编辑空间
3. THE RichText_Editor SHALL 正确处理移动端虚拟键盘弹出时的页面滚动，确保编辑区域保持可见

### 需求 7：预览面板移动端适配

**用户故事：** 作为移动端用户，我希望在手机上也能清晰地预览简历效果，以便确认排版和内容。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE Preview_Panel SHALL 将默认缩放比例调整为适合屏幕宽度的值（自动计算 `屏幕宽度 / A4宽度 * 100`）
2. THE Preview_Panel SHALL 支持双指缩放手势，允许用户在移动端放大或缩小预览内容
3. WHILE Mobile_Viewport 处于活跃状态时，THE Preview_Panel 的缩放控制按钮 SHALL 保持最小触控目标尺寸 44x44 像素
4. WHILE Mobile_Viewport 处于活跃状态时，THE Preview_Panel SHALL 将缩放控制栏居中显示在底部，避免被 Tab_Navigation 遮挡

### 需求 8：拖拽排序移动端适配

**用户故事：** 作为移动端用户，我希望能够通过触控手势对简历章节进行排序，以便自定义简历结构。

#### 验收标准

1. THE DnD_Section_List SHALL 支持触控拖拽操作，用户可通过长按拖拽手柄启动排序
2. WHILE 拖拽操作进行中，THE DnD_Section_List SHALL 显示拖拽占位符，提供清晰的视觉反馈
3. THE DnD_Section_List 的拖拽手柄 SHALL 保持最小触控目标尺寸 44x44 像素
4. THE DnD_Section_List SHALL 设置触控拖拽的激活距离阈值为 8px，防止误触发拖拽操作

### 需求 9：模板画廊移动端适配

**用户故事：** 作为移动端用户，我希望模板画廊在手机上也能方便浏览和选择模板，以便快速切换简历风格。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE Gallery_Overlay 的模板网格 SHALL 切换为单列布局，每行显示一个模板卡片
2. WHILE Tablet_Viewport 处于活跃状态时，THE Gallery_Overlay 的模板网格 SHALL 切换为两列布局
3. WHILE Mobile_Viewport 处于活跃状态时，THE Gallery_Overlay 的行业筛选标签 SHALL 支持水平滚动，并隐藏滚动条
4. THE Gallery_Overlay 的关闭按钮和模板选择按钮 SHALL 保持最小触控目标尺寸 44x44 像素
5. WHILE Mobile_Viewport 处于活跃状态时，THE Gallery_Overlay 的内边距 SHALL 从 24px 缩减为 16px，最大化内容展示区域

### 需求 10：Toast 通知移动端适配

**用户故事：** 作为移动端用户，我希望通知提示在手机上不遮挡重要内容且易于关闭，以便获得良好的操作反馈。

#### 验收标准

1. WHILE Mobile_Viewport 处于活跃状态时，THE App 的 Toast 通知 SHALL 显示在屏幕顶部居中位置，避免被底部 Tab_Navigation 遮挡
2. THE App 的 Toast 通知关闭按钮 SHALL 保持最小触控目标尺寸 44x44 像素
3. WHILE Mobile_Viewport 处于活跃状态时，THE App 的 Toast 通知宽度 SHALL 适配屏幕宽度，左右各留 16px 边距
