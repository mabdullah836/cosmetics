import Link from "next/link";
import prisma  from "@/lib/db/prisma";
import { notFound } from "next/navigation";

const ConfirmationPage = async ({ searchParams }: { searchParams: { orderId?: string } }) => {
  if (!searchParams.orderId) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: searchParams.orderId },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg mb-8">Your order has been placed successfully.</p>
      <div className="bg-gray-100 p-6 rounded-lg inline-block text-left">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Total:</strong> ${order.total.toString()}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p className="mt-4">You will receive an email confirmation shortly.</p>
      </div>
      <div className="mt-8">
        <Link href="/" className="bg-black text-white py-3 px-6 rounded-md">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
