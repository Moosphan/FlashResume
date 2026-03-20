# 设计文档：行业专属模板画廊

## 概述

本功能为 FlashResume 新增 16 个行业专属简历模板 React 组件。每个模板针对特定行业设计独特的视觉风格（布局、配色、字体、章节侧重），并注册到现有的 `templateRegistry` 中。

画廊基础设施（`IndustryGalleryOverlay`、`FilterPanel`、`TemplateGrid`、`GalleryTemplateCard`、`galleryUtils`、`uiStore` 画廊状态、i18n 翻译键）已全部实现并正常工作。本设计聚焦于 16 个新模板组件的设计与实现。

核心设计目标：
- 16 个新模板组件均实现 `TemplateProps` 接口（`{ data: ResumeData; themeColor: string; language: 'zh' | 'en' }`），与现有 8 个模板保持相同的 props 契约
- 每个模板具有符合其行业惯例的独特视觉特征（布局结构、配色方案、字体选择、章节装饰）
- 所有模板注册到 `templateRegistry`，携带行业分类和特点标签元数据
- 复用现有 `formatDate`、`getLabels`、`sectionOrder` 等工具函数和模式

## 架构

### 整体架构图

```mermaid
graph TB
    subgraph 新增模板组件
        T1[TechTemplate]
        T2[FinanceTemplate]
        T3[HealthcareTemplate]
        T4[AcademicTemplate]
        T5[CreativeTemplate]
        T6[LegalTemplate]
        T7[MarketingTemplate]
        T8[EngineeringTemplate]
        T9[GovernmentTemplate]
        T10[RetailTemplate]
        T11[RealEstateTemplate]
        T12[HospitalityTemplate]
        T13[LogisticsTemplate]
        T14[MediaTemplate]
        T15[AgricultureTemplate]
        T16[HRConsultingTemplate]
    end

    subgraph 现有基础设施（无需修改）
        GI[IndustryGalleryOverlay]
        FP[FilterPanel]
        TG[TemplateGrid]
        GC[GalleryTemplateCard]
        GU[galleryUtils]
    end

    subgraph 需修改
        TR[templateRegistry.ts - 新增 16 个注册调用]
    end

    subgraph 共享依赖
        TP[TemplateProps 接口]
        FD[formatDate / getLabels]
        RD[ResumeData 类型]
    end

    T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 --> TP
    T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 --> TP
    T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 --> FD
    T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 --> FD
    TR -->|import & register| T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8
    TR -->|import & register| T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16
    GI --> TR
```

### 设计决策

1. **遵循现有模板模式**：所有新模板遵循 `ClassicTemplate`/`ModernTemplate` 的实现模式——接受 `TemplateProps`，使用 `getLabels(language)` 获取翻译标签，使用 `formatDate` 格式化日期，通过 `sectionOrder` 控制章节渲染顺序，使用 `sectionRenderers` 字典模式渲染各章节。

2. **纯 Tailwind CSS 样式**：所有视觉差异通过 Tailwind CSS 类和内联 `style` 实现，不引入额外 CSS 文件或 CSS-in-JS 库。与现有模板保持一致。

3. **A4 尺寸约束**：所有模板保持 `width: 210mm; minHeight: 297mm` 的 A4 页面尺寸，确保打印和 PDF 导出兼容。

4. **单栏 vs 双栏布局**：根据行业特征选择布局——金融、法律、政府等传统行业使用单栏布局；科技、营销、人力资源等现代行业使用双栏布局。布局选择直接影响 `sectionRenderers` 的组织方式（参考 `ClassicTemplate` 单栏 vs `ModernTemplate` 双栏的实现差异）。

5. **仅修改 templateRegistry.ts**：新模板组件是独立文件，对现有代码的唯一修改是在 `templateRegistry.ts` 中新增 import 和 `register()` 调用。画廊 UI 组件无需任何修改。

