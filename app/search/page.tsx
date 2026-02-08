import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q;

  // Redirect to products page with search query
  if (query) {
    redirect(`/products?search=${encodeURIComponent(query)}`);
  } else {
    redirect("/products");
  }
}
