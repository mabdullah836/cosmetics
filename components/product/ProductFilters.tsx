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

const ProductFilters = ({ categories = [], brands = [], maxPrice = 1000 }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Local state for immediate UI updates
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams?.get("category") || null
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams?.get("brands")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams?.get("minPrice")) || 0,
    Number(searchParams?.get("maxPrice")) || maxPrice,
  ]);

  // Refs for tracking state
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastUpdateRef = useRef<string>("");
  const isUpdatingRef = useRef<boolean>(false);

  // Sync state with URL params when they change externally
  useEffect(() => {
    const category = searchParams?.get("category") || null;
    const brands = searchParams?.get("brands")?.split(",").filter(Boolean) || [];
    const minPrice = Number(searchParams?.get("minPrice")) || 0;
    const urlMaxPrice = Number(searchParams?.get("maxPrice")) || maxPrice;

    setSelectedCategory(category);
    setSelectedBrands(brands);
    setPriceRange([minPrice, urlMaxPrice]);
  }, [searchParams, maxPrice]);

  // Optimized filter update with debouncing
  const updateFilters = useCallback((immediate = false) => {
    // Clear any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const applyFilters = () => {
      // Prevent duplicate updates
      if (isUpdatingRef.current) return;
      
      const params = new URLSearchParams(searchParams?.toString() || "");
      
      // Build new params string
      if (selectedCategory) {
        params.set("category", selectedCategory);
      } else {
        params.delete("category");
      }
      
      if (selectedBrands.length > 0) {
        params.set("brands", selectedBrands.join(","));
      } else {
        params.delete("brands");
      }
      
      if (priceRange?.[0] > 0) {
        params.set("minPrice", priceRange[0]?.toString() || "0");
      } else {
        params.delete("minPrice");
      }
      
      if (priceRange?.[1] < maxPrice) {
        params.set("maxPrice", priceRange[1]?.toString() || maxPrice.toString());
      } else {
        params.delete("maxPrice");
      }
      
      params.delete("page");
      
      const newUrl = `/products?${params.toString()}`;
      
      // Only update if URL actually changed
      if (lastUpdateRef.current !== newUrl) {
        lastUpdateRef.current = newUrl;
        isUpdatingRef.current = true;
        
        // Use startTransition for non-urgent updates
        startTransition(() => {
          router.push(newUrl, { scroll: false });
          // Reset update flag after a short delay
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        });
      }
    };

    if (immediate) {
      applyFilters();
    } else {
      // Debounce price slider updates (500ms)
      updateTimeoutRef.current = setTimeout(applyFilters, 500);
    }
  }, [router, searchParams, selectedCategory, selectedBrands, priceRange, maxPrice]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategory(prev => prev === categorySlug ? null : categorySlug);
    // Apply immediately for category changes
    setTimeout(() => updateFilters(true), 0);
  }, [updateFilters]);

  const handleBrandChange = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    // Apply immediately for brand changes
    setTimeout(() => updateFilters(true), 0);
  }, [updateFilters]);

  const handlePriceChange = useCallback((value: number[]) => {
    setPriceRange(value as [number, number]);
    // Debounced update for price slider
    updateFilters(false);
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
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

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || (priceRange?.[0] || 0) > 0 || (priceRange?.[1] || maxPrice) < maxPrice;

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
        
        {categories.length > 0 && (
          <AccordionItem value="category">
            <AccordionTrigger className="text-base font-semibold">Category</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategory === category.slug}
                    onCheckedChange={() => handleCategoryChange(category.slug || "")}
                    disabled={isPending}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`} 
                    className="font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
        
        {brands.length > 0 && (
          <AccordionItem value="brand">
            <AccordionTrigger className="text-base font-semibold">Brand</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
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
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Filters are applied automatically as you select them
      </p>
    </div>
  );
};

export default ProductFilters;
