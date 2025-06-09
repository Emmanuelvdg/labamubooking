
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RosterTemplate } from '@/types/roster';
import { toast } from 'sonner';

export const useRosterTemplates = (tenantId: string) => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['roster-templates', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roster_templates')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name');

      if (error) throw error;
      return data as RosterTemplate[];
    },
    enabled: !!tenantId,
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<RosterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('roster_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster-templates', tenantId] });
      toast.success('Roster template created successfully');
    },
    onError: (error) => {
      console.error('Error creating roster template:', error);
      toast.error('Failed to create roster template');
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RosterTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('roster_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster-templates', tenantId] });
      toast.success('Roster template updated successfully');
    },
    onError: (error) => {
      console.error('Error updating roster template:', error);
      toast.error('Failed to update roster template');
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roster_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roster-templates', tenantId] });
      toast.success('Roster template deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting roster template:', error);
      toast.error('Failed to delete roster template');
    },
  });

  const generateFromTemplate = useMutation({
    mutationFn: async ({ 
      templateId, 
      startDate, 
      endDate 
    }: {
      templateId: string;
      startDate: string;
      endDate: string;
    }) => {
      const { data, error } = await supabase.rpc('generate_roster_from_template', {
        p_template_id: templateId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_tenant_id: tenantId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['roster-assignments', tenantId] });
      toast.success(`${count} roster assignments created from template`);
    },
    onError: (error) => {
      console.error('Error generating roster from template:', error);
      toast.error('Failed to generate roster from template');
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    generateFromTemplate,
  };
};
