# 实现计划：简历制作应用 (Resume Builder)

## 概述

基于 React 18 + TypeScript + Vite + Tailwind CSS 技术栈，采用分层架构（数据层 → 逻辑层 → 视图层）逐步实现简历制作应用。从类型定义和核心服务开始，逐步构建编辑器组件、预览面板、导出导入功能，最终完成响应式布局和主题系统的集成。

## 任务

- [x] 1. 项目初始化与基础设施搭建
  - [x] 1.1 使用 Vite 创建 React + TypeScript 项目，安装核心依赖
    - 初始化 Vite 项目（react-ts 模板）
    - 安装依赖：tailwindcss、zustand、@dnd-kit/core、@dnd-kit/sortable、react-colorful、html2canvas、jspdf、fast-check、vitest
    - 配置 Tailwind CSS（含深浅主题支持的 darkMode: 'class'）
    - 配置 Vitest 测试环境
    - _需求：14.1, 14.2_

  - [x] 1.2 定义核心类型与数据模型
    - 创建 `src/types/resume.ts`，定义 ResumeData、PersonalInfo、Experience、Education、Skill、CustomSection、ResumeMetadata、ResumeListItem、SkillLevel 等所有接口和类型
    - 定义 DEFAULT_RESUME_DATA 常量
    - 定义 ValidationResult、ResumeDataValidationResult、ImportResult 等服务接口类型
    - _需求：1.1, 2.2, 3.2, 4.4, 5.1_

- [x] 2. 数据校验服务
  - [x] 2.1 实现 ValidationService
    - 创建 `src/services/validationService.ts`
    - 实现 `validateEmail`：使用正则校验标准邮箱格式
    - 实现 `validatePhone`：校验仅包含数字、+、- 的非空字符串
    - 实现 `validateDateRange`：校验结束日期不早于开始日期
    - 实现 `validateResumeData`：校验 ResumeData 结构完整性，返回缺失字段列表
    - _需求：1.3, 1.4, 2.6, 10.3_

  - [x] 2.2 实现校验工具函数
    - 创建 `src/utils/validators.ts`，封装常用校验辅助函数
    - _需求：1.3, 1.4, 2.6_

  - [ ]* 2.3 编写属性测试：邮箱格式校验（属性 1）
    - **属性 1：邮箱格式校验**
    - 创建 `src/__tests__/validators.property.test.ts`
    - 使用 fast-check 生成随机字符串，验证 validateEmail 对无效邮箱返回 valid: false，对有效邮箱返回 valid: true
    - **验证需求：1.3**

  - [ ]* 2.4 编写属性测试：电话号码格式校验（属性 2）
    - **属性 2：电话号码格式校验**
    - 使用 fast-check 生成随机字符串，验证 validatePhone 对包含非法字符的字符串返回 valid: false，对合法字符串返回 valid: true
    - **验证需求：1.4**

  - [ ]* 2.5 编写属性测试：日期范围校验（属性 5）
    - **属性 5：日期范围校验**
    - 使用 fast-check 生成随机日期对，验证 validateDateRange 的正确性
    - **验证需求：2.6**

