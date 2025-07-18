
import React from 'react';
import { TestingDashboard } from '@/components/testing/TestingDashboard';
import { PageTransition } from '@/components/ui/animations';

export default function TestingPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <TestingDashboard />
      </div>
    </PageTransition>
  );
}
