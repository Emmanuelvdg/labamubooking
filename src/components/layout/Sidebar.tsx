
import { 
  Calendar, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  Clock,
  UserCheck,
  DollarSign,
  MessageSquare,
  Puzzle,
  ExternalLink,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTenant } from '@/contexts/TenantContext';

export const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { tenantId, availableTenants } = useTenant();

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('bookings'), href: '/bookings', icon: BookOpen },
    { name: t('calendar'), href: '/calendar', icon: Calendar },
    { name: t('customers'), href: '/customers', icon: Users },
    { name: t('staff'), href: '/staff', icon: UserCheck },
    { name: t('services'), href: '/services', icon: Clock },
    { name: t('commissions'), href: '/commissions', icon: DollarSign },
    { name: t('add_ons'), href: '/addons', icon: Puzzle },
    { name: t('customer_engagement'), href: '/customer-engagement', icon: MessageSquare },
    { name: 'Online Booking Setup', href: '/online-booking-setup', icon: Globe },
  ];

  // Find the current tenant from available tenants
  const currentTenant = availableTenants.find(ut => ut.tenant_id === tenantId);
  const tenantSlug = currentTenant?.tenant?.name?.toLowerCase().replace(/\s+/g, '-');
  const publicSiteUrl = tenantSlug ? `/book/${tenantSlug}` : '#';

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">LabamuBooking</h2>
        <p className="text-slate-400 text-sm">{t('service_management')}</p>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  isActive 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
        
        {/* Public Site Link */}
        {tenantSlug && (
          <a href={publicSiteUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ExternalLink className="mr-3 h-4 w-4" />
              View Public Site
            </Button>
          </a>
        )}
        
        {/* Settings Link */}
        <Link to="/settings">
          <Button
            variant={location.pathname === '/settings' ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-left",
              location.pathname === '/settings'
                ? "bg-slate-800 text-white" 
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            )}
          >
            <Settings className="mr-3 h-4 w-4" />
            {t('settings')}
          </Button>
        </Link>
      </nav>
    </div>
  );
};
