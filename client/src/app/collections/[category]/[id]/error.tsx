"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        <AlertCircle className="h-16 w-16 mx-auto" />

        <div>
          <h1 className="text-2xl font-bold">Unable to Load Product</h1>

          <p className="text-muted-foreground mt-2">
            Something unexpected happened while fetching the product details.
          </p>
        </div>

        <Button onClick={reset}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
