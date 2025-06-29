import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tags-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CourseInfo {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
}

interface CreateCourseInformationProps {
  courseInfo: CourseInfo;
  setCourseInfo: React.Dispatch<React.SetStateAction<CourseInfo>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  active: number;
  setActive: (active: number) => void;
}

const CreateCourseInformation = ({ courseInfo, setCourseInfo, errors, setErrors, setActive, active }: CreateCourseInformationProps) => {
  const [dragging, setDragging] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Sync tags with courseInfo
  useEffect(() => {
    if (courseInfo.tags) {
      const tagsArray = courseInfo.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);
      setTags(tagsArray);
    }
  }, [courseInfo.tags]);

  // Update courseInfo when tags change
  useEffect(() => {
    setCourseInfo((prev: CourseInfo) => ({ ...prev, tags: tags.join(", ") }));
  }, [tags, setCourseInfo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (courseInfo.name === "" || courseInfo.description === "" || courseInfo.price === "" || courseInfo.estimatedPrice === "" || courseInfo.tags === "" || courseInfo.level === "" || courseInfo.demoUrl === "" || courseInfo.thumbnail === "") {
      toast.error("Please fill all the fields");
      setErrors({ ...errors, name: "Name is required", description: "Description is required", price: "Price is required", estimatedPrice: "Estimated price is required", tags: "Tags are required", level: "Level is required", demoUrl: "Demo URL is required", thumbnail: "Thumbnail is required" });
      return;
    }

    console.log(courseInfo);
    setActive(active + 1);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDropLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setCourseInfo((prev: CourseInfo) => ({ ...prev, thumbnail: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setCourseInfo((prev: CourseInfo) => ({ ...prev, thumbnail: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "";
    setCourseInfo((prev: CourseInfo) => ({ ...prev, thumbnail: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-4xl flex-col gap-4">
      {/* Course Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-sm text-gray-500">
          Course Name
        </Label>
        <Input type="text" value={courseInfo.name} onChange={(e) => setCourseInfo((prev: CourseInfo) => ({ ...prev, name: e.target.value }))} placeholder="Enter course name" className={errors.name ? "border-red-500" : ""} />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm text-gray-500">
          Description
        </Label>
        <Textarea
          value={courseInfo.description}
          onChange={(e) => setCourseInfo((prev: CourseInfo) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter course description"
          className={errors.description ? "border-red-500" : ""}
          rows={4}
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
      </div>

      {/* Row */}
      <div className="flex gap-4">
        {/* Price */}
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="price" className="text-sm text-gray-500">
            Price
          </Label>
          <Input type="number" value={courseInfo.price} onChange={(e) => setCourseInfo((prev: CourseInfo) => ({ ...prev, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" className={errors.price ? "border-red-500" : ""} />
          {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
        </div>
        {/* Estimated Price */}
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="estimatedPrice" className="text-sm text-gray-500">
            Estimated Price
          </Label>
          <Input type="number" value={courseInfo.estimatedPrice} onChange={(e) => setCourseInfo((prev: CourseInfo) => ({ ...prev, estimatedPrice: e.target.value }))} placeholder="0.00" min="0" step="0.01" className={errors.estimatedPrice ? "border-red-500" : ""} />
          {errors.estimatedPrice && <span className="text-xs text-red-500">{errors.estimatedPrice}</span>}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tags" className="text-sm text-gray-500">
          Tags
        </Label>
        <TagInput value={tags} onChange={setTags} placeholder="e.g., React, JavaScript, Python" error={!!errors.tags} />
        {errors.tags && <span className="text-xs text-red-500">{errors.tags}</span>}
      </div>

      {/* Level */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-gray-500">Course Level</Label>
        <Select value={courseInfo.level} onValueChange={(value) => setCourseInfo((prev: CourseInfo) => ({ ...prev, level: value }))}>
          <SelectTrigger className={errors.level ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        {errors.level && <span className="text-xs text-red-500">{errors.level}</span>}
      </div>

      {/* Demo URL */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="demoUrl" className="text-sm text-gray-500">
          Demo URL
        </Label>
        <Input type="url" value={courseInfo.demoUrl} onChange={(e) => setCourseInfo((prev: CourseInfo) => ({ ...prev, demoUrl: e.target.value }))} placeholder="https://example.com/demo" className={errors.demoUrl ? "border-red-500" : ""} />
        {errors.demoUrl && <span className="text-xs text-red-500">{errors.demoUrl}</span>}
      </div>

      {/* Thumbnail Upload */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="thumbnail" className="text-sm text-gray-500">
          Thumbnail
        </Label>
        <div className="relative">
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition ${
              dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } ${errors.thumbnail ? "border-red-500" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDropLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <div className="relative">
                <img
                  src={courseInfo.thumbnail}
                  alt="Thumbnail Preview"
                  className="max-h-64 rounded-lg object-contain"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                  <p className="text-white opacity-0 hover:opacity-100 text-sm">Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="h-8 w-8" />
                <p>Drag & drop thumbnail image here, or click to browse</p>
              </div>
            )}
          </div>
        </div>
        {errors.thumbnail && <span className="text-xs text-red-500">{errors.thumbnail}</span>}
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="mt-6 w-full">
        Next
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default CreateCourseInformation;
