
export default function Reports() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Performance Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Total Savings</h3>
            <p className="text-3xl font-bold text-green-600">$12,450</p>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Performance Improvement</h3>
            <p className="text-3xl font-bold text-blue-600">73%</p>
            <p className="text-sm text-muted-foreground">Average across all queries</p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Queries Optimized</h3>
            <p className="text-3xl font-bold text-purple-600">1,247</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
          <div className="h-64 bg-muted/50 rounded flex items-center justify-center">
            <p className="text-muted-foreground">Performance chart would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
