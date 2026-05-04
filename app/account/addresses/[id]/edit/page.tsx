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
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account" className="text-muted-foreground hover:text-foreground">
                  Account
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account/addresses" className="text-muted-foreground hover:text-foreground">
                  Addresses
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground">Edit Address</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/addresses"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Addresses
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Address</h1>
          <p className="text-muted-foreground">Update your address information</p>
        </div>

        <AddressForm initialData={address} />
      </div>
    </div>
  );
}
