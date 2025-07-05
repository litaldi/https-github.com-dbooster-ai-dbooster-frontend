
export default function Support() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Support & Help</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How does DBooster optimize my queries?</h3>
                <p className="text-muted-foreground">
                  DBooster uses advanced AI algorithms to analyze your SQL queries and database structure, 
                  identifying performance bottlenecks and suggesting optimizations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, we're SOC2 Type II certified and use enterprise-grade encryption to protect your data. 
                  Your database schemas and queries are encrypted at rest and in transit.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What databases do you support?</h3>
                <p className="text-muted-foreground">
                  We support all major databases including PostgreSQL, MySQL, SQL Server, Oracle, 
                  and many more. Contact us if you need support for a specific database.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get Help</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Comprehensive guides and API documentation
                </p>
                <button className="text-primary hover:underline text-sm">
                  View Docs →
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Join our community of developers
                </p>
                <button className="text-primary hover:underline text-sm">
                  Join Discord →
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Get help from our support team
                </p>
                <button className="text-primary hover:underline text-sm">
                  Create Ticket →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
