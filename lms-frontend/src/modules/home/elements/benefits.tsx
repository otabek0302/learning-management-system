'use client';

const BENEFITS = [
  {
    title: 'Secure & compliant',
    description: 'Your data is protected with enterprise-grade security and privacy controls.',
    className: 'col-span-1 md:col-span-2 md:row-span-2',
    size: 'large' as const,
  },
  {
    title: 'Start in minutes',
    description: 'Enroll in a course and begin learning without any complicated setup.',
    className: 'col-span-2',
    size: 'default' as const,
  },
  {
    title: 'Support when you need it',
    description: 'Get help from our team via email or in-app chat whenever you need it.',
    className: 'col-span-1',
    size: 'default' as const,
  },
  {
    title: 'Track your progress',
    description: 'Monitor completion, quiz scores, and certificates in one place.',
    className: 'col-span-1',
    size: 'default' as const,
  },
  {
    title: 'Built for learners',
    description: 'Designed for individuals and teams who want to grow their skills.',
    className: 'col-span-2',
    size: 'default' as const,
  },
  {
    title: 'Learn anywhere',
    description: 'Access courses on desktop, tablet, or mobile—your progress syncs everywhere.',
    className: 'col-span-2',
    size: 'wide' as const,
  },
];

function BenefitCard({
  title,
  description,
  className,
  size = 'default',
}: {
  title: string;
  description: string;
  className: string;
  size?: 'default' | 'large' | 'wide';
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card/80 transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-md ${
        size === 'wide' ? 'px-8 py-6 sm:px-10 sm:py-8' : size === 'large' ? 'p-6 sm:p-8' : 'p-5 sm:p-6'
      } ${className}`}
    >
      <div
        className={`relative flex-1 ${
          size === 'large' ? 'min-h-[160px]' : size === 'wide' ? 'min-h-[100px]' : 'min-h-[70px]'
        } flex items-center justify-center rounded-xl bg-muted/40 dark:bg-muted/20`}
      >
        <span className="text-xs text-muted-foreground/50" aria-hidden>
          Illustration
        </span>
      </div>
      <div className="mt-4 space-y-1.5">
        <h3
          className={`font-semibold tracking-tight text-foreground ${
            size === 'wide' ? 'text-xl sm:text-2xl' : size === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          }`}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}

const Benefits = () => {
  return (
    <section className="border-t border-border bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Trusted by learners everywhere</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join individuals and organizations who use our platform to grow their skills and advance their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-4 md:grid-rows-[1fr_1fr_auto] md:gap-6">
          {BENEFITS.map((benefit) => (
            <BenefitCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
              className={benefit.className}
              size={benefit.size}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
