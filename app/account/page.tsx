import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, MapPin, ShoppingBag, Heart, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SignOutButton from "@/components/account/SignOutButton";

export default async function AccountPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/account");
  }

  const supabase = await createClient();
  const userId = session.user.id;

  // Fetch user orders count
  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, status, total, created_at, payment_status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch addresses count
  const { count: addressesCount } = await supabase
    .from("addresses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Fetch wishlist count
  const { count: wishlistCount } = await supabase
    .from("wishlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, phone")
    .eq("id", userId)
    .single();


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">My Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Welcome back, {profile?.full_name || (session.user.email ? session.user.email.split("@")?.[0] : null) || "User"}!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Saved Addresses</CardTitle>
              <MapPin className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{addressesCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wishlistCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Account Status</CardTitle>
              <User className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <Badge className="bg-emerald-500">Active</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest order history</CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/account/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order: any) => (
                      <Link
                        key={order.id}
                        href={`/account/orders/${order.id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                              <Badge className={getOrderStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 capitalize">{order.payment_status}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Button asChild>
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Navigation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/account/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/account/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/account/addresses">
                    <MapPin className="mr-2 h-4 w-4" />
                    Addresses
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/wishlist">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </Button>
                <SignOutButton />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
