
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, User, FileText, Calendar } from 'lucide-react';
import { WaitlistEntry } from '@/types/waitlist';
import { ConvertToBookingDialog } from './ConvertToBookingDialog';
import { format } from 'date-fns';

interface WaitlistQueueProps {
  entries: WaitlistEntry[];
  onCallNext: (entryId: string) => void;
  onMarkAsServed: (entryId: string) => void;
  onUpdateEntry: (id: string, updates: Partial<WaitlistEntry>) => void;
}

export const WaitlistQueue = ({ 
  entries, 
  onCallNext, 
  onMarkAsServed, 
  onUpdateEntry 
}: WaitlistQueueProps) => {
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);

  const waitingEntries = entries.filter(entry => entry.status === 'waiting');
  const calledEntries = entries.filter(entry => entry.status === 'called');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'called': return 'bg-yellow-100 text-yellow-800';
      case 'served': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatWaitTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const handleConvertToBooking = (entry: WaitlistEntry) => {
    setSelectedEntry(entry);
    setConvertDialogOpen(true);
  };

  const handleBookingConvert = (bookingData: any) => {
    // This would create a booking and remove from waitlist
    console.log('Converting to booking:', bookingData);
    setConvertDialogOpen(false);
    setSelectedEntry(null);
    // TODO: Implement actual booking creation
  };

  return (
    <div className="space-y-6">
      {/* Waiting Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Waiting Queue ({waitingEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitingEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No customers waiting</p>
          ) : (
            <div className="space-y-3">
              {waitingEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
                      {entry.queue_position}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{entry.customer?.name}</span>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {entry.service?.name} • Wait: {formatWaitTime(entry.created_at)}
                        {entry.estimated_wait_minutes && (
                          <> • Est: {entry.estimated_wait_minutes}m</>
                        )}
                      </div>
                      {entry.preferred_staff && (
                        <div className="text-sm text-gray-500 mt-1">
                          Prefers: {entry.preferred_staff.name}
                        </div>
                      )}
                      {entry.notes && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <FileText className="h-3 w-3" />
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvertToBooking(entry)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                    {entry.customer?.phone && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => onCallNext(entry.id)}
                      size="sm"
                      disabled={entry.queue_position !== 1}
                    >
                      Call Next
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Called Customers */}
      {calledEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Called Customers ({calledEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calledEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{entry.customer?.name}</span>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {entry.service?.name} • Called: {
                        entry.called_at ? format(new Date(entry.called_at), 'HH:mm') : 'Unknown'
                      }
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onMarkAsServed(entry.id)}
                      size="sm"
                      variant="outline"
                    >
                      Mark as Served
                    </Button>
                    <Button
                      onClick={() => onUpdateEntry(entry.id, { status: 'no_show' })}
                      size="sm"
                      variant="destructive"
                    >
                      No Show
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convert to Booking Dialog */}
      {selectedEntry && (
        <ConvertToBookingDialog
          open={convertDialogOpen}
          onOpenChange={setConvertDialogOpen}
          waitlistEntry={selectedEntry}
          onConvert={handleBookingConvert}
        />
      )}
    </div>
  );
};
