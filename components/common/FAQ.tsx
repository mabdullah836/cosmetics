"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const faqs = [
  {
    id: "cruelty-free",
    category: "Ethics & Values",
    question: "Are your products really cruelty-free?",
    answer:
      "Absolutely! We are certified cruelty-free by Leaping Bunny and PETA. We never test on animals at any stage of product development, and we don't work with suppliers who test on animals. All our products are 100% vegan.",
    popular: true,
  },
  {
    id: "ingredients",
    category: "Ingredients",
    question: "What ingredients do you avoid?",
    answer:
      "We formulate without parabens, sulfates, phthalates, formaldehyde, mineral oils, and over 1,500 other questionable ingredients. Our full list of banned ingredients is available on our Clean Beauty Standards page. We use only clean, ethically sourced ingredients.",
  },
  {
    id: "shipping",
    category: "Shipping & Delivery",
    question: "Do you offer international shipping?",
    answer:
      "Yes! We ship to over 50 countries worldwide. Shipping rates and delivery times vary by location. Free shipping is available on orders over $75 for US customers and $100 for international orders. Most orders are processed within 24-48 hours.",
    popular: true,
  },
  {
    id: "returns",
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return unused products in their original packaging for a full refund or exchange. Return shipping is free for US customers.",
  },
  {
    id: "sensitive-skin",
    category: "Skin Concerns",
    question: "Are your products suitable for sensitive skin?",
    answer:
      "Many of our products are formulated for sensitive skin and are dermatologist-tested. Look for products marked with our 'Sensitive' badge. We recommend patch testing new products before full application. Our customer service team can help you choose the right products.",
  },
  {
    id: "tracking",
    category: "Order Management",
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive an email with a tracking number and estimated delivery date. You can also track your order by logging into your account on our website and viewing your order history. Most orders are delivered within 3-7 business days.",
  },
  {
    id: "expiry",
    category: "Product Care",
    question: "What is the shelf life of your products?",
    answer:
      "Our products typically have a shelf life of 12-24 months when unopened, and 6-12 months after opening. You'll find the PAO (Period After Opening) symbol on each product. Store products in a cool, dry place away from direct sunlight.",
  },
  {
    id: "sustainability",
    category: "Sustainability",
    question: "How sustainable is your packaging?",
    answer:
      "We use 100% recyclable materials and 30% post-consumer recycled plastic. Our shipping materials are biodegradable, and we offer a recycling program where you can send back empty containers for recycling and receive store credit.",
    popular: true,
  },
];

const categories = [
  "All",
  ...Array.from(new Set(faqs.map(faq => faq.category))),
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactQuestion, setContactQuestion] = useState("");

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactQuestion.trim()) {
      toast.error("Please enter your question");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setContactQuestion("");
      
      toast.success("Question submitted!", {
        description: "Our team will get back to you within 24 hours.",
        duration: 5000,
        action: {
          label: "View FAQ",
          onClick: () => {
            const element = document.getElementById("faq-section");
            element?.scrollIntoView({ behavior: "smooth" });
          },
        },
      });
    }, 1500);
  };

  return (
    <section 
      id="faq-section"
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <HelpCircle className="h-3 w-3" />
            Need Help?
          </div>
          <h2 
            id="faq-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions. Can&apos;t find what you&apos;re looking for? Ask us below!
          </p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-10 lg:mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions (e.g., 'shipping', 'returns', 'ingredients')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full border-border/50 bg-background/80 backdrop-blur-sm"
              aria-label="Search FAQ questions"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
                {category === "All" && (
                  <span className="ml-2 text-xs opacity-70">
                    ({faqs.length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Results Count */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFaqs.length} of {faqs.length} questions
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
          {filteredFaqs.length > 0 ? (
            <Accordion 
              type="single" 
              collapsible 
              className="space-y-4"
              defaultValue="cruelty-free"
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={cn(
                    "border border-border/50 rounded-xl px-6 transition-all duration-200",
                    "hover:border-primary/30 hover:shadow-md",
                    "data-[state=open]:border-primary/50 data-[state=open]:shadow-lg"
                  )}
                >
                  <AccordionTrigger className="py-6 hover:no-underline group">
                    <div className="flex items-start gap-4 text-left">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {faq.category}
                          </span>
                          {faq.popular && (
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      {faq.id === "ingredients" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => toast.info("Clean Beauty Standards page coming soon")}
                        >
                          View Full Ingredient List
                        </Button>
                      )}
                      {faq.id === "returns" && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Free returns for US customers</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
              <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No questions found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn&apos;t find any questions matching &quot;{searchQuery}&quot;. 
                Try a different search term or ask your question below.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                View All Questions
              </Button>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Our team is here to help.
              </p>
            </div>
            
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label htmlFor="question" className="sr-only">
                  Your question
                </label>
                <Input
                  id="question"
                  placeholder="Type your question here..."
                  value={contactQuestion}
                  onChange={(e) => setContactQuestion(e.target.value)}
                  className="rounded-lg h-12"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Ask Your Question
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We typically respond within 24 hours during business days
              </p>
            </form>

            {/* Contact Options */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="mailto:help@example.com">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email: help@cosmetics.com
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="tel:+18005551234">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call: (800) 555-1234
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}