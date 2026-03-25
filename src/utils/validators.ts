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
 * 将 YYYY-MM 格式转换为更友好的显示格式
 * 中文: "2023年01月"，英文: "Jan 2023"
 * 空字符串返回 "至今" / "Present"
 */
export function formatDate(date: string, locale: 'zh' | 'en' = 'zh'): string {
  if (!date) {
    return locale === 'zh' ? '至今' : 'Present';
  }

  const parts = date.split('-');
  if (parts.length < 2) {
    return date;
  }

  const [year, month] = parts;

  if (locale === 'en') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex] ?? month} ${year}`;
  }

  return `${year}年${month}月`;
}
