import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/search") {
    const query = searchParams.get("q")?.trim();
    const destination = query
      ? `/products?search=${encodeURIComponent(query)}`
      : "/products";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (pathname === "/categories") {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  if (pathname.startsWith("/categories/")) {
    const slug = pathname.slice("/categories/".length).split("/")[0];
    if (slug) {
      const query = new URLSearchParams(request.nextUrl.searchParams);
      query.set("category", decodeURIComponent(slug));
      return NextResponse.redirect(
        new URL(`/products?${query.toString()}`, request.url)
      );
    }
  }

  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Validate session with Auth server (getSession() from storage can be insecure)
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
