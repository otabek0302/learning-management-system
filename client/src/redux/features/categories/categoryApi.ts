import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => ({
                url: '/categories/get-all-categories',
                method: 'GET',
                credentials: 'include' as const,
            }),
            providesTags: ['Category'],
        }),
        getCategoryById: builder.query({
            query: (id) => ({
                url: `/categories/get-category/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
            providesTags: (_result, _error, id) => [{ type: 'Category' as const, id }],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: '/categories/create-category',
                method: 'POST',
                body: data,
                credentials: 'include' as const,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/categories/update-category/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include' as const,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Category' as const, id }, 'Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/delete-category/${id}`,
                method: 'DELETE',
                credentials: 'include' as const,
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;

