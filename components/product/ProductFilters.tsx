"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/supabase";
import { useState, useEffect, useCallback, useRef, useTransition } from "react";

interface ProductFiltersProps {
  categories?: Category[];
  brands?: string[];
  maxPrice?: number;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getCategoryIdsFromParams(
  searchParams: URLSearchParams | null,
  categoryList: Category[]
): string[] {
  const multi = searchParams?.get("categories")?.split(",").map((c) => c.trim()).filter(Boolean);
  if (multi?.length) return multi;

  const single = searchParams?.get("category")?.trim();
  if (!single) return [];
  if (UUID_REGEX.test(single)) return [single];
  const bySlug = categoryList?.find((c) => (c?.slug ?? "")?.toLowerCase() === single?.toLowerCase());
  return bySlug ? [bySlug.id] : [];
}

const ProductFilters = ({ categories = [], brands = [], maxPrice = 1000 }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    getCategoryIdsFromParams(searchParams, categories)
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams?.get("brands")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams?.get("minPrice")) || 0,
    Number(searchParams?.get("maxPrice")) || maxPrice,
  ]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastUpdateRef = useRef<string>("");
  const isUpdatingRef = useRef<boolean>(false);

  // Sync state with URL when arriving from landing (e.g. ?category=makeup) or when params change
  useEffect(() => {
    if (isUpdatingRef.current) return;

    const categoryIds = getCategoryIdsFromParams(searchParams, categories);
    const brandsFromUrl = searchParams?.get("brands")?.split(",").filter(Boolean) || [];
    const minPrice = Number(searchParams?.get("minPrice")) || 0;
    const urlMaxPrice = Number(searchParams?.get("maxPrice")) || maxPrice;

    setSelectedCategories(categoryIds);
    setSelectedBrands(brandsFromUrl);
    setPriceRange([minPrice, urlMaxPrice]);
  }, [searchParams, maxPrice, categories]);

  // Override state so we can pass the *next* state from click handlers (avoids stale closure)
  type FilterOverride = {
    selectedCategories?: string[];
    selectedBrands?: string[];
    priceRange?: [number, number];
  };

  const updateFilters = useCallback((immediate = false, override?: FilterOverride) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const applyFilters = () => {
      if (isUpdatingRef.current) return;

      const categories = override?.selectedCategories !== undefined ? override.selectedCategories : selectedCategories;
      const brands = override?.selectedBrands !== undefined ? override.selectedBrands : selectedBrands;
      const range = override?.priceRange !== undefined ? override.priceRange : priceRange;

      const params = new URLSearchParams(searchParams?.toString() || "");

      if (categories?.length) {
        params.set("categories", categories.join(","));
        params.delete("category");
      } else {
        params.delete("categories");
        params.delete("category");
      }

      if (brands?.length) {
        params.set("brands", brands.join(","));
      } else {
        params.delete("brands");
      }

      if (range?.[0] != null && range[0] > 0) {
        params.set("minPrice", String(range[0]));
      } else {
        params.delete("minPrice");
      }

      if (range?.[1] != null && range[1] < maxPrice) {
        params.set("maxPrice", String(range[1]));
      } else {
        params.delete("maxPrice");
      }
      
      params.delete("page");
      
      const newUrl = `/products?${params.toString()}`;

      if (lastUpdateRef.current !== newUrl) {
        lastUpdateRef.current = newUrl;
        isUpdatingRef.current = true;
        startTransition(() => {
          router.push(newUrl, { scroll: false });
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        });
      }
    };

    if (immediate) {
      applyFilters();
    } else {
      updateTimeoutRef.current = setTimeout(applyFilters, 500);
    }
  }, [router, searchParams, selectedCategories, selectedBrands, priceRange, maxPrice]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    const nextCategories = selectedCategories?.includes(categoryId)
      ? selectedCategories?.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(nextCategories);
    updateFilters(true, { selectedCategories: nextCategories });
  }, [updateFilters, selectedCategories]);

  const handleBrandChange = useCallback((brand: string) => {
    const nextBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(nextBrands);
    updateFilters(true, { selectedBrands: nextBrands });
  }, [updateFilters, selectedBrands]);

  const handlePriceChange = useCallback((value: number[]) => {
    const nextRange = value as [number, number];
    setPriceRange(nextRange);
    updateFilters(false, { priceRange: nextRange });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    
    // Clear immediately
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    startTransition(() => {
      router.push("/products", { scroll: false });
    });
  }, [router, maxPrice]);

  const hasActiveFilters = selectedCategories?.length > 0 || selectedBrands?.length > 0 || (priceRange?.[0] || 0) > 0 || (priceRange?.[1] || maxPrice) < maxPrice;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Filters</h3>
          {isPending && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
            Clear all
          </Button>
        )}
      </div>
      
      <Accordion type="multiple" defaultValue={["price", "category", "brand"]}>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
              disabled={isPending}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange?.[0] || 0}</span>
              <span>${priceRange?.[1] || maxPrice}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {categories?.length > 0 && (
          <AccordionItem value="category">
            <AccordionTrigger className="text-base font-semibold">Category</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {categories?.map((category) => {
                const categoryId = category?.id ?? "";
                const slug = (category?.slug ?? "").toLowerCase();
                const categoriesFromUrl = searchParams?.get("categories")?.split(",").filter(Boolean) || [];
                const singleCategoryFromUrl = searchParams?.get("category")?.trim().toLowerCase() || null;
                const isChecked =
                  Boolean(categoryId) &&
                  (selectedCategories.includes(categoryId) ||
                    categoriesFromUrl.includes(categoryId) ||
                    (Boolean(singleCategoryFromUrl) &&
                      (singleCategoryFromUrl === categoryId.toLowerCase() || singleCategoryFromUrl === slug)));
                return (
                <div key={category?.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category?.id}`}
                    checked={isChecked}
                    onCheckedChange={() => handleCategoryChange(categoryId)}
                    disabled={isPending}
                  />
                  <Label 
                    htmlFor={`category-${category?.id}`} 
                    className="font-normal cursor-pointer"
                  >
                    {category?.name}
                  </Label>
                </div>
              );
              })}
            </AccordionContent>
          </AccordionItem>
        )}
        
        {brands?.length > 0 && (
          <AccordionItem value="brand">
            <AccordionTrigger className="text-base font-semibold">Brand</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {brands?.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands?.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                    disabled={isPending}
                  />
                  <Label 
                    htmlFor={`brand-${brand}`} 
                    className="font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ProductFilters;
