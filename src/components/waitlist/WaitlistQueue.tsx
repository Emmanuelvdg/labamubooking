
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, CheckCircle, User, Calendar } from 'lucide-react';
import { WaitlistEntry } from '@/types/waitlist';

interface WaitlistQueueProps {
  entries: WaitlistEntry[];
  onCallNext: (entryId: string) => void;
  onMarkAsServed: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<WaitlistEntry>) => void;
}

export const WaitlistQueue = ({ entries, onCallNext, onMarkAsServed, onUpdateEntry }: WaitlistQueueProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'default';
      case 'called':
        return 'secondary';
      case 'served':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'no_show':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-blue-600';
      case 'called':
        return 'text-yellow-600';
      case 'served':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'no_show':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No customers in the waitlist</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{entry.customer?.name}</span>
                  <Badge variant={getStatusBadgeVariant(entry.status)} className={getStatusColor(entry.status)}>
                    {entry.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{entry.customer?.email}</p>
                {entry.customer?.phone && (
                  <p className="text-sm text-gray-600">{entry.customer.phone}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Position #{entry.queue_position}</div>
                {entry.estimated_wait_minutes && (
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {entry.estimated_wait_minutes}min
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{entry.service?.name}</span>
                <span>• ${entry.service?.price}</span>
                <span>• {entry.service?.duration}min</span>
              </div>
              {entry.preferred_staff && (
                <div className="text-gray-600 mt-1">
                  Preferred: {entry.preferred_staff.name}
                </div>
              )}
              {entry.notes && (
                <div className="text-gray-600 mt-1 italic">
                  {entry.notes}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {entry.status === 'waiting' && (
                <Button
                  size="sm"
                  onClick={() => onCallNext(entry.id)}
                  className="flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  Call
                </Button>
              )}
              {entry.status === 'called' && (
                <Button
                  size="sm"
                  onClick={() => onMarkAsServed(entry.id)}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Mark Served
                </Button>
              )}
              {(entry.status === 'waiting' || entry.status === 'called') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateEntry(entry.id, { status: 'cancelled', cancelled_at: new Date().toISOString() })}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
