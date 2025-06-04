
import { Building2 } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Building2 className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">LabamuBooking</h1>
      <p className="text-gray-600">Manage your service business</p>
    </div>
  );
};

export default AuthHeader;
