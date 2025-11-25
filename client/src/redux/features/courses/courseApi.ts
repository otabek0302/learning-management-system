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
            invalidatesTags: ['Course'],
        }),
        updateCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `/courses/admin/update-course/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include' as const,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Course' as const, id }, 'Course'],
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/admin/delete-course`,
                method: 'DELETE',
                body: { id },
                credentials: 'include' as const,
            }),
            invalidatesTags: ['Course'],
        }),
        getAllCourses: builder.query({
            query: (params) => ({
                url: '/courses/admin/get-all-courses',
                method: 'GET',
                params,
                credentials: 'include' as const,
            }),
            providesTags: ['Course'],
        }),
        getSingleCourseAdmin: builder.query({
            query: (id) => ({
                url: `/courses/admin/get-single-course/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
            providesTags: (_result, _error, id) => [{ type: 'Course' as const, id }],
        }),
        getSingleCourse: builder.query({
            query: (id) => ({
                url: `/courses/get-single-course/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
            providesTags: (_result, _error, id) => [{ type: 'Course' as const, id }],
        }),
        getAllCoursesPublic: builder.query({
            query: (params) => ({
                url: '/courses/get-all-courses',
                method: 'GET',
                params,
                credentials: 'include' as const,
            }),
            providesTags: ['Course'],
        }),
    }),
});

export const { useCreateCourseMutation, useGetAllCoursesQuery, useGetAllCoursesPublicQuery, useGetSingleCourseQuery, useGetSingleCourseAdminQuery, useUpdateCourseMutation, useDeleteCourseMutation } = courseApi;