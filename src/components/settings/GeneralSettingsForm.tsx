
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const GeneralSettingsForm = () => {
  const { t } = useLanguage();

  const handleSave = () => {
    // Language changes are automatically saved via localStorage in the context
    toast.success(t('changes_saved'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('general_settings')}</CardTitle>
        <CardDescription>
          {t('basic_settings')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LanguageSelector />
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            {t('save_changes')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
