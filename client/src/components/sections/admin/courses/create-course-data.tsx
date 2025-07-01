import React from "react";
import { Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Benefit {
  title: string;
}

interface Prerequisite {
  title: string;
}

interface CreateCourseDataProps {
  benefits: Benefit[];
  setBenefits: React.Dispatch<React.SetStateAction<Benefit[]>>;
  prerequisites: Prerequisite[];
  setPrerequisites: React.Dispatch<React.SetStateAction<Prerequisite[]>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setActive: (active: number) => void;
  active: number;
}

const CreateCourseData = ({ benefits, setBenefits, prerequisites, setPrerequisites, errors, setErrors, setActive, active }: CreateCourseDataProps) => {
  const handleSubmitPrevious = () => {
    setActive(active - 1);
  };

  const handleSubmitNext = () => {
    const newErrors = { ...errors };
    let hasError = false;

    benefits.forEach((b, idx) => {
      if (!b.title.trim()) {
        newErrors[`benefit_${idx}`] = "Benefit title cannot be empty";
        hasError = true;
      } else {
        delete newErrors[`benefit_${idx}`];
      }
    });

    prerequisites.forEach((p, idx) => {
      if (!p.title.trim()) {
        newErrors[`prerequisite_${idx}`] = "Prerequisite title cannot be empty";
        hasError = true;
      } else {
        delete newErrors[`prerequisite_${idx}`];
      }
    });

    setErrors(newErrors);

    if (hasError) {
      toast.error("Please fix the errors before proceeding.");
      return;
    }

    setActive(active + 1);
  };

  return (
    <div className="mt-4 flex w-full max-w-4xl flex-col gap-4">
      {/* Benefits */}
      <div className="mb-8">
        <p className="pb-0.5 pl-0.5 text-sm text-gray-500">What are the benefits for students in this course ?</p>
        {benefits.map((benefit, idx) => (
          <div key={idx} className="space-y-2">
            <div className="mb-2 flex items-center gap-2">
              <Input type="text" value={benefit.title} onChange={(e) => setBenefits((prev) => prev.map((b, i) => (i === idx ? { ...b, title: e.target.value } : b)))} className={errors[`benefit_${idx}`] ? "border-red-500" : ""} placeholder="Enter benefit title" />
              <Button type="button" variant="destructive" size="sm" onClick={() => setBenefits((prev) => prev.filter((_, i) => i !== idx))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {errors[`benefit_${idx}`] && <span className="text-xs text-red-500">{errors[`benefit_${idx}`]}</span>}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setBenefits([...benefits, { title: "" }])} className="mt-3">
          <Plus className="h-4 w-4" />
          <span className="hidden md:block">Add Benefit</span>
        </Button>
      </div>

      {/* Prerequisites */}
      <div className="mb-6">
        <p className="pb-0.5 pl-0.5 text-sm text-gray-500">What are the prerequisites for this course ?</p>
        {prerequisites.map((pre, idx) => (
          <div key={idx} className="space-y-2">
            <div className="mb-2 flex items-center gap-2">
              <Input type="text" value={pre.title} onChange={(e) => setPrerequisites((prev) => prev.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p)))} className={errors[`prerequisite_${idx}`] ? "border-red-500" : ""} placeholder="Enter prerequisite title" />
              <Button type="button" variant="destructive" size="sm" onClick={() => setPrerequisites((prev) => prev.filter((_, i) => i !== idx))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {errors[`prerequisite_${idx}`] && <span className="text-xs text-red-500">{errors[`prerequisite_${idx}`]}</span>}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setPrerequisites([...prerequisites, { title: "" }])} className="mt-3">
          <Plus className="h-4 w-4" />
          <span className="hidden md:block">Add Prerequisite</span>
        </Button>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center gap-2">
        <Button type="button" variant="outline" size="lg" onClick={() => handleSubmitPrevious()} className="mt-6 px-14">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden md:block">Back</span>
        </Button>
        <Button type="button" size="lg" onClick={() => handleSubmitNext()} className="mt-6 px-14">
          <span className="hidden md:block">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCourseData;
