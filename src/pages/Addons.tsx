
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingIntegrationsGrid } from '@/components/addons/BookingIntegrationsGrid';

const Addons = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add-ons</h1>
        <p className="text-gray-600">Extend your business with powerful integrations</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Booking Integrations
                  <Badge variant="secondary">Popular</Badge>
                </CardTitle>
                <CardDescription>
                  Connect with major booking platforms to sync appointments automatically
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BookingIntegrationsGrid />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Addons;
