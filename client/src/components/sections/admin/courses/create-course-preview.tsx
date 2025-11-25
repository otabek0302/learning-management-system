import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, Lock, Unlock, Eye } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoryApi";

interface Link {
  title: string;
  url: string;
}

interface VideoObject {
  public_id: string;
  url: string;
  secure_url: string;
  duration: number;
  format: string;
}

interface CourseContentSection {
  video?: VideoObject; // Contains duration from Cloudinary
  videoUrl?: string; // For backward compatibility (base64 during upload)
  title: string;
  description: string;
  videoSection: string;
  links: Link[];
  suggestion: string;
  order: number;
  isPreview: boolean;
  isLocked: boolean;
}

interface CourseData {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  categoryId: string;
  thumbnail: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseContent: CourseContentSection[];
}
interface CreateCoursePreviewProps {
  courseData: CourseData;
  active: number;
  setActive: (active: number) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const CreateCoursePreview: React.FC<CreateCoursePreviewProps> = ({ courseData, active, setActive, handleSubmit, isLoading }) => {
  const { data: categoriesResponse } = useGetAllCategoriesQuery({});
  const categoryName = categoriesResponse?.categories?.find((cat: { _id: string }) => cat._id === courseData.categoryId)?.name || "Not set";
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Preview Your Course</h2>
        <p className="text-gray-500">Review all your course details before publishing.</p>
      </div>

      {/* Course Info */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold mb-2">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Name</span>
            <div className="font-medium">{courseData.name}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Level</span>
            <div className="font-medium">{courseData.level}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Price</span>
            <div className="font-medium">${courseData.price}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Estimated Price</span>
            <div className="font-medium">${courseData.estimatedPrice}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Tags</span>
            <div className="font-medium">{courseData.tags}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Category</span>
            <div className="font-medium">{categoryName}</div>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Description</span>
          <div className="mt-1">{courseData.description}</div>
        </div>
        {courseData.thumbnail && (
          <div>
            <span className="text-sm text-gray-500">Thumbnail</span>
            <img src={courseData.thumbnail} alt="Thumbnail" className="mt-2 max-h-40 rounded border" />
          </div>
        )}
      </div>

      {/* Benefits & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h4 className="font-semibold mb-2">Benefits</h4>
          <ul className="list-disc ml-5 space-y-1">
            {courseData.benefits.map((b: { title: string }, i: number) => (
              <li key={i} className="text-gray-700">{b.title}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h4 className="font-semibold mb-2">Prerequisites</h4>
          <ul className="list-disc ml-5 space-y-1">
            {courseData.prerequisites.map((p: { title: string }, i: number) => (
              <li key={i} className="text-gray-700">{p.title}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Course Content */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Course Content</h3>
        <div className="space-y-4">
          {courseData.courseContent.map((section: CourseContentSection, i: number) => (
            <div key={i} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-500" />
                <span className="font-semibold">{section.videoSection}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Title</span>
                  <div className="font-medium">{section.title}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Video Length</span>
                  <div className="font-medium">{section.video?.duration || 0} seconds</div>
                </div>
                {(section.video?.secure_url || section.videoUrl) && (
                  <div>
                    <span className="text-sm text-gray-500">Video Preview</span>
                    <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                      {section.video?.secure_url ? (
                        <video
                          src={section.video.secure_url}
                          controls
                          className="w-full h-full"
                          style={{ maxHeight: "400px" }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : section.videoUrl && section.videoUrl.startsWith("data:") ? (
                        <video
                          src={section.videoUrl}
                          controls
                          className="w-full h-full"
                          style={{ maxHeight: "400px" }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    {section.isPreview ? (
                      <>
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Free Preview</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Locked</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Order: {section.order !== undefined ? section.order : "N/A"}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Description</span>
                <div>{section.description}</div>
              </div>
              {section.links && section.links.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Links</span>
                  <ul className="list-disc ml-5">
                    {section.links.map((link: Link, j: number) => (
                      <li key={j}>
                        <span className="font-medium">{link.title}</span>{" "}
                        <a href={link.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                          {link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {section.suggestion && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Suggestions</span>
                  <div>{section.suggestion}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => setActive(active - 1)} disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Back</span>
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
          <span className="hidden md:inline">{isLoading ? "Submitting..." : "Submit"}</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateCoursePreview;