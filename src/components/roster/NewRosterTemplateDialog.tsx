
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useRosterTemplates } from '@/hooks/useRosterTemplates';
import { useStaff } from '@/hooks/useStaff';
import { useTenant } from '@/contexts/TenantContext';
import { TemplateItem } from '@/types/roster';

interface NewRosterTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewRosterTemplateDialog = ({ open, onOpenChange }: NewRosterTemplateDialogProps) => {
  const { tenantId } = useTenant();
  const { createTemplate } = useRosterTemplates(tenantId || '');
  const { data: staff = [] } = useStaff(tenantId || '');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const [templateItems, setTemplateItems] = useState<TemplateItem[]>([]);

  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const addTemplateItem = () => {
    setTemplateItems([
      ...templateItems,
      {
        staffId: '',
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
        notes: ''
      }
    ]);
  };

  const updateTemplateItem = (index: number, updates: Partial<TemplateItem>) => {
    setTemplateItems(items => 
      items.map((item, i) => i === index ? { ...item, ...updates } : item)
    );
  };

  const removeTemplateItem = (index: number) => {
    setTemplateItems(items => items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) return;

    await createTemplate.mutateAsync({
      tenantId,
      name: formData.name,
      description: formData.description || undefined,
      isActive: formData.isActive,
      templateData: templateItems
    });

    onOpenChange(false);
    setFormData({ name: '', description: '', isActive: true });
    setTemplateItems([]);
  };

  const activeStaff = staff.filter(member => member.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Roster Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Standard Week Schedule"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this template..."
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Schedule Items</Label>
              <Button type="button" onClick={addTemplateItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {templateItems.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">No schedule items added yet</p>
                  <Button type="button" onClick={addTemplateItem} variant="outline">
                    Add your first schedule item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {templateItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Staff Member</Label>
                          <Select
                            value={item.staffId}
                            onValueChange={(value) => updateTemplateItem(index, { staffId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select staff" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeStaff.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Day of Week</Label>
                          <Select
                            value={item.dayOfWeek.toString()}
                            onValueChange={(value) => updateTemplateItem(index, { dayOfWeek: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dayNames.map((day, dayIndex) => (
                                <SelectItem key={dayIndex} value={dayIndex.toString()}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={item.startTime}
                            onChange={(e) => updateTemplateItem(index, { startTime: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={item.endTime}
                            onChange={(e) => updateTemplateItem(index, { endTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex-1 mr-4">
                          <Label>Notes (Optional)</Label>
                          <Input
                            value={item.notes || ''}
                            onChange={(e) => updateTemplateItem(index, { notes: e.target.value })}
                            placeholder="Add notes for this shift..."
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTemplateItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createTemplate.isPending || !formData.name || templateItems.length === 0}
            >
              {createTemplate.isPending ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