6. **themeColor 作为主色调覆盖**：每个模板有自己的默认配色方案，但 `themeColor` prop 仍用于标题、分隔线等关键装饰元素的着色，保持用户自定义主题色的能力。

## 组件与接口

### 共享接口

所有 16 个新模板组件共享相同的接口契约：

```typescript
// src/types/resume.ts（已有，无需修改）
export interface TemplateProps {
  data: ResumeData;
  themeColor: string;
  language: 'zh' | 'en';
}
```

### 新增模板组件清单

所有组件位于 `src/components/Preview/templates/` 目录：

| # | 组件名 | 文件名 | 布局类型 | 主色调 | 字体风格 |
|---|--------|--------|----------|--------|----------|
| 1 | TechTemplate | TechTemplate.tsx | 双栏（深色侧边栏） | 深蓝 #1a1a2e + 青色 #0f9690 | 无衬线 (Inter/system) |
| 2 | FinanceTemplate | FinanceTemplate.tsx | 单栏传统 | 深蓝 #003366 + 金色 #c5a55a | 衬线 (Georgia/宋体) |
| 3 | HealthcareTemplate | HealthcareTemplate.tsx | 单栏清爽 | 白底 + 浅蓝 #e8f4f8 + 深青 #2c7a7b | 无衬线 |
| 4 | AcademicTemplate | AcademicTemplate.tsx | 单栏学术论文 | 深灰 #333 + 暗红 #8b0000 | 衬线 (Times/宋体) |
| 5 | CreativeTemplate | CreativeTemplate.tsx | 非对称 | 珊瑚 #ff6b6b + 深紫 #4a0e4e | 现代展示字体 |
| 6 | LegalTemplate | LegalTemplate.tsx | 单栏法律文书 | 深灰 #2d2d2d + 深红 #800020 | 衬线 |
| 7 | MarketingTemplate | MarketingTemplate.tsx | 双栏信息图 | 橙色 #ff6600 + 深灰 #333 | 无衬线 |
| 8 | EngineeringTemplate | EngineeringTemplate.tsx | 网格化 | 钢铁灰 #4a4a4a + 工业蓝 #2b5797 | 等宽/工程风格 |
| 9 | GovernmentTemplate | GovernmentTemplate.tsx | 单栏标准化 | 藏蓝 #1b3a5c + 白色 | 标准字体 |
| 10 | RetailTemplate | RetailTemplate.tsx | 双栏活泼 | 活力橙 #f39c12 + 深灰 #2c3e50 | 无衬线 |
| 11 | RealEstateTemplate | RealEstateTemplate.tsx | 宽幅头部+双栏 | 大地色 #8B7355 + 深绿 #2d5016 | 现代衬线 |
| 12 | HospitalityTemplate | HospitalityTemplate.tsx | 单栏温馨 | 暖棕 #8B4513 + 奶油白 #FFF8DC | 优雅无衬线 |
| 13 | LogisticsTemplate | LogisticsTemplate.tsx | 流程图风格 | 深蓝 #1a3c5e + 亮绿 #27ae60 | 无衬线 |
| 14 | MediaTemplate | MediaTemplate.tsx | 杂志排版 | 黑色 #1a1a1a + 亮黄 #f1c40f | 混合字体 |
| 15 | AgricultureTemplate | AgricultureTemplate.tsx | 单栏自然 | 森林绿 #2d5016 + 大地棕 #8B7355 | 自然风格 |
| 16 | HRConsultingTemplate | HRConsultingTemplate.tsx | 双栏专业 | 紫色 #6c3483 + 浅灰 #f5f5f5 | 无衬线 |

### 组件内部结构模式

每个模板组件遵循统一的内部结构模式（参考现有 ClassicTemplate/ModernTemplate）：

