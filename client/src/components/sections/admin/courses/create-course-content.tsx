import React, { useState, useRef } from "react";

import { Plus, Trash2, ArrowLeft, ArrowRight, Video, Link, FileText, Lock, Unlock, Eye, Upload, Loader2, CheckCircle2, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

interface Quiz {
  questions: QuizQuestion[];
  passingScore: number; // 
}

interface VideoObject {
  public_id: string;
  url: string;
  secure_url: string;
  duration: number;
  format: string;
}

interface CourseContent {
  videoUrl: string; // Base64 string for upload OR existing URL
  video?: VideoObject; // Full video object from Cloudinary (used when already uploaded) - contains duration
  title: string;
  description: string;
  videoSection: string;
  links: { title: string; url: string }[];
  suggestion: string;
  order: number; // lesson ordering
  isPreview: boolean; // free preview
  isLocked: boolean; // requires enrollment
  quiz?: Quiz; // optional quiz
}

interface CreateCourseContentProps {
  courseContent?: CourseContent[];
  setCourseContent?: React.Dispatch<React.SetStateAction<CourseContent[]>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setActive: (active: number) => void;
  active: number;
}

const CreateCourseContent = ({ courseContent = [], setCourseContent, errors, setErrors, setActive, active }: CreateCourseContentProps) => {
  const [uploadingSectionIndex, setUploadingSectionIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleSubmitPrevious = () => {
    setActive(active - 1);
  };

  const handleSubmitNext = () => {
    const newErrors = { ...errors };
    let hasError = false;

    courseContent.forEach((content, idx) => {
      if (!content.title.trim()) {
        newErrors[`content_title_${idx}`] = "Content title cannot be empty";
        hasError = true;
      } else {
        delete newErrors[`content_title_${idx}`];
      }
      // Video validation: either video object OR videoUrl (for base64 or external URL)
      const hasVideo = content.video && content.video.public_id;
      const hasVideoUrl = content.videoUrl && typeof content.videoUrl === "string" && content.videoUrl.trim().length > 0;
      
      if (!hasVideo && !hasVideoUrl) {
        newErrors[`content_videoUrl_${idx}`] = "Content video is required (upload video or enter URL)";
        hasError = true;
      } else {
        delete newErrors[`content_videoUrl_${idx}`];
      }
      if (!content.description.trim()) {
        newErrors[`content_description_${idx}`] = "Content description cannot be empty";
        hasError = true;
      } else {
        delete newErrors[`content_description_${idx}`];
      }
    });

    setErrors(newErrors);

    if (hasError) {
      toast.error("Please fix the errors before proceeding.");
      return;
    }

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
          order: prev.length,
          isPreview: false,
          isLocked: true,
        },
      ]);
    }
  };

  const removeVideoSection = (index: number) => {
    if (setCourseContent && courseContent.length > 1) {
      setCourseContent((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateVideoSection = (index: number, field: keyof CourseContent, value: string | number | boolean | Array<{ title: string; url: string }>) => {
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

  // Quiz Management Functions
  const addQuiz = (sectionIndex: number) => {
    if (setCourseContent) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex
            ? {
                ...content,
                quiz: {
                  questions: [
                    {
                      question: "",
                      options: ["", ""],
                      correctAnswer: 0,
                    },
                  ],
                  passingScore: 70,
                },
              }
            : content
        )
      );
    }
  };

  const removeQuiz = (sectionIndex: number) => {
    if (setCourseContent) {
      setCourseContent((prev) =>
        prev.map((content, i) => (i === sectionIndex ? { ...content, quiz: undefined } : content))
      );
    }
  };

  const addQuestion = (sectionIndex: number) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: [
                    ...content.quiz.questions,
                    {
                      question: "",
                      options: ["", ""],
                      correctAnswer: 0,
                    },
                  ],
                },
              }
            : content
        )
      );
    }
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: content.quiz.questions.filter((_, j) => j !== questionIndex),
                },
              }
            : content
        )
      );
    }
  };

  const updateQuestion = (sectionIndex: number, questionIndex: number, field: "question", value: string) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: content.quiz.questions.map((q, j) =>
                    j === questionIndex ? { ...q, [field]: value } : q
                  ),
                },
              }
            : content
        )
      );
    }
  };

  const addOption = (sectionIndex: number, questionIndex: number) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: content.quiz.questions.map((q, j) =>
                    j === questionIndex ? { ...q, options: [...q.options, ""] } : q
                  ),
                },
              }
            : content
        )
      );
    }
  };

  const removeOption = (sectionIndex: number, questionIndex: number, optionIndex: number) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: content.quiz.questions.map((q, j) =>
                    j === questionIndex
                      ? {
                          ...q,
                          options: q.options.filter((_, k) => k !== optionIndex),
                          correctAnswer: q.correctAnswer >= optionIndex ? Math.max(0, q.correctAnswer - 1) : q.correctAnswer,
                        }
                      : q
                  ),
                },
              }
            : content
        )
      );
    }
  };

  const updateOption = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: content.quiz.questions.map((q, j) =>
                    j === questionIndex
                      ? {
                          ...q,
                          options: q.options.map((opt, k) => (k === optionIndex ? value : opt)),
                        }
                      : q
                  ),
                },
              }
            : content
        )
      );
    }
  };

  const setCorrectAnswer = (sectionIndex: number, questionIndex: number, answerIndex: number) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  questions: content.quiz.questions.map((q, j) =>
                    j === questionIndex ? { ...q, correctAnswer: answerIndex } : q
                  ),
                },
              }
            : content
        )
      );
    }
  };

  const updatePassingScore = (sectionIndex: number, score: number) => {
    if (setCourseContent && courseContent[sectionIndex]?.quiz) {
      setCourseContent((prev) =>
        prev.map((content, i) =>
          i === sectionIndex && content.quiz
            ? {
                ...content,
                quiz: {
                  ...content.quiz,
                  passingScore: score,
                },
              }
            : content
        )
      );
    }
  };

  const handleVideoUpload = async (sectionIndex: number, file: File) => {
    // Validate file type
    const allowedTypes = ["video/mp4", "video/mkv", "video/mov"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid video format. Please upload MP4, MKV, or MOV files.");
      return;
    }

    // Validate file size (1GB = 1024 * 1024 * 1024 bytes)
    const maxSize = 1024 * 1024 * 1000; // 1GB
    if (file.size > maxSize) {
      toast.error("Video file size exceeds 1GB limit.");
      return;
    }

    setUploadingSectionIndex(sectionIndex);
    setUploadProgress((prev) => ({ ...prev, [sectionIndex]: 0 }));

    try {
      // Convert file to base64 - backend will upload it when creating the course
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const base64String = reader.result as string;
          
          // Simulate progress for base64 conversion
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const current = prev[sectionIndex] || 0;
              if (current < 90) {
                return { ...prev, [sectionIndex]: current + 10 };
              }
              return prev;
            });
          }, 100);

          // Store base64 string - backend will upload it to Cloudinary when creating course
          if (setCourseContent) {
            setCourseContent((prev) => prev.map((content, i) => 
              i === sectionIndex 
                ? { 
                    ...content, 
                    videoUrl: base64String // Store base64 - backend will upload and get duration
                  } 
                : content
            ));
          }

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [sectionIndex]: 100 }));
          
          toast.success("Video processed successfully! It will be uploaded when you create the course.");
          
          // Small delay to show 100% before hiding progress
          setTimeout(() => {
            setUploadingSectionIndex(null);
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[sectionIndex];
              return newProgress;
            });
            // Reset file input
            if (fileInputRefs.current[sectionIndex]) {
              fileInputRefs.current[sectionIndex]!.value = "";
            }
          }, 1000);
        } catch (error: any) {
          toast.error("Failed to process video file. Please try again.");
          console.error("Video processing error:", error);
          setUploadingSectionIndex(null);
          setUploadProgress((prev) => ({ ...prev, [sectionIndex]: 0 }));
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read video file. Please try again.");
        setUploadingSectionIndex(null);
        setUploadProgress((prev) => ({ ...prev, [sectionIndex]: 0 }));
      };

      // Read file as base64 data URL
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error("Failed to process video file. Please try again.");
      console.error("Video processing error:", error);
      setUploadingSectionIndex(null);
      setUploadProgress((prev) => ({ ...prev, [sectionIndex]: 0 }));
    }
  };

  const handleFileChange = (sectionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleVideoUpload(sectionIndex, file);
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
                <span className="hidden md:block">Remove Section</span>
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

            {/* Video Upload */}
            <div className="flex flex-col gap-2">
              <Label>Video</Label>
              <input
                ref={(el) => {
                  fileInputRefs.current[sectionIndex] = el;
                }}
                type="file"
                accept="video/mp4,video/mkv,video/mov"
                onChange={(e) => handleFileChange(sectionIndex, e)}
                className="hidden"
                id={`video-upload-${sectionIndex}`}
                disabled={uploadingSectionIndex === sectionIndex}
              />
              
              {/* Show Upload Button when no video */}
              {!(content.video?.secure_url || content.videoUrl) && (
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRefs.current[sectionIndex]?.click()}
                    disabled={uploadingSectionIndex === sectionIndex}
                    className="w-full sm:w-auto"
                  >
                    {uploadingSectionIndex === sectionIndex ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </>
                    )}
                  </Button>
                  {/* Upload Progress Bar */}
                  {uploadingSectionIndex === sectionIndex && uploadProgress[sectionIndex] !== undefined && (
                    <div className="w-full">
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                        <span>Uploading video...</span>
                        <span className="font-semibold">{uploadProgress[sectionIndex]}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress[sectionIndex]}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload MP4, MKV, or MOV files (max 1GB). The video will be uploaded to Cloudinary when you create the course.
                  </p>
                </div>
              )}

              {/* Show Video Preview when video exists */}
              {(content.video?.secure_url || (content.videoUrl && content.videoUrl.startsWith('data:'))) && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black group">
                  {content.video?.secure_url ? (
                    <video
                      src={content.video.secure_url}
                      controls
                      className="w-full h-full"
                      style={{ maxHeight: "400px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : content.videoUrl && content.videoUrl.startsWith('data:') ? (
                    <video
                      src={content.videoUrl}
                      controls
                      className="w-full h-full"
                      style={{ maxHeight: "400px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      if (setCourseContent) {
                        setCourseContent((prev) => prev.map((c, i) => 
                          i === sectionIndex 
                            ? { ...c, video: undefined, videoUrl: "" }
                            : c
                        ));
                        toast.success("Video removed. You can upload a new one.");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {errors[`content_videoUrl_${sectionIndex}`] && <span className="text-xs text-red-500">{errors[`content_videoUrl_${sectionIndex}`]}</span>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea value={content.description} onChange={(e) => updateVideoSection(sectionIndex, "description", e.target.value)} placeholder="Enter video description" rows={3} />
              {errors[`content_description_${sectionIndex}`] && <span className="text-xs text-red-500">{errors[`content_description_${sectionIndex}`]}</span>}
            </div>


            {/* Order */}
            <div className="flex flex-col gap-2">
              <Label>Lesson Order</Label>
              <Input type="number" value={content.order !== undefined ? content.order : sectionIndex} onChange={(e) => updateVideoSection(sectionIndex, "order", parseInt(e.target.value) || sectionIndex)} placeholder="Enter lesson order" min={0} />
              <p className="text-xs text-muted-foreground">Set the order/sequence of this lesson (0 = first)</p>
            </div>

            {/* Preview & Lock Options */}
            <div className="flex flex-col gap-3 rounded-lg border p-4">
              <Label className="text-sm font-semibold">Lesson Access Settings</Label>
              
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  id={`preview-${sectionIndex}`} 
                  checked={content.isPreview !== undefined ? content.isPreview : false}
                  onChange={(e) => updateVideoSection(sectionIndex, "isPreview", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`preview-${sectionIndex}`} className="flex items-center gap-2 cursor-pointer font-normal">
                  <Eye className="h-4 w-4" />
                  Free Preview
                </Label>
                <p className="text-xs text-muted-foreground">Allow non-enrolled users to preview this lesson</p>
              </div>

              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  id={`locked-${sectionIndex}`} 
                  checked={content.isLocked !== undefined ? content.isLocked : true}
                  onChange={(e) => updateVideoSection(sectionIndex, "isLocked", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`locked-${sectionIndex}`} className="flex items-center gap-2 cursor-pointer font-normal">
                  {content.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  Locked (Requires Enrollment)
                </Label>
                <p className="text-xs text-muted-foreground">Require enrollment to access this lesson</p>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Note: If "Free Preview" is enabled, the lesson will be accessible even if locked.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <span className="hidden md:block">Additional Links</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addLink(sectionIndex)}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block">Add Link</span>
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
                <span className="hidden md:block">Suggestions</span>
              </Label>
              <Textarea value={content.suggestion} onChange={(e) => updateVideoSection(sectionIndex, "suggestion", e.target.value)} placeholder="Any suggestions or notes for this section" rows={2} />
            </div>

            {/* Quiz Section */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <HelpCircle className="h-4 w-4" />
                  <span>Quiz (Optional)</span>
                </Label>
                {content.quiz ? (
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeQuiz(sectionIndex)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Quiz
                  </Button>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuiz(sectionIndex)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Quiz
                  </Button>
                )}
              </div>

              {content.quiz && (
                <div className="space-y-4">
                  {/* Passing Score */}
                  <div className="flex flex-col gap-2">
                    <Label>Passing Score (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={content.quiz.passingScore}
                      onChange={(e) => updatePassingScore(sectionIndex, parseInt(e.target.value) || 70)}
                      placeholder="70"
                    />
                    <p className="text-xs text-muted-foreground">Minimum score required to pass (0-100%)</p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Questions</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addQuestion(sectionIndex)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </Button>
                    </div>

                    {content.quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Question {questionIndex + 1}</Label>
                          {content.quiz!.questions.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeQuestion(sectionIndex, questionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="flex flex-col gap-2">
                          <Label>Question Text</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(sectionIndex, questionIndex, "question", e.target.value)}
                            placeholder="Enter your question here"
                            rows={2}
                          />
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Options</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(sectionIndex, questionIndex)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Option
                            </Button>
                          </div>

                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${sectionIndex}-${questionIndex}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => setCorrectAnswer(sectionIndex, questionIndex, optionIndex)}
                                className="h-4 w-4"
                              />
                              <Input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(sectionIndex, questionIndex, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              {question.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeOption(sectionIndex, questionIndex, optionIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {question.options.length < 2 && (
                            <p className="text-xs text-red-500">At least 2 options are required</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add New Section Button */}
      <Button type="button" variant="outline" onClick={addVideoSection} className="w-full">
        <Plus className="h-4 w-4" />
        <span className="hidden md:block">Add New Video Section</span>
      </Button>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button type="button" variant="outline" size="lg" onClick={handleSubmitPrevious} className="px-14">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden md:block">Back</span>
        </Button>
        <Button type="button" size="lg" onClick={handleSubmitNext} className="px-14">
          <span className="hidden md:block">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCourseContent;
