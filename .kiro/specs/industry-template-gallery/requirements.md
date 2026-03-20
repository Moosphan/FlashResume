# 需求文档：行业专属模板画廊

## 简介

为 FlashResume 应用新增 16 个行业专属简历模板组件，每个模板针对特定行业设计独特的视觉风格、布局结构、配色方案和排版特征。同时新增「行业模板画廊」版面，让用户按行业浏览和选用这些专属模板。每个行业模板不是对现有模板的分类标记，而是全新设计的独立模板组件，具有符合该行业惯例和审美的视觉特征。

## 术语表

- **Industry_Template（行业专属模板）**：针对特定行业全新设计的简历模板 React 组件，具有独特的布局、配色、字体和章节侧重
- **Gallery（画廊页面）**：展示所有行业专属模板的独立版面/页面组件
- **Template_Card（模板卡片）**：画廊中展示单个模板的 UI 卡片，包含实时缩略预览、模板名称和行业标签
- **Template_Registry（模板注册表）**：管理所有可用模板的服务模块（已有 `templateRegistry.ts`）
- **Resume_Store（简历状态仓库）**：管理当前简历数据和模板选择的 Zustand store
- **Filter_Panel（筛选面板）**：用于按行业分类筛选模板的 UI 区域
- **TemplateProps（模板属性接口）**：所有模板组件共用的 props 接口，包含 data、themeColor、language

## 需求

### 需求 1：科技/互联网行业模板（TechTemplate）

**用户故事：** 作为科技行业求职者，我希望有一个体现技术感和现代感的简历模板，以便展示我的技术能力和项目经验。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 TechTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE TechTemplate SHALL 采用深色侧边栏搭配浅色主内容区的双栏布局，侧边栏展示技能进度条和联系方式
3. THE TechTemplate SHALL 使用无衬线字体（如 Inter/系统无衬线体），配色以深蓝（#1a1a2e）和青色（#0f9690）为主色调
4. THE TechTemplate SHALL 将技能章节置于显著位置，使用标签云或进度条形式展示技术栈
5. THE TechTemplate SHALL 为项目经验章节提供代码风格的装饰元素（如等宽字体标题、终端风格分隔线）

### 需求 2：金融/银行行业模板（FinanceTemplate）

**用户故事：** 作为金融行业求职者，我希望有一个体现专业性和严谨性的简历模板，以便展示我的金融从业资质。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 FinanceTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE FinanceTemplate SHALL 采用单栏传统布局，章节之间使用细线分隔，整体结构严谨对称
3. THE FinanceTemplate SHALL 使用衬线字体（如 Georgia/宋体），配色以深蓝（#003366）和金色（#c5a55a）为主色调
4. THE FinanceTemplate SHALL 将工作经验和教育背景章节置于最显著位置，强调机构名称和职位头衔
5. THE FinanceTemplate SHALL 为证书和资质章节提供专门的展示区域，使用徽章样式呈现

### 需求 3：医疗/健康行业模板（HealthcareTemplate）

**用户故事：** 作为医疗行业求职者，我希望有一个体现专业可信赖感的简历模板，以便展示我的医疗资质和临床经验。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 HealthcareTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE HealthcareTemplate SHALL 采用清爽的单栏布局，大量留白，章节间距宽松
3. THE HealthcareTemplate SHALL 使用无衬线字体，配色以白色为底、浅蓝（#e8f4f8）和深青（#2c7a7b）为主色调
4. THE HealthcareTemplate SHALL 将证书/资质和教育背景章节置于显著位置，使用图标装饰
5. THE HealthcareTemplate SHALL 为工作经验章节提供清晰的时间线样式，强调任职机构和科室信息

### 需求 4：教育/学术行业模板（AcademicTemplate）

**用户故事：** 作为学术领域求职者，我希望有一个体现学术严谨性的简历模板，以便展示我的研究成果和学术经历。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 AcademicTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE AcademicTemplate SHALL 采用单栏学术论文风格布局，使用编号章节和缩进层级
3. THE AcademicTemplate SHALL 使用衬线字体（如 Times New Roman/宋体），配色以深灰（#333）和暗红（#8b0000）为主色调
4. THE AcademicTemplate SHALL 将教育背景和项目/研究经历章节置于最显著位置
5. THE AcademicTemplate SHALL 为自定义章节（如"发表论文"、"学术会议"）提供引用格式样式的展示

### 需求 5：创意/设计行业模板（CreativeTemplate）