```typescript
import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

export default function XxxTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  // 1. 定义 sectionRenderers 字典（每个章节的渲染函数）
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null, // Header 始终在顶部单独渲染
    experiences: () => /* 行业特色的工作经验渲染 */,
    educations: () => /* 行业特色的教育背景渲染 */,
    skills: () => /* 行业特色的技能展示渲染 */,
    projects: () => /* 行业特色的项目经验渲染 */,
  };

  // 2. 注册自定义章节渲染器
  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => /* 自定义章节渲染 */;
  });

  // 3. 返回 JSX，包含：
  //    - 固定 A4 尺寸容器 (width: 210mm, minHeight: 297mm)
  //    - Header（个人信息，始终在顶部）
  //    - 按 sectionOrder 渲染各章节
  //    - Fallback：渲染不在 sectionOrder 中但有内容的章节
  return (
    <div style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {/* Header */}
      {/* Sections by sectionOrder */}
      {sectionOrder.map((id) => sectionRenderers[id]?.())}
      {/* Fallback sections */}
    </div>
  );
}
```

### 各模板视觉特征详述

#### 1. TechTemplate（科技/互联网）
- **布局**：双栏——深色侧边栏（`bg-[#1a1a2e]`）展示技能进度条和联系方式，浅色主内容区展示经历
- **字体**：`font-sans`（系统无衬线体）
- **技能展示**：进度条形式，类似 ModernTemplate 的技能条但使用青色（#0f9690）
- **项目装饰**：项目标题使用 `font-mono` 等宽字体，章节分隔使用虚线（`border-dashed`）模拟终端风格
- **参考**：布局结构参考 ModernTemplate（双栏 + 侧边栏），但配色和装饰元素不同

#### 2. FinanceTemplate（金融/银行）
- **布局**：单栏传统——章节间使用细实线分隔，整体对称
- **字体**：`font-serif`（Georgia/宋体）
- **章节侧重**：工作经验和教育背景在最前，机构名称加粗突出
- **证书展示**：使用带金色（#c5a55a）边框的徽章样式 `span` 标签
- **参考**：布局结构参考 ClassicTemplate（单栏），但更强调正式感

#### 3. HealthcareTemplate（医疗/健康）
- **布局**：单栏清爽——大量 `padding` 和 `margin`，章节间距宽松
- **字体**：`font-sans`
- **配色**：白色底 + 浅蓝（#e8f4f8）章节背景 + 深青（#2c7a7b）标题
- **时间线**：工作经验使用左侧竖线 + 圆点的时间线样式（`border-l-2` + 伪元素圆点）
- **证书/教育**：使用 emoji 图标装饰（📋、🎓）

#### 4. AcademicTemplate（教育/学术）
- **布局**：单栏学术论文风格——编号章节标题（如"1. 教育背景"、"2. 研究经历"）
- **字体**：`font-serif`（Times New Roman/宋体）
- **配色**：深灰文字 + 暗红（#8b0000）标题
- **章节侧重**：教育背景和项目/研究经历优先
- **自定义章节**：使用缩进引用格式（`pl-4 border-l-2`）模拟学术引用样式

#### 5. CreativeTemplate（创意/设计）
- **布局**：非对称——顶部大面积色块（珊瑚色 #ff6b6b）展示头像和个人简介，下方内容区
- **字体**：现代展示字体（`font-sans` + 大字号标题）
- **配色**：珊瑚色 #ff6b6b + 深紫 #4a0e4e 撞色
- **技能展示**：圆环进度或星级评分样式（使用 CSS 实现的圆形进度指示器）
- **几何装饰**：使用 CSS 伪元素或 div 实现几何色块装饰

#### 6. LegalTemplate（法律/合规）
- **布局**：严格单栏——粗体标题 + 缩进段落，类似法律文书
- **字体**：`font-serif`
- **配色**：深灰 #2d2d2d + 深红 #800020
- **工作经验**：详细段落描述形式（非列表），律所/机构名称加粗
- **教育背景**：学位和院校使用加粗 + 缩进层级展示

