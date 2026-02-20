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
import { getAllOrders, isAdmin } from "@/lib/actions/admin";
import AdminOrdersClient from "./AdminOrdersClient";

const AdminOrdersPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/admin/orders");
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect("/");
  }

  const orders = await getAllOrders();

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
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Orders</h1>
        <p className="text-gray-600">Track and manage customer orders</p>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
};

export default AdminOrdersPage;
