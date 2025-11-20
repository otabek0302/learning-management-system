import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Video } from "lucide-react";

interface CourseSection {
  _id?: string;
  title: string;
  videoSection?: string;
  description?: string;
  comments?: Array<unknown>;
}

export function AccordionSections({ sections }: { sections: CourseSection[] }) {
  const [openSection, setOpenSection] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {sections.map((section, idx) => {
        const open = openSection === idx;
        return (
          <div key={section._id || idx} className="rounded-lg border bg-background">
            <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" onClick={() => setOpenSection(open ? null : idx)}>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">{section.title}</span>
                {section.videoSection && (
                  <Badge variant="secondary" className="text-xs">
                    {section.videoSection}
                  </Badge>
                )}
              </div>
              <span className="ml-2 text-muted-foreground">{open ? "-" : "+"}</span>
            </button>
            {open && (
              <div className="animate-fade-in px-4 pb-4 pt-2">
                {section.description && <p className="mb-2 text-sm text-muted-foreground">{section.description}</p>}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {section.comments?.length || 0} comments
                  </span>
                  <Button variant="outline" size="sm" disabled>
                    <Video className="mr-1 h-4 w-4" /> Watch
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
