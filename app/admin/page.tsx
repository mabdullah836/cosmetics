import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/products" className="bg-gray-100 p-6 rounded-lg text-center font-bold hover:bg-gray-200">Products</Link>
        <Link href="/admin/stock" className="bg-gray-100 p-6 rounded-lg text-center font-bold hover:bg-gray-200">Stock</Link>
        <Link href="/admin/orders" className="bg-gray-100 p-6 rounded-lg text-center font-bold hover:bg-gray-200">Orders</Link>
        <Link href="/admin/payments" className="bg-gray-100 p-6 rounded-lg text-center font-bold hover:bg-gray-200">Payments</Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
