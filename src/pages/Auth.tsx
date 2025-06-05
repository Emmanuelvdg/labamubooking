
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <p className="text-center text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-600">
          <p>New to LabamuBooking? <Link to="/tenant/create" className="text-blue-600 hover:underline">Create your business</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
