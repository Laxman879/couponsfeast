'use client';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 pt-16 lg:p-6 lg:pt-6">
        {children}
      </main>
    </div>
  );
}
