
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export function createSimplePage(title: string, description: string) {
  return function SimplePage() {
    return (
      <StandardPageLayout
        title={title}
        description={description}
      >
        <div className="text-center">
          <p className="text-muted-foreground">{title} content coming soon.</p>
        </div>
      </StandardPageLayout>
    );
  };
}
