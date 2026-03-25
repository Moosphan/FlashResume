# 需求文档

## 简介

简历教程面板功能为 Flash Resume 用户提供内置的简历撰写教程和优化建议。用户可通过应用右上角的入口按钮打开教程面板，浏览分类教程内容，学习简历撰写技巧、优化方法和润色建议，从而提升简历质量。

## 术语表

- **Tutorial_Panel（教程面板）**：一个从右侧滑出的抽屉式面板，用于展示简历相关教程内容
- **Tutorial_Entry_Button（教程入口按钮）**：位于应用顶部导航栏右侧的图标按钮，用于打开或关闭教程面板
- **Tutorial_Category（教程分类）**：教程内容的分组类别，如"简历入门"、"简历优化"、"简历润色"
- **Tutorial_Card（教程卡片）**：教程面板中展示单个教程条目的可展开/折叠的内容区块
- **User（用户）**：使用 Flash Resume 应用的简历编辑者

## 需求

### 需求 1：教程面板入口

**用户故事：** 作为用户，我希望在应用右上角看到一个教程入口按钮，以便随时访问简历撰写教程。

#### 验收标准

1. THE Tutorial_Entry_Button SHALL 显示在应用顶部导航栏右侧区域，位于主题切换按钮附近
2. WHEN 用户点击 Tutorial_Entry_Button，THE Tutorial_Panel SHALL 从屏幕右侧滑出并显示
3. WHEN Tutorial_Panel 处于打开状态且用户点击 Tutorial_Entry_Button，THE Tutorial_Panel SHALL 关闭并隐藏
4. THE Tutorial_Entry_Button SHALL 使用一个可辨识的图标（如书本或灯泡图标）来表示教程功能
5. THE Tutorial_Entry_Button SHALL 包含无障碍标签以支持屏幕阅读器

### 需求 2：教程面板布局与交互

**用户故事：** 作为用户，我希望教程面板有清晰的布局和流畅的交互，以便高效浏览教程内容。

#### 验收标准

1. THE Tutorial_Panel SHALL 以抽屉（Drawer）形式从屏幕右侧滑出，覆盖在主内容之上
2. THE Tutorial_Panel SHALL 包含一个标题栏，显示"简历教程"标题和一个关闭按钮
3. WHEN 用户点击 Tutorial_Panel 的关闭按钮，THE Tutorial_Panel SHALL 关闭
4. WHEN 用户点击 Tutorial_Panel 外部的遮罩区域，THE Tutorial_Panel SHALL 关闭
5. THE Tutorial_Panel SHALL 在面板内容超出可视区域时支持垂直滚动
6. THE Tutorial_Panel SHALL 在深色模式和浅色模式下均正确显示样式
7. THE Tutorial_Panel SHALL 支持中文和英文两种语言的界面文本，跟随应用当前语言设置

### 需求 3：教程内容分类展示

**用户故事：** 作为用户，我希望教程内容按类别组织，以便快速找到我需要的教程主题。

#### 验收标准

1. THE Tutorial_Panel SHALL 将教程内容分为至少三个 Tutorial_Category：简历入门、简历优化、简历润色
2. THE Tutorial_Panel SHALL 以分类标题的形式展示每个 Tutorial_Category
3. WHEN 用户查看某个 Tutorial_Category，THE Tutorial_Panel SHALL 在该分类下展示对应的 Tutorial_Card 列表

### 需求 4：教程卡片展开与折叠

**用户故事：** 作为用户，我希望能展开和折叠教程卡片，以便按需查看详细内容而不被信息淹没。

#### 验收标准

1. THE Tutorial_Card SHALL 默认以折叠状态显示，仅展示教程标题
2. WHEN 用户点击某个折叠状态的 Tutorial_Card，THE Tutorial_Card SHALL 展开并显示完整教程内容
3. WHEN 用户点击某个展开状态的 Tutorial_Card，THE Tutorial_Card SHALL 折叠并隐藏详细内容
4. THE Tutorial_Card SHALL 通过视觉指示器（如箭头图标）表示当前的展开或折叠状态

### 需求 5：简历入门教程内容

**用户故事：** 作为简历新手用户，我希望获得简历撰写的基础指导，以便了解如何开始写一份简历。

#### 验收标准

1. THE Tutorial_Panel SHALL 在"简历入门"分类下提供关于简历基本结构的教程内容
2. THE Tutorial_Panel SHALL 在"简历入门"分类下提供关于个人信息填写要点的教程内容
3. THE Tutorial_Panel SHALL 在"简历入门"分类下提供关于工作经历描述方法的教程内容
4. THE Tutorial_Panel SHALL 在"简历入门"分类下提供关于教育背景填写建议的教程内容

### 需求 6：简历优化教程内容

**用户故事：** 作为希望提升简历质量的用户，我希望获得简历优化的方法和技巧，以便让简历更具竞争力。

#### 验收标准

1. THE Tutorial_Panel SHALL 在"简历优化"分类下提供关于量化工作成果的教程内容
2. THE Tutorial_Panel SHALL 在"简历优化"分类下提供关于使用行动动词的教程内容
3. THE Tutorial_Panel SHALL 在"简历优化"分类下提供关于针对目标岗位定制简历的教程内容
4. THE Tutorial_Panel SHALL 在"简历优化"分类下提供关于技能展示策略的教程内容

### 需求 7：简历润色教程内容

**用户故事：** 作为希望完善简历细节的用户，我希望获得简历润色的建议，以便让简历更加专业和精致。

#### 验收标准

1. THE Tutorial_Panel SHALL 在"简历润色"分类下提供关于排版和格式规范的教程内容
2. THE Tutorial_Panel SHALL 在"简历润色"分类下提供关于语言表达精炼的教程内容
3. THE Tutorial_Panel SHALL 在"简历润色"分类下提供关于常见错误检查的教程内容
4. THE Tutorial_Panel SHALL 在"简历润色"分类下提供关于简历长度控制的教程内容

### 需求 8：移动端适配

**用户故事：** 作为移动端用户，我希望教程面板在小屏幕上也能正常使用，以便在手机上查看教程。

#### 验收标准

1. WHILE 应用在移动端视口下运行，THE Tutorial_Panel SHALL 以全屏宽度显示
2. WHILE 应用在移动端视口下运行，THE Tutorial_Entry_Button SHALL 保持可点击且触摸目标尺寸不小于 44×44 像素
3. WHILE 应用在移动端视口下运行，THE Tutorial_Card SHALL 保持可读性和可操作性
