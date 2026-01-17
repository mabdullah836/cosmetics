import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => (
  <div className="w-full max-w-sm">
    <Skeleton className="w-full aspect-square rounded-xl" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="p-4 pt-0 flex justify-between items-center">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-10 w-2/5" />
    </div>
  </div>
);

const ProductGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
