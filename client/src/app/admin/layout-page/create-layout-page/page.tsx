"use client";

import Image from "next/image";
import Link from "next/link";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCreateLayoutMutation } from "@/redux/features/layout-page/layoutApi";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoryApi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash, ArrowLeft, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface IFaqItem {
    question: string;
    answer: string;
}

const CreateLayoutPage = () => {
  const router = useRouter();
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });

  const [banner, setBanner] = useState({ title: "", subTitle: "", image: null as File | null, imagePreview: "" });
  const [faq, setFaq] = useState<IFaqItem[]>([{ question: "", answer: "" }]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = categoriesData?.categories || [];

  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Please select a valid image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image size should be less than 5MB");

    const previewURL = URL.createObjectURL(file);
    setBanner((b) => ({ ...b, image: file, imagePreview: previewURL }));
  };

  const removeBannerImage = () => {
    if (banner.imagePreview && banner.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(banner.imagePreview);
    }
    setBanner({ ...banner, image: null, imagePreview: "" });
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.value = "";
    }
  };

    const addFaqItem = () => {
      setFaq([...faq, { question: "", answer: "" }]);
    };

    const removeFaqItem = (index: number) => {
      setFaq(faq.filter((_, i) => i !== index));
    };

    const updateFaqItem = (index: number, field: "question" | "answer", value: string) => {
      setFaq(faq.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreateAll = async () => {
    const layoutsToCreate: Array<{ type: "banner" | "faq" | "categories"; payload: any }> = [];

    if (banner.title && banner.subTitle && banner.image) {
      const base64Image = await fileToBase64(banner.image);
      layoutsToCreate.push({
        type: "banner",
        payload: {
          type: "banner",
          title: banner.title.trim(),
          subTitle: banner.subTitle.trim(),
          image: base64Image,
        },
      });
    }

    const cleanFaq = faq.filter((i) => i.question.trim() && i.answer.trim()).map((i) => ({
      question: i.question.trim(),
      answer: i.answer.trim(),
    }));
    if (cleanFaq.length > 0) {
      layoutsToCreate.push({
        type: "faq",
        payload: {
          type: "faq",
          faq: cleanFaq,
        },
      });
    }

    if (selectedCategories.length > 0) {
      layoutsToCreate.push({
        type: "categories",
        payload: {
          type: "categories",
          categories: selectedCategories,
        },
      });
    }

    if (layoutsToCreate.length === 0) {
      toast.error("Please fill in at least one layout section");
      return;
    }

    try {
      for (const { type, payload } of layoutsToCreate) {
      await createLayout(payload).unwrap();
      }
      toast.success(`Successfully created ${layoutsToCreate.length} layout(s)`);
      router.push("/admin/layout-page");
    } catch (error: unknown) {
      console.error("Failed to create layouts:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
          ? String(error.data.message)
          : "Failed to create layouts. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Layout</h1>
            <p className="mt-1 text-sm text-muted-foreground">Configure your landing page sections</p>
          </div>
          <Link href="/admin/layout-page">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <form className="space-y-4">
          <Accordion type="multiple" defaultValue={["banner"]} className="w-full">
            {/* Hero/Banner Section */}
            <AccordionItem value="banner">
              <AccordionTrigger className="text-lg font-semibold">
                Hero/Banner Section
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Configuration</CardTitle>
                    <CardDescription>Configure your hero banner section with image, title, and subtitle</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="banner-title">Title *</Label>
                      <Input
                        id="banner-title"
                        value={banner.title}
                        onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                        placeholder="Enter banner title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner-subtitle">Subtitle *</Label>
                      <Input
                        id="banner-subtitle"
                        value={banner.subTitle}
                        onChange={(e) => setBanner({ ...banner, subTitle: e.target.value })}
                        placeholder="Enter banner subtitle"
                      />
              </div>
              <div>
                      <Label htmlFor="banner-image">Banner Image *</Label>
                      <div className="space-y-2">
                        <Input
                          ref={bannerFileInputRef}
                          id="banner-image"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerImageChange}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>

                        {banner.imagePreview && (
                          <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                            <Image src={banner.imagePreview} alt="Banner preview" fill className="object-cover" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeBannerImage}
                              className="absolute right-2 top-2 h-8 w-8 p-0"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
              </div>
            </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* FAQ Section */}
            <AccordionItem value="faq">
              <AccordionTrigger className="text-lg font-semibold">
                FAQ Section
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>FAQ Configuration</CardTitle>
                    <CardDescription>Add frequently asked questions for your landing page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {faq.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        <p>No FAQ items added yet. Click &quot;Add FAQ&quot; to get started.</p>
                      </div>
                    )}
                    <div className="space-y-3">
                      {faq.map((item, index) => (
                        <Card key={index} className="border">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">FAQ Item {index + 1}</CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFaqItem(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Question</Label>
                              <Input
                                value={item.question}
                                onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                                placeholder="Enter question"
                              />
                            </div>
                            <div>
                              <Label>Answer</Label>
                              <Textarea
                                value={item.answer}
                                onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                                placeholder="Enter answer"
                                rows={3}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex justify-start">
                      <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add FAQ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Categories Section */}
            <AccordionItem value="categories">
              <AccordionTrigger className="text-lg font-semibold">
                Categories Section
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Categories Configuration</CardTitle>
                    <CardDescription>Select categories to display on your landing page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categories.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <p>No categories available. Please create categories first.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categories.map((category: any) => (
                          <div key={category._id} className="flex items-center space-x-2 rounded-lg border p-3">
                            <Checkbox
                              id={`category-${category._id}`}
                              checked={selectedCategories.includes(category._id)}
                              onCheckedChange={() => toggleCategory(category._id)}
                            />
                            <Label
                              htmlFor={`category-${category._id}`}
                              className="flex-1 cursor-pointer font-normal"
                            >
                              {category.name}
                            </Label>
                            {selectedCategories.includes(category._id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        ))}
          </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Create All Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/admin/layout-page">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="button" onClick={handleCreateAll} disabled={isCreating}>
              <Save className="mr-2 h-4 w-4" />
              {isCreating ? "Creating..." : "Create All Layouts"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLayoutPage;
