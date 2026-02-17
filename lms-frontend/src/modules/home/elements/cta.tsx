'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="border-t border-border bg-muted/20 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Ready to start learning?</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join learners who are advancing their skills. Start today—no credit card required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[160px] font-semibold">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px] font-semibold">
            <Link href="/contact-us">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
