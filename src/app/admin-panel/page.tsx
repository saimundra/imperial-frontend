import type { Metadata } from 'next';
import AdminPanelInteractive from './components/AdminPanelInteractive';

export const metadata: Metadata = {
  title: 'Admin Panel - Imperial Glow Nepal',
  description: 'Manage products, users, and orders from the Imperial Glow Nepal admin dashboard.',
};

export default function AdminPanelPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <AdminPanelInteractive />
      </div>
    </main>
  );
}
