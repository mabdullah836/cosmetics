"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";

interface AccountSettingsFormProps {
  initialData: {
    email: string;
    fullName: string;
    phone: string;
    avatarUrl: string;
  };
}

export default function AccountSettingsForm({ initialData }: AccountSettingsFormProps) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [phone, setPhone] = useState(initialData.phone);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error(MESSAGES.ACCOUNT.NOT_LOGGED_IN);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast.success(MESSAGES.ACCOUNT.PROFILE_UPDATE_SUCCESS);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || MESSAGES.ACCOUNT.PROFILE_UPDATE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={initialData.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          Email cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
