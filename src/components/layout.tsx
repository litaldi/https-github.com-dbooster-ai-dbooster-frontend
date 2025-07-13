
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/navigation/MainNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
