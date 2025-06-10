
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const StaffAdvancedTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">Advanced Settings</div>
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Advanced staff management features</p>
            <p className="text-sm">Permissions, bulk operations, and more coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
