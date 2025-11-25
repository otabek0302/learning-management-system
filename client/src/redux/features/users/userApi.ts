import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (data) => ({
                url: "/user/update-user-avatar",
                method: "PUT",
                body: data,
                credentials: "include" as const,
            })
        }),
        updateUserInfo: builder.mutation({
            query: ({ name, email, avatar }) => ({
                url: "/user/update-user-info",
                method: "PUT",
                body: { name, email, avatar },
                credentials: "include" as const,
            })
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: "/user/update-user-password",
                method: "PUT",
                body: data,
                credentials: "include" as const,
            })
        }),
        // Admin endpoints
        getAllUsers: builder.query({
            query: (params) => ({
                url: '/user/admin/users',
                method: 'GET',
                params,
                credentials: 'include' as const,
            }),
            providesTags: ['User'],
        }),
        getSingleUser: builder.query({
            query: (id) => ({
                url: `/user/admin/get-user/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
            providesTags: (_result, _error, id) => [{ type: 'User' as const, id }],
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: '/user/admin/create-user',
                method: 'POST',
                body: data,
                credentials: 'include' as const,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/user/admin/update-user/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include' as const,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'User' as const, id }, 'User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: '/user/admin/delete-user',
                method: 'DELETE',
                body: { id },
                credentials: 'include' as const,
            }),
            invalidatesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: '/user/admin/update-role',
                method: 'PUT',
                body: { id, role },
                credentials: 'include' as const,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'User' as const, id }, 'User'],
        }),
    })
})

export const { useUpdateAvatarMutation, useUpdateUserInfoMutation, useUpdatePasswordMutation, useGetAllUsersQuery, useGetSingleUserQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useUpdateUserRoleMutation } = userApi;