"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Schema validation
const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Extract email from FormData
    const email = formData.get("email") as string;
    
    // Validate input
    const validatedData = newsletterSchema.safeParse({ email });
    
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message || "Invalid email address",
      };
    }

    const supabase = await createClient();
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return {
        success: false,
        error: "You're already subscribed to our newsletter!",
      };
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        status: "active",
        subscribed_at: new Date().toISOString(),
        source: "website",
      });

    if (error) {
      console.error("Error subscribing to newsletter:", error);
      return {
        success: false,
        error: "Failed to subscribe. Please try again.",
      };
    }

    // Optional: Send welcome email (you can integrate with Resend, SendGrid, etc.)
    // await sendWelcomeEmail(email);

    revalidatePath("/");
    
    return {
      success: true,
      message: "Successfully subscribed to newsletter",
    };
  } catch (error) {
    console.error("Error in newsletter subscription:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

// Form action wrapper (returns void for form action compatibility)
export async function subscribeToNewsletterAction(formData: FormData) {
  await subscribeToNewsletter(formData);
}

// Optional: Email sending function
// async function sendWelcomeEmail(email: string) {
//   // Implement your email service here (Resend, SendGrid, etc.)
// }