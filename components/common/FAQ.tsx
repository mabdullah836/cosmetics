"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_DATA } from "@/lib/constants";

export default function FAQ() {

  return (
    <section 
      id="faq-section"
      className="py-20 md:py-24 bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 
            id="faq-heading"
            className="text-3xl md:text-4xl font-display font-bold text-primary mb-4"
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-3"
          >
            {FAQ_DATA.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border/50 rounded-lg px-6"
              >
                <AccordionTrigger className="py-5 hover:no-underline">
                  <h3 className="text-base font-semibold text-foreground text-left">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}