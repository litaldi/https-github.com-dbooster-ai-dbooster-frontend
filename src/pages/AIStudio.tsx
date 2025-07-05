
export default function AIStudio() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">AI Studio</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Query Analysis</h2>
              <p className="text-muted-foreground mb-4">
                Upload your database schema or paste SQL queries for AI-powered analysis and optimization.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Start Analysis
              </button>
            </div>
            
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
              <p className="text-muted-foreground mb-4">
                Get detailed insights about your database performance and optimization opportunities.
              </p>
              <button className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/10">
                View Insights
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium">Index Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Consider adding an index on user_id column for better performance
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium">Query Rewrite</h3>
                <p className="text-sm text-muted-foreground">
                  Your SELECT query can be optimized to reduce execution time by 45%
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium">Schema Design</h3>
                <p className="text-sm text-muted-foreground">
                  Consider normalizing the orders table to improve data integrity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
