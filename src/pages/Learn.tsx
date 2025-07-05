
export default function Learn() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Learn Database Optimization</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Master database optimization with our comprehensive guides and tutorials.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              Learn the basics of database optimization and how to get started with DBooster.
            </p>
            <button className="text-primary hover:underline">Read Guide →</button>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Techniques</h2>
            <p className="text-muted-foreground mb-4">
              Deep dive into advanced optimization strategies for complex database scenarios.
            </p>
            <button className="text-primary hover:underline">Read Guide →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
