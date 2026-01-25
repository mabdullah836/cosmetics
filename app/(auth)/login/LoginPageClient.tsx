"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

interface LoginPageClientProps {
  redirectTo: string;
}

export default function LoginPageClient({ redirectTo }: LoginPageClientProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Open modal when component mounts
    setIsOpen(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Redirect when modal is closed
      router.push(redirectTo);
    }
  };

  const handleSuccess = () => {
    // Modal will close automatically on success, redirect is handled in LoginForm
  };

  return (
    <LoginForm
      open={isOpen}
      onOpenChange={handleOpenChange}
      onSuccess={handleSuccess}
      redirectTo={redirectTo}
    />
  );
}
