import { RegistrationResponse, RegistrationData, ActivationData, ActivationResponse, LoginResponse, LoginData } from "@/shared/types";
import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn, userLoggedOut } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: ({ name, email, password }) => ({
                url: "/user/registration",
                method: "POST",
                body: { name, email, password },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userRegistration({
                        token: result.data?.activationToken,
                    }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        activation: builder.mutation<ActivationResponse, ActivationData>({
            query: ({ activation_token, activation_code }) => ({
                url: "/user/activate",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            })
        }),
        login: builder.mutation<LoginResponse, LoginData>({
            query: ({ email, password }) => ({
                url: "/user/login",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({
                        token: result.data?.accessToken,
                        user: result.data?.user,
                    }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        signInWithSocial: builder.mutation<LoginResponse, { email: string, name: string, avatar: string }>({
            query: (data) => ({
                url: "/user/social-auth",
                method: "POST",
                body: {
                    email: data.email,
                    name: data.name,
                    avatar: data.avatar,
                },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({
                        token: result.data?.accessToken,
                        user: result.data?.user,
                    }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        logout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "/user/logout",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(userLoggedOut());
                } catch (error) {
                    dispatch(userLoggedOut());
                    console.log(error);
                }
            }
        }),
    })
})

export const { useLoginMutation, useRegisterMutation, useActivationMutation, useSignInWithSocialMutation, useLogoutMutation } = authApi;
