import LoginForm from "@/components/auth/LoginForm";
import LoginPageClient from "./LoginPageClient";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const redirectTo = params?.redirect || "/";
  
  return <LoginPageClient redirectTo={redirectTo} />;
};

export default LoginPage;
