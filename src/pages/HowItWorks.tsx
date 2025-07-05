
export default function HowItWorks() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">How DBooster Works</h1>
          <p className="text-lg text-muted-foreground">
            Learn how our AI-powered platform optimizes your database performance in three simple steps.
          </p>
        </div>

        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-4">01</div>
              <h2 className="text-2xl font-semibold mb-4">Connect Your Database</h2>
              <p className="text-muted-foreground">
                Securely connect your database or upload your SQL files. Our platform supports all major databases 
                including PostgreSQL, MySQL, SQL Server, and more.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-muted-foreground">Database Connection Visualization</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <div className="text-3xl font-bold text-primary mb-4">02</div>
              <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
              <p className="text-muted-foreground">
                Our advanced AI algorithms analyze your queries, identify performance bottlenecks, 
                and generate optimization recommendations in real-time.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-8 h-64 flex items-center justify-center md:order-1">
              <div className="text-muted-foreground">AI Analysis Visualization</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-4">03</div>
              <h2 className="text-2xl font-semibold mb-4">Optimize & Deploy</h2>
              <p className="text-muted-foreground">
                Review the optimization suggestions, apply the improvements, and monitor the performance gains. 
                Most users see 60-80% improvement in query performance.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-muted-foreground">Optimization Results Visualization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
