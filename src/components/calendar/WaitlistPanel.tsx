
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Plus } from 'lucide-react';
import { WaitlistQueue } from '@/components/waitlist/WaitlistQueue';
import { AddToWaitlistDialog } from '@/components/waitlist/AddToWaitlistDialog';
import { useWaitlist } from '@/hooks/useWaitlist';

export const WaitlistPanel = () => {
  const {
    waitlistEntries,
    isLoading,
    addToWaitlist,
    callNext,
    markAsServed,
    updateWaitlistEntry,
    isAddingToWaitlist
  } = useWaitlist();

  const waitingCount = waitlistEntries.filter(entry => entry.status === 'waiting').length;
  const calledCount = waitlistEntries.filter(entry => entry.status === 'called').length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading waitlist...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Waitlist Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Waitlist Overview
            </CardTitle>
            <AddToWaitlistDialog 
              onAddToWaitlist={addToWaitlist}
              isLoading={isAddingToWaitlist}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{waitingCount}</div>
              <div className="text-sm text-blue-600">Waiting</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{calledCount}</div>
              <div className="text-sm text-yellow-600">Called</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waitlist Queue */}
      <WaitlistQueue
        entries={waitlistEntries}
        onCallNext={callNext}
        onMarkAsServed={markAsServed}
        onUpdateEntry={updateWaitlistEntry}
      />
    </div>
  );
};
