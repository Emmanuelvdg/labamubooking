
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRosterTemplates } from '@/hooks/useRosterTemplates';
import { useTenant } from '@/contexts/TenantContext';
import { RosterTemplate } from '@/types/roster';
import { format, addDays } from 'date-fns';

interface GenerateFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: RosterTemplate;
}

export const GenerateFromTemplateDialog = ({ 
  open, 
  onOpenChange, 
  template 
}: GenerateFromTemplateDialogProps) => {
  const { tenantId } = useTenant();
  const { generateFromTemplate } = useRosterTemplates(tenantId || '');

  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 6), 'yyyy-MM-dd') // Default to one week
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await generateFromTemplate.mutateAsync({
      templateId: template.id,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });

    onOpenChange(false);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Roster from Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">Template includes:</p>
              {template.templateData.map((item, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {getDayName(item.dayOfWeek)}: {item.startTime} - {item.endTime}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This will create roster assignments for all matching days in the selected date range. 
                Existing assignments will not be overwritten.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={generateFromTemplate.isPending}
              >
                {generateFromTemplate.isPending ? 'Generating...' : 'Generate Roster'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
