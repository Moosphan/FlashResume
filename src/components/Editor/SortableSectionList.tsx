import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectForm from './ProjectForm';
import SingleCustomSectionEditor from './SingleCustomSectionEditor';
import { getSectionTitle } from '../../utils/sectionTitles';
import type { StandardSectionId } from '../../types/resume';

// --- Drag Handle ---
function DragHandle({ listeners, attributes, label }: { listeners?: DraggableSyntheticListeners; attributes?: React.HTMLAttributes<HTMLButtonElement>; label: string }) {
  return (
    <button
      type="button"
      className="flex min-h-[44px] min-w-[44px] cursor-grab items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors duration-150"
      aria-label={label}
      {...attributes}
      {...listeners}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <circle cx="7" cy="4" r="1.5" />
        <circle cx="13" cy="4" r="1.5" />
        <circle cx="7" cy="10" r="1.5" />
        <circle cx="13" cy="10" r="1.5" />
        <circle cx="7" cy="16" r="1.5" />
        <circle cx="13" cy="16" r="1.5" />
      </svg>
    </button>
  );
}

// --- Sortable Section Item ---
function SortableSectionItem({ id, customSectionIds }: { id: string; customSectionIds: string[] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { t } = useLocale();
  const resumeData = useResumeStore((s) => s.resumeData);
  const customSections = resumeData.customSections;

  const style = {
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isCustom = customSectionIds.includes(id);
  const customSection = isCustom ? customSections.find((s) => s.id === id) : undefined;
  const label = !isCustom && ['personalInfo', 'experiences', 'projects', 'educations', 'skills'].includes(id)
    ? getSectionTitle(resumeData, t, id as StandardSectionId)
    : (customSection?.title || t.sectionCustom);

  const renderContent = () => {
    switch (id) {
      case 'personalInfo':
        return <PersonalInfoForm />;
      case 'experiences':
        return <ExperienceForm />;
      case 'educations':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectForm />;
      default:
        if (isCustom) {
          return <SingleCustomSectionEditor sectionId={id} />;
        }
        return null;
    }
  };

  const content = renderContent();
  if (content === null) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        <DragHandle listeners={listeners} attributes={attributes} label={t.dragSort} />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      {content}
    </div>
  );
}

// --- Drag Overlay placeholder ---
function DragOverlayContent({ id, customSectionIds }: { id: string; customSectionIds: string[] }) {
  const { t } = useLocale();
  const resumeData = useResumeStore((s) => s.resumeData);
  const customSections = resumeData.customSections;
  const isCustom = customSectionIds.includes(id);
  const customSection = isCustom ? customSections.find((s) => s.id === id) : undefined;
  const label = !isCustom && ['personalInfo', 'experiences', 'projects', 'educations', 'skills'].includes(id)
    ? getSectionTitle(resumeData, t, id as StandardSectionId)
    : (customSection?.title || t.sectionCustom);

  return (
    <div className="rounded-lg border-2 border-blue-400 bg-white p-4 shadow-xl dark:bg-gray-800 dark:border-blue-500">
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-blue-400" aria-hidden="true">
          <circle cx="7" cy="4" r="1.5" />
          <circle cx="13" cy="4" r="1.5" />
          <circle cx="7" cy="10" r="1.5" />
          <circle cx="13" cy="10" r="1.5" />
          <circle cx="7" cy="16" r="1.5" />
          <circle cx="13" cy="16" r="1.5" />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
      </div>
    </div>
  );
}

// --- Main SortableSectionList ---
export default function SortableSectionList() {
  const sectionOrder = useResumeStore((s) => s.resumeData.sectionOrder);
  const customSections = useResumeStore((s) => s.resumeData.customSections);
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const addCustomSection = useResumeStore((s) => s.addCustomSection);
  const { t } = useLocale();

  const [activeId, setActiveId] = useState<string | null>(null);

  const customSectionIds = useMemo(
    () => customSections.map((s) => s.id),
    [customSections],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = sectionOrder.indexOf(active.id as string);
    const toIndex = sectionOrder.indexOf(over.id as string);
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderSections(fromIndex, toIndex);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((sectionId) => (
            <SortableSectionItem
              key={sectionId}
              id={sectionId}
              customSectionIds={customSectionIds}
            />
          ))}
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <DragOverlayContent id={activeId} customSectionIds={customSectionIds} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add custom section button — always at the bottom */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={addCustomSection}
          className="min-h-[44px] w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors duration-150 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          {t.addCustomSection}
        </button>
      </div>
    </div>
  );
}
