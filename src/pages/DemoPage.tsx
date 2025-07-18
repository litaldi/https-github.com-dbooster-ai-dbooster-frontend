
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export default function DemoPage() {
  return (
    <StandardPageLayout
      title="Demo"
      description="Try our product demo"
    >
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-muted-foreground">
          Demo content will be available soon.
        </p>
      </div>
    </StandardPageLayout>
  );
}
