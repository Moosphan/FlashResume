# 实施计划：行业专属模板组件

## 概述

画廊 UI 基础设施（IndustryGalleryOverlay、FilterPanel、TemplateGrid、GalleryTemplateCard、galleryUtils、uiStore 画廊状态、i18n 翻译键、TemplateSelector 入口按钮、AppLayout 集成）已全部实现。类型定义（TemplateFeatureTag、ExtendedTemplateDefinition）和 industryData.ts 也已完成。templateRegistry.ts 已有验证逻辑和 8 个现有模板注册。

本计划聚焦于：创建 16 个新行业专属模板 React 组件，并注册到 templateRegistry 中。每个模板遵循现有 ClassicTemplate/ModernTemplate 的实现模式（接受 TemplateProps，使用 getLabels、formatDate、sectionOrder、sectionRenderers 模式）。

## 任务

- [x] 1. 第一批模板：科技、金融、医疗、学术（4 个）
  - [x] 1.1 创建 `src/components/Preview/templates/TechTemplate.tsx`
    - 双栏布局：深色侧边栏（#1a1a2e）展示技能进度条和联系方式，浅色主内容区展示经历
    - 无衬线字体，青色（#0f9690）作为强调色
    - 技能使用进度条形式，项目标题使用 font-mono 等宽字体，章节分隔使用虚线模拟终端风格
    - 遵循 TemplateProps 接口，使用 getLabels、formatDate、sectionOrder、sectionRenderers 模式
    - _需求：1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.2 创建 `src/components/Preview/templates/FinanceTemplate.tsx`
    - 单栏传统布局，章节间细实线分隔，整体对称严谨
    - 衬线字体（Georgia/宋体），深蓝（#003366）+ 金色（#c5a55a）配色
    - 工作经验和教育背景优先展示，机构名称加粗；证书使用金色边框徽章样式
    - _需求：2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.3 创建 `src/components/Preview/templates/HealthcareTemplate.tsx`
    - 单栏清爽布局，大量留白，章节间距宽松
    - 无衬线字体，白底 + 浅蓝（#e8f4f8）+ 深青（#2c7a7b）配色
    - 工作经验使用左侧竖线+圆点时间线样式；证书/教育使用 emoji 图标装饰
    - _需求：3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 1.4 创建 `src/components/Preview/templates/AcademicTemplate.tsx`
    - 单栏学术论文风格，编号章节标题（如"1. 教育背景"）
    - 衬线字体（Times/宋体），深灰（#333）+ 暗红（#8b0000）配色
    - 教育背景和项目/研究经历优先；自定义章节使用缩进引用格式
    - _需求：4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.5 在 `templateRegistry.ts` 中注册 TechTemplate、FinanceTemplate、HealthcareTemplate、AcademicTemplate
    - 添加 import 语句和 register() 调用，包含 id、name、nameEn、industries、featureTags
    - _需求：17.1, 17.2, 17.3, 17.4_

  - [ ]* 1.6 编写单元测试：验证第一批 4 个模板可渲染
    - 使用空数据和完整数据分别渲染，验证不抛异常且输出非空
    - 验证 A4 尺寸容器存在
    - _需求：1.1, 2.1, 3.1, 4.1_

- [x] 2. 第二批模板：创意、法律、营销、工程（4 个）
  - [x] 2.1 创建 `src/components/Preview/templates/CreativeTemplate.tsx`
    - 非对称布局，顶部大面积珊瑚色（#ff6b6b）色块展示头像和个人简介
    - 现代展示字体 + 深紫（#4a0e4e）撞色；技能使用圆环进度或星级评分样式
    - 几何色块装饰元素
    - _需求：5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 2.2 创建 `src/components/Preview/templates/LegalTemplate.tsx`
    - 严格单栏布局，粗体标题+缩进段落，类似法律文书格式
    - 衬线字体，深灰（#2d2d2d）+ 深红（#800020）配色
    - 工作经验以详细段落描述形式展示；教育背景使用加粗+缩进层级
    - _需求：6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 2.3 创建 `src/components/Preview/templates/MarketingTemplate.tsx`
    - 双栏信息图风格，左侧窄栏（个人品牌信息），右侧宽栏（经历）
    - 无衬线字体，橙色（#ff6600）+ 深灰（#333）配色
    - 技能使用百分比进度条；工作经验中数字/百分比使用橙色加粗高亮
    - _需求：7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 2.4 创建 `src/components/Preview/templates/EngineeringTemplate.tsx`
    - 网格化结构布局，CSS Grid 对齐的表格式章节
    - 等宽字体（font-mono），钢铁灰（#4a4a4a）+ 工业蓝（#2b5797）配色
    - 技能以分类表格形式展示；工作经验使用编号列表+结构化描述
    - _需求：8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 2.5 在 `templateRegistry.ts` 中注册 CreativeTemplate、LegalTemplate、MarketingTemplate、EngineeringTemplate
    - 添加 import 语句和 register() 调用
    - _需求：17.1, 17.2, 17.3, 17.4_

  - [ ]* 2.6 编写单元测试：验证第二批 4 个模板可渲染
    - 使用空数据和完整数据分别渲染，验证不抛异常且输出非空
    - _需求：5.1, 6.1, 7.1, 8.1_

