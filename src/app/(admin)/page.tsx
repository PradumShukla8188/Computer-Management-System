import type { Metadata } from 'next';
import CMSDashboard from '@/components/ecommerce/CMSDashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Computer Management System',
  description: 'SST Computer & Well Knowledge Institute — Admin Dashboard',
};

export default function DashboardPage() {
  return <CMSDashboard />;
}
