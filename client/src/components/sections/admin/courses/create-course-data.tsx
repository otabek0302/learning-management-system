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
  errors?: Record<string, string>;
  setActive: (active: number) => void;
  active: number;
}

const CreateCourseData = ({ benefits, setBenefits, prerequisites, setPrerequisites, errors = {}, setActive, active }: CreateCourseDataProps) => {
  const handleSubmitPrevious = () => {
    setActive(active - 1);
  };

  const handleSubmitNext = () => {
    if (benefits[benefits.length - 1].title === "" || prerequisites[prerequisites.length - 1].title === "") {
      toast.error("Please add at least one benefit and prerequisite");
      return;
    }

    console.log(benefits, prerequisites);
    setActive(active + 1);
  };

  return (
    <div className="mt-4 flex w-full max-w-4xl flex-col gap-4">
      {/* Benefits */}
      <div className="mb-8">
        <p className="pb-0.5 pl-0.5 text-sm text-gray-500">What are the benefits for students in this course ?</p>
        {benefits.map((benefit, idx) => (
          <div key={idx} className="mb-3 flex items-center gap-2">
            <Input type="text" value={benefit.title} onChange={(e) => setBenefits((prev) => prev.map((b, i) => (i === idx ? { ...b, title: e.target.value } : b)))} className={errors[`benefit_${idx}`] ? "border-red-500" : ""} placeholder="Enter benefit title" />
            <Button type="button" variant="destructive" size="sm" onClick={() => setBenefits((prev) => prev.filter((_, i) => i !== idx))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {benefits.map(
          (benefit, idx) =>
            errors[`benefit_${idx}`] && (
              <span key={`error-${idx}`} className="text-xs text-red-500">
                {errors[`benefit_${idx}`]}
              </span>
            )
        )}
        <Button type="button" variant="outline" onClick={() => setBenefits([...benefits, { title: "" }])} className="mt-3">
          <Plus className="h-4 w-4" />
          Add Benefit
        </Button>
      </div>

      {/* Prerequisites */}
      <div className="mb-6">
        <p className="pb-0.5 pl-0.5 text-sm text-gray-500">What are the prerequisites for this course ?</p>
        {prerequisites.map((pre, idx) => (
          <div key={idx} className="mb-3 flex items-center gap-2">
            <Input type="text" value={pre.title} onChange={(e) => setPrerequisites((prev) => prev.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p)))} className={errors[`prerequisite_${idx}`] ? "border-red-500" : ""} placeholder="Enter prerequisite title" />
            <Button type="button" variant="destructive" size="sm" onClick={() => setPrerequisites((prev) => prev.filter((_, i) => i !== idx))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {prerequisites.map(
          (pre, idx) =>
            errors[`prerequisite_${idx}`] && (
              <span key={`error-${idx}`} className="text-xs text-red-500">
                {errors[`prerequisite_${idx}`]}
              </span>
            )
        )}
        <Button type="button" variant="outline" onClick={() => setPrerequisites([...prerequisites, { title: "" }])} className="mt-3">
          <Plus className="h-4 w-4" />
          Add Prerequisite
        </Button>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center gap-2">
        <Button type="button" variant="outline" size="lg" onClick={() => handleSubmitPrevious()} className="mt-6 px-14">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={() => handleSubmitNext()} className="mt-6 px-14">
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCourseData;
