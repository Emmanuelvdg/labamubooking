
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { queryClient } from '@/lib/queryClient';
import Index from '@/pages/Index';
import Demo from '@/pages/Demo';
import Auth from '@/pages/Auth';
import TenantCreate from '@/pages/TenantCreate';
import Dashboard from '@/pages/Dashboard';
import Staff from '@/pages/Staff';
import Customers from '@/pages/Customers';
import Services from '@/pages/Services';
import Bookings from '@/pages/Bookings';
import Calendar from '@/pages/Calendar';
import Commissions from '@/pages/Commissions';
import CustomerEngagement from '@/pages/CustomerEngagement';
import Addons from '@/pages/Addons';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Layout } from '@/components/layout/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TenantProvider } from '@/components/providers/TenantProvider';
import PublicBooking from '@/pages/PublicBooking';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo/*" element={<Demo />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tenant-create" element={<TenantCreate />} />
              
              {/* Public booking route - accessible without authentication */}
              <Route path="/book/:slug" element={<PublicBooking />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/staff" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Staff />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/customers" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Customers />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/services" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Services />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/bookings" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Bookings />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/calendar" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Calendar />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/commissions" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Commissions />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/customer-engagement" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <CustomerEngagement />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/addons" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Addons />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="/settings" element={
                <AuthGuard>
                  <TenantProvider>
                    <Layout>
                      <Settings />
                    </Layout>
                  </TenantProvider>
                </AuthGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