#### 7. MarketingTemplate（市场营销）
- **布局**：双栏信息图风格——左侧窄栏（个人品牌信息），右侧宽栏（经历）
- **字体**：`font-sans`
- **配色**：橙色 #ff6600 + 深灰 #333
- **技能展示**：百分比进度条，带数值标签
- **数据高亮**：工作经验中的数字/百分比使用橙色加粗高亮

#### 8. EngineeringTemplate（制造/工程）
- **布局**：网格化结构——使用 CSS Grid 对齐的表格式章节
- **字体**：`font-mono`（等宽字体）
- **配色**：钢铁灰 #4a4a4a + 工业蓝 #2b5797
- **技能展示**：分类表格形式（技术技能 vs 工具熟练度）
- **工作经验**：编号列表 + 结构化描述

#### 9. GovernmentTemplate（政府/公共事业）
- **布局**：标准化单栏——明确的章节编号和层级标题
- **字体**：标准字体（`font-sans`）
- **配色**：藏蓝 #1b3a5c + 白色，庄重风格
- **工作经验**：强调单位名称、职级和任职时间
- **教育/证书**：规范化表格式展示

#### 10. RetailTemplate（零售/电商）
- **布局**：双栏活泼——圆角卡片 + 柔和阴影
- **字体**：`font-sans`
- **配色**：活力橙 #f39c12 + 深灰 #2c3e50
- **技能展示**：彩色标签云
- **工作经验**：简洁要点列表，强调业绩数据

#### 11. RealEstateTemplate（房地产/建筑）
- **布局**：宽幅头部（建筑线条装饰）+ 双栏内容
- **字体**：现代衬线（`font-serif`）
- **配色**：大地色 #8B7355 + 深绿 #2d5016
- **项目经验**：卡片式布局，每个项目一张卡片
- **证书/资质**：带图标的列表

#### 12. HospitalityTemplate（餐饮/酒店）
- **布局**：单栏温馨——圆角元素 + 柔和装饰线条
- **字体**：优雅无衬线（`font-sans`）
- **配色**：暖棕 #8B4513 + 奶油白 #FFF8DC
- **工作经验**：时间线形式，强调服务岗位和工作场所
- **技能展示**：分组标签（语言能力、服务技能、管理技能）

#### 13. LogisticsTemplate（物流/供应链）
- **布局**：流程图风格——章节间使用箭头/连接线装饰
- **字体**：`font-sans`
- **配色**：深蓝 #1a3c5e + 亮绿 #27ae60
- **工作经验**：流程节点形式，强调职责范围和管理规模
- **技能展示**：分类列表（管理技能 vs 技术工具）

#### 14. MediaTemplate（媒体/传播）
- **布局**：杂志排版风格——大标题、引用块、分栏文字
- **字体**：混合字体（标题 `font-serif` 大字号 + 正文 `font-sans`）
- **配色**：黑色 #1a1a1a + 亮黄 #f1c40f
- **个人简介**：大字号引用块形式，页面顶部
- **工作经验**：新闻报道风格排版

#### 15. AgricultureTemplate（农业/环保）
- **布局**：单栏自然风格——有机曲线装饰
- **字体**：自然风格（`font-sans`）
- **配色**：森林绿 #2d5016 + 大地棕 #8B7355
- **工作/项目经验**：卡片形式 + 绿色系渐变装饰
- **技能展示**：简洁图标列表

#### 16. HRConsultingTemplate（人力资源/咨询）
- **布局**：双栏专业——左栏（个人信息 + 技能评估），右栏（经历详情）
- **字体**：`font-sans`
- **配色**：紫色 #6c3483 + 浅灰 #f5f5f5
- **技能展示**：评分矩阵形式（使用 CSS 实现的评分条/点阵）
- **工作经验**：结构化成就描述，强调管理成果和团队规模

### templateRegistry.ts 修改

在现有 8 个模板注册之后，新增 16 个 import 和 register 调用：

