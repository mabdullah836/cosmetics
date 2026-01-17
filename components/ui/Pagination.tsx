import Link from "next/link";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center mt-12 space-x-4">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`}>
          <Button>Previous</Button>
        </Link>
      )}
      <span className="text-lg font-medium">Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`}>
          <Button>Next</Button>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
