// Layout para páginas administrativas (protegidas)
'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}
