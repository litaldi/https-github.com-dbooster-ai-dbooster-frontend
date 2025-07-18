
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, Clock, 
  BarChart3, PieChart, TrendingUp, Database 
} from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface ReportConfig {
  name: string;
  type: 'performance' | 'usage' | 'security' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  schedule?: 'daily' | 'weekly' | 'monthly';
  sections: string[];
  dateRange: '7d' | '30d' | '90d' | 'custom';
}

export function ReportGenerator() {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    type: 'performance',
    format: 'pdf',
    sections: [],
    dateRange: '30d'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, name: 'Weekly Performance Summary', schedule: 'weekly', nextRun: '2024-01-20' },
    { id: 2, name: 'Monthly Usage Report', schedule: 'monthly', nextRun: '2024-02-01' }
  ]);

  const reportSections = {
    performance: [
      'Query Performance Metrics',
      'Response Time Analysis',
      'Resource Utilization',
      'Optimization Recommendations'
    ],
    usage: [
      'User Activity Summary',
      'Database Usage Statistics',
      'Feature Adoption Metrics',
      'Growth Trends'
    ],
    security: [
      'Access Logs',
      'Security Events',
      'Compliance Status',
      'Risk Assessment'
    ],
    custom: [
      'Custom Metrics',
      'Custom Charts',
      'Custom Analysis',
      'Custom Recommendations'
    ]
  };

  const handleSectionToggle = (section: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section]
    }));
  };

  const generateReport = async () => {
    if (!config.name || config.sections.length === 0) {
      enhancedToast.error({
        title: 'Invalid Configuration',
        description: 'Please provide a report name and select at least one section'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      enhancedToast.success({
        title: 'Report Generated',
        description: `${config.name} has been generated successfully`,
        action: {
          label: 'Download',
          onClick: () => console.log('Downloading report...')
        }
      });
    } catch (error) {
      enhancedToast.error({
        title: 'Generation Failed',
        description: 'Could not generate report. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const scheduleReport = () => {
    if (!config.schedule) {
      enhancedToast.error({
        title: 'Schedule Required',
        description: 'Please select a schedule for the report'
      });
      return;
    }

    const newReport = {
      id: Date.now(),
      name: config.name,
      schedule: config.schedule,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setScheduledReports(prev => [...prev, newReport]);
    
    enhancedToast.success({
      title: 'Report Scheduled',
      description: `${config.name} has been scheduled for ${config.schedule} generation`
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter report name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select 
                  value={config.type} 
                  onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value, sections: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select 
                  value={config.format} 
                  onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Report Sections</Label>
              <div className="space-y-2">
                {reportSections[config.type].map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={section}
                      checked={config.sections.includes(section)}
                      onCheckedChange={() => handleSectionToggle(section)}
                    />
                    <Label htmlFor={section} className="text-sm">{section}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select 
                value={config.dateRange} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule (Optional)</Label>
              <Select 
                value={config.schedule || ''} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, schedule: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={generateReport} 
                disabled={isGenerating} 
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {config.schedule && (
                <Button 
                  onClick={scheduleReport} 
                  variant="outline"
                  className="flex-1"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Next run: {report.nextRun}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{report.schedule}</Badge>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </div>
                </motion.div>
              ))}
              
              {scheduledReports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No scheduled reports</p>
                  <p className="text-xs mt-1">Configure a report above and set a schedule</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, name: 'Performance Summary', type: 'performance' },
              { icon: PieChart, name: 'Usage Analytics', type: 'usage' },
              { icon: TrendingUp, name: 'Growth Report', type: 'custom' }
            ].map((template) => (
              <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <template.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium">{template.name}</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setConfig(prev => ({ 
                      ...prev, 
                      type: template.type as any,
                      name: template.name,
                      sections: reportSections[template.type as keyof typeof reportSections]
                    }))}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