- [x] 3. 检查点 - 确保前 8 个模板正常工作
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 4. 第三批模板：政府、零售、房地产、餐饮酒店（4 个）
  - [x] 4.1 创建 `src/components/Preview/templates/GovernmentTemplate.tsx`
    - 标准化单栏布局，明确章节编号和层级标题
    - 标准字体（font-sans），藏蓝（#1b3a5c）+ 白色，庄重风格
    - 工作经验强调单位名称、职级和任职时间；教育/证书使用表格式展示
    - _需求：9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 4.2 创建 `src/components/Preview/templates/RetailTemplate.tsx`
    - 双栏活泼布局，圆角卡片+柔和阴影
    - 无衬线字体，活力橙（#f39c12）+ 深灰（#2c3e50）配色
    - 技能以彩色标签云展示；工作经验使用简洁要点列表，强调业绩数据
    - _需求：10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 4.3 创建 `src/components/Preview/templates/RealEstateTemplate.tsx`
    - 宽幅头部（建筑线条装饰）+ 双栏内容
    - 现代衬线字体，大地色（#8B7355）+ 深绿（#2d5016）配色
    - 项目经验使用卡片式布局；证书/资质使用带图标列表
    - _需求：11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 4.4 创建 `src/components/Preview/templates/HospitalityTemplate.tsx`
    - 单栏温馨风格，圆角元素+柔和装饰线条
    - 优雅无衬线字体，暖棕（#8B4513）+ 奶油白（#FFF8DC）配色
    - 工作经验使用时间线形式；技能使用分组标签（语言能力、服务技能、管理技能）
    - _需求：12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 4.5 在 `templateRegistry.ts` 中注册 GovernmentTemplate、RetailTemplate、RealEstateTemplate、HospitalityTemplate
    - 添加 import 语句和 register() 调用
    - _需求：17.1, 17.2, 17.3, 17.4_

  - [ ]* 4.6 编写单元测试：验证第三批 4 个模板可渲染
    - 使用空数据和完整数据分别渲染，验证不抛异常且输出非空
    - _需求：9.1, 10.1, 11.1, 12.1_

- [x] 5. 第四批模板：物流、媒体、农业环保、人力咨询（4 个）
  - [x] 5.1 创建 `src/components/Preview/templates/LogisticsTemplate.tsx`
    - 流程图风格布局，章节间使用箭头/连接线装饰
    - 无衬线字体，深蓝（#1a3c5e）+ 亮绿（#27ae60）配色
    - 工作经验以流程节点形式展示；技能使用分类列表（管理技能 vs 技术工具）
    - _需求：13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 5.2 创建 `src/components/Preview/templates/MediaTemplate.tsx`
    - 杂志排版风格，大标题、引用块、分栏文字
    - 混合字体（标题 font-serif + 正文 font-sans），黑色（#1a1a1a）+ 亮黄（#f1c40f）配色
    - 个人简介以大字号引用块形式展示；工作经验使用新闻报道风格排版
    - _需求：14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 5.3 创建 `src/components/Preview/templates/AgricultureTemplate.tsx`
    - 单栏自然风格，有机曲线装饰
    - 自然风格字体（font-sans），森林绿（#2d5016）+ 大地棕（#8B7355）配色
    - 工作/项目经验使用卡片形式+绿色系渐变装饰；技能使用简洁图标列表
    - _需求：15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 5.4 创建 `src/components/Preview/templates/HRConsultingTemplate.tsx`
    - 双栏专业布局，左栏（个人信息+技能评估），右栏（经历详情）
    - 无衬线字体，紫色（#6c3483）+ 浅灰（#f5f5f5）配色
    - 技能使用评分矩阵/评分条形式；工作经验使用结构化成就描述，强调管理成果和团队规模
    - _需求：16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 5.5 在 `templateRegistry.ts` 中注册 LogisticsTemplate、MediaTemplate、AgricultureTemplate、HRConsultingTemplate
    - 添加 import 语句和 register() 调用
    - _需求：17.1, 17.2, 17.3, 17.4_

  - [ ]* 5.6 编写单元测试：验证第四批 4 个模板可渲染
    - 使用空数据和完整数据分别渲染，验证不抛异常且输出非空
    - _需求：13.1, 14.1, 15.1, 16.1_

- [x] 6. 检查点 - 确保全部 16 个模板注册完成
  - 确保所有测试通过
  - 验证 `templateRegistry.getAll()` 返回至少 24 个模板（8 个现有 + 16 个新增）
  - 如有问题请向用户确认。

- [ ]* 7. 编写属性测试：所有行业模板可渲染
  - **属性 1：所有行业模板对任意有效简历数据均可渲染**
  - 使用 fast-check 生成随机 ResumeData、随机 themeColor 和随机 language
  - 对 16 个新模板组件逐一调用 render()，验证不抛异常且输出非空
  - **验证需求：1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.1, 16.1, 17.4**

- [ ]* 8. 编写属性测试：注册数据双语完整性
  - **属性 3：所有行业模板注册数据包含完整的双语字段**
  - 遍历所有已注册的行业模板（id 以 -industry 结尾），验证 name、nameEn 非空，featureTags 的 zh/en 字段非空，industries 至少包含一个有效行业 ID
  - **验证需求：17.1, 23.3**

- [x] 9. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户确认。

## 备注

- 标记 `*` 的子任务为可选任务，可跳过以加速 MVP 开发
- 每个任务引用了具体的需求编号，确保可追溯性
- 检查点任务确保增量验证
- 所有模板遵循现有 ClassicTemplate/ModernTemplate 的实现模式
- 使用 TypeScript + React，测试使用 Vitest + React Testing Library + fast-check
