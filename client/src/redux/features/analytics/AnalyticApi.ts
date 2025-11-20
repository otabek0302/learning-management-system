import { apiSlice } from "../api/apiSlice";

export const analyticApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Chart Analytics (Last 12 Months)
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
        // Stats Endpoints
        getRevenueStats: builder.query({
            query: () => ({
                url: "/analytics/revenue",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getUserStats: builder.query({
            query: () => ({
                url: "/analytics/users",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getCourseStats: builder.query({
            query: () => ({
                url: "/analytics/courses",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getQuizStats: builder.query({
            query: () => ({
                url: "/analytics/quizzes",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getCouponStats: builder.query({
            query: () => ({
                url: "/analytics/coupons",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        // Dashboard Summary
        getAdminDashboardStats: builder.query({
            query: () => ({
                url: "/analytics/dashboard",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useGetUserAnalyticsQuery,
    useGetCourseAnalyticsQuery,
    useGetOrderAnalyticsQuery,
    useGetRevenueStatsQuery,
    useGetUserStatsQuery,
    useGetCourseStatsQuery,
    useGetQuizStatsQuery,
    useGetCouponStatsQuery,
    useGetAdminDashboardStatsQuery
} = analyticApi;    