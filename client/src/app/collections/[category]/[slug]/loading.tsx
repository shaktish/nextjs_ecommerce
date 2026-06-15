export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Images */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-[3/4] bg-gray-300 rounded-lg" />
          ))}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4" />

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
          </div>

          <div className="h-12 bg-gray-300 rounded w-40" />
          <div className="h-12 bg-gray-300 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
