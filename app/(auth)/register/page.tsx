import RegisterPageClient from "./RegisterPageClient";

interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
  const params = await searchParams;
  const redirectTo = params?.redirect || "/";
  
  return <RegisterPageClient redirectTo={redirectTo} />;
};

export default RegisterPage;
