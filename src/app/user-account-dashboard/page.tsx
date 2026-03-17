import type { Metadata } from 'next';
import UserAccountDashboardClient from './components/UserAccountDashboardClient';

export const metadata: Metadata = {
  title: 'My Account - Imperial Glow Nepal',
  description: 'Manage your luxury beauty shopping experience, track orders, view wishlist, and update account preferences on Imperial Glow Nepal.',
};

export default function UserAccountDashboardPage() {
  return <UserAccountDashboardClient />;
}
