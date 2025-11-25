import { LoginResponse, RefreshTokenResponse } from "@/shared/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    credentials: "include",
  }),
  tagTypes: ['Layout', 'User', 'Course', 'Category'],
  endpoints: (builder) => ({
    refreshToken: builder.query<RefreshTokenResponse, void>({
      query: () => ({
        url: "/user/refreshtoken",
        method: "GET",
      }),
    }),
    loadUser: builder.query<{ success: boolean; user: any }, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result.data?.user) {
            const user = result.data.user;
            dispatch(userLoggedIn({
              token: "",
              user: user,
            }));
          }
        } catch (error) {
          console.error("Load user error:", error);
        }
      }
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;