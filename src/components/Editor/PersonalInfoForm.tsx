import { useState, type ChangeEvent } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { validateEmail, validatePhone } from '../../services/validationService';

export default function PersonalInfoForm() {
  const personalInfo = useResumeStore((s) => s.resumeData.personalInfo);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const handleChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handleEmailBlur = () => {
    if (!personalInfo.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
      return;
    }
    const result = validateEmail(personalInfo.email);
    setErrors((prev) => ({ ...prev, email: result.valid ? undefined : result.error }));
  };

  const handlePhoneBlur = () => {
    if (!personalInfo.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
      return;
    }
    const result = validatePhone(personalInfo.phone);
    setErrors((prev) => ({ ...prev, phone: result.valid ? undefined : result.error }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updatePersonalInfo({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">个人信息</h2>

      {/* 头像 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">头像</label>
        <div className="flex items-center gap-4">
          {personalInfo.avatar && (
            <img
              src={personalInfo.avatar}
              alt="头像预览"
              className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="min-h-[44px] text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 file:transition-colors file:duration-150 file:cursor-pointer"
          />
        </div>
      </div>

      {/* 姓名 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">姓名</label>
        <input
          type="text"
          value={personalInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="请输入姓名"
          className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      {/* 邮箱 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">邮箱</label>
        <input
          type="email"
          value={personalInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={handleEmailBlur}
          placeholder="请输入邮箱"
          className={`min-h-[44px] w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* 电话 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">电话</label>
        <input
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={handlePhoneBlur}
          placeholder="请输入电话号码"
          className={`min-h-[44px] w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
            errors.phone
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600'
          }`}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* 地址 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">地址</label>
        <input
          type="text"
          value={personalInfo.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="请输入地址"
          className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      {/* 个人网站 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">个人网站</label>
        <input
          type="url"
          value={personalInfo.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="请输入个人网站 URL"
          className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
    </section>
  );
}
