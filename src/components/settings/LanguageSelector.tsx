
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {t('language')}
      </label>
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'id')}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('english')}</SelectItem>
          <SelectItem value="id">{t('bahasa_indonesia')}</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">
        {t('language_description')}
      </p>
    </div>
  );
};