- [x] 3. 存储服务与状态管理
  - [x] 3.1 实现 StorageService
    - 创建 `src/services/storageService.ts`
    - 实现 saveResume、loadResume、deleteResume、getResumeList、saveResumeList、clearAll 方法
    - 使用 localStorage key 前缀 `resume_builder_` 进行命名空间隔离
    - 处理 localStorage 不可用和存储空间不足的异常情况
    - _需求：11.1, 11.2, 11.4, 12.1, 12.4_

  - [ ]* 3.2 编写属性测试：本地存储往返一致性（属性 9）
    - **属性 9：本地存储往返一致性**
    - 创建 `src/__tests__/storageService.property.test.ts`
    - 使用 fast-check 生成随机 ResumeData，验证 saveResume 后 loadResume 返回深度相等的数据
    - **验证需求：11.1, 11.2**

  - [x] 3.3 实现 ResumeStore（Zustand）
    - 创建 `src/stores/resumeStore.ts`
    - 实现简历数据 CRUD 操作：updatePersonalInfo、addExperience/updateExperience/removeExperience、addEducation/updateEducation/removeEducation、addSkill/removeSkill/updateSkillLevel、addCustomSection/updateCustomSection/removeCustomSection
    - 实现排序操作：reorderExperiences、reorderEducations、reorderSections
    - 实现模板与主题操作：setTemplate、setThemeColor
    - 实现多简历管理：createResume、loadResume、deleteResume、renameResume
    - 实现导入导出方法：importFromJSON、exportToJSON
    - 实现 clearAll 重置方法
    - _需求：1.1, 2.1, 2.5, 3.1, 3.5, 4.1, 4.4, 5.1, 5.5, 6.3, 12.1, 12.3, 12.4_

  - [x] 3.4 实现 UIStore（Zustand）
    - 创建 `src/stores/uiStore.ts`
    - 管理界面状态：主题模式（light/dark）、自动保存状态提示、Toast 消息队列
    - 从 localStorage 读取并持久化主题模式偏好
    - _需求：14.3, 11.3_

  - [ ]* 3.5 编写属性测试：列表项增删不变量（属性 3）
    - **属性 3：列表项增删不变量**
    - 创建 `src/__tests__/resumeStore.property.test.ts`
    - 使用 fast-check 生成随机列表项，验证添加后长度 +1 且可检索，删除后长度 -1 且不可检索
    - **验证需求：2.1, 2.3, 2.4, 3.1, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 5.3, 5.4**

  - [ ]* 3.6 编写属性测试：排序操作保持元素不变量（属性 4）
    - **属性 4：排序操作保持元素不变量**
    - 使用 fast-check 生成随机排序操作，验证重排序后元素集合不变
    - **验证需求：2.5, 3.5, 5.5**

  - [ ]* 3.7 编写属性测试：模板切换保持数据不变量（属性 6）
    - **属性 6：模板切换保持数据不变量**
    - 使用 fast-check 生成随机 ResumeData 和模板 ID，验证切换模板后除 metadata.templateId 外数据不变
    - **验证需求：6.3**

  - [ ]* 3.8 编写属性测试：多简历独立性（属性 10）
    - **属性 10：多简历独立性**
    - 使用 fast-check 生成随机简历操作序列，验证各简历数据互不影响
    - **验证需求：12.1, 12.3, 12.4**

- [x] 4. 检查点 - 核心数据层验证
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 5. 导出与导入服务
  - [x] 5.1 实现 ExportService
    - 创建 `src/services/exportService.ts`
    - 实现 `exportToPDF`：使用 html2canvas + jsPDF 将预览面板 DOM 元素渲染为 A4 尺寸 PDF，支持多页分页
    - 实现 `exportToJSON`：将 ResumeData 序列化为格式化 JSON 字符串
    - _需求：9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 5.2 实现 ImportService
    - 创建 `src/services/importService.ts`
    - 实现 `parseJSON`：解析 JSON 字符串，校验数据完整性
    - 对非法 JSON 返回 `{ success: false, error: 'invalid_json' }`
    - 对缺少必要字段的 JSON 返回 `{ success: false, error: 'missing_fields', details: [...] }`
    - _需求：10.1, 10.2, 10.3_

  - [ ]* 5.3 编写属性测试：JSON 导出/导入往返一致性（属性 7）
    - **属性 7：JSON 导出/导入往返一致性**
    - 创建 `src/__tests__/exportImport.property.test.ts`
    - 使用 fast-check 生成随机 ResumeData，验证 exportToJSON → parseJSON 往返一致
    - **验证需求：9.5, 9.6, 10.1**

  - [ ]* 5.4 编写属性测试：导入无效数据的错误处理（属性 8）
    - **属性 8：导入无效数据的错误处理**
    - 创建 `src/__tests__/importService.property.test.ts`
    - 使用 fast-check 生成随机无效输入，验证错误处理逻辑
    - **验证需求：10.2, 10.3**

