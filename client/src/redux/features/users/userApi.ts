import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (data) => ({
                url: "/users/update-user-avatar",
                method: "PUT",
                body: data,
                credentials: "include" as const,
            })
        }),
        updateUserInfo: builder.mutation({
            query: ({ name, email, avatar }) => ({
                url: "/users/update-user-info",
                method: "PUT",
                body: { name, email, avatar },
                credentials: "include" as const,
            })
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: "/users/update-user-password",
                method: "PUT",
                body: data,
                credentials: "include" as const,
            })
        }),
        // Admin endpoints
        getAllUsers: builder.query({
            query: (params) => ({
                url: '/users/admin/users',
                method: 'GET',
                params,
                credentials: 'include' as const,
            }),
        }),
        getSingleUser: builder.query({
            query: (id) => ({
                url: `/users/admin/get-user/${id}`,
                method: 'GET',
                credentials: 'include' as const,
            }),
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: '/users/admin/create-user',
                method: 'POST',
                body: data,
                credentials: 'include' as const,
            }),
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/admin/update-user/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include' as const,
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: '/users/admin/delete-user',
                method: 'DELETE',
                body: { id },
                credentials: 'include' as const,
            }),
        }),
        searchUsers: builder.query({
            query: (search) => ({
                url: '/users/admin/search-users',
                method: 'GET',
                params: { search },
                credentials: 'include' as const,
            }),
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: '/users/admin/update-role',
                method: 'PUT',
                body: { id, role },
                credentials: 'include' as const,
            }),
        }),
    })
})

export const { useUpdateAvatarMutation, useUpdateUserInfoMutation, useUpdatePasswordMutation, useGetAllUsersQuery, useGetSingleUserQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useSearchUsersQuery, useUpdateUserRoleMutation } = userApi;