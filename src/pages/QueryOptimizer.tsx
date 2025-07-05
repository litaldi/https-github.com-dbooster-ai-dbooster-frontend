
export default function QueryOptimizer() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Query Optimizer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Query Input */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter Your SQL Query</h2>
            <textarea
              className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
              placeholder="SELECT * FROM users WHERE..."
            />
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
              Optimize Query
            </button>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Optimization Suggestions</h2>
            <div className="border rounded-lg p-4 h-64 bg-muted/50">
              <p className="text-muted-foreground text-center mt-20">
                Enter a query to see optimization suggestions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
