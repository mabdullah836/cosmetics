"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { createCartFromLocalItems } from "@/lib/actions/cartMigration";
import { getLocalCart, clearLocalCart } from "@/lib/utils/localCart";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";
import { CONFIG } from "@/lib/constants";

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  redirectTo?: string;
  defaultTab?: "login" | "register";
}

const LoginForm = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  redirectTo = "/",
  defaultTab = "login"
}: LoginFormProps) => {
  const [isLoginMode, setIsLoginMode] = useState(defaultTab === "login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setLoginEmail("");
      setLoginPassword("");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setIsMagicLink(false);
      setIsLoginMode(defaultTab === "login");
    }
  }, [open, defaultTab]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Use server action for login to ensure cookies are set properly
      const formData = new FormData();
      formData.append("email", loginEmail);
      formData.append("password", loginPassword);

      const result = await login(formData);

      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      // Get the current user to check if login was successful (client-side check)
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Migrate local cart to Supabase
        const localCart = getLocalCart();
        if (localCart.length > 0) {
          const migrationResult = await createCartFromLocalItems(
            localCart,
            user.id
          );

          if (migrationResult.success) {
            clearLocalCart();
            toast.success("Cart synced successfully");
          } else {
            logger.error("Cart migration error:", migrationResult.error);
          }
        }

        const isAdmin = user.app_metadata?.role === "admin";
        const shouldRedirectAdminToDashboard = isAdmin && redirectTo.startsWith("/account");
        const destination = shouldRedirectAdminToDashboard ? "/admin" : redirectTo;

        toast.success("Logged in successfully");
        onOpenChange(false);
        onSuccess?.();
        
        // Navigate to trigger new request with cookies
        // Use window.location for full page reload to ensure cookies are sent
        window.location.href = destination;
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      logger.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: loginEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      toast.success("Check your email for the login link!");
      setIsMagicLink(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      logger.error("Magic link error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", registerName);
      formData.append("email", registerEmail);
      formData.append("password", registerPassword);

      const result = await register(formData);

      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      if (result.success) {
        // Get the current user (client-side check)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Migrate local cart to Supabase
          const localCart = getLocalCart();
          if (localCart.length > 0) {
            const migrationResult = await createCartFromLocalItems(
              localCart,
              user.id
            );
            if (migrationResult.success) {
              clearLocalCart();
              toast.success("Cart synced successfully");
            } else {
              logger.error("Cart migration error:", migrationResult.error);
            }
          }
        }

        toast.success("Account created successfully!");
        onOpenChange(false);
        onSuccess?.();
        
        // Navigate to trigger new request with cookies
        // Use window.location for full page reload to ensure cookies are sent
        window.location.href = redirectTo;
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      logger.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-xl">
            {isLoginMode ? "Sign in to continue" : "Create an Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {isLoginMode 
              ? "Sign in to complete your order. Your cart will be saved to your account."
              : "Sign up to save your details and track your orders."
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={isLoginMode ? "login" : "register"} 
          onValueChange={(value) => setIsLoginMode(value === "login")} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 mt-6">
            {isMagicLink ? (
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="magic-email" className="text-gray-900 font-medium">Email</Label>
                  <Input
                    id="magic-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    className="border-2 border-gray-300 focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsMagicLink(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-900 font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    className="border-2 border-gray-300 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-900 font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="border-2 border-gray-300 focus:border-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsMagicLink(true)}
                  className="w-full text-primary hover:text-primary/80"
                  disabled={isLoading}
                >
                  Use magic link instead
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-gray-900 font-medium">Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Your full name"
                  required
                  disabled={isLoading}
                  className="border-2 border-gray-300 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-gray-900 font-medium">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="border-2 border-gray-300 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-gray-900 font-medium">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="border-2 border-gray-300 focus:border-primary"
                  minLength={CONFIG.MIN_PASSWORD_LENGTH}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least {CONFIG.MIN_PASSWORD_LENGTH} characters
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
