
export default function Repositories() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
            Add Repository
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample repository cards */}
          {[
            { name: 'my-awesome-app', status: 'Active', queries: 15, optimizations: 3 },
            { name: 'analytics-service', status: 'Scanning', queries: 8, optimizations: 1 },
            { name: 'user-management', status: 'Active', queries: 23, optimizations: 7 },
          ].map((repo, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">{repo.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Status: <span className="text-foreground">{repo.status}</span></p>
                <p>Queries: <span className="text-foreground">{repo.queries}</span></p>
                <p>Optimizations: <span className="text-foreground">{repo.optimizations}</span></p>
              </div>
              <div className="mt-4 space-x-2">
                <button className="text-primary hover:underline text-sm">View</button>
                <button className="text-primary hover:underline text-sm">Scan</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