```typescript
// 新增 import
import TechTemplate from '../components/Preview/templates/TechTemplate';
import FinanceTemplate from '../components/Preview/templates/FinanceTemplate';
// ... 其余 14 个 import

// 新增注册
register({
  id: 'tech-industry',
  name: '科技',
  nameEn: 'Tech',
  thumbnail: '',
  component: TechTemplate,
  industries: ['tech'],
  featureTags: [
    { zh: '深色侧边栏', en: 'Dark Sidebar' },
    { zh: '技能进度条', en: 'Skill Progress Bars' },
  ],
});
// ... 其余 15 个注册调用
```

每个行业模板的 `industries` 字段主要包含其对应的行业 ID，部分模板可适用于相近行业。`id` 使用 `{行业}-industry` 格式以区别于现有通用模板。

## 数据模型

### 类型定义（已有，无需修改）

```typescript
// src/types/resume.ts
export interface TemplateProps {
  data: ResumeData;
  themeColor: string;
  language: 'zh' | 'en';
}

export interface TemplateDefinition {
  id: string;
  name: string;
  thumbnail: string;
  component: React.ComponentType<TemplateProps>;
}

export interface TemplateFeatureTag {
  zh: string;
  en: string;
}

export interface ExtendedTemplateDefinition extends TemplateDefinition {
  industries: string[];
  featureTags: TemplateFeatureTag[];
  nameEn: string;
}
```

### 行业分类数据（已有，无需修改）

```typescript
// src/data/industryData.ts
export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  { id: 'tech', nameZh: '科技/互联网', nameEn: 'Tech/Internet', icon: '💻' },
  { id: 'finance', nameZh: '金融/银行', nameEn: 'Finance/Banking', icon: '🏦' },
  // ... 共 16 个行业分类
];
```

### 16 个新模板的注册数据

| 模板 ID | 中文名 | 英文名 | 行业分类 | 特点标签 (zh/en) |
|---------|--------|--------|----------|-----------------|
| tech-industry | 科技 | Tech | tech | 深色侧边栏/Dark Sidebar, 技能进度条/Skill Progress Bars |
| finance-industry | 金融 | Finance | finance | 传统单栏/Traditional Single Column, 衬线字体/Serif Font |
| healthcare-industry | 医疗 | Healthcare | healthcare | 清爽留白/Clean Whitespace, 时间线/Timeline |
| academic-industry | 学术 | Academic | education | 论文风格/Paper Style, 编号章节/Numbered Sections |
| creative-industry | 创意 | Creative | creative | 非对称布局/Asymmetric Layout, 撞色方案/Bold Colors |
| legal-industry | 法律 | Legal | legal | 法律文书风格/Legal Document Style, 衬线字体/Serif Font |
| marketing-industry | 营销 | Marketing | marketing | 信息图风格/Infographic Style, 数据高亮/Data Highlights |
| engineering-industry | 工程 | Engineering | manufacturing | 网格布局/Grid Layout, 等宽字体/Monospace Font |
| government-industry | 政府 | Government | government | 标准化布局/Standardized Layout, 庄重风格/Formal Style |
| retail-industry | 零售 | Retail | retail | 圆角卡片/Rounded Cards, 标签云/Tag Cloud |
| realestate-industry | 房地产 | Real Estate | realestate | 宽幅头部/Wide Header, 建筑线条/Architectural Lines |
| hospitality-industry | 餐饮酒店 | Hospitality | hospitality | 温馨风格/Warm Style, 圆角元素/Rounded Elements |
| logistics-industry | 物流 | Logistics | logistics | 流程图风格/Flowchart Style, 连接线装饰/Connector Lines |
| media-industry | 媒体 | Media | media | 杂志排版/Magazine Layout, 混合字体/Mixed Fonts |
| agriculture-industry | 农业环保 | Agriculture | agriculture | 自然风格/Natural Style, 有机曲线/Organic Curves |
| hr-industry | 人力咨询 | HR Consulting | hr | 评分矩阵/Rating Matrix, 双栏专业/Professional Two-Column |



## 正确性属性

