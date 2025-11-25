import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Video, Lock, Unlock, Eye, Clock, Link as LinkIcon, ExternalLink } from "lucide-react";

interface VideoObject {
  public_id?: string;
  url?: string;
  secure_url?: string;
  duration?: number;
  format?: string;
}

interface CourseLink {
  title: string;
  url: string;
}

interface CourseSection {
  _id?: string;
  title: string;
  videoSection?: string;
  description?: string;
  video?: VideoObject;
  videoLength?: number;
  comments?: Array<unknown>;
  order?: number;
  isPreview?: boolean;
  isLocked?: boolean;
  links?: CourseLink[];
  suggestion?: string;
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
              <div className="animate-fade-in px-4 pb-4 pt-2 space-y-3">
                {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
                
                {/* Video Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {section.video?.duration && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {Math.floor(section.video.duration / 60)}:{(section.video.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  {section.videoLength && !section.video?.duration && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {Math.floor(section.videoLength / 60)}:{(section.videoLength % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  {section.isPreview !== undefined && (
                    <span className={`flex items-center gap-1 ${section.isPreview ? 'text-green-600' : 'text-gray-500'}`}>
                      {section.isPreview ? (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Free Preview</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  )}
                  {section.order !== undefined && (
                    <span className="text-muted-foreground">Order: {section.order}</span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {section.comments?.length || 0} comments
                  </span>
                </div>

                {/* Video Player - Admin can see all videos (both locked and preview) */}
                {section.video?.secure_url && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <video
                      src={section.video.secure_url}
                      controls
                      className="w-full h-full"
                      style={{ maxHeight: "400px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    {!section.isPreview && section.isLocked && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Locked
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Links */}
                {section.links && section.links.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">Additional Links</span>
                    </div>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx} className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex-1 truncate"
                          >
                            <span className="font-medium">{link.title}</span>
                            <span className="text-muted-foreground ml-2">({link.url})</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {section.suggestion && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold">Suggestions</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.suggestion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
