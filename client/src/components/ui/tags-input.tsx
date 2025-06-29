import React, { useState, useRef } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder = "Enter tags, comma separated...", className = "", error = false }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
      setInput("");
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      // Remove last tag on backspace
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (input) {
      addTag(input);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-lg border p-1 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-gray-300 hover:border-gray-400"} ${className}`} onClick={() => inputRef.current?.focus()}>
      {value.map((tag, idx) => (
        <div key={idx} className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-100 px-3 py-1 text-sm">
          <span className="font-medium text-blue-800">{tag}</span>
          <button type="button" className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-blue-600 transition-colors hover:bg-red-100 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(idx);
            }}>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <input ref={inputRef} type="text" className="min-w-[120px] flex-1 border-none bg-transparent p-1 text-sm placeholder:text-gray-400 focus:outline-none" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur} placeholder={value.length === 0 ? placeholder : "Add another tag..."} />
    </div>
  );
};
