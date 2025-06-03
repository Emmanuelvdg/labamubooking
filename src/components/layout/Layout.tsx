
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  tenantName?: string;
}

export const Layout = ({ children, tenantName }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Header tenantName={tenantName} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
