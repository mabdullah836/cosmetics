"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

interface RegisterPageClientProps {
  redirectTo: string;
}

export default function RegisterPageClient({ redirectTo }: RegisterPageClientProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      router.push(redirectTo);
    }
  };

  const handleSuccess = () => {
    // Modal will close automatically on success
  };

  return (
    <LoginForm
      open={isOpen}
      onOpenChange={handleOpenChange}
      onSuccess={handleSuccess}
      redirectTo={redirectTo}
      defaultTab="register"
    />
  );
}
