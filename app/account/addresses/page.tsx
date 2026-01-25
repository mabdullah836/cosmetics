import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import AddressesList from "@/components/account/AddressesList";

export default async function AddressesPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/account/addresses");
  }

  const supabase = await createClient();
  const userId = session.user.id;

  // Fetch addresses
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <BreadcrumbPage className="text-gray-900">Addresses</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Addresses</h1>
            <p className="text-gray-600">Manage your shipping and billing addresses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
            <Button asChild>
              <Link href="/account/addresses/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Link>
            </Button>
          </div>
        </div>

        {/* Addresses List */}
        <AddressesList initialAddresses={addresses || []} />
      </div>
    </div>
  );
}
