import { Outlet } from 'react-router-dom';
import { DemoBar } from '../components/DemoBar';

export function RootLayout() {
  return (
    <div style={{ paddingTop: '36px' }}>
      <DemoBar />
      <Outlet />
    </div>
  );
}
