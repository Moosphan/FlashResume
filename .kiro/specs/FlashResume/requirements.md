# 需求文档

## 简介

本项目是一个基于 Web 的简历制作应用，用户可以通过简洁美观的界面创建、编辑、预览和导出个人简历。应用支持多种简历模板、实时预览、多格式导出，以及本地数据持久化等功能，旨在为用户提供高效、直观的简历制作体验。

## 术语表

- **Resume_Builder**: 简历制作应用系统整体
- **Editor**: 简历编辑器模块，负责简历内容的输入与修改
- **Template_Engine**: 模板引擎模块，负责将简历数据渲染为不同的视觉模板
- **Exporter**: 导出模块，负责将简历导出为不同文件格式
- **Preview_Panel**: 预览面板模块，负责实时展示简历的最终效果
- **Storage_Manager**: 存储管理模块，负责简历数据的本地持久化
- **Section**: 简历中的一个内容区块（如个人信息、工作经历、教育背景等）
- **Resume_Data**: 简历的结构化数据对象，包含所有 Section 的内容

## 需求

### 需求 1：个人信息编辑

**用户故事：** 作为求职者，我希望能够编辑个人基本信息，以便在简历中展示我的联系方式和基本资料。

#### 验收标准

1. THE Editor SHALL 提供姓名、邮箱、电话、地址、个人网站和头像的输入字段
2. WHEN 用户修改任意个人信息字段时，THE Preview_Panel SHALL 在 500ms 内更新显示对应内容
3. IF 用户输入的邮箱格式不符合标准邮箱格式，THEN THE Editor SHALL 在对应字段下方显示格式错误提示
4. IF 用户输入的电话号码包含非数字字符（除 + 和 - 外），THEN THE Editor SHALL 在对应字段下方显示格式错误提示

### 需求 2：工作经历编辑

**用户故事：** 作为求职者，我希望能够添加和管理多段工作经历，以便展示我的职业背景。

#### 验收标准

1. THE Editor SHALL 允许用户添加、编辑和删除多条工作经历记录
2. THE Editor SHALL 为每条工作经历提供公司名称、职位、起止日期和工作描述的输入字段
3. WHEN 用户点击"添加工作经历"按钮时，THE Editor SHALL 在工作经历列表末尾插入一条空白记录
4. WHEN 用户点击某条工作经历的"删除"按钮时，THE Editor SHALL 移除该条记录并更新预览
5. THE Editor SHALL 支持通过拖拽方式对工作经历记录进行排序
6. IF 用户设置的结束日期早于开始日期，THEN THE Editor SHALL 显示日期范围错误提示

### 需求 3：教育背景编辑

**用户故事：** 作为求职者，我希望能够添加和管理教育背景信息，以便展示我的学历。

#### 验收标准

1. THE Editor SHALL 允许用户添加、编辑和删除多条教育背景记录
2. THE Editor SHALL 为每条教育背景提供学校名称、学位、专业、起止日期的输入字段
3. WHEN 用户点击"添加教育背景"按钮时，THE Editor SHALL 在教育背景列表末尾插入一条空白记录
4. WHEN 用户点击某条教育背景的"删除"按钮时，THE Editor SHALL 移除该条记录并更新预览
5. THE Editor SHALL 支持通过拖拽方式对教育背景记录进行排序

### 需求 4：技能与专长编辑

**用户故事：** 作为求职者，我希望能够列出我的技能和专长，以便让招聘方快速了解我的能力。

#### 验收标准

1. THE Editor SHALL 允许用户以标签形式添加和删除技能项
2. WHEN 用户输入技能名称并按下回车键时，THE Editor SHALL 将该技能添加为一个标签
3. WHEN 用户点击某个技能标签的关闭图标时，THE Editor SHALL 移除该技能标签
4. THE Editor SHALL 允许用户为每个技能设置熟练程度（初级、中级、高级、精通）

### 需求 5：自定义区块管理

**用户故事：** 作为求职者，我希望能够添加自定义内容区块（如项目经历、证书、语言能力等），以便灵活展示更多个人信息。

#### 验收标准

1. THE Editor SHALL 允许用户创建自定义 Section，并为其指定标题
2. THE Editor SHALL 为自定义 Section 提供富文本编辑功能
3. WHEN 用户点击"添加区块"按钮时，THE Editor SHALL 在简历末尾插入一个新的自定义 Section
4. WHEN 用户点击某个自定义 Section 的"删除"按钮时，THE Editor SHALL 移除该 Section
5. THE Editor SHALL 支持通过拖拽方式对所有 Section（包括默认和自定义）进行排序

### 需求 6：简历模板选择

**用户故事：** 作为求职者，我希望能够从多种预设模板中选择简历样式，以便找到最适合我的视觉风格。

#### 验收标准

1. THE Template_Engine SHALL 提供至少 3 种不同风格的简历模板
2. WHEN 用户选择一个模板时，THE Preview_Panel SHALL 在 1 秒内使用新模板重新渲染简历
3. WHEN 用户切换模板时，THE Resume_Builder SHALL 保留所有已编辑的简历内容不变
4. THE Template_Engine SHALL 为每个模板提供缩略图预览

### 需求 7：主题颜色自定义

**用户故事：** 作为求职者，我希望能够自定义简历的主题颜色，以便让简历更具个人特色。

#### 验收标准

