export interface TutorialItem {
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
}

export interface TutorialCategoryData {
  categoryKeyZh: string;
  categoryKeyEn: string;
  items: TutorialItem[];
}

export const TUTORIAL_DATA: TutorialCategoryData[] = [
  {
    categoryKeyZh: '简历入门',
    categoryKeyEn: 'Getting Started',
    items: [
      {
        titleZh: '简历基本结构',
        titleEn: 'Basic Resume Structure',
        contentZh:
          '一份完整的简历通常包含以下几个部分：个人信息、工作经历、教育背景、技能特长和项目经验。建议按照重要程度排列各模块，将最能体现你竞争力的内容放在前面。保持整体结构清晰，让招聘者能在短时间内获取关键信息。',
        contentEn:
          'A complete resume typically includes: personal information, work experience, education, skills, and project experience. Arrange sections by importance, placing your strongest qualifications first. Keep the structure clear so recruiters can quickly find key information.',
      },
      {
        titleZh: '个人信息填写要点',
        titleEn: 'Personal Information Tips',
        contentZh:
          '个人信息应简洁明了，包含姓名、联系电话、电子邮箱和所在城市。确保联系方式准确有效，邮箱地址尽量使用专业的格式。可选择性添加个人网站或作品集链接，避免填写与求职无关的个人信息。',
        contentEn:
          'Keep personal information concise: include your name, phone number, email, and city. Ensure contact details are accurate and use a professional email address. Optionally add a personal website or portfolio link. Avoid including irrelevant personal details.',
      },
      {
        titleZh: '工作经历描述方法',
        titleEn: 'Describing Work Experience',
        contentZh:
          '工作经历应按时间倒序排列，每段经历包含公司名称、职位、时间段和工作描述。描述工作内容时，重点突出你的职责和成果，使用具体的数据和事例来支撑。避免简单罗列日常事务，而是展示你创造的价值。',
        contentEn:
          'List work experience in reverse chronological order with company name, title, dates, and description. Focus on responsibilities and achievements, using specific data and examples. Avoid simply listing daily tasks — instead, showcase the value you created.',
      },
      {
        titleZh: '教育背景填写建议',
        titleEn: 'Education Background Tips',
        contentZh:
          '教育背景包含学校名称、学位、专业和就读时间。应届生可以详细描述相关课程和学术成果，有工作经验者则简要列出即可。如果有与目标岗位相关的培训或认证，也可以在此部分补充。',
        contentEn:
          'Include school name, degree, major, and dates. Recent graduates can detail relevant coursework and academic achievements, while experienced professionals should keep it brief. Add relevant training or certifications if applicable.',
      },
    ],
  },
  {
    categoryKeyZh: '简历优化',
    categoryKeyEn: 'Resume Optimization',
    items: [
      {
        titleZh: '量化工作成果',
        titleEn: 'Quantify Your Achievements',
        contentZh:
          '用具体数字来展示你的工作成果，例如"提升销售额30%"、"管理10人团队"、"缩短交付周期2周"。量化的成果更有说服力，能让招聘者直观了解你的能力和贡献。即使无法精确量化，也可以用大致范围来描述。',
        contentEn:
          'Use specific numbers to showcase achievements, such as "increased sales by 30%", "managed a team of 10", or "reduced delivery time by 2 weeks". Quantified results are more persuasive and help recruiters understand your impact. Use approximate ranges if exact numbers are unavailable.',
      },
      {
        titleZh: '使用行动动词',
        titleEn: 'Use Action Verbs',
        contentZh:
          '用强有力的行动动词开头描述工作内容，如"主导"、"优化"、"推动"、"设计"、"实现"等。避免使用"负责"、"参与"等模糊表述。行动动词能更好地展示你的主动性和领导力，让简历更具感染力。',
        contentEn:
          'Start descriptions with strong action verbs like "led", "optimized", "drove", "designed", or "implemented". Avoid vague terms like "responsible for" or "participated in". Action verbs better demonstrate initiative and leadership, making your resume more compelling.',
      },
      {
        titleZh: '针对目标岗位定制简历',
        titleEn: 'Tailor Your Resume',
        contentZh:
          '根据目标岗位的要求调整简历内容，突出与岗位最相关的经验和技能。仔细阅读职位描述，将其中的关键词融入简历中。不同岗位可以准备不同版本的简历，确保每份简历都有针对性。',
        contentEn:
          'Customize your resume for each target position by highlighting the most relevant experience and skills. Study the job description carefully and incorporate its keywords. Prepare different resume versions for different roles to ensure each one is targeted.',
      },
      {
        titleZh: '技能展示策略',
        titleEn: 'Skills Presentation Strategy',
        contentZh:
          '将技能分为核心技能和辅助技能，优先展示与目标岗位最匹配的技能。标注技能熟练程度有助于招聘者评估你的能力水平。技术岗位可以列出具体的工具和技术栈，非技术岗位则侧重软技能和行业知识。',
        contentEn:
          'Categorize skills into core and supplementary, prioritizing those most relevant to the target role. Indicating proficiency levels helps recruiters assess your capabilities. Technical roles should list specific tools and tech stacks, while non-technical roles should emphasize soft skills and domain knowledge.',
      },
    ],
  },
  {
    categoryKeyZh: '简历润色',
    categoryKeyEn: 'Resume Polishing',
    items: [
      {
        titleZh: '排版和格式规范',
        titleEn: 'Layout and Formatting',
        contentZh:
          '保持简历排版整洁统一，使用一致的字体、字号和间距。合理运用加粗、分隔线等视觉元素来区分不同模块。确保页面留白适当，避免内容过于拥挤。良好的排版能提升阅读体验，给招聘者留下专业印象。',
        contentEn:
          'Keep your resume layout clean and consistent with uniform fonts, sizes, and spacing. Use bold text and dividers to distinguish sections. Ensure adequate white space and avoid overcrowding. Good formatting enhances readability and leaves a professional impression.',
      },
      {
        titleZh: '语言表达精炼',
        titleEn: 'Concise Language',
        contentZh:
          '使用简洁有力的语言，避免冗长的句子和重复的表述。每个要点控制在一到两行以内，用精炼的语言传达最重要的信息。删除不必要的修饰词和填充语，让每个词都有价值。',
        contentEn:
          'Use concise and impactful language, avoiding lengthy sentences and repetitive statements. Keep each bullet point to one or two lines, conveying the most important information efficiently. Remove unnecessary modifiers and filler words — make every word count.',
      },
      {
        titleZh: '常见错误检查',
        titleEn: 'Common Mistakes to Check',
        contentZh:
          '提交简历前务必仔细检查：拼写和语法错误、时间线是否连贯、联系方式是否正确、格式是否在不同设备上显示正常。建议请他人帮忙审阅，因为自己往往难以发现自己的错误。',
        contentEn:
          'Before submitting, carefully check for: spelling and grammar errors, timeline consistency, correct contact information, and proper formatting across devices. Have someone else review your resume — it is often hard to spot your own mistakes.',
      },
      {
        titleZh: '简历长度控制',
        titleEn: 'Resume Length Control',
        contentZh:
          '一般建议简历控制在一到两页以内。应届生和初级岗位一页为宜，资深人士可以适当延长至两页。删除与目标岗位无关的内容，保留最有价值的信息。过长的简历可能导致关键信息被忽略。',
        contentEn:
          'Keep your resume to one or two pages. One page is ideal for entry-level candidates, while senior professionals may extend to two pages. Remove content irrelevant to the target role and retain only the most valuable information. An overly long resume risks key details being overlooked.',
      },
    ],
  },
];
