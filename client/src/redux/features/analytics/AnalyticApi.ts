import { apiSlice } from "../api/apiSlice";

export const analyticApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserAnalytics: builder.query({
            query: () => ({
                url: "/analytics/user-analytics",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getCourseAnalytics: builder.query({
            query: () => ({
                url: "/analytics/course-analytics",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getOrderAnalytics: builder.query({
            query: () => ({
                url: "/analytics/order-analytics",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const { useGetUserAnalyticsQuery, useGetCourseAnalyticsQuery, useGetOrderAnalyticsQuery } = analyticApi;    