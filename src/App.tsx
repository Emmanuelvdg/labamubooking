
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TenantProvider } from '@/contexts/TenantContext';

// Import pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import TenantCreate from '@/pages/TenantCreate';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import Staff from '@/pages/Staff';
import Services from '@/pages/Services';
import Bookings from '@/pages/Bookings';
import Calendar from '@/pages/Calendar';
import Commissions from '@/pages/Commissions';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TenantProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tenant/create" element={<TenantCreate />} />
            
            {/* Protected routes that require authentication and tenant access */}
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/customers" element={<AuthGuard><Customers /></AuthGuard>} />
            <Route path="/staff" element={<AuthGuard><Staff /></AuthGuard>} />
            <Route path="/services" element={<AuthGuard><Services /></AuthGuard>} />
            <Route path="/bookings" element={<AuthGuard><Bookings /></AuthGuard>} />
            <Route path="/calendar" element={<AuthGuard><Calendar /></AuthGuard>} />
            <Route path="/commissions" element={<AuthGuard><Commissions /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TenantProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