- [x] 6. 模板引擎
  - [x] 6.1 实现 TemplateRegistry
    - 创建 `src/services/templateRegistry.ts`
    - 实现模板注册、查询功能
    - 注册 3 种模板：Classic、Modern、Minimal
    - _需求：6.1, 6.4_

  - [x] 6.2 实现简历模板组件
    - 创建 `src/components/Preview/templates/ClassicTemplate.tsx`（经典风格）
    - 创建 `src/components/Preview/templates/ModernTemplate.tsx`（现代风格）
    - 创建 `src/components/Preview/templates/MinimalTemplate.tsx`（极简风格）
    - 每个模板接收 TemplateProps（data + themeColor），渲染 A4 比例的简历布局
    - _需求：6.1, 6.2, 8.3_

- [x] 7. 通用 UI 组件
  - [x] 7.1 实现基础 UI 组件
    - 创建 `src/components/UI/TagInput.tsx`：标签输入组件，支持回车添加、点击关闭删除
    - 创建 `src/components/UI/ConfirmDialog.tsx`：确认对话框组件
    - 创建 `src/components/UI/ThemeToggle.tsx`：深浅主题切换按钮
    - 确保所有交互元素最小触摸目标 44x44px
    - _需求：4.2, 4.3, 12.5, 14.3, 13.4_

  - [x] 7.2 实现模板选择器与主题颜色选择器
    - 创建 `src/components/UI/TemplateSelector.tsx`：展示模板缩略图列表，点击切换模板
    - 创建 `src/components/UI/ThemePicker.tsx`：集成 react-colorful 颜色选择器，提供至少 6 种预设颜色
    - _需求：6.2, 6.4, 7.1, 7.2, 7.3_

- [x] 8. 编辑器组件
  - [x] 8.1 实现个人信息表单
    - 创建 `src/components/Editor/PersonalInfoForm.tsx`
    - 提供姓名、邮箱、电话、地址、个人网站、头像输入字段
    - 集成 ValidationService 进行邮箱和电话的实时校验，在字段下方显示错误提示
    - _需求：1.1, 1.2, 1.3, 1.4_

  - [x] 8.2 实现工作经历表单
    - 创建 `src/components/Editor/ExperienceForm.tsx`
    - 支持添加、编辑、删除多条工作经历
    - 每条记录包含公司名称、职位、起止日期、工作描述字段
    - 集成日期范围校验
    - _需求：2.1, 2.2, 2.3, 2.4, 2.6_

  - [x] 8.3 实现教育背景表单
    - 创建 `src/components/Editor/EducationForm.tsx`
    - 支持添加、编辑、删除多条教育背景
    - 每条记录包含学校名称、学位、专业、起止日期字段
    - _需求：3.1, 3.2, 3.3, 3.4_

  - [x] 8.4 实现技能编辑表单
    - 创建 `src/components/Editor/SkillsForm.tsx`
    - 使用 TagInput 组件实现技能标签的添加和删除
    - 支持为每个技能设置熟练程度下拉选择
    - _需求：4.1, 4.2, 4.3, 4.4_

  - [x] 8.5 实现自定义区块表单
    - 创建 `src/components/Editor/CustomSectionForm.tsx`
    - 支持创建自定义 Section 并指定标题
    - 提供富文本编辑功能（可使用 contentEditable 或轻量富文本方案）
    - 支持添加和删除自定义区块
    - _需求：5.1, 5.2, 5.3, 5.4_

  - [x] 8.6 实现可拖拽排序的区块列表
    - 创建 `src/components/Editor/SortableSectionList.tsx`
    - 使用 @dnd-kit 实现所有 Section 的拖拽排序
    - 整合所有编辑器子组件（PersonalInfoForm、ExperienceForm、EducationForm、SkillsForm、CustomSectionForm）
    - 支持工作经历和教育背景列表内部的拖拽排序
    - _需求：2.5, 3.5, 5.5_

