
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export default function TestingDashboard() {
  return (
    <StandardPageLayout
      title="Testing Dashboard"
      description="Development testing area"
    >
      <div className="text-center">
        <p className="text-muted-foreground">Testing dashboard content</p>
      </div>
    </StandardPageLayout>
  );
}
