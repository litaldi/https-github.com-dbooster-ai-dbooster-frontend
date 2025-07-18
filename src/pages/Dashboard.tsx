
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export default function Dashboard() {
  return (
    <StandardPageLayout
      title="Dashboard"
      description="Welcome to your dashboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground">View your analytics data</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Projects</h3>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p className="text-muted-foreground">Configure your account</p>
        </div>
      </div>
    </StandardPageLayout>
  );
}
