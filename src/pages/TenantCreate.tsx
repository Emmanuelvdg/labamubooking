
import TenantCreateHeader from '@/components/tenant/TenantCreateHeader';
import BusinessInfoForm from '@/components/tenant/BusinessInfoForm';

const TenantCreate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <TenantCreateHeader />
        <BusinessInfoForm />
        
        <div className="text-center mt-6 text-gray-600">
          <p>Already have an account? <a href="/auth" className="text-blue-600 hover:underline">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
};

export default TenantCreate;