**用户故事：** 作为创意设计行业求职者，我希望有一个体现创意表达和视觉冲击力的简历模板，以便展示我的设计审美。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 CreativeTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE CreativeTemplate SHALL 采用非对称布局，使用大面积色块和几何装饰元素
3. THE CreativeTemplate SHALL 使用现代展示字体，配色以大胆的撞色方案为特征（如珊瑚色 #ff6b6b 搭配深紫 #4a0e4e）
4. THE CreativeTemplate SHALL 将头像和个人简介置于页面顶部大面积展示区域
5. THE CreativeTemplate SHALL 为技能章节使用可视化图形（如圆环进度、星级评分）展示

### 需求 6：法律/合规行业模板（LegalTemplate）

**用户故事：** 作为法律行业求职者，我希望有一个体现权威性和规范性的简历模板，以便展示我的法律从业经历。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 LegalTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE LegalTemplate SHALL 采用严格的单栏布局，使用粗体标题和缩进段落，类似法律文书格式
3. THE LegalTemplate SHALL 使用衬线字体，配色以深灰（#2d2d2d）和深红（#800020）为主色调
4. THE LegalTemplate SHALL 将工作经验章节以详细的段落描述形式展示，强调律所/机构名称
5. THE LegalTemplate SHALL 为教育背景章节突出显示学位和院校信息，使用加粗和缩进层级

### 需求 7：市场营销行业模板（MarketingTemplate）

**用户故事：** 作为市场营销行业求职者，我希望有一个体现品牌意识和传播力的简历模板，以便展示我的营销成果。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 MarketingTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE MarketingTemplate SHALL 采用信息图风格的双栏布局，左侧窄栏展示个人品牌信息，右侧宽栏展示经历
3. THE MarketingTemplate SHALL 使用现代无衬线字体，配色以橙色（#ff6600）和深灰（#333）为主色调
4. THE MarketingTemplate SHALL 为技能章节使用百分比进度条或数据可视化样式展示
5. THE MarketingTemplate SHALL 在工作经验章节中为成果描述提供醒目的数据高亮样式

### 需求 8：制造/工程行业模板（EngineeringTemplate）

**用户故事：** 作为制造工程行业求职者，我希望有一个体现精密和技术规范的简历模板，以便展示我的工程经验。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 EngineeringTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE EngineeringTemplate SHALL 采用网格化的结构布局，使用清晰的表格式章节和对齐的数据列
3. THE EngineeringTemplate SHALL 使用等宽或工程风格字体，配色以钢铁灰（#4a4a4a）和工业蓝（#2b5797）为主色调
4. THE EngineeringTemplate SHALL 将技能章节以分类表格形式展示，区分技术技能和工具熟练度
5. THE EngineeringTemplate SHALL 为工作经验章节使用编号列表和结构化描述格式

### 需求 9：政府/公共事业行业模板（GovernmentTemplate）

**用户故事：** 作为政府/公共事业求职者，我希望有一个体现庄重和规范的简历模板，以便展示我的公共服务经历。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 GovernmentTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE GovernmentTemplate SHALL 采用标准化的单栏布局，使用明确的章节编号和层级标题
3. THE GovernmentTemplate SHALL 使用标准字体，配色以藏蓝（#1b3a5c）和白色为主色调，风格庄重
4. THE GovernmentTemplate SHALL 将工作经验章节按时间倒序排列，强调单位名称、职级和任职时间
5. THE GovernmentTemplate SHALL 为教育背景和证书章节提供规范化的表格式展示

### 需求 10：零售/电商行业模板（RetailTemplate）

**用户故事：** 作为零售电商行业求职者，我希望有一个体现活力和商业感的简历模板，以便展示我的销售和运营能力。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 RetailTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE RetailTemplate SHALL 采用明亮活泼的双栏布局，使用圆角卡片和柔和阴影装饰
3. THE RetailTemplate SHALL 使用友好的无衬线字体，配色以活力橙（#f39c12）和深灰（#2c3e50）为主色调
4. THE RetailTemplate SHALL 将技能章节以标签云形式展示，使用彩色标签
5. THE RetailTemplate SHALL 为工作经验章节提供简洁的要点列表格式，强调业绩数据

### 需求 11：房地产/建筑行业模板（RealEstateTemplate）

**用户故事：** 作为房地产建筑行业求职者，我希望有一个体现稳重和专业的简历模板，以便展示我的项目经验和行业资质。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 RealEstateTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE RealEstateTemplate SHALL 采用宽幅头部搭配双栏内容的布局，头部区域使用建筑线条装饰
3. THE RealEstateTemplate SHALL 使用现代衬线字体，配色以大地色（#8B7355）和深绿（#2d5016）为主色调
4. THE RealEstateTemplate SHALL 将项目经验章节置于显著位置，使用卡片式布局展示每个项目
5. THE RealEstateTemplate SHALL 为证书和资质章节提供带图标的列表展示

### 需求 12：餐饮/酒店行业模板（HospitalityTemplate）

