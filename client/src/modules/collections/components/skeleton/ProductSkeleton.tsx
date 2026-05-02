export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 aspect-[3/4] mb-4 rounded"></div>
      <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
      <div className="space-y-1">
        <div className="bg-gray-300 h-3 w-full rounded"></div>
        <div className="bg-gray-300 h-3 w-5/6 rounded"></div>
      </div>
    </div>
  );
}
