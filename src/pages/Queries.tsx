
export default function Queries() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Query Management</h1>
        
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search queries..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        
        <div className="space-y-4">
          {[
            {
              id: 1,
              query: 'SELECT * FROM users WHERE created_at > ?',
              status: 'Optimized',
              improvement: '45%',
              file: 'user-service.ts:42'
            },
            {
              id: 2,
              query: 'SELECT u.*, p.* FROM users u JOIN profiles p ON u.id = p.user_id',
              status: 'Pending',
              improvement: 'Analyzing...',
              file: 'profile-service.ts:18'
            },
            {
              id: 3,
              query: 'UPDATE orders SET status = ? WHERE id = ?',
              status: 'Optimized',
              improvement: '23%',
              file: 'order-service.ts:95'
            }
          ].map((query) => (
            <div key={query.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{query.query}</code>
                  <p className="text-sm text-muted-foreground mt-2">{query.file}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    query.status === 'Optimized' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {query.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Performance improvement: <strong>{query.improvement}</strong>
                </span>
                <div className="space-x-2">
                  <button className="text-primary hover:underline text-sm">View Details</button>
                  <button className="text-primary hover:underline text-sm">Apply Fix</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