**用户故事：** 作为餐饮酒店行业求职者，我希望有一个体现服务精神和温馨感的简历模板，以便展示我的服务行业经验。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 HospitalityTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE HospitalityTemplate SHALL 采用温馨风格的单栏布局，使用圆角元素和柔和的装饰线条
3. THE HospitalityTemplate SHALL 使用优雅的无衬线字体，配色以暖棕（#8B4513）和奶油白（#FFF8DC）为主色调
4. THE HospitalityTemplate SHALL 将工作经验章节以时间线形式展示，强调服务岗位和工作场所
5. THE HospitalityTemplate SHALL 为技能章节使用分组标签形式，区分语言能力、服务技能和管理技能

### 需求 13：物流/供应链行业模板（LogisticsTemplate）

**用户故事：** 作为物流供应链行业求职者，我希望有一个体现效率和系统性的简历模板，以便展示我的运营管理能力。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 LogisticsTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE LogisticsTemplate SHALL 采用流程图风格的布局，章节之间使用箭头或连接线装饰，体现流程感
3. THE LogisticsTemplate SHALL 使用简洁的无衬线字体，配色以深蓝（#1a3c5e）和亮绿（#27ae60）为主色调
4. THE LogisticsTemplate SHALL 将工作经验章节以流程节点形式展示，强调职责范围和管理规模
5. THE LogisticsTemplate SHALL 为技能章节使用分类列表形式，区分管理技能和技术工具

### 需求 14：媒体/传播行业模板（MediaTemplate）

**用户故事：** 作为媒体传播行业求职者，我希望有一个体现传播力和视觉表现力的简历模板，以便展示我的媒体从业经历。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 MediaTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE MediaTemplate SHALL 采用杂志排版风格的布局，使用大标题、引用块和分栏文字
3. THE MediaTemplate SHALL 使用混合字体（标题用展示字体、正文用无衬线体），配色以黑色（#1a1a1a）和亮黄（#f1c40f）为主色调
4. THE MediaTemplate SHALL 将个人简介以大字号引用块形式展示在页面顶部
5. THE MediaTemplate SHALL 为工作经验章节使用新闻报道风格的排版，强调作品和成果

### 需求 15：农业/环保行业模板（AgricultureTemplate）

**用户故事：** 作为农业环保行业求职者，我希望有一个体现自然和可持续发展理念的简历模板，以便展示我的行业经验。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 AgricultureTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE AgricultureTemplate SHALL 采用自然风格的单栏布局，使用有机曲线装饰和叶片/自然元素点缀
3. THE AgricultureTemplate SHALL 使用自然风格字体，配色以森林绿（#2d5016）和大地棕（#8B7355）为主色调
4. THE AgricultureTemplate SHALL 将工作经验和项目经历章节以卡片形式展示，使用绿色系渐变装饰
5. THE AgricultureTemplate SHALL 为技能章节使用简洁的图标列表形式展示

### 需求 16：人力资源/咨询行业模板（HRConsultingTemplate）

**用户故事：** 作为人力资源咨询行业求职者，我希望有一个体现沟通力和专业咨询感的简历模板，以便展示我的人力资源管理经验。

#### 验收标准

1. THE Industry_Template SHALL 提供名为 HRConsultingTemplate 的 React 组件，接受 TemplateProps 并渲染完整简历
2. THE HRConsultingTemplate SHALL 采用专业的双栏布局，左栏展示个人信息和技能评估，右栏展示经历详情
3. THE HRConsultingTemplate SHALL 使用专业的无衬线字体，配色以紫色（#6c3483）和浅灰（#f5f5f5）为主色调
4. THE HRConsultingTemplate SHALL 将技能章节以雷达图或评分矩阵形式展示，体现能力评估风格
5. THE HRConsultingTemplate SHALL 为工作经验章节使用结构化的成就描述格式，强调管理成果和团队规模

### 需求 17：模板注册与集成

**用户故事：** 作为开发者，我希望所有行业专属模板都能通过统一的注册机制集成到系统中，以便画廊页面和模板选择器能够发现和使用这些模板。

#### 验收标准

1. THE Template_Registry SHALL 为每个行业专属模板注册条目，包含模板 ID、中英文名称、所属行业列表和特点标签
2. THE Template_Registry SHALL 验证每个注册的行业模板包含至少一个行业分类和至少一个特点标签
3. WHEN 行业专属模板注册完成后，THE Template_Registry 的 getAll 方法 SHALL 返回包含所有 16 个行业模板在内的完整模板列表
4. THE Industry_Template SHALL 全部实现 TemplateProps 接口，与现有 8 个模板保持相同的 props 契约

### 需求 18：画廊页面入口与导航