- [x] 9. 检查点 - 编辑器组件验证
  - 确保所有测试通过，如有问题请向用户确认。

- [x] 10. 预览面板与导出工具栏
  - [x] 10.1 实现预览面板
    - 创建 `src/components/Preview/PreviewPanel.tsx`
    - 订阅 ResumeStore 状态变更，实时渲染当前模板
    - 按 A4 纸张比例展示预览
    - 支持缩放操作（放大/缩小）
    - 确保编辑内容变更后 500ms 内更新预览
    - _需求：8.1, 8.2, 8.3, 8.4, 1.2_

  - [x] 10.2 实现导出工具栏
    - 创建 `src/components/Layout/ExportBar.tsx`
    - 实现"导出 PDF"按钮，调用 ExportService.exportToPDF 并触发下载
    - 实现"导出 JSON"按钮，调用 ExportService.exportToJSON 并触发下载
    - 实现"导入 JSON"按钮，打开文件选择器，调用 ImportService.parseJSON 处理导入
    - 内容为空时禁用导出按钮
    - 显示导入错误的 Toast 提示
    - _需求：9.1, 9.5, 10.1, 10.2, 10.3, 10.4_

- [x] 11. 布局与简历管理
  - [x] 11.1 实现应用主布局
    - 创建 `src/components/Layout/AppLayout.tsx`
    - 视口 ≥ 1024px 时左右并排布局（编辑器 + 预览面板）
    - 视口 < 1024px 时上下堆叠布局（编辑器在上，预览在下）
    - 集成 Sidebar、编辑器区域、预览面板、ExportBar
    - _需求：13.1, 13.2, 13.3_

  - [x] 11.2 实现简历列表侧边栏
    - 创建 `src/components/Layout/Sidebar.tsx`
    - 展示所有已保存简历列表
    - 支持点击切换当前编辑的简历
    - 支持创建新简历、删除简历（带确认对话框）
    - _需求：12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 12. 自动保存与 Hooks
  - [x] 12.1 实现 useDebounce Hook
    - 创建 `src/hooks/useDebounce.ts`
    - 实现通用防抖 Hook
    - _需求：11.1_

  - [x] 12.2 实现 useAutoSave Hook
    - 创建 `src/hooks/useAutoSave.ts`
    - 监听 ResumeStore 数据变更，防抖 2 秒后自动保存到 localStorage
    - 保存成功后更新 UIStore 显示"已自动保存"状态提示
    - _需求：11.1, 11.3_

- [x] 13. 应用集成与主题系统
  - [x] 13.1 实现 App 根组件集成
    - 更新 `src/App.tsx`，组装 AppLayout 及所有子组件
    - 集成 useAutoSave Hook
    - 应用启动时从 localStorage 加载已保存的简历数据
    - 集成深浅主题切换（通过 HTML class 控制 Tailwind dark mode）
    - _需求：11.2, 14.3, 14.4_

  - [x] 13.2 实现主题过渡动画与设计系统
    - 配置 Tailwind 主题变量：统一字体、间距、圆角规范
    - 实现主题切换过渡动画（300ms）
    - 实现界面状态变化的平滑过渡动画（150ms-300ms）
    - 确保充足留白和清晰视觉层次
    - _需求：14.1, 14.2, 14.4, 14.5_

- [x] 14. 最终检查点 - 全面验证
  - 确保所有测试通过，如有问题请向用户确认。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 开发
- 每个任务均引用了对应的需求编号，确保需求可追溯性
- 检查点任务用于阶段性验证，确保增量开发的正确性
- 属性测试验证通用正确性属性，单元测试验证具体示例和边界情况
