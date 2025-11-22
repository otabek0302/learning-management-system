import { LoginResponse, RefreshTokenResponse } from "@/types/auth";
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
        url: "/users/refreshtoken",
        method: "GET",
      }),
    }),
    loadUser: builder.query<LoginResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({
            token: result.data?.accessToken,
            user: result.data?.user,
          }));
        } catch (error) {
          console.error("Load user error:", error);
        }
      }
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;