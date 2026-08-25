import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="container py-8 max-w-6xl">
        {/* Breadcrumb */}
        <Skeleton className="h-5 w-40 mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 md:p-12">
              {/* Badges */}
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
              
              {/* Title */}
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-3/4 mb-6" />
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-dashed mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                ))}
              </div>
              
              {/* AI Summary Card */}
              <Skeleton className="h-48 rounded-2xl mb-10" />
              
              {/* Content */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-8 sticky top-24">
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              
              {/* External Links */}
              <Skeleton className="h-12 w-full" />
            </Card>
            
            {/* Premium Card */}
            <Card className="p-8">
              <Skeleton className="h-10 w-10 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}