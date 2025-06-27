"use client";
import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";

const schema = Yup.object().shape({
  name: Yup.string().required("Course name is required").min(3, "Course name must be at least 3 characters").max(100, "Course name must not exceed 100 characters"),
  description: Yup.string().required("Course description is required").min(10, "Description must be at least 10 characters").max(500, "Description must not exceed 500 characters"),
  price: Yup.number().required("Price is required").positive("Price must be a positive number").min(0, "Price cannot be negative"),
  estimatedPrice: Yup.number().positive("Estimated price must be a positive number").min(0, "Estimated price cannot be negative"),
  tags: Yup.string().required("Tags are required").min(2, "At least one tag is required"),
  level: Yup.string().required("Course level is required").oneOf(["Beginner", "Intermediate", "Advanced"], "Please select a valid level"),
  demoUrl: Yup.string().required("Demo URL is required").url("Please enter a valid URL"),
  thumbnail: Yup.string().required("Thumbnail is required"),
});

const CreateCoursePage = () => {
  const [active, setActive] = useState(0);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      estimatedPrice: "",
      tags: "",
      level: "",
      demoUrl: "",
      thumbnail: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        console.log("Form submitted with values:", values);
        alert("Course created successfully");
      } catch (error) {
        console.error("Error creating course:", error);
        alert("Error creating course. Please try again.");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Create New Course</h2>

        {/* Course Name */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Course Name *</label>
          <input 
            type="text" 
            name="name" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.name && formik.errors.name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="Enter course name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Description *</label>
          <textarea 
            name="description" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description} 
            rows={4}
            className={`w-full rounded-md border p-3 ${
              formik.touched.description && formik.errors.description 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="Enter course description"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Price *</label>
          <input 
            type="number" 
            name="price" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.price && formik.errors.price 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {formik.touched.price && formik.errors.price && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        {/* Estimated Price */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Estimated Price</label>
          <input 
            type="number" 
            name="estimatedPrice" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.estimatedPrice} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.estimatedPrice && formik.errors.estimatedPrice 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {formik.touched.estimatedPrice && formik.errors.estimatedPrice && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.estimatedPrice}</p>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Tags *</label>
          <input 
            type="text" 
            name="tags" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tags} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.tags && formik.errors.tags 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="e.g., React, JavaScript, Web Development"
          />
          {formik.touched.tags && formik.errors.tags && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.tags}</p>
          )}
        </div>

        {/* Level */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Course Level *</label>
          <select 
            name="level" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.level} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.level && formik.errors.level 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="">Select a level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {formik.touched.level && formik.errors.level && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.level}</p>
          )}
        </div>

        {/* Demo URL */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Demo URL *</label>
          <input 
            type="url" 
            name="demoUrl" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.demoUrl} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.demoUrl && formik.errors.demoUrl 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="https://example.com/demo"
          />
          {formik.touched.demoUrl && formik.errors.demoUrl && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.demoUrl}</p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">Thumbnail URL *</label>
          <input 
            type="url" 
            name="thumbnail" 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.thumbnail} 
            className={`w-full rounded-md border p-3 ${
              formik.touched.thumbnail && formik.errors.thumbnail 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="https://example.com/thumbnail.jpg"
          />
          {formik.touched.thumbnail && formik.errors.thumbnail && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.thumbnail}</p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={formik.isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Creating Course..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
