import type { TemplateDefinition } from '../types/resume';
import ClassicTemplate from '../components/Preview/templates/ClassicTemplate';
import ModernTemplate from '../components/Preview/templates/ModernTemplate';
import MinimalTemplate from '../components/Preview/templates/MinimalTemplate';
import TimelineTemplate from '../components/Preview/templates/TimelineTemplate';
import CardTemplate from '../components/Preview/templates/CardTemplate';
import ProfessionalTemplate from '../components/Preview/templates/ProfessionalTemplate';
import MagazineTemplate from '../components/Preview/templates/MagazineTemplate';
import CenteredTemplate from '../components/Preview/templates/CenteredTemplate';

// --- Template Registry ---

const templates: TemplateDefinition[] = [];

function register(template: TemplateDefinition): void {
  const existing = templates.findIndex((t) => t.id === template.id);
  if (existing !== -1) {
    templates[existing] = template;
  } else {
    templates.push(template);
  }
}

function getAll(): TemplateDefinition[] {
  return [...templates];
}

function getById(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

// Pre-register built-in templates
register({ id: 'classic', name: '经典', thumbnail: '', component: ClassicTemplate });
register({ id: 'modern', name: '现代', thumbnail: '', component: ModernTemplate });
register({ id: 'minimal', name: '极简', thumbnail: '', component: MinimalTemplate });
register({ id: 'timeline', name: '时间线', thumbnail: '', component: TimelineTemplate });
register({ id: 'card', name: '卡片', thumbnail: '', component: CardTemplate });
register({ id: 'professional', name: '专业', thumbnail: '', component: ProfessionalTemplate });
register({ id: 'magazine', name: '杂志', thumbnail: '', component: MagazineTemplate });
register({ id: 'centered', name: '居中', thumbnail: '', component: CenteredTemplate });

export const templateRegistry = { getAll, getById, register };
