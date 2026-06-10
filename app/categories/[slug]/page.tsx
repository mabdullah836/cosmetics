import { redirect } from "next/navigation";

type CategorySlugPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
};

export default async function CategorySlugPage({
  params,
  searchParams,
}: CategorySlugPageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;

  const query = new URLSearchParams();
  query.set("category", slug);
  if (sub?.trim()) {
    query.set("sub", sub.trim());
  }

  redirect(`/products?${query.toString()}`);
}
