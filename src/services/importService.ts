import type { ImportResult, ResumeData } from '../types/resume';
import { validateResumeData } from './validationService';

/**
 * 解析 JSON 字符串，校验数据完整性，返回 ImportResult。
 *
 * 1. 尝试 JSON.parse — 失败则返回 invalid_json 错误
 * 2. 对解析结果执行 validateResumeData — 无效则返回 missing_fields 及详情
 * 3. 校验通过则返回 success 与解析后的 ResumeData
 */
export function parseJSON(content: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { success: false, error: 'invalid_json' };
  }

  const validation = validateResumeData(parsed);
  if (!validation.valid) {
    return {
      success: false,
      error: 'missing_fields',
      details: validation.missingFields.length > 0
        ? validation.missingFields
        : validation.errors,
    };
  }

  return { success: true, data: parsed as ResumeData };
}
