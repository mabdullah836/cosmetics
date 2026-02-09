"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  debounceMs?: number;
  className?: string;
  showClearButton?: boolean;
}

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  defaultValue = "",
  debounceMs = 300,
  className,
  showClearButton = true,
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, debounceMs);
  const isFirstRender = useRef(true);
  const lastSearchedQuery = useRef(defaultValue);
  const prevDefaultValue = useRef(defaultValue);

  // Keep input in sync when URL/defaultValue changes from outside (e.g. back button, filter change)
  useEffect(() => {
    if (prevDefaultValue.current !== defaultValue) {
      prevDefaultValue.current = defaultValue;
      setQuery(defaultValue);
      lastSearchedQuery.current = defaultValue;
    }
  }, [defaultValue]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastSearchedQuery.current = debouncedQuery;
      return;
    }
    if (debouncedQuery !== lastSearchedQuery.current) {
      lastSearchedQuery.current = debouncedQuery;
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {showClearButton && query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