**用户故事：** 作为用户，我希望能从主界面方便地进入行业模板画廊，以便浏览各行业专属模板。

#### 验收标准

1. THE Gallery SHALL 在主界面的模板选择区域下方提供一个"浏览更多行业模板"入口按钮
2. WHEN 用户点击"浏览更多行业模板"按钮时，THE Gallery SHALL 以全屏覆盖层（overlay）方式展示画廊页面
3. THE Gallery SHALL 在页面顶部提供关闭按钮，使用户可以返回主编辑界面
4. WHEN 用户点击关闭按钮或按下 Escape 键时，THE Gallery SHALL 关闭画廊页面并返回主编辑界面

### 需求 19：行业分类筛选

**用户故事：** 作为用户，我希望能按行业筛选模板，以便快速找到适合我目标行业的专属简历模板。

#### 验收标准

1. THE Filter_Panel SHALL 在画廊页面顶部展示所有行业分类作为可点击的筛选标签
2. THE Filter_Panel SHALL 默认显示"全部"分类，展示所有可用模板（包括现有 8 个通用模板和 16 个行业专属模板）
3. WHEN 用户点击某个行业分类标签时，THE Gallery SHALL 仅展示属于该行业的模板
4. WHEN 用户点击已选中的行业分类标签时，THE Filter_Panel SHALL 取消选中并恢复显示全部模板
5. THE Filter_Panel SHALL 在每个行业分类标签旁显示该分类下的模板数量

### 需求 20：模板卡片展示

**用户故事：** 作为用户，我希望能直观地预览每个行业专属模板的独特视觉风格，以便做出选择。

#### 验收标准

1. THE Template_Card SHALL 以网格布局展示模板，每张卡片包含模板实时缩略预览、模板名称和行业标签
2. THE Template_Card SHALL 使用当前简历数据渲染缩略预览，使用户能看到真实效果
3. WHEN 用户将鼠标悬停在模板卡片上时，THE Template_Card SHALL 显示"使用此模板"操作按钮
4. THE Template_Card SHALL 展示该模板的行业适用标签和视觉特点标签（如"双栏布局"、"衬线字体"、"深色侧边栏"）
5. WHEN 当前正在使用的模板出现在画廊中时，THE Template_Card SHALL 以视觉高亮标记标识该模板为"当前使用中"

### 需求 21：模板选用

**用户故事：** 作为用户，我希望能在画廊中直接选用行业专属模板并应用到我的简历。

#### 验收标准

1. WHEN 用户点击模板卡片上的"使用此模板"按钮时，THE Resume_Store SHALL 将当前简历的模板切换为所选行业专属模板
2. WHEN 模板切换成功后，THE Gallery SHALL 关闭画廊页面并返回主编辑界面，使用户能立即看到新模板效果
3. WHEN 模板切换成功后，THE Gallery SHALL 通过 Toast 通知用户模板已切换成功

### 需求 22：响应式布局

**用户故事：** 作为用户，我希望在不同设备上都能正常使用行业模板画廊。

#### 验收标准

1. THE Gallery SHALL 在桌面端（宽度 ≥ 1024px）以每行 3-4 列网格展示模板卡片
2. THE Gallery SHALL 在平板端（宽度 768px-1023px）以每行 2 列网格展示模板卡片
3. THE Gallery SHALL 在移动端（宽度 < 768px）以每行 1 列展示模板卡片
4. THE Filter_Panel SHALL 在移动端以水平滚动方式展示行业分类标签

### 需求 23：国际化支持

**用户故事：** 作为用户，我希望画廊页面支持中英文切换，与应用其他部分保持一致。

#### 验收标准

1. THE Gallery SHALL 根据当前应用语言设置（中文/英文）展示所有界面文本
2. THE Gallery SHALL 为所有行业分类名称提供中英文翻译
3. THE Gallery SHALL 为所有 16 个行业专属模板的名称和特点标签提供中英文翻译
4. WHEN 用户在应用中切换语言时，THE Gallery SHALL 实时更新所有文本为对应语言

### 需求 24：无障碍访问

**用户故事：** 作为使用辅助技术的用户，我希望能无障碍地使用行业模板画廊。

#### 验收标准

1. THE Gallery SHALL 为所有交互元素提供符合语义的 ARIA 标签
2. THE Gallery SHALL 支持键盘导航，用户可以使用 Tab 键在筛选标签和模板卡片之间移动
3. THE Filter_Panel SHALL 使用 role="tablist" 和 role="tab" 语义标记行业分类筛选标签
4. THE Template_Card SHALL 使用 role="article" 语义标记，并包含描述性的 aria-label
5. WHEN 模板卡片获得焦点时，THE Template_Card SHALL 显示可见的焦点指示器
