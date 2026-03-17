import type { ResumeData, ResumeListItem } from '../types/resume';

// ============================================================
// StorageService - localStorage 存储服务
// ============================================================

const PREFIX = 'resume_builder_';
const KEYS = {
  list: `${PREFIX}list`,
  data: (id: string) => `${PREFIX}data_${id}`,
  currentId: `${PREFIX}current_id`,
  themeMode: `${PREFIX}theme_mode`,
} as const;

/**
 * 检测 localStorage 是否可用
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = `${PREFIX}__storage_test__`;
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 安全写入 localStorage，处理存储空间不足异常
 * @throws 当 localStorage 不可用时抛出错误
 */
function safeSetItem(key: string, value: string): void {
  if (!isStorageAvailable()) {
    throw new Error('localStorage 不可用');
  }
  try {
    localStorage.setItem(key, value);
  } catch (e: unknown) {
    if (
      e instanceof DOMException &&
      (e.name === 'QuotaExceededError' || e.code === 22)
    ) {
      throw new Error('存储空间不足，请清理部分简历数据');
    }
    throw e;
  }
}

/**
 * 安全读取 localStorage
 */
function safeGetItem(key: string): string | null {
  if (!isStorageAvailable()) {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * 安全删除 localStorage 项
 */
function safeRemoveItem(key: string): void {
  if (!isStorageAvailable()) {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // 静默忽略
  }
}

// --- 简历数据 CRUD ---

/**
 * 保存简历数据到 localStorage
 */
export function saveResume(id: string, data: ResumeData): void {
  safeSetItem(KEYS.data(id), JSON.stringify(data));
}

/**
 * 从 localStorage 加载简历数据
 */
export function loadResume(id: string): ResumeData | null {
  const raw = safeGetItem(KEYS.data(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResumeData;
  } catch {
    return null;
  }
}

/**
 * 删除指定简历数据
 */
export function deleteResume(id: string): void {
  safeRemoveItem(KEYS.data(id));
}

// --- 简历列表 ---

/**
 * 获取简历列表
 */
export function getResumeList(): ResumeListItem[] {
  const raw = safeGetItem(KEYS.list);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ResumeListItem[];
  } catch {
    return [];
  }
}

/**
 * 保存简历列表
 */
export function saveResumeList(list: ResumeListItem[]): void {
  safeSetItem(KEYS.list, JSON.stringify(list));
}

// --- 当前简历 ID ---

/**
 * 获取当前编辑的简历 ID
 */
export function getCurrentResumeId(): string | null {
  return safeGetItem(KEYS.currentId);
}

/**
 * 设置当前编辑的简历 ID
 */
export function setCurrentResumeId(id: string): void {
  safeSetItem(KEYS.currentId, id);
}

// --- 主题模式 ---

/**
 * 获取主题模式
 */
export function getThemeMode(): 'light' | 'dark' {
  const mode = safeGetItem(KEYS.themeMode);
  return mode === 'dark' ? 'dark' : 'light';
}

/**
 * 设置主题模式
 */
export function setThemeMode(mode: 'light' | 'dark'): void {
  safeSetItem(KEYS.themeMode, mode);
}

// --- 清除所有数据 ---

/**
 * 清除所有 resume_builder_ 前缀的 localStorage 数据
 */
export function clearAll(): void {
  if (!isStorageAvailable()) return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
