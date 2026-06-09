import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import styles from './Dashboard.module.css';

interface DashboardLayoutProps {
  viewId: string;
}

export function DashboardLayout({ viewId }: DashboardLayoutProps) {
  return (
    <div id={viewId} className="view on" style={{ paddingTop: 0 }}>
      <div className={styles.dashWrap}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
