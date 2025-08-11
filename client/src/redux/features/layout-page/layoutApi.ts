import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLayout: builder.query({
            query: (type) => ({
                url: `/layout/get-layout/${type}`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: (result, error, type) => [{ type: 'Layout' as const, id: type }]
        }),
        getLayoutById: builder.query({
            query: (id) => ({
                url: `/layout/get-layout-by-id/${id}`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: (result, error, id) => [{ type: 'Layout' as const, id }]
        }),
        getAllLayouts: builder.query({
            query: () => ({
                url: `/layout/get-all-layouts`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: [{ type: 'Layout' as const }]
        }),
        createLayout: builder.mutation({
            query: (data) => ({
                url: `/layout/create-layout`,
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            invalidatesTags: [{ type: 'Layout' as const }]
        }),
        editLayout: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/layout/edit-layout/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
            invalidatesTags: [{ type: 'Layout' as const }]
        }),
        deleteLayout: builder.mutation({
            query: (id) => ({
                url: `/layout/delete-layout/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
            invalidatesTags: [{ type: 'Layout' as const }]
        }),
    }),
});

export const { useGetLayoutQuery, useGetLayoutByIdQuery, useGetAllLayoutsQuery, useCreateLayoutMutation, useEditLayoutMutation, useDeleteLayoutMutation } = layoutApi;