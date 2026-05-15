import { useLocale } from '../../hooks/useLocale';

const SEO_CONTENT = {
  zh: {
    heading: '免费在线简历制作工具',
    intro:
      'Flash Resume 是一个浏览器端简历编辑器，适合校招、社招、转岗和自由职业场景。你可以直接在页面里编辑内容、切换模板、调整主题色，并实时查看 A4 排版效果。',
    supporting:
      '项目部署在 GitHub Pages 上，无需注册即可开始使用。所有简历数据默认保存在浏览器本地，适合快速起稿、维护多版本简历，以及导出 PDF、PNG、JPG 或 JSON 备份。',
    featureHeading: '核心能力',
    features: [
      '本地自动保存，关闭页面后也能继续编辑',
      '24 套行业模板，支持科技、金融、医疗、法律等方向',
      '多份简历管理，适合针对不同岗位准备多个版本',
      '实时预览和导出，方便在投递前检查版式',
    ],
    faqHeading: '常见问题',
    faqs: [
      {
        question: 'Flash Resume 需要登录或上传简历到服务器吗？',
        answer:
          '不需要。当前版本默认把简历数据保存在浏览器 localStorage 中，日常编辑不依赖后端服务。',
      },
      {
        question: '这个在线简历工具支持导出哪些格式？',
        answer:
          '支持导出 PDF、PNG、JPG 和 JSON。PDF 适合正式投递，JSON 适合备份或在不同设备间迁移。',
      },
      {
        question: '可以同时管理多份简历吗？',
        answer:
          '可以。你可以为不同岗位创建不同版本的简历，并在侧边栏中切换、重命名或删除。',
      },
      {
        question: 'Flash Resume 适合哪些求职场景？',
        answer:
          '适合应届生求职、社招跳槽、岗位定向投递，以及需要快速制作中英文简历或多模板简历的场景。',
      },
    ],
  },
  en: {
    heading: 'Free Online Resume Builder',
    intro:
      'Flash Resume is a browser-based resume editor for job seekers, career changers, and freelancers. You can edit content, switch templates, adjust theme colors, and preview the final A4 layout in real time.',
    supporting:
      'The project is deployed on GitHub Pages and works without registration. Resume data stays in your browser by default, which makes it useful for drafting quickly, maintaining multiple resume versions, and exporting PDF, PNG, JPG, or JSON backups.',
    featureHeading: 'Key Features',
    features: [
      'Local auto-save so you can continue editing later',
      '24 industry-oriented templates for tech, finance, healthcare, legal, and more',
      'Multi-resume management for different job applications',
      'Real-time preview and export before sending applications',
    ],
    faqHeading: 'FAQ',
    faqs: [
      {
        question: 'Do I need to sign in or upload my resume to a server?',
        answer:
          'No. The current version stores resume data in browser localStorage by default and does not require a backend for everyday editing.',
      },
      {
        question: 'Which export formats are supported?',
        answer:
          'You can export PDF, PNG, JPG, and JSON. PDF is suitable for formal applications, while JSON is useful for backup and migration.',
      },
      {
        question: 'Can I manage multiple resumes at the same time?',
        answer:
          'Yes. You can create separate resume versions for different roles and switch, rename, or delete them from the sidebar.',
      },
      {
        question: 'Who is Flash Resume for?',
        answer:
          'It works well for students, professionals changing jobs, and anyone who needs quick resume editing with bilingual support and multiple templates.',
      },
    ],
  },
} as const;

export default function SeoContent() {
  const { locale } = useLocale();
  const content = SEO_CONTENT[locale];

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {content.heading}
      </h2>
      <p className="mt-2 leading-6">{content.intro}</p>
      <p className="mt-2 leading-6 text-gray-600 dark:text-gray-400">{content.supporting}</p>

      <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {content.featureHeading}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
        {content.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <h3 className="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {content.faqHeading}
      </h3>
      <div className="mt-2 space-y-2">
        {content.faqs.map((item) => (
          <details
            key={item.question}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/60"
          >
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              {item.question}
            </summary>
            <p className="mt-2 leading-6 text-gray-600 dark:text-gray-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
