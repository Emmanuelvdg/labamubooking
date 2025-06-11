
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/components/providers/TenantProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TenantCreate from "./pages/TenantCreate";
import Calendar from "./pages/Calendar";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Staff from "./pages/Staff";
import Commissions from "./pages/Commissions";
import Settings from "./pages/Settings";
import Addons from "./pages/Addons";
import CustomerEngagement from "./pages/CustomerEngagement";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";
import BookingsDemo from "./pages/demo/BookingsDemo";
import CalendarDemo from "./pages/demo/CalendarDemo";
import StaffDemo from "./pages/demo/StaffDemo";
import ServicesDemo from "./pages/demo/ServicesDemo";
import CommissionsDemo from "./pages/demo/CommissionsDemo";
import AnalyticsDemo from "./pages/demo/AnalyticsDemo";
import { Layout } from "@/components/layout/Layout";
import { AuthGuard } from "@/components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <TenantProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/tenant/create" element={<TenantCreate />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/demo/bookings" element={<BookingsDemo />} />
                <Route path="/demo/calendar" element={<CalendarDemo />} />
                <Route path="/demo/staff" element={<StaffDemo />} />
                <Route path="/demo/services" element={<ServicesDemo />} />
                <Route path="/demo/commissions" element={<CommissionsDemo />} />
                <Route path="/demo/analytics" element={<AnalyticsDemo />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
                <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
                <Route path="/customers" element={<Layout><Customers /></Layout>} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/staff" element={<Layout><Staff /></Layout>} />
                <Route path="/commissions" element={<Layout><Commissions /></Layout>} />
                <Route path="/addons" element={<Layout><Addons /></Layout>} />
                <Route path="/settings/reminders" element={<Layout><CustomerEngagement /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          </BrowserRouter>
        </TenantProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
