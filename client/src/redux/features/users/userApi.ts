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
    })
})

export const { useUpdateAvatarMutation, useUpdateUserInfoMutation, useUpdatePasswordMutation } = userApi;