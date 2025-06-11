
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
  Puzzle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('bookings'), href: '/bookings', icon: BookOpen },
    { name: t('calendar'), href: '/calendar', icon: Calendar },
    { name: t('customers'), href: '/customers', icon: Users },
    { name: t('staff'), href: '/staff', icon: UserCheck },
    { name: t('services'), href: '/services', icon: Clock },
    { name: t('commissions'), href: '/commissions', icon: DollarSign },
    { name: t('add_ons'), href: '/addons', icon: Puzzle },
    { name: t('customer_engagement'), href: '/settings/reminders', icon: MessageSquare },
    { name: t('settings'), href: '/settings', icon: Settings },
  ];

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
      </nav>
    </div>
  );
};
