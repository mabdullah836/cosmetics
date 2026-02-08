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
import { getPaymentsData } from "@/lib/actions/admin";
import AdminPaymentsClient from "./AdminPaymentsClient";

const AdminPaymentsPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/admin/payments");
  }

  const payments = await getPaymentsData();

  const paymentStats = {
    total: payments.reduce((sum, p) => sum + (p.total || 0), 0),
    paid: payments.filter(p => p.payment_status === "PAID").reduce((sum, p) => sum + (p.total || 0), 0),
    pending: payments.filter(p => p.payment_status === "PENDING").reduce((sum, p) => sum + (p.total || 0), 0),
    failed: payments.filter(p => p.payment_status === "FAILED").reduce((sum, p) => sum + (p.total || 0), 0),
  };

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
            <BreadcrumbPage>Payments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Overview</h1>
        <p className="text-gray-600">Track and manage payment transactions</p>
      </div>

      <AdminPaymentsClient payments={payments} paymentStats={paymentStats} />
    </div>
  );
};

export default AdminPaymentsPage;
