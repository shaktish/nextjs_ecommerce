import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-[70%] space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Skeleton className="w-20 h-20 rounded-md" />

                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />

                  <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>

                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[30%] border rounded-lg p-6 space-y-4">
            <Skeleton className="h-7 w-40" />

            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>

            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