*属性（Property）是指在系统所有有效执行中都应成立的特征或行为——本质上是对系统应做什么的形式化陈述。属性是人类可读规格说明与机器可验证正确性保证之间的桥梁。*

### 属性 1：所有行业模板对任意有效简历数据均可渲染

*对于任意*有效的 ResumeData 和任意 themeColor 字符串和任意 language（'zh' | 'en'），16 个行业模板组件中的每一个都应能接受这些 TemplateProps 并渲染出非空的 React 元素，不抛出异常。

**验证需求：1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.1, 16.1, 17.4**

### 属性 2：模板注册验证拒绝空行业或空标签

*对于任意*模板定义，当其包含 `industries` 或 `featureTags` 字段时，若 `industries` 数组为空（或不含任何有效行业 ID）或 `featureTags` 数组为空，`register()` 应拒绝注册（不将其加入模板列表）。

**验证需求：17.2**

### 属性 3：所有行业模板注册数据包含完整的双语字段

*对于任意*已注册的行业专属模板（id 以 `-industry` 结尾），其 `name`（中文）和 `nameEn`（英文）字段都应为非空字符串，且每个 `featureTag` 的 `zh` 和 `en` 字段都应为非空字符串，且 `industries` 数组至少包含一个有效行业 ID。

**验证需求：17.1, 23.3**

### 属性 4：行业筛选仅返回匹配模板

*对于任意*行业分类 ID 和任意模板集合，调用 `filterTemplatesByIndustry(templates, industryId)` 返回的每个模板的 `industries` 数组都应包含该 `industryId`，且返回数量应等于原始集合中 `industries` 包含该 ID 的模板总数。

**验证需求：19.3**

### 属性 5：筛选选中-取消选中往返还原

*对于任意*模板集合和任意行业分类 ID，先以该行业 ID 筛选再以 `null` 筛选（即取消选中），应返回与原始集合完全相同的模板列表。

**验证需求：19.4**

### 属性 6：行业模板计数与筛选结果一致

*对于任意*模板集合，`getTemplateCountByIndustry(templates)` 返回的每个行业的计数值应等于 `filterTemplatesByIndustry(templates, industryId)` 返回的模板数量。

**验证需求：19.5**

### 属性 7：模板卡片渲染包含名称和所有特点标签

*对于任意*已注册的 ExtendedTemplateDefinition 和任意语言设置（'zh' | 'en'），其对应的画廊卡片渲染结果应包含模板名称（当前语言版本）和所有特点标签文本（当前语言版本）。

**验证需求：20.1, 20.4**

### 属性 8：当前模板标识唯一性

*对于任意*模板列表和任意当前模板 ID（该 ID 存在于列表中），画廊中应恰好有一张卡片被标记为"当前使用中"，且该卡片的模板 ID 应等于当前模板 ID。

**验证需求：20.5**

### 属性 9：模板选用更新状态并关闭画廊

*对于任意*有效的模板 ID，当用户在画廊中选用该模板后，`resumeStore` 的 `selectedTemplateId` 应更新为该模板 ID，且 `uiStore` 的 `galleryOpen` 应变为 `false`。

**验证需求：21.1, 21.2**

## 错误处理

### 模板注册错误
- 当模板的 `industries` 为空数组或不含有效行业 ID 时，`register()` 输出 `console.warn` 并拒绝注册（不抛出异常，不阻断应用启动）
- 当模板的 `featureTags` 为空数组时，同样拒绝注册并输出警告
- 当 `industries` 中包含无效的行业 ID 时，过滤掉无效 ID 仅保留有效的；若过滤后为空则拒绝注册

### 模板渲染错误
- 缩略预览渲染失败时，由 `GalleryTemplateCard` 中已有的 ErrorBoundary 捕获，显示占位符
- 模板组件内部应对 `data` 中的空数组（experiences、educations 等）做条件渲染，不因空数据崩溃

