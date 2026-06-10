import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductResultsFallback() {
  return (
    <>
      <div className="mb-4">
        <Skeleton className="h-4 w-40" />
      </div>
      <ProductGridSkeleton count={12} className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5" />
    </>
  );
}
