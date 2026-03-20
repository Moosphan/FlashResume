import { useState, type ChangeEvent } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { validateEmail, validatePhone } from '../../services/validationService';
import { useLocale } from '../../hooks/useLocale';

export default function PersonalInfoForm() {
  const personalInfo = useResumeStore((s) => s.resumeData.personalInfo);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);
  const { t } = useLocale();

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const handleChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handleEmailBlur = () => {
    if (!personalInfo.email) { setErrors((p) => ({ ...p, email: undefined })); return; }
    const r = validateEmail(personalInfo.email);
    setErrors((p) => ({ ...p, email: r.valid ? undefined : r.error }));
  };

  const handlePhoneBlur = () => {
    if (!personalInfo.phone) { setErrors((p) => ({ ...p, phone: undefined })); return; }
    const r = validatePhone(personalInfo.phone);
    setErrors((p) => ({ ...p, phone: r.valid ? undefined : r.error }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonalInfo({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const inputCls = 'min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base md:text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500';
  const baseCls = 'min-h-[44px] w-full rounded-md border px-3 py-2 text-base md:text-sm outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500';
  const errCls = 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500';
  const okCls = 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600';
  const labelCls = 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t.personalInfo}</h2>

      <div>
        <label className={labelCls}>{t.avatar}</label>
        <div className="flex items-center gap-4">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt={t.avatarPreview} className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="min-h-[44px] text-base md:text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-base md:file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 file:transition-colors file:duration-150 file:cursor-pointer" />
        </div>
      </div>

      <div>
        <label className={labelCls}>{t.name}</label>
        <input type="text" value={personalInfo.name} onChange={(e) => handleChange('name', e.target.value)} placeholder={t.namePh} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>{t.email}</label>
        <input type="email" value={personalInfo.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={handleEmailBlur} placeholder={t.emailPh} className={`${baseCls} ${errors.email ? errCls : okCls}`} />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className={labelCls}>{t.phone}</label>
        <input type="tel" value={personalInfo.phone} onChange={(e) => handleChange('phone', e.target.value)} onBlur={handlePhoneBlur} placeholder={t.phonePh} className={`${baseCls} ${errors.phone ? errCls : okCls}`} />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label className={labelCls}>{t.address}</label>
        <input type="text" value={personalInfo.address} onChange={(e) => handleChange('address', e.target.value)} placeholder={t.addressPh} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>{t.website}</label>
        <input type="url" value={personalInfo.website} onChange={(e) => handleChange('website', e.target.value)} placeholder={t.websitePh} className={inputCls} />
      </div>
    </section>
  );
}
