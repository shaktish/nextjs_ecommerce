export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="h-10 w-72 bg-gray-300 rounded mx-auto mb-4"></div>
        <div className="h-5 w-56 bg-gray-300 rounded mx-auto"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-40 bg-gray-300 rounded"></div>
          <div className="h-10 w-40 bg-gray-300 rounded"></div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-64 space-y-4">
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="animate-pulse" key={i}>
                <div className="bg-gray-300 aspect-[3/4] mb-4 rounded"></div>
                <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="bg-gray-300 h-3 w-full rounded"></div>
                  <div className="bg-gray-300 h-3 w-5/6 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="h-10 w-10 bg-gray-300 rounded"></div>
          <div className="h-10 w-10 bg-gray-300 rounded"></div>
          <div className="h-10 w-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
