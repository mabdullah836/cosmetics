"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ProductFilters from "./ProductFilters";
import SearchInput from "@/components/common/SearchInput";
import { useCallback } from "react";

interface ProductsToolbarProps {
  currentCount: number;
  totalCount: number;
  currentSort: string;
  categories?: any[];
  brands?: string[];
}

export default function ProductsToolbar({
  currentCount,
  totalCount,
  currentSort,
  categories = [],
  brands = [],
}: ProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("sortBy", value);
    params.delete("page"); // Reset to page 1 when sorting changes
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    // Only update if the search value actually changed
    const currentSearch = params.get("search") || "";
    if (currentSearch === query.trim()) {
      return; // No change, don't navigate
    }
    
    if (query.trim()) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to page 1 when search changes
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <>
      {/* Search Bar - Mobile and Desktop */}
      <div className="mb-4">
        <SearchInput
          placeholder="Search products..."
          onSearch={handleSearch}
          defaultValue={searchParams?.get("search") || ""}
          className="w-full"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-600">
          Showing {currentCount} of {totalCount}
        </p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden flex-1 sm:flex-initial">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96">
              <div className="mt-6">
                <ProductFilters
                  categories={categories}
                  brands={brands}
                  maxPrice={1000}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
