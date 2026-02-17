'use client';

import { BarChart3, BookOpen, GraduationCap, Layout, Users, Zap } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    title: 'Quality courses',
    description: 'Access curated content designed by experts to help you master new skills.',
    icon: BookOpen,
  },
  {
    title: 'Track progress',
    description: 'Monitor your learning journey with analytics and completion tracking.',
    icon: BarChart3,
  },
  {
    title: 'Engaged community',
    description: 'Connect with learners, instructors, and peers in discussion forums.',
    icon: Users,
  },
  {
    title: 'Learn at your pace',
    description: 'Self-paced learning that fits your schedule and lifestyle.',
    icon: Zap,
  },
  {
    title: 'Certificates',
    description: 'Earn certificates to showcase your achievements to employers.',
    icon: GraduationCap,
  },
  {
    title: 'Modern platform',
    description: 'Clean, intuitive interface that works on any device.',
    icon: Layout,
  },
];

function FeatureCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="border-border/60 bg-card/80 transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-sm">
      <CardContent className="gap-5 p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const FeaturesSection = () => {
  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Everything you need to learn</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Simple, powerful tools to explore courses, track progress, and reach your goals.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} title={f.title} description={f.description} icon={f.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
