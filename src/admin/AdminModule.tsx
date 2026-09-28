import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext.tsx';
import { AdminLogin } from './AdminLogin.tsx';
import { AdminDashboard } from './AdminDashboard.tsx';

interface AdminModuleProps {
  onBackToSite: () => void;
}

const AdminContent: React.FC<AdminModuleProps> = ({ onBackToSite }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050609] flex flex-col items-center justify-center text-zinc-500 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-3" />
        <span>Verifying admin session authorization...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onBackToSite={onBackToSite} />;
  }

  return <AdminDashboard onBackToSite={onBackToSite} />;
};

export const AdminModule: React.FC<AdminModuleProps> = ({ onBackToSite }) => {
  return (
    <AdminAuthProvider>
      <AdminContent onBackToSite={onBackToSite} />
    </AdminAuthProvider>
  );
};
