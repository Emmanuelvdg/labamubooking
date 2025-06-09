
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar } from 'lucide-react';
import { StaffScheduleSetup } from './StaffScheduleSetup';
import { WeeklyScheduleView } from './WeeklyScheduleView';

export const ScheduleManagementDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');

  const handleScheduleSuccess = () => {
    setActiveTab('calendar');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Manage Schedules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Management</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Schedule Calendar</TabsTrigger>
            <TabsTrigger value="setup">Setup Regular Shifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <WeeklyScheduleView 
              onAddSchedule={() => setActiveTab('setup')}
              onOptionsClick={() => {}}
            />
          </TabsContent>
          
          <TabsContent value="setup" className="space-y-4">
            <StaffScheduleSetup onSuccess={handleScheduleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
