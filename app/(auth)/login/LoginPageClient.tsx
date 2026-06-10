"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

interface LoginPageClientProps {
  redirectTo: string;
}

// Protected routes that require authentication
// If user closes modal without logging in, redirect to home instead of these routes
const PROTECTED_ROUTES = [
  "/account",
  "/checkout/payment",
  "/checkout/address",
  "/admin",
];

// Check if a route is protected (requires authentication)
const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

export default function LoginPageClient({ redirectTo }: LoginPageClientProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && !isNavigatingRef.current) {
      // When closing without login, only redirect to public routes
      // Protected routes will cause infinite redirect loop
      isNavigatingRef.current = true;
      setTimeout(() => {
        // If redirectTo is a protected route, go to home instead
        // (Protected routes should only be accessed after successful login)
        const targetUrl = 
          redirectTo && 
          redirectTo !== "/login" && 
          !isProtectedRoute(redirectTo)
            ? redirectTo 
            : "/";
        
        router.replace(targetUrl);
      }, 150);
    }
  };

  const handleSuccess = () => {
    // Mark that navigation is happening to prevent handleOpenChange from also navigating
    isNavigatingRef.current = true;
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
