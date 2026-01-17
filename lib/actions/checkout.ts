"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In a real app, you'd use a library like Zod for validation
const validateAddress = (formData: FormData) => {
  const address = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    addressLine1: formData.get("addressLine1") as string,
    addressLine2: formData.get("addressLine2") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postalCode: formData.get("postalCode") as string,
    country: formData.get("country") as string,
  };

  // Basic validation
  if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
    throw new Error("All fields are required.");
  }

  return address;
};

export const saveAddress = async (formData: FormData) => {
  const cookieStore = await cookies();

  const shippingAddress = validateAddress(formData);
  
  // For now, assume billing is the same as shipping
  const billingAddress = shippingAddress;

  // In a real app, you would encrypt this data
  cookieStore.set("shippingAddress", JSON.stringify(shippingAddress));
  cookieStore.set("billingAddress", JSON.stringify(billingAddress));

  redirect("/checkout/payment");
};
