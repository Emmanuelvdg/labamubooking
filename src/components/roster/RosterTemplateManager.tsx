
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play } from 'lucide-react';
import { useRosterTemplates } from '@/hooks/useRosterTemplates';
import { useTenant } from '@/contexts/TenantContext';
import { RosterTemplate } from '@/types/roster';
import { NewRosterTemplateDialog } from './NewRosterTemplateDialog';
import { GenerateFromTemplateDialog } from './GenerateFromTemplateDialog';

export const RosterTemplateManager = () => {
  const { tenantId } = useTenant();
  const { templates, deleteTemplate } = useRosterTemplates(tenantId || '');
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RosterTemplate | null>(null);

  const handleDelete = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate.mutateAsync(templateId);
    }
  };

  const handleGenerate = (template: RosterTemplate) => {
    setSelectedTemplate(template);
    setGenerateOpen(true);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Roster Templates</CardTitle>
            <Button onClick={() => setNewTemplateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No roster templates yet</p>
              <Button onClick={() => setNewTemplateOpen(true)}>
                Create your first template
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        )}
                      </div>
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">Schedule items:</p>
                      {template.templateData.length === 0 ? (
                        <p className="text-sm text-gray-500">No schedule items</p>
                      ) : (
                        <div className="space-y-1">
                          {template.templateData.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                              <span className="font-medium">{getDayName(item.dayOfWeek)}</span>
                              <span className="ml-2">{item.startTime} - {item.endTime}</span>
                            </div>
                          ))}
                          {template.templateData.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{template.templateData.length - 3} more items
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerate(template)}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NewRosterTemplateDialog
        open={newTemplateOpen}
        onOpenChange={setNewTemplateOpen}
      />

      {selectedTemplate && (
        <GenerateFromTemplateDialog
          open={generateOpen}
          onOpenChange={setGenerateOpen}
          template={selectedTemplate}
        />
      )}
    </>
  );
};
