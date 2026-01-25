import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import AddressForm from "@/components/account/AddressForm";

type EditAddressPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/account/addresses");
  }

  const { id } = await params;
  const supabase = await createClient();
  const userId = session.user.id;

  // Fetch address
  const { data: address, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !address) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  Account
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account/addresses" className="text-gray-600 hover:text-gray-900">
                  Addresses
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Edit Address</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/addresses"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Addresses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Address</h1>
          <p className="text-gray-600">Update your address information</p>
        </div>

        <AddressForm initialData={address} />
      </div>
    </div>
  );
}
