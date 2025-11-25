import Image from "next/image";

import { useState, useEffect } from "react";
import { Upload, ArrowRight, Plus, Loader2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetAllCategoriesQuery, useCreateCategoryMutation } from "@/redux/features/categories/categoryApi";
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
  categoryId: string;
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
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isProcessingThumbnail, setIsProcessingThumbnail] = useState(false);

  const { data: categoriesResponse } = useGetAllCategoriesQuery({});
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  useEffect(() => {
    if (courseInfo.tags && tags.length === 0) {
      const tagsArray = courseInfo.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);
      setTags(tagsArray);
    }
  }, [courseInfo.tags, tags.length]);

  useEffect(() => {
    const currentTagsString = tags.join(", ");
    if (courseInfo.tags !== currentTagsString) {
      setCourseInfo((prev: CourseInfo) => ({ ...prev, tags: currentTagsString }));
    }
  }, [tags, setCourseInfo, courseInfo.tags]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};
    let hasError = false;

    if (!courseInfo.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!courseInfo.description.trim()) {
      newErrors.description = "Description is required";
      hasError = true;
    }
    if (!courseInfo.price.trim()) {
      newErrors.price = "Price is required";
      hasError = true;
    }
    if (!courseInfo.estimatedPrice.trim()) {
      newErrors.estimatedPrice = "Estimated price is required";
      hasError = true;
    }
    if (!courseInfo.tags.trim()) {
      newErrors.tags = "Tags are required";
      hasError = true;
    }
    if (!courseInfo.level.trim()) {
      newErrors.level = "Level is required";
      hasError = true;
    }
    if (!courseInfo.categoryId.trim()) {
      newErrors.categoryId = "Category is required";
      hasError = true;
    }
    if (!courseInfo.thumbnail.trim()) {
      newErrors.thumbnail = "Thumbnail is required";
      hasError = true;
    }

    if (hasError) {
      toast.error("Please fill all the required fields");
      setErrors({ ...errors, ...newErrors });
      return;
    }

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
      handleThumbnailFile(file);
    }
  };

  const handleThumbnailFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsProcessingThumbnail(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setCourseInfo((prev: CourseInfo) => ({ ...prev, thumbnail: reader.result as string }));
        setIsProcessingThumbnail(false);
        toast.success("Thumbnail processed successfully!");
      }
    };
    reader.onerror = () => {
      setIsProcessingThumbnail(false);
      toast.error("Failed to process thumbnail image");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleThumbnailFile(file);
    }
  };

  const handleImageError = () => {
    setCourseInfo((prev: CourseInfo) => ({ ...prev, thumbnail: "" }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      }).unwrap();

      if (result.success && result.category) {
        toast.success("Category created successfully!");
        setCourseInfo((prev: CourseInfo) => ({ ...prev, categoryId: result.category._id }));
        setIsCreateCategoryOpen(false);
        setNewCategoryName("");
        setNewCategoryDescription("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category. Please try again.");
    }
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
        <Textarea value={courseInfo.description} onChange={(e) => setCourseInfo((prev: CourseInfo) => ({ ...prev, description: e.target.value }))} placeholder="Enter course description" className={errors.description ? "border-red-500" : ""} rows={4} />
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
        <TagInput key={courseInfo.tags} value={tags} onChange={setTags} placeholder="e.g., React, JavaScript, Python" error={!!errors.tags} />
        {errors.tags && <span className="text-xs text-red-500">{errors.tags}</span>}
      </div>

      {/* Level */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-gray-500">Course Level</Label>
        <Select key={courseInfo.level} value={courseInfo.level} onValueChange={(value) => setCourseInfo((prev: CourseInfo) => ({ ...prev, level: value }))}>
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

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-gray-500">Course Category</Label>
        <Select 
          key={courseInfo.categoryId} 
          value={courseInfo.categoryId || undefined} 
          onValueChange={(value) => {
            if (value === "__create__") {
              setIsCreateCategoryOpen(true);
              return;
            }
            setCourseInfo((prev: CourseInfo) => ({ ...prev, categoryId: value }));
          }}
        >
          <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoriesResponse?.categories && categoriesResponse.categories.length > 0 ? (
              <>
                {categoriesResponse.categories.map((category: { _id: string; name: string }) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectSeparator />
              </>
            ) : null}
            <SelectItem 
              value="__create__" 
              className="text-primary font-medium cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setIsCreateCategoryOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create New Category</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId}</span>}
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for your courses. Category name must be unique.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Web Development, Data Science"
                disabled={isCreatingCategory}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Textarea
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Brief description of this category"
                rows={3}
                disabled={isCreatingCategory}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateCategoryOpen(false);
                setNewCategoryName("");
                setNewCategoryDescription("");
              }}
              disabled={isCreatingCategory}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={isCreatingCategory || !newCategoryName.trim()}>
              {isCreatingCategory ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Thumbnail Upload */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="thumbnail" className="text-sm text-gray-500">
          Thumbnail
        </Label>
        <div className="relative">
          <input type="file" id="thumbnail" accept="image/*" onChange={handleFileChange} disabled={isProcessingThumbnail} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed z-10" />
          <div className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"} ${errors.thumbnail ? "border-red-500" : ""} ${isProcessingThumbnail ? "opacity-50 pointer-events-none" : ""} ${courseInfo.thumbnail ? "border-solid p-0" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDropLeave} onDrop={handleDrop}>
            {isProcessingThumbnail ? (
              <div className="flex flex-col items-center gap-2 text-gray-500 py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Processing thumbnail...</p>
              </div>
            ) : courseInfo.thumbnail ? (
              <div className="relative w-full group">
                <Image src={courseInfo.thumbnail} alt="Thumbnail Preview" width={512} height={256} className="w-full max-h-64 rounded-lg object-contain" onError={handleImageError} />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-10">
                  <p className="text-sm text-white opacity-0 group-hover:opacity-100">Click to change image</p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCourseInfo((prev: CourseInfo) => ({ ...prev, thumbnail: "" }));
                    toast.success("Thumbnail removed. You can upload a new one.");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500 py-8">
                <Upload className="h-8 w-8" />
                <p>Drag & drop thumbnail image here, or click to browse</p>
                <p className="text-xs text-gray-400">Max size: 5MB</p>
              </div>
            )}
          </div>
        </div>
        {errors.thumbnail && <span className="text-xs text-red-500">{errors.thumbnail}</span>}
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="mt-6 w-full">
        <span className="hidden md:block">Next</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default CreateCourseInformation;
