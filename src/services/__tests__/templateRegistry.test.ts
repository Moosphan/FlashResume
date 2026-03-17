import { describe, it, expect } from 'vitest';
import { templateRegistry } from '../templateRegistry';
import type { TemplateProps } from '../../types/resume';

const DummyComponent: React.ComponentType<TemplateProps> = () => null;

describe('templateRegistry', () => {
  it('should have 3 pre-registered templates', () => {
    const all = templateRegistry.getAll();
    expect(all.length).toBeGreaterThanOrEqual(3);
  });

  it('should return classic template by id', () => {
    const t = templateRegistry.getById('classic');
    expect(t).toBeDefined();
    expect(t!.name).toBe('经典');
  });

  it('should return modern template by id', () => {
    const t = templateRegistry.getById('modern');
    expect(t).toBeDefined();
    expect(t!.name).toBe('现代');
  });

  it('should return minimal template by id', () => {
    const t = templateRegistry.getById('minimal');
    expect(t).toBeDefined();
    expect(t!.name).toBe('极简');
  });

  it('should return undefined for unknown id', () => {
    expect(templateRegistry.getById('nonexistent')).toBeUndefined();
  });

  it('should register a new template', () => {
    const before = templateRegistry.getAll().length;
    templateRegistry.register({ id: 'test-tpl', name: 'Test', thumbnail: '', component: DummyComponent });
    expect(templateRegistry.getAll().length).toBe(before + 1);
    expect(templateRegistry.getById('test-tpl')).toBeDefined();
  });

  it('should overwrite existing template on re-register', () => {
    templateRegistry.register({ id: 'test-tpl', name: 'Updated', thumbnail: 'thumb.png', component: DummyComponent });
    const t = templateRegistry.getById('test-tpl');
    expect(t!.name).toBe('Updated');
    expect(t!.thumbnail).toBe('thumb.png');
  });

  it('getAll should return a copy, not the internal array', () => {
    const a = templateRegistry.getAll();
    const b = templateRegistry.getAll();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
