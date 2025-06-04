// Layout para páginas administrativas (protegidas)
'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import SecurityMonitor from '@/components/auth/security-monitor';
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SecurityMonitor>
        <AdminLayout>
          {children}
        </AdminLayout>
      </SecurityMonitor>
    </ProtectedRoute>
  );
}
