import React from "react";
import { Button } from "./button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions?: number[];
  selectedCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange, rowsPerPageOptions = [5, 10, 12, 25, 50], selectedCount = 0 }) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));

  const handleFirst = () => onPageChange(1);
  const handlePrev = () => onPageChange(Math.max(1, page - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, page + 1));
  const handleLast = () => onPageChange(totalPages);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t pt-2 text-sm text-muted-foreground">
      <div>
        <p className="text-sm text-muted-foreground">
          {selectedCount} of {count} row(s) selected.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <Select value={rowsPerPage.toString()} onValueChange={(val) => onRowsPerPageChange(Number(val))}>
          <SelectTrigger className="h-8 w-20 rounded-md border px-2 text-sm focus:outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((opt) => (
              <SelectItem key={opt} value={opt.toString()}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-blue-500 lg:h-8 lg:w-8" onClick={handleFirst} disabled={page === 1} aria-label="First page">
            <ChevronsLeft className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
          <Button variant="outline" size="icon" className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-blue-500 lg:h-8 lg:w-8" onClick={handlePrev} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
          <Button variant="outline" size="icon" className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-blue-500 lg:h-8 lg:w-8" onClick={handleNext} disabled={page === totalPages} aria-label="Next page">
            <ChevronRight className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
          <Button variant="outline" size="icon" className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-blue-500 lg:h-8 lg:w-8" onClick={handleLast} disabled={page === totalPages} aria-label="Last page">
            <ChevronsRight className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
