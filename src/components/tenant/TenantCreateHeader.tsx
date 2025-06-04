
import { Building2 } from 'lucide-react';

const TenantCreateHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Building2 className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to BookingPro</h1>
      <p className="text-xl text-gray-600">Set up your service business in minutes</p>
    </div>
  );
};

export default TenantCreateHeader;
