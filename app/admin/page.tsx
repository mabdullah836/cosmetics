import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminStats, isAdmin } from "@/lib/actions/admin";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const AdminDashboardPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/admin");
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect("/");
  }

  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: `${stats.activeProducts} active`,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      description: "All time",
      icon: DollarSign,
      href: "/admin/payments",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      description: "Needs attention",
      icon: AlertTriangle,
      href: "/admin/stock",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "View Orders",
      description: "Track and manage customer orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Stock Management",
      description: "Monitor and update inventory",
      href: "/admin/stock",
      icon: AlertTriangle,
    },
    {
      title: "Payment Overview",
      description: "View payment transactions",
      href: "/admin/payments",
      icon: DollarSign,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your store, products, and orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Overview of your store activity</CardDescription>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Recent Orders</p>
                  <p className="text-sm text-gray-500">{stats.recentOrders} orders in the last 7 days</p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
            
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Low Stock Alert</p>
                    <p className="text-sm text-gray-500">{stats.lowStockProducts} products need restocking</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/admin/stock">Manage Stock</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
