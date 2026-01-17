"use client";

import { useState } from 'react';
import { Product } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddToCartButton from './AddToCartButton';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">123 Reviews</span>
        </div>
      </div>

      {product.variants.map((variant) => (
        <div key={variant.id}>
          <Label className="text-base font-semibold">{variant.name}</Label>
          <RadioGroup defaultValue={variant.options[0]} className="flex flex-wrap gap-2 mt-2">
            {variant.options.map((option) => (
              <Label key={option} htmlFor={option} className="flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium hover:bg-accent has-[:checked]:border-primary cursor-pointer">
                <RadioGroupItem value={option} id={option} className="sr-only" />
                {option}
              </Label>
            ))}
          </RadioGroup>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <Label className="text-base font-semibold">Quantity</Label>
        <div className="flex items-center border rounded-lg">
          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>+</Button>
        </div>
      </div>

      <p className="text-3xl font-bold">${product.price.toString()}</p>

      <AddToCartButton productId={product.id} />

      <Tabs defaultValue="description" className="mt-6">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4 text-muted-foreground">
          {product.description}
        </TabsContent>
        <TabsContent value="ingredients" className="mt-4 text-muted-foreground">
          <p>Placeholder for ingredients list.</p>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4 text-muted-foreground">
          <p>Placeholder for reviews.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductInfo;
