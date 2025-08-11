"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateLayoutMutation, useEditLayoutMutation, useGetLayoutQuery } from "@/redux/features/layout-page/layoutApi";
import { Layout, IFaqItem, Category } from "@/interfaces/layout.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Save, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CreateLayoutFormProps {
  isEdit?: boolean;
  layoutId?: string;
}

const CreateLayoutForm: React.FC<CreateLayoutFormProps> = ({ isEdit = false, layoutId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();

  // For edit mode, we need to get the layout by type
  const layoutTypeToFetch = isEdit ? (layoutId || typeParam || "") : "";
  const { data: existingLayout, isLoading: isLoadingLayout } = useGetLayoutQuery(layoutTypeToFetch, { 
    skip: !isEdit || !layoutTypeToFetch 
  });

  const [formData, setFormData] = useState({
    type: typeParam || "banner",
    title: "",
    subTitle: "",
    image: null as File | null,
    imagePreview: "",
    faq: [] as IFaqItem[],
    categories: [] as Category[],
  });

  // Initialize form data when editing
  useEffect(() => {
    if (isEdit && layoutId) {
      setFormData(prev => ({
        ...prev,
        type: layoutId
      }));
    }
  }, [isEdit, layoutId]);

  // Load existing data when it's available
  useEffect(() => {
    if (existingLayout?.layout && isEdit) {
      const layout = existingLayout.layout;
      
      setFormData({
        type: layout.type,
        title: layout.banner?.title || "",
        subTitle: layout.banner?.subTitle || "",
        image: null,
        imagePreview: layout.banner?.image?.url || "",
        faq: layout.faq || [],
        categories: layout.categories || [],
      });
    }
  }, [existingLayout, isEdit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const updateFaqItem = (index: number, field: "question" | "answer", value: string) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, { title: "" }],
    }));
  };

  const updateCategory = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((item, i) => (i === index ? { ...item, title: value } : item)),
    }));
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let payload: any = {
        type: formData.type,
      };

      if (formData.type === "banner") {
        if (formData.image) {
          // Convert image to base64 for upload
          const base64 = await fileToBase64(formData.image);
          payload = {
            ...payload,
            title: formData.title,
            subTitle: formData.subTitle,
            image: base64,
          };
        } else if (formData.imagePreview && isEdit) {
          // If editing and no new image, keep existing
          payload = {
            ...payload,
            title: formData.title,
            subTitle: formData.subTitle,
          };
        } else {
          toast.error("Please select an image for banner");
          return;
        }
      } else if (formData.type === "faq") {
        payload.faq = formData.faq.filter((item) => item.question && item.answer);
        if (payload.faq.length === 0) {
          toast.error("Please add at least one FAQ item");
          return;
        }
      } else if (formData.type === "categories") {
        payload.categories = formData.categories.filter((item) => item.title);
        if (payload.categories.length === 0) {
          toast.error("Please add at least one category");
          return;
        }
      }

      if (isEdit) {
        await editLayout(payload).unwrap();
        toast.success("Layout updated successfully!");
      } else {
        await createLayout(payload).unwrap();
        toast.success("Layout created successfully!");
      }

      router.push("/admin/layout-page");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
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

  const renderBannerForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Enter banner title" />
      </div>
      <div>
        <Label htmlFor="subTitle">Subtitle</Label>
        <Input id="subTitle" value={formData.subTitle} onChange={(e) => handleInputChange("subTitle", e.target.value)} placeholder="Enter banner subtitle" />
      </div>
      <div>
        <Label htmlFor="image">Banner Image</Label>
        <div className="space-y-2">
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
          {formData.imagePreview && (
            <div className="relative h-48 w-full overflow-hidden rounded-lg border">
              <img src={formData.imagePreview} alt="Banner preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFaqForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>FAQ Items</Label>
        <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>
      {formData.faq.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>No FAQ items added yet. Click "Add FAQ" to get started.</p>
        </div>
      )}
      {formData.faq.map((item, index) => (
        <Card key={index}>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>FAQ Item {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFaqItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label>Question</Label>
                <Input value={item.question} onChange={(e) => updateFaqItem(index, "question", e.target.value)} placeholder="Enter question" />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea value={item.answer} onChange={(e) => updateFaqItem(index, "answer", e.target.value)} placeholder="Enter answer" rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCategoriesForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Categories</Label>
        <Button type="button" variant="outline" size="sm" onClick={addCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      {formData.categories.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>No categories added yet. Click "Add Category" to get started.</p>
        </div>
      )}
      {formData.categories.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input value={item.title} onChange={(e) => updateCategory(index, e.target.value)} placeholder="Enter category title" />
          <Button type="button" variant="ghost" size="sm" onClick={() => removeCategory(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  const renderFormByType = () => {
    switch (formData.type) {
      case "banner":
        return renderBannerForm();
      case "faq":
        return renderFaqForm();
      case "categories":
        return renderCategoriesForm();
      default:
        return null;
    }
  };

  if (isLoadingLayout) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Loading layout data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/layout-page">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Layout" : "Create Layout"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Layout Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="type">Layout Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} disabled={isEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select layout type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="categories">Categories</SelectItem>
                </SelectContent>
              </Select>
              {isEdit && (
                <p className="mt-1 text-sm text-gray-600">
                  Editing {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} layout
                </p>
              )}
            </div>

            {renderFormByType()}

            <div className="flex justify-end gap-4">
              <Link href="/admin/layout-page">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isCreating || isEditing}>
                <Save className="mr-2 h-4 w-4" />
                {isCreating || isEditing ? "Saving..." : isEdit ? "Update Layout" : "Create Layout"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLayoutForm;
