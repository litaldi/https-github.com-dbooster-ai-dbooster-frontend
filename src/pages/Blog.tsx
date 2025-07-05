
export default function Blog() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">DBooster Blog</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Stay updated with the latest in database optimization and performance tuning.
        </p>
        
        <div className="space-y-8">
          <article className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2">
              How to Reduce Database Costs by 60% with AI
            </h2>
            <p className="text-muted-foreground mb-2">Published on January 15, 2024</p>
            <p className="text-muted-foreground">
              Learn practical strategies for reducing database infrastructure costs while improving performance.
            </p>
          </article>
          
          <article className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2">
              The Future of Database Optimization
            </h2>
            <p className="text-muted-foreground mb-2">Published on January 10, 2024</p>
            <p className="text-muted-foreground">
              Explore emerging trends and technologies shaping the future of database optimization.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
