# 实现计划：简历教程面板

## 概述

基于需求和设计文档，将简历教程面板功能拆分为增量式编码任务。从数据层和状态管理开始，逐步构建 UI 组件，最后集成到 AppLayout 中并完成国际化和移动端适配。

## 任务

- [x] 1. 创建教程数据和扩展状态管理
  - [x] 1.1 创建教程数据文件 `src/data/tutorialData.ts`
    - 定义 `TutorialItem` 和 `TutorialCategoryData` 接口
    - 创建 `TUTORIAL_DATA` 常量，包含三个分类（简历入门、简历优化、简历润色），每个分类 4 个教程条目
    - 每个条目包含 `titleZh`、`titleEn`、`contentZh`、`contentEn` 字段
    - 简历入门：简历基本结构、个人信息填写要点、工作经历描述方法、教育背景填写建议
    - 简历优化：量化工作成果、使用行动动词、针对目标岗位定制简历、技能展示策略
    - 简历润色：排版和格式规范、语言表达精炼、常见错误检查、简历长度控制
    - _需求: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_

  - [x] 1.2 扩展 uiStore 添加教程面板状态
    - 在 `UIStoreState` 接口中新增 `tutorialOpen: boolean`
    - 新增 `openTutorial` 和 `closeTutorial` 方法
    - `tutorialOpen` 默认值为 `false`
    - _需求: 1.2, 1.3, 2.3_

  - [x] 1.3 扩展 i18n 添加教程相关翻译键
    - 在 `src/utils/i18n.ts` 的 zh 和 en 翻译对象中新增：`tutorialButton`、`tutorialTitle`、`closeTutorial`
    - _需求: 2.7_

  - [ ]* 1.4 编写教程数据完整性单元测试
    - 创建 `src/data/__tests__/tutorialData.test.ts`
    - 验证三个分类各包含 4 个教程条目
    - 验证每个条目包含中英文标题和内容且非空
    - 验证需求 5/6/7 中指定的具体教程主题存在
    - _需求: 5.1-5.4, 6.1-6.4, 7.1-7.4_

- [x] 2. 实现 TutorialCard 组件
  - [x] 2.1 创建 `src/components/Tutorial/TutorialCard.tsx`
    - 接收 `title: string` 和 `content: string` 属性
    - 使用本地 `useState` 管理展开/折叠状态，默认折叠
    - 折叠时仅显示标题和箭头指示器（▶/▼）
    - 展开时显示完整教程内容
    - 点击标题区域切换展开/折叠
    - 支持深色/浅色模式样式（Tailwind `dark:` 前缀）
    - _需求: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 2.2 编写 TutorialCard 属性测试 - Property 2: 教程卡片默认折叠
    - 创建 `src/components/Tutorial/__tests__/TutorialCard.property.test.tsx`
    - **Property 2: 教程卡片默认折叠**
    - **验证: 需求 4.1**
    - 使用 fast-check 生成随机 title 和 content 字符串
    - 渲染 TutorialCard 后验证 content 文本不可见

  - [ ]* 2.3 编写 TutorialCard 属性测试 - Property 3: 教程卡片点击切换
    - 在 `src/components/Tutorial/__tests__/TutorialCard.property.test.tsx` 中添加
    - **Property 3: 教程卡片点击切换（展开/折叠往返）**
    - **验证: 需求 4.2, 4.3**
    - 使用 fast-check 生成随机 TutorialItem，点击一次验证内容可见，再点击一次验证内容不可见

  - [ ]* 2.4 编写 TutorialCard 单元测试
    - 创建 `src/components/Tutorial/__tests__/TutorialCard.test.tsx`
    - 测试箭头指示器在展开/折叠状态下正确显示
    - 测试空内容边界情况
    - _需求: 4.4_

- [x] 3. 实现 TutorialPanel 组件
  - [x] 3.1 创建 `src/components/Tutorial/TutorialPanel.tsx`
    - 从 uiStore 读取 `tutorialOpen` 状态控制显示/隐藏
    - 渲染遮罩层（backdrop），点击遮罩调用 `closeTutorial`
    - 渲染标题栏：显示国际化标题文本和关闭按钮
    - 从 `tutorialData.ts` 读取数据，根据当前语言选择中/英文内容
    - 遍历分类渲染分类标题和对应的 TutorialCard 列表
    - 支持 Escape 键关闭面板
    - 面板内容区域支持垂直滚动（`overflow-y-auto`）
    - 支持深色/浅色模式
    - 面板从右侧滑入的 CSS 过渡动画
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3_

  - [ ]* 3.2 编写 TutorialPanel 属性测试 - Property 1: 分类下的教程卡片完整渲染
    - 创建 `src/components/Tutorial/__tests__/TutorialPanel.property.test.tsx`
    - **Property 1: 分类下的教程卡片完整渲染**
    - **验证: 需求 3.3**
    - 使用 fast-check 生成随机 TutorialCategoryData（随机数量的 items）
    - 渲染后验证卡片数量与 items 数量一致

  - [ ]* 3.3 编写 TutorialPanel 单元测试
    - 创建 `src/components/Tutorial/__tests__/TutorialPanel.test.tsx`
    - 面板关闭时不渲染内容
    - 面板打开时渲染标题和关闭按钮
    - 点击关闭按钮调用 closeTutorial
    - 点击遮罩层调用 closeTutorial
    - Escape 键关闭面板
    - 渲染所有三个分类标题
    - 中文/英文环境下显示对应语言内容
    - _需求: 2.1-2.7, 3.1-3.3_

- [x] 4. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 5. 集成到 AppLayout 并完成移动端适配
  - [x] 5.1 在 AppLayout header 中添加教程入口按钮
    - 在 `src/components/Layout/AppLayout.tsx` header 右侧按钮区域添加教程入口按钮
    - 使用 📖 图标，点击调用 `openTutorial`
    - 包含 `aria-label` 无障碍标签，使用 i18n 的 `tutorialButton` 翻译键
    - 确保按钮最小触摸目标 44×44px（`min-h-[44px] min-w-[44px]`）
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 8.2_

  - [x] 5.2 在 AppLayout 中渲染 TutorialPanel
    - 在 AppLayout 组件底部（与 IndustryGalleryOverlay 同级）添加 `<TutorialPanel />`
    - _需求: 2.1_

  - [x] 5.3 添加移动端适配样式
    - TutorialPanel 在移动端视口下全屏宽度显示
    - 确保 TutorialCard 在移动端保持可读性和可操作性
    - _需求: 8.1, 8.3_

  - [ ]* 5.4 编写集成相关单元测试
    - 在 `src/components/Layout/__tests__/AppLayout.test.tsx` 中添加教程按钮测试
    - 验证按钮存在于 header 中
    - 验证按钮包含 aria-label
    - 验证点击按钮切换面板状态
    - 验证移动端入口按钮触摸目标 >= 44×44px
    - _需求: 1.1, 1.4, 1.5, 8.2_

- [x] 6. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户确认。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务引用了具体的需求编号以确保可追溯性
- 检查点任务确保增量验证
- 属性测试验证通用正确性属性，单元测试验证具体示例和边界情况
