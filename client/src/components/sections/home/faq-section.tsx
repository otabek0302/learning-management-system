"use client";

import React, { useState } from "react";
import { useGetLayoutQuery } from "@/redux/features/layout-page/layoutApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQSection = () => {
  const { data: layoutResponse, isLoading } = useGetLayoutQuery("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading FAQ section...</p>
          </div>
        </div>
      </section>
    );
  }

  const layout = layoutResponse?.layout;
  const faqItems = layout?.faq || [];

  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqItems.map((item: { question: string; answer: string }, index: number) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-left text-lg font-semibold">
                    {item.question}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFAQ(index);
                    }}
                  >
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {openIndex === index && (
                <CardContent>
                  <p className="leading-relaxed text-gray-600">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

