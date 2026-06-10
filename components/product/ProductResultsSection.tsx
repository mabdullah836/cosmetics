"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { buildProductFilterKey } from "@/lib/utils/product-filters";
import ProductResultsFallback from "./ProductResultsFallback";

export default function ProductResultsSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const filterKey = buildProductFilterKey(searchParams);

  return (
    <Suspense key={filterKey} fallback={<ProductResultsFallback />}>
      {children}
    </Suspense>
  );
}
