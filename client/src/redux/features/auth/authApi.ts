import { RegistrationResponse, RegistrationData, ActivationData, ActivationResponse, LoginResponse, LoginData } from "@/types/auth";
import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: ({ name, email, password }) => ({
                url: "/users/registration",
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
                url: "/users/activate",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            })
        }),
        login: builder.mutation<LoginResponse, LoginData>({
            query: ({ email, password }) => ({
                url: "/users/login",
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
                url: "/users/social-auth",
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
    })
})

export const { useLoginMutation, useRegisterMutation, useActivationMutation, useSignInWithSocialMutation } = authApi;
