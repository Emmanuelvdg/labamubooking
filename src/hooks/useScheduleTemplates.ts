
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScheduleTemplate, CreateTemplateData, TemplateScheduleItem } from '@/types/schedule';

export const useScheduleTemplates = (tenantId: string) => {
  return useQuery({
    queryKey: ['schedule-templates', tenantId],
    queryFn: async () => {
      console.log('Fetching schedule templates for tenant:', tenantId);
      
      const { data, error } = await supabase
        .from('staff_schedule_templates')
        .select(`
          *,
          items:template_schedule_items(*),
          creator:staff(name)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(template => ({
        id: template.id,
        tenantId: template.tenant_id,
        name: template.name,
        description: template.description,
        isActive: template.is_active,
        createdBy: template.created_by,
        createdAt: template.created_at,
        updatedAt: template.updated_at,
        items: template.items?.map(item => ({
          id: item.id,
          templateId: item.template_id,
          title: item.title,
          description: item.description,
          dayOfWeek: item.day_of_week,
          startTime: item.start_time,
          endTime: item.end_time,
          createdAt: item.created_at,
        })) || [],
        creator: template.creator
      })) as (ScheduleTemplate & { 
        items: TemplateScheduleItem[]; 
        creator: { name: string } | null;
      })[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: CreateTemplateData) => {
      console.log('Creating template:', templateData);
      
      // Create the template first
      const { data: template, error: templateError } = await supabase
        .from('staff_schedule_templates')
        .insert([{
          tenant_id: templateData.tenantId,
          name: templateData.name,
          description: templateData.description,
          created_by: templateData.createdBy,
        }])
        .select()
        .single();
      
      if (templateError) throw templateError;
      
      // Create the template items
      if (templateData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('template_schedule_items')
          .insert(
            templateData.items.map(item => ({
              template_id: template.id,
              title: item.title,
              description: item.description,
              day_of_week: item.dayOfWeek,
              start_time: item.startTime,
              end_time: item.endTime,
            }))
          );
        
        if (itemsError) throw itemsError;
      }
      
      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-templates'] });
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting template:', id);
      
      const { error } = await supabase
        .from('staff_schedule_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-templates'] });
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    },
  });
};
