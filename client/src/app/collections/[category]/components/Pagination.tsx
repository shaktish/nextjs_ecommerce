"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button
        variant={"outline"}
        size={"icon"}
        disabled={currentPage === 1}
        onClick={onPrevPage}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size={"icon"}
          onClick={() => onGoToPage(page)}
          className="pointer"
        >
          {page}
        </Button>
      ))}
      <Button
        variant={"outline"}
        size={"icon"}
        disabled={currentPage === totalPages}
        onClick={onNextPage}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
