import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

interface DashboardLayoutProps {
  viewId: string;
}

export function DashboardLayout({ viewId }: DashboardLayoutProps) {
  return (
    <div id={viewId} className="view on" style={{ paddingTop: 0 }}>
      <div className="dash-wrap">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