### 数据边界情况
- `personalInfo.name` 为空时，使用 `L.namePlaceholder` 占位
- `experiences`/`educations`/`skills`/`projects` 为空数组时，对应章节不渲染
- `customSections` 为空数组时，不渲染自定义章节
- `sectionOrder` 中缺少某些章节 ID 时，通过 fallback 逻辑渲染有内容但不在 order 中的章节

## 测试策略

### 双重测试方法

本功能采用单元测试与属性测试相结合的方式，确保全面覆盖。

### 属性测试（Property-Based Testing）

使用 `fast-check` 库（已适配 TypeScript/Vitest 生态）进行属性测试。

配置要求：
- 每个属性测试至少运行 100 次迭代
- 每个测试用注释标注对应的设计属性
- 标注格式：**Feature: industry-template-gallery, Property {编号}: {属性描述}**
- 每个正确性属性由一个属性测试实现

属性测试覆盖：

1. **所有行业模板可渲染**（属性 1）：使用 `fast-check` 生成随机的 ResumeData（随机个人信息、随机数量的经历/教育/技能/项目）、随机 themeColor 和随机 language，对 16 个模板组件逐一调用 `render()`，验证不抛出异常且输出非空。
2. **注册验证拒绝空数据**（属性 2）：生成随机的模板定义，其中 industries 和 featureTags 数组长度随机（包括 0），验证空数组时注册被拒绝。
3. **注册数据双语完整性**（属性 3）：遍历所有已注册的行业模板，验证 name、nameEn、featureTags 的 zh/en 字段均为非空字符串。
4. **行业筛选正确性**（属性 4）：生成随机模板集合（随机 industries 数组）和随机行业 ID，验证筛选结果中每个模板都包含该行业 ID。
5. **筛选往返还原**（属性 5）：生成随机模板集合和随机行业 ID，验证 filter(null) 返回完整列表。
6. **计数与筛选一致**（属性 6）：生成随机模板集合，验证 getTemplateCountByIndustry 的每个计数值等于对应 filterTemplatesByIndustry 的结果长度。
7. **卡片内容完整性**（属性 7）：生成随机 ExtendedTemplateDefinition 和随机语言，渲染 GalleryTemplateCard，验证输出包含模板名称和所有标签文本。
8. **当前模板标识唯一性**（属性 8）：生成随机模板列表和随机当前 ID，渲染 TemplateGrid，验证恰好一张卡片有"当前使用中"标记。
9. **模板选用状态一致性**（属性 9）：生成随机模板 ID，模拟选用操作，验证 store 状态更新。

### 单元测试

使用 Vitest + React Testing Library 进行单元测试，聚焦于：

- **具体示例**：
  - 注册完成后 `templateRegistry.getAll()` 返回至少 24 个模板（需求 17.3）
  - "浏览更多行业模板"按钮存在性（需求 18.1）
  - 默认显示全部模板（需求 19.2）
  - 画廊打开/关闭交互（需求 18.2, 18.4）
  - 模板切换 Toast 通知（需求 21.3）
  - FilterPanel 的 role="tablist"/role="tab"（需求 24.3）
  - TemplateCard 的 role="article" 和 aria-label（需求 24.4）
  - 行业分类双语名称非空（需求 23.2）

- **边界情况**：
  - 空简历数据（所有数组为空）时模板不崩溃
  - 无匹配筛选结果时的空状态展示
  - sectionOrder 缺少章节时的 fallback 渲染

### 不测试的内容

- 响应式 CSS 布局断点（需求 22.1-22.4）：由视觉回归测试或手动测试覆盖
- 语言切换实时更新（需求 23.4）：依赖 React 响应式机制，由集成测试覆盖
- ARIA 完整合规性（需求 24.1）：需要辅助技术手动测试
- 键盘导航（需求 24.2）：需要 E2E 测试
- 焦点指示器可见性（需求 24.5）：CSS 视觉测试
- 各模板的具体视觉样式（需求 1.2-1.5, 2.2-2.5, ... 16.2-16.5）：视觉设计属性，由视觉回归测试或人工审查覆盖
