import { CollectionSkeleton } from "@/modules/collections/components/skeleton/CollectionSkeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="text-center mb-3">
        <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
        <div className="h-5 w-80 bg-gray-200 rounded mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CollectionSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
