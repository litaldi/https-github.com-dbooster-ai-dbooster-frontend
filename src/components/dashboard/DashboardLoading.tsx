
import { LoadingState, SkeletonCard } from '@/components/ui/enhanced-loading-states';

export function DashboardLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      <LoadingState 
        isLoading={true} 
        message="Loading your enterprise dashboard..." 
        variant="database"
      >
        <div />
      </LoadingState>
    </div>
  );
}
