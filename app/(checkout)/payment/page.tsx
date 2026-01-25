import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PaymentPageClient from "./PaymentPageClient";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PaymentPage = async () => {
  const session = await auth();
  
  if (!session) {
    redirect('/login?redirect=/payment');
  }

  const cookieStore = await cookies();
  const shippingAddressString = cookieStore.get("shippingAddress")?.value;
  const billingAddressString = cookieStore.get("billingAddress")?.value;

  if (!shippingAddressString || !billingAddressString) {
    redirect("/address");
  }

  const shippingAddress = JSON.parse(shippingAddressString);
  const billingAddress = JSON.parse(billingAddressString);

  return (
    <>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
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
                <Link href="/cart">Cart</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/address">Address</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Payment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <PaymentPageClient 
        shippingAddress={shippingAddress} 
        billingAddress={billingAddress} 
      />
    </>
  );
};

export default PaymentPage;
