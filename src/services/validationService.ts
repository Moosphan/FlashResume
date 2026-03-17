import type { ValidationResult, ResumeDataValidationResult } from '../types/resume';

/**
 * 邮箱格式校验
 * 使用正则校验标准邮箱格式
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, error: '邮箱不能为空' };
  }
  // Standard email regex: local@domain.tld
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '邮箱格式不正确' };
  }
  return { valid: true };
}

/**
 * 电话号码格式校验
 * 校验仅包含数字、+、- 的非空字符串
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, error: '电话号码不能为空' };
  }
  const phoneRegex = /^[0-9+\-]+$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: '电话号码只能包含数字、+ 和 -' };
  }
  return { valid: true };
}

/**
 * 日期范围校验
 * 校验结束日期不早于开始日期
 * 空的结束日期表示"至今"，视为有效
 */
export function validateDateRange(start: string, end: string): ValidationResult {
  if (!start) {
    return { valid: false, error: '开始日期不能为空' };
  }
  // Empty end date means "present" — always valid
  if (!end) {
    return { valid: true };
  }
  if (end < start) {
    return { valid: false, error: '结束日期不能早于开始日期' };
  }
  return { valid: true };
}


/**
 * 校验 ResumeData 结构完整性
 * 检查必要的顶层字段和 personalInfo 子字段是否存在
 * 返回缺失字段列表
 */
export function validateResumeData(data: unknown): ResumeDataValidationResult {
  const missingFields: string[] = [];
  const errors: string[] = [];

  if (data === null || data === undefined || typeof data !== 'object') {
    return {
      valid: false,
      missingFields: ['resumeData'],
      errors: ['数据必须是一个对象'],
    };
  }

  const obj = data as Record<string, unknown>;

  // Check required top-level fields
  const requiredTopLevel = [
    'personalInfo',
    'experiences',
    'educations',
    'skills',
    'customSections',
    'sectionOrder',
    'metadata',
  ] as const;

  for (const field of requiredTopLevel) {
    if (!(field in obj) || obj[field] === undefined) {
      missingFields.push(field);
    }
  }

  // Check personalInfo sub-fields if personalInfo exists
  if (obj.personalInfo && typeof obj.personalInfo === 'object') {
    const personalInfo = obj.personalInfo as Record<string, unknown>;
    const requiredPersonalFields = [
      'name',
      'email',
      'phone',
      'address',
      'website',
      'avatar',
    ] as const;

    for (const field of requiredPersonalFields) {
      if (!(field in personalInfo) || personalInfo[field] === undefined) {
        missingFields.push(`personalInfo.${field}`);
      }
    }
  }

  // Check metadata sub-fields if metadata exists
  if (obj.metadata && typeof obj.metadata === 'object') {
    const metadata = obj.metadata as Record<string, unknown>;
    const requiredMetadataFields = [
      'templateId',
      'themeColor',
      'createdAt',
      'updatedAt',
    ] as const;

    for (const field of requiredMetadataFields) {
      if (!(field in metadata) || metadata[field] === undefined) {
        missingFields.push(`metadata.${field}`);
      }
    }
  }

  // Validate array fields are actually arrays
  const arrayFields = ['experiences', 'educations', 'skills', 'customSections', 'sectionOrder'] as const;
  for (const field of arrayFields) {
    if (field in obj && !Array.isArray(obj[field])) {
      errors.push(`${field} 必须是数组`);
    }
  }

  if (missingFields.length > 0) {
    errors.push(`缺少必要字段: ${missingFields.join(', ')}`);
  }

  return {
    valid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
  };
}
