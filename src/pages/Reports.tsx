
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Share, TrendingUp, Clock, Database } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export default function Reports() {
  const timeSavedData = [
    { month: 'Jan', time: 12.5 },
    { month: 'Feb', time: 18.2 },
    { month: 'Mar', time: 24.1 },
    { month: 'Apr', time: 31.5 },
    { month: 'May', time: 28.9 },
    { month: 'Jun', time: 47.2 },
  ];

  const queryBreakdownData = [
    { name: 'SELECT', value: 45, color: '#3b82f6' },
    { name: 'JOIN', value: 25, color: '#10b981' },
    { name: 'UPDATE', value: 15, color: '#f59e0b' },
    { name: 'INSERT', value: 10, color: '#ef4444' },
    { name: 'DELETE', value: 5, color: '#8b5cf6' },
  ];

  const topQueriesData = [
    { query: 'User lookup with profile', optimizations: 24, timeSaved: '12.3s' },
    { query: 'Order history with items', optimizations: 18, timeSaved: '8.7s' },
    { query: 'Product search with filters', optimizations: 15, timeSaved: '6.2s' },
    { query: 'Analytics aggregation', optimizations: 12, timeSaved: '15.1s' },
    { query: 'Payment processing check', optimizations: 9, timeSaved: '4.8s' },
  ];

  const handleExport = (format: string) => {
    enhancedToast.success({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
  };

  const handleShare = () => {
    enhancedToast.success({
      title: "Report Shared",
      description: "Report link has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Reports</h1>
          <p className="text-muted-foreground">
            Analyze your database optimization performance and trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="last-30-days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47.2 hours</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries Optimized</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance Gain</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Saved Over Time</CardTitle>
            <CardDescription>Monthly performance improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSavedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} hours`, 'Time Saved']} />
                <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Type Breakdown</CardTitle>
            <CardDescription>Distribution of optimized query types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={queryBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {queryBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Queries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Optimized Queries</CardTitle>
          <CardDescription>Queries with the most impact on performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topQueriesData.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{query.query}</p>
                  <p className="text-sm text-muted-foreground">
                    {query.optimizations} optimizations applied
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{query.timeSaved}</p>
                  <p className="text-sm text-muted-foreground">time saved</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
