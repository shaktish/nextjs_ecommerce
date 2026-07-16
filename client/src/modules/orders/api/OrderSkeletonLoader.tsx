import { Skeleton } from "@/components/ui/skeleton";

export default function OrderSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between gap-6 border-b bg-gray-50 px-6 py-4">
            <div className="flex flex-wrap gap-10">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Skeleton className="ml-auto h-3 w-16" />
              <Skeleton className="h-5 w-44" />
            </div>
          </div>

          {/* Products */}
          <div className="divide-y">
            {[1, 2].map((item) => (
              <div key={item} className="flex flex-col gap-4 p-6 sm:flex-row">
                <Skeleton className="h-[150px] w-[150px] rounded-lg" />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                </div>

                <div className="flex items-center">
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
