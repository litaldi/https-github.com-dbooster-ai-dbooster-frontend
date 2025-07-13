
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/navigation/MainNav';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
