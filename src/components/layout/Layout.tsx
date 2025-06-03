
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  tenantName?: string;
  currentPath?: string;
}

export const Layout = ({ children, tenantName, currentPath }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPath={currentPath} />
      <div className="flex-1">
        <Header tenantName={tenantName} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
