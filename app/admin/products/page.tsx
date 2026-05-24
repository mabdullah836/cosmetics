import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAdminCategories, getAllProducts, isAdmin } from "@/lib/actions/admin";
import AdminProductsClient from "./AdminProductsClient";

const AdminProductsPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/admin/products");
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect("/");
  }

  const products = await getAllProducts();
  const categories = await getAdminCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AdminProductsClient products={products} categories={categories} />
    </div>
  );
};

export default AdminProductsPage;
