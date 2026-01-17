"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const ProductFilters = () => {
  // Placeholder data - replace with actual data
  const categories = ["Skincare", "Makeup", "Haircare", "Fragrance"];
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

  return (
    <div className="w-full lg:w-64">
      <h3 className="text-xl font-bold mb-4">Filters</h3>
      <Accordion type="multiple" defaultValue={['price', 'category']}>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider defaultValue={[50]} max={100} step={1} />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>$0</span>
              <span>$100</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-semibold">Category</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label htmlFor={category} className="font-normal">{category}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brand">
          <AccordionTrigger className="text-base font-semibold">Brand</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={brand} />
                <Label htmlFor={brand} className="font-normal">{brand}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
