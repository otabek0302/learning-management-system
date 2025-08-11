"use client";

import React from "react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetLayoutByIdQuery, useEditLayoutMutation } from "@/redux/features/layout-page/layoutApi";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface LayoutPayload {
  type: string;
  title?: string;
  subTitle?: string;
  image?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  categories?: Array<{
    title: string;
  }>;
}

const EditLayoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const layoutId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: existingLayoutResponse, isLoading: isLoadingLayout, error: layoutError, refetch } = useGetLayoutByIdQuery(layoutId);
  const existingLayout = existingLayoutResponse?.layout;

  const [editLayout, { isLoading: isUpdating }] = useEditLayoutMutation();

  const [faq, setFaq] = useState([{ question: "", answer: "" }]);
  const [categories, setCategories] = useState([{ title: "" }]);
  const [banner, setBanner] = useState({ title: "", subTitle: "", image: null as File | null, imagePreview: "" });
  const [type, setType] = useState("banner");
  const [hasImageChanged, setHasImageChanged] = useState(false);

  useEffect(() => {
    if (existingLayout) {
      setType(existingLayout.type);

      if (existingLayout.type === "banner" && existingLayout.banner) {
        setBanner({
          title: existingLayout.banner.title || "",
          subTitle: existingLayout.banner.subTitle || "",
          image: null,
          imagePreview: existingLayout.banner.image?.url || "",
        });
      }

      if (existingLayout.type === "faq" && existingLayout.faq) {
        setFaq(existingLayout.faq.length > 0 ? existingLayout.faq : [{ question: "", answer: "" }]);
      }

      if (existingLayout.type === "categories" && existingLayout.categories) {
        setCategories(existingLayout.categories.length > 0 ? existingLayout.categories : [{ title: "" }]);
      }
    }
  }, [existingLayout]);

  const handleTypeChange = (newType: string) => {
    setType(newType);

    if (newType !== "banner") {
      setBanner({ title: "", subTitle: "", image: null, imagePreview: "" });
    }
    if (newType !== "faq") {
      setFaq([{ question: "", answer: "" }]);
    }
    if (newType !== "categories") {
      setCategories([{ title: "" }]);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Please select a valid image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image size should be less than 5MB");

    const previewURL = URL.createObjectURL(file);
    setBanner((b) => ({ ...b, image: file, imagePreview: previewURL }));
    setHasImageChanged(true);
  };

  const removeImage = () => {
    if (banner.imagePreview && banner.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(banner.imagePreview);
    }

    setBanner({ ...banner, image: null, imagePreview: "" });
    setHasImageChanged(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const renderBannerForm = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={banner.title} onChange={(e) => setBanner({ ...banner, title: e.target.value })} placeholder="Enter banner title" required />
        </div>
        <div>
          <Label htmlFor="subTitle">Subtitle</Label>
          <Input id="subTitle" value={banner.subTitle} onChange={(e) => setBanner({ ...banner, subTitle: e.target.value })} placeholder="Enter banner subtitle" required />
        </div>
        <div>
          <Label htmlFor="image">Banner Image</Label>
          <div className="space-y-2">
            <Input ref={fileInputRef} id="image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
            <p className="text-xs text-gray-500">{hasImageChanged ? "New image selected" : "Current image will be kept if no new image is selected"}</p>

            {banner.imagePreview && (
              <div className="relative h-80 w-full overflow-hidden rounded-lg border">
                <img src={banner.imagePreview} alt="Banner preview" className="h-full w-full object-cover" />
                <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="absolute right-2 top-2 h-8 w-8 p-0">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFaqForm = () => {
    const addFaqItem = () => {
      setFaq([...faq, { question: "", answer: "" }]);
    };

    const removeFaqItem = (index: number) => {
      setFaq(faq.filter((_, i) => i !== index));
    };

    const updateFaqItem = (index: number, field: "question" | "answer", value: string) => {
      setFaq(faq.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    return (
      <div className="space-y-4">
        {faq.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No FAQ items added yet. Click &quot;Add FAQ&quot; to get started.</p>
          </div>
        )}
        <div className="space-y-2 p-0">
          {faq.map((item, index) => (
            <Card key={index} className="p-0 shadow-none">
              <CardHeader>
                <Label className="text-sm font-medium leading-normal text-gray-500">FAQ Item {index + 1}</Label>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium leading-normal text-gray-500">Question</Label>
                    <Input value={item.question} onChange={(e) => updateFaqItem(index, "question", e.target.value)} placeholder="Enter question" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium leading-normal text-gray-500">Answer</Label>
                    <Textarea value={item.answer} onChange={(e) => updateFaqItem(index, "answer", e.target.value)} placeholder="Enter answer" rows={3} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => removeFaqItem(index)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-red-500">
                  <Trash className="h-4 w-4 group-hover/btn:text-white" />
                  <span className="hidden group-hover/btn:text-white sm:block">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <Button type="button" variant="default" size="sm" onClick={addFaqItem} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-blue-500">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:block">Add FAQ</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderCategoriesForm = () => {
    const addCategory = () => {
      setCategories([...categories, { title: "" }]);
    };

    const removeCategory = (index: number) => {
      setCategories(categories.filter((_, i) => i !== index));
    };

    const updateCategory = (index: number, value: string) => {
      setCategories(categories.map((item, i) => (i === index ? { ...item, title: value } : item)));
    };

    return (
      <div className="space-y-4">
        {categories.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No categories added yet. Click &quot;Add Category&quot; to get started.</p>
          </div>
        )}
        <div className="space-y-2 p-0">
          {categories.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input value={item.title} onChange={(e) => updateCategory(index, e.target.value)} placeholder="Enter category title" />
              <Button variant="outline" size="icon" onClick={() => removeCategory(index)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-red-500">
                <Trash className="h-5 w-5 group-hover/btn:text-white" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <Button type="button" variant="default" size="sm" onClick={addCategory} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-blue-500">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:block">Add Category</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderFormByType = () => {
    switch (type) {
      case "banner":
        return renderBannerForm();
      case "faq":
        return renderFaqForm();
      case "categories":
        return renderCategoriesForm();
      default:
        return <div>Please select a valid layout type</div>;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === "banner") {
        if (!banner.title || !banner.subTitle) {
          toast.error("Please fill in all required banner fields");
          return;
        }
      }

      if (type === "faq") {
        if (faq.some((i) => !i.question || !i.answer)) {
          toast.error("Please fill in all FAQ questions and answers");
          return;
        }
      }

      if (type === "categories") {
        if (categories.some((c) => !c.title)) {
          toast.error("Please fill in all category titles");
          return;
        }
      }

      let payload: LayoutPayload = { type };

      if (type === "banner") {
        payload = {
          type,
          title: banner.title.trim(),
          subTitle: banner.subTitle.trim(),
        };

        if (hasImageChanged && banner.image) {
          const base64Image = await fileToBase64(banner.image);
          payload.image = base64Image;
        }
      }

      if (type === "faq") {
        const cleanFaq = faq.map((i) => ({ question: i.question.trim(), answer: i.answer.trim() })).filter((i) => i.question && i.answer);
        payload = { type, faq: cleanFaq };
      }

      if (type === "categories") {
        const cleanCategories = categories.map((c) => ({ title: c.title.trim() })).filter((c) => c.title);
        payload = { type, categories: cleanCategories };
      }

      await editLayout({ id: layoutId, ...payload }).unwrap();
      toast.success("Layout updated successfully");

      refetch();

      router.push(`/admin/layout-page/${type}`);
    } catch (error: unknown) {
      console.error("Failed to update layout:", error);
      const errorMessage = error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data ? String(error.data.message) : "Failed to update layout. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoadingLayout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-xl text-muted-foreground">Loading layout details...</p>
        </div>
      </div>
    );
  }

  if (layoutError || !existingLayout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={() => router.push("/admin/layout-page")}>View All Layouts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-gray-100">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2" title="Refresh data">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:block">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between gap-2 border-b pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Layout Type</span>
                <p className="text-sm text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)} layout</p>
              </div>
            </div>

            <div className="mt-6">{renderFormByType()}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href={`/admin/layout-page/${type}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              <Save className="mr-2 h-4 w-4" />
              {isUpdating ? "Updating..." : "Update Layout"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLayoutPage;