1. THE Editor SHALL 提供颜色选择器，允许用户选择简历的主题色
2. THE Editor SHALL 提供至少 6 种预设主题颜色供快速选择
3. WHEN 用户选择新的主题颜色时，THE Preview_Panel SHALL 在 500ms 内更新简历中所有使用主题色的元素

### 需求 8：实时预览

**用户故事：** 作为求职者，我希望在编辑简历时能够实时看到最终效果，以便及时调整内容和排版。

#### 验收标准

1. THE Preview_Panel SHALL 在编辑器右侧以并排布局展示简历的实时预览
2. WHEN 用户修改任意简历内容时，THE Preview_Panel SHALL 在 500ms 内同步更新预览
3. THE Preview_Panel SHALL 按照 A4 纸张比例展示简历预览
4. THE Preview_Panel SHALL 支持缩放操作，允许用户放大或缩小预览视图

### 需求 9：简历导出

**用户故事：** 作为求职者，我希望能够将简历导出为 PDF 文件，以便用于求职投递。

#### 验收标准

1. WHEN 用户点击"导出 PDF"按钮时，THE Exporter SHALL 生成与预览一致的 PDF 文件并触发下载
2. THE Exporter SHALL 确保导出的 PDF 文件保持 A4 页面尺寸
3. THE Exporter SHALL 确保导出的 PDF 中的文字可被选中和复制
4. IF 简历内容超过一页，THEN THE Exporter SHALL 自动进行合理的分页处理
5. WHEN 用户点击"导出 JSON"按钮时，THE Exporter SHALL 将 Resume_Data 序列化为 JSON 文件并触发下载
6. FOR ALL 有效的 Resume_Data 对象，导出为 JSON 后再导入 SHALL 产生等价的 Resume_Data 对象（往返一致性）

### 需求 10：简历导入

**用户故事：** 作为求职者，我希望能够导入之前导出的简历数据，以便在不同设备间迁移或恢复简历。

#### 验收标准

1. WHEN 用户选择一个有效的 JSON 简历文件时，THE Resume_Builder SHALL 解析该文件并将内容加载到编辑器中
2. IF 用户选择的文件不是有效的 JSON 格式，THEN THE Resume_Builder SHALL 显示"文件格式无效"的错误提示
3. IF 用户选择的 JSON 文件缺少必要字段，THEN THE Resume_Builder SHALL 显示"简历数据不完整"的错误提示并指出缺失的字段
4. WHEN 导入成功后，THE Preview_Panel SHALL 立即使用导入的数据更新预览

### 需求 11：本地数据持久化

**用户故事：** 作为求职者，我希望简历数据能够自动保存在浏览器中，以便关闭页面后再次打开时恢复编辑进度。

#### 验收标准

1. WHEN 用户修改简历内容时，THE Storage_Manager SHALL 在用户停止输入 2 秒后自动将 Resume_Data 保存到浏览器 localStorage
2. WHEN 用户打开应用时，THE Storage_Manager SHALL 检查 localStorage 中是否存在已保存的 Resume_Data，若存在则自动加载
3. THE Storage_Manager SHALL 在保存成功后在界面上显示"已自动保存"的状态提示
4. THE Resume_Builder SHALL 提供"清除数据"按钮，允许用户手动清除所有本地保存的简历数据

### 需求 12：多份简历管理

**用户故事：** 作为求职者，我希望能够创建和管理多份简历，以便针对不同岗位准备不同版本的简历。

#### 验收标准

1. THE Resume_Builder SHALL 允许用户创建多份独立的简历，每份简历拥有独立的名称
2. THE Resume_Builder SHALL 在侧边栏或顶部导航中展示所有已保存简历的列表
3. WHEN 用户点击某份简历名称时，THE Resume_Builder SHALL 加载该简历的数据到编辑器和预览面板
4. THE Resume_Builder SHALL 允许用户删除已保存的简历
5. WHEN 用户删除一份简历时，THE Resume_Builder SHALL 显示确认对话框，要求用户确认删除操作

### 需求 13：响应式布局

**用户故事：** 作为求职者，我希望应用在不同设备上都能正常使用，以便在手机或平板上也能编辑简历。

#### 验收标准

1. THE Resume_Builder SHALL 在视口宽度大于等于 1024px 时以左右并排布局展示编辑器和预览面板
2. WHEN 视口宽度小于 1024px 时，THE Resume_Builder SHALL 切换为上下堆叠布局，编辑器在上，预览在下
3. THE Resume_Builder SHALL 在视口宽度大于等于 320px 的设备上保持所有功能可用
4. THE Resume_Builder SHALL 确保所有交互元素的最小触摸目标尺寸为 44x44 像素

### 需求 14：界面设计风格

**用户故事：** 作为求职者，我希望应用界面简约美观，以便获得舒适的使用体验。

#### 验收标准

1. THE Resume_Builder SHALL 采用简约设计风格，使用充足的留白和清晰的视觉层次
2. THE Resume_Builder SHALL 使用统一的设计系统，包括一致的字体、间距和圆角规范
3. THE Resume_Builder SHALL 支持浅色和深色两种主题模式
4. WHEN 用户切换主题模式时，THE Resume_Builder SHALL 在 300ms 内完成界面主题切换过渡动画
5. THE Resume_Builder SHALL 使用平滑的过渡动画处理界面状态变化，动画时长控制在 150ms 至 300ms 之间
