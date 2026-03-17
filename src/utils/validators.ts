// ============================================================
// 校验工具函数 - 简历制作应用 (Resume Builder)
// ============================================================

// Re-export validation service functions for convenience
export {
  validateEmail,
  validatePhone,
  validateDateRange,
  validateResumeData,
} from '../services/validationService';

/**
 * 检查字符串是否为空（空字符串或仅包含空白字符）
 */
export function isEmptyString(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * 生成唯一 ID（用于列表项如工作经历、教育背景等）
 * 使用时间戳 + 随机数组合确保唯一性
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 格式化日期字符串用于显示
 * 将 YYYY-MM 格式转换为更友好的显示格式（如 "2023年01月"）
 * 空字符串返回 "至今"
 */
export function formatDate(date: string): string {
  if (!date) {
    return '至今';
  }

  const parts = date.split('-');
  if (parts.length < 2) {
    return date;
  }

  const [year, month] = parts;
  return `${year}年${month}月`;
}
