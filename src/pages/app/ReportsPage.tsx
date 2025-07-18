
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveAnalyticsDashboard } from '@/components/analytics/ComprehensiveAnalyticsDashboard';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { ScreenshotToSQL } from '@/components/ai/ScreenshotToSQL';
import { BarChart3, FileText, Camera, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analytics, report generation, and advanced AI features for database optimization insights.
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            AI Tools
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <ComprehensiveAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="ai-tools">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScreenshotToSQL />
            <div className="space-y-6">
              {/* Additional AI tools can be added here */}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Advanced Insights</h3>
            <p className="text-muted-foreground">
              AI-powered insights and recommendations will be displayed here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
