import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: '/courses/admin/create-course',
                method: 'POST',
                body: data,
                credentials: 'include' as const,
            }),
        }),
        updateCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `/courses/admin/update-course/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include' as const,
            }),
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/admin/delete-course`,
                method: 'DELETE',
                body: { id },
                credentials: 'include' as const,
            }),
        }),
        getAllCourses: builder.query({
            query: (params) => ({
                url: '/courses/admin/get-all-courses',
                method: 'GET',
                params,
                credentials: 'include' as const,
            }),
        }),
        getSingleCourseAdmin: builder.query({
            query: (id) => ({
                url: `/courses/admin/get-single-course/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
        }),
        getSingleCourse: builder.query({
            query: (id) => ({
                url: `/courses/get-single-course/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
        }),
    }),
});

export const { useCreateCourseMutation, useGetAllCoursesQuery, useGetSingleCourseQuery, useGetSingleCourseAdminQuery, useUpdateCourseMutation, useDeleteCourseMutation } = courseApi;