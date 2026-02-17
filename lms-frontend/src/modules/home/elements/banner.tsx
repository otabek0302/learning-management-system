'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const Banner = () => {
  return (
    <section className="relative flex min-h-[70vh] h-screen w-full items-center justify-center bg-primary">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <defs>
            <pattern id="banner-dots" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
              <circle cx="14" cy="14" r="2" fill="white" fillOpacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#banner-dots)" />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">Learn Without Limits</h1>
          <p className="mt-4 text-lg text-white/90 md:text-xl">Explore courses, grow your skills, and achieve your goals with our comprehensive learning platform.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[160px] bg-white font-semibold text-primary shadow-none hover:bg-white/90">
              <Link href="/courses">Browse Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px] border-white bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
