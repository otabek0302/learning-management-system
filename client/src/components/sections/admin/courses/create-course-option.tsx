import React from "react";

const steps = ["Course Details", "Pricing & Tags", "Media & Preview", "Publish"];

const CreateCourseOption = ({ active, setActive }: { active: number; setActive: (active: number) => void }) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-1 flex-col items-center">
            
            {/* Circle */}
            <button type="button" onClick={() => setActive(index)} className={`flex h-10 w-10 items-center justify-center rounded-full transition ${index < active ? "bg-green-500 text-white" : index === active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
              {index + 1}
            </button>

            {/* Label */}
            <span className={`mt-2 text-center text-xs ${index <= active ? "font-semibold text-gray-800" : "text-gray-400"}`}>{step}</span>

            {/* Line connector */}
            {index !== steps.length - 1 && (
              <div className="absolute left-1/2 top-5 -z-10 h-0.5 w-full">
                <div className={`h-full transition-all ${index < active ? "bg-green-500" : "bg-gray-300"}`} style={{ width: "100%" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateCourseOption;
