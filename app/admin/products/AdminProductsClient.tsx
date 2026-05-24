"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SearchInput from "@/components/common/SearchInput";
import { Package, Plus, Edit, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { replaceProductImages, upsertProduct } from "@/lib/actions/admin";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminProductsClientProps {
  products: any[];
  categories: Array<{ id: string; name: string }>;
}

type ProductFormState = {
  id?: string;
  name: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  brand: string;
  description: string;
  stockLevel: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED";
  isActive: boolean;
  pendingFiles: File[];
};

const defaultProductForm: ProductFormState = {
  name: "",
  price: "",
  compareAtPrice: "",
  categoryId: "none",
  brand: "",
  description: "",
  stockLevel: "IN_STOCK",
  isActive: true,
  pendingFiles: [],
};

export default function AdminProductsClient({ products, categories }: AdminProductsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [formState, setFormState] = useState<ProductFormState>(defaultProductForm);
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(product.categories)
          ? product.categories[0]?.name
          : product.categories?.name
        )
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.is_active) ||
        (statusFilter === "inactive" && !product.is_active);

      // Stock filter
      const matchesStock =
        stockFilter === "all" || product.stock_level === stockFilter;

      return matchesSearch && matchesStatus && matchesStock;
    });
  }, [products, searchQuery, statusFilter, stockFilter]);

  const getStockBadge = (stockLevel?: string) => {
    switch (stockLevel) {
      case "IN_STOCK":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case "LOW_STOCK":
        return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>;
      case "OUT_OF_STOCK":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      case "DISCONTINUED":
        return <Badge className="bg-gray-100 text-gray-800">Discontinued</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    );
  };

  const openCreateDialog = () => {
    setFormState(defaultProductForm);
    setShowProductDialog(true);
  };

  const openEditDialog = (product: any) => {
    setFormState({
      id: product.id,
      name: product.name || "",
      price: String(product.price ?? ""),
      compareAtPrice:
        product.original_price != null && product.original_price > product.price
          ? String(product.original_price)
          : "",
      categoryId: product.category_id || "none",
      brand: product.brand || "",
      description: product.description || "",
      stockLevel: product.stock_level || "IN_STOCK",
      isActive: !!product.is_active,
      pendingFiles: [],
    });
    setShowProductDialog(true);
  };

  const handleSaveProduct = () => {
    startTransition(() => {
      void (async () => {
        const price = Number(formState.price);
        const compareRaw = formState.compareAtPrice.trim();
        let compareAtPrice: number | null = null;
        if (compareRaw !== "") {
          const n = Number(compareRaw);
          if (!Number.isFinite(n) || n < 0) {
            toast.error("Compare-at price must be a valid number");
            return;
          }
          compareAtPrice = n;
        }

        const result = await upsertProduct({
          id: formState.id,
          name: formState.name,
          price,
          compareAtPrice,
          categoryId: formState.categoryId === "none" ? null : formState.categoryId,
          brand: formState.brand,
          description: formState.description,
          stockLevel: formState.stockLevel,
          isActive: formState.isActive,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        const productId = result.productId;
        if (!productId) {
          toast.error("Could not determine product id");
          return;
        }

        if (formState.pendingFiles.length > 0) {
          const uploaded: { url: string; publicId?: string | null }[] = [];
          for (const file of formState.pendingFiles) {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("productId", productId);
            const res = await fetch("/api/admin/product-images", {
              method: "POST",
              body: fd,
            });
            const data = (await res.json()) as {
              url?: string;
              publicId?: string;
              error?: string;
            };
            if (!res.ok) {
              toast.error(data.error || "Image upload failed");
              return;
            }
            if (data.url) {
              uploaded.push({ url: data.url, publicId: data.publicId ?? null });
            }
          }
          const imgRes = await replaceProductImages(productId, uploaded);
          if (imgRes.error) {
            toast.error(imgRes.error);
            return;
          }
        }

        toast.success(formState.id ? "Product updated" : "Product created");
        setShowProductDialog(false);
        router.refresh();
      })();
    });
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Products</h1>
          <p className="text-gray-600">View and manage all products in your store</p>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search products by name, brand, or category..."
                onSearch={setSearchQuery}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products ({filteredProducts.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const primaryImage =
                      product.images?.find((img: any) => img.is_primary) ||
                      product.images?.[0];
                    const category = Array.isArray(product.categories)
                      ? product.categories[0]?.name
                      : product.categories?.name || "Uncategorized";

                    return (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {primaryImage?.image_url ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={primaryImage.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              {product.brand && (
                                <p className="text-sm text-gray-500">{product.brand}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{category}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.original_price &&
                              product.original_price > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.original_price)}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="p-4">{getStockBadge(product.stock_level)}</td>
                        <td className="p-4">{getStatusBadge(product.is_active)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/product/${product.slug || product.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formState.id ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="product-price">Sale price (current)</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={(e) => setFormState((prev) => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-compare">Compare-at price (optional)</Label>
                <Input
                  id="product-compare"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Higher list price"
                  value={formState.compareAtPrice}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, compareAtPrice: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  When compare-at is higher than sale price, storefront shows a discount.
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Stock level</Label>
                <Select
                  value={formState.stockLevel}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      stockLevel: value as ProductFormState["stockLevel"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_STOCK">In Stock</SelectItem>
                    <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={formState.categoryId}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-brand">Brand</Label>
                <Input
                  id="product-brand"
                  value={formState.brand}
                  onChange={(e) => setFormState((prev) => ({ ...prev, brand: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={formState.description}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
              />
            </div>
            <div className="grid gap-2 rounded-md border p-3">
              <Label>Images (Cloudinary)</Label>
              <p className="text-xs text-muted-foreground">
                New uploads are sent to Cloudinary and saved on this product. Leave empty to keep
                existing images when editing. Adding files replaces the product&apos;s image gallery
                with the new set.
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="cursor-pointer"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormState((prev) => ({
                    ...prev,
                    pendingFiles: [...prev.pendingFiles, ...files].slice(0, 12),
                  }));
                  e.target.value = "";
                }}
              />
              {formState.pendingFiles.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-1">
                  {formState.pendingFiles.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex justify-between gap-2">
                      <span className="truncate">{f.name}</span>
                      <button
                        type="button"
                        className="text-primary shrink-0"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            pendingFiles: prev.pendingFiles.filter((_, j) => j !== i),
                          }))
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="product-active"
                checked={formState.isActive}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, isActive: checked === true }))
                }
              />
              <Label htmlFor="product-active">Active product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProductDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={isPending}>
              {isPending ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
