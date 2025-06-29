import React from "react";
import { Plus, Trash2, ArrowLeft, ArrowRight, Video, Link, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CourseContent {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  links: { title: string; url: string }[];
  suggestion: string;
}

interface CreateCourseContentProps {
  courseContent?: CourseContent[];
  setCourseContent?: React.Dispatch<React.SetStateAction<CourseContent[]>>;
  errors?: Record<string, string>;
  setActive: (active: number) => void;
  active: number;
}

const CreateCourseContent = ({
  courseContent = [
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ],
  setCourseContent,
  errors = {},
  setActive,
  active,
}: CreateCourseContentProps) => {
  const handleSubmitPrevious = () => {
    setActive(active - 1);
  };

  const handleSubmitNext = () => {
    // Simple validation
    const hasEmptyFields = courseContent.some((content) => !content.title.trim() || !content.videoUrl.trim());

    if (hasEmptyFields) {
      toast.error("Please fill in all video titles and URLs");
      return;
    }

    console.log("Course Content:", courseContent);
    setActive(active + 1);
  };

  const addVideoSection = () => {
    if (setCourseContent) {
      setCourseContent((prev) => [
        ...prev,
        {
          videoUrl: "",
          title: "",
          description: "",
          videoSection: `Section ${prev.length + 1}`,
          links: [{ title: "", url: "" }],
          suggestion: "",
        },
      ]);
    }
  };

  const removeVideoSection = (index: number) => {
    if (setCourseContent && courseContent.length > 1) {
      setCourseContent((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateVideoSection = (index: number, field: keyof CourseContent, value: any) => {
    if (setCourseContent) {
      setCourseContent((prev) => prev.map((content, i) => (i === index ? { ...content, [field]: value } : content)));
    }
  };

  const addLink = (sectionIndex: number) => {
    if (setCourseContent) {
      setCourseContent((prev) => prev.map((content, i) => (i === sectionIndex ? { ...content, links: [...content.links, { title: "", url: "" }] } : content)));
    }
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    if (setCourseContent) {
      setCourseContent((prev) => prev.map((content, i) => (i === sectionIndex ? { ...content, links: content.links.filter((_, j) => j !== linkIndex) } : content)));
    }
  };

  const updateLink = (sectionIndex: number, linkIndex: number, field: "title" | "url", value: string) => {
    if (setCourseContent) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex
            ? {
                ...content,
                links: content.links.map((link, j) => (j === linkIndex ? { ...link, [field]: value } : link)),
              }
            : content
        )
      );
    }
  };

  return (
    <div className="mt-4 flex w-full max-w-4xl flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Course Content</h2>
        <p className="text-gray-500">Add video sections and content for your course</p>
      </div>

      {courseContent.map((content, sectionIndex) => (
        <div key={sectionIndex} className="rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Video className="h-5 w-5" />
              Section {sectionIndex + 1}
            </h3>
            {courseContent.length > 1 && (
              <Button type="button" variant="destructive" size="sm" onClick={() => removeVideoSection(sectionIndex)}>
                <Trash2 className="h-4 w-4" />
                Remove Section
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
              <Label>Section Title</Label>
              <Input type="text" value={content.videoSection} onChange={(e) => updateVideoSection(sectionIndex, "videoSection", e.target.value)} placeholder="Enter section title" />
            </div>

            {/* Video Title */}
            <div className="flex flex-col gap-2">
              <Label>Video Title</Label>
              <Input type="text" value={content.title} onChange={(e) => updateVideoSection(sectionIndex, "title", e.target.value)} placeholder="Enter video title" className={errors[`content_title_${sectionIndex}`] ? "border-red-500" : ""} />
              {errors[`content_title_${sectionIndex}`] && <span className="text-xs text-red-500">{errors[`content_title_${sectionIndex}`]}</span>}
            </div>

            {/* Video URL */}
            <div className="flex flex-col gap-2">
              <Label>Video URL</Label>
              <Input type="url" value={content.videoUrl} onChange={(e) => updateVideoSection(sectionIndex, "videoUrl", e.target.value)} placeholder="https://example.com/video" className={errors[`content_videoUrl_${sectionIndex}`] ? "border-red-500" : ""} />
              {errors[`content_videoUrl_${sectionIndex}`] && <span className="text-xs text-red-500">{errors[`content_videoUrl_${sectionIndex}`]}</span>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea value={content.description} onChange={(e) => updateVideoSection(sectionIndex, "description", e.target.value)} placeholder="Enter video description" rows={3} />
            </div>

            {/* Links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Additional Links
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addLink(sectionIndex)}>
                  <Plus className="h-4 w-4" />
                  Add Link
                </Button>
              </div>

              {content.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex gap-2">
                  <Input type="text" value={link.title} onChange={(e) => updateLink(sectionIndex, linkIndex, "title", e.target.value)} placeholder="Link title" className="flex-1" />
                  <Input type="url" value={link.url} onChange={(e) => updateLink(sectionIndex, linkIndex, "url", e.target.value)} placeholder="https://example.com" className="flex-1" />
                  {content.links.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeLink(sectionIndex, linkIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Suggestions
              </Label>
              <Textarea value={content.suggestion} onChange={(e) => updateVideoSection(sectionIndex, "suggestion", e.target.value)} placeholder="Any suggestions or notes for this section" rows={2} />
            </div>
          </div>
        </div>
      ))}

      {/* Add New Section Button */}
      <Button type="button" variant="outline" onClick={addVideoSection} className="w-full">
        <Plus className="h-4 w-4" />
        Add New Video Section
      </Button>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button type="button" variant="outline" size="lg" onClick={handleSubmitPrevious} className="px-14">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={handleSubmitNext} className="px-14">
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCourseContent;
