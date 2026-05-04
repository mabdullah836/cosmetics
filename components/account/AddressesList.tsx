"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { Address } from "@/types/supabase";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MESSAGES, getAddressTypeLabel } from "@/lib/constants";

interface AddressesListProps {
  initialAddresses: Address[];
}

export default function AddressesList({ initialAddresses }: AddressesListProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setDeletingId(id);

    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success(MESSAGES.ACCOUNT.ADDRESS_DELETE_SUCCESS);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || MESSAGES.ACCOUNT.ADDRESS_DELETE_ERROR);
    } finally {
      setDeletingId(null);
    }
  };


  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-16 w-16 text-muted-foreground/45 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No addresses yet</h3>
          <p className="text-muted-foreground mb-6 text-center">
            Add an address to make checkout faster
          </p>
          <Button asChild>
            <Link href="/account/addresses/new">Add Your First Address</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {address.full_name}
                  {address.is_default && (
                    <Badge className="bg-emerald-500">Default</Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {getAddressTypeLabel(address.type)}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/account/addresses/${address.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-muted-foreground">
              <p>{address.address_line_1}</p>
              {address.address_line_2 && <p>{address.address_line_2}</p>}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
              <p className="mt-2 text-sm text-muted-foreground">Phone: {address.phone}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
