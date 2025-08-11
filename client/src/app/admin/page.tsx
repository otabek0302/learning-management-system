"use client";

import AnalyticsCourse from "@/components/sections/admin/analytics/analytics-cours";
import AnalyticsOrder from "@/components/sections/admin/analytics/analytics-order";
import AnalyticsUser from "@/components/sections/admin/analytics/analytics-user";

import { useGetUserAnalyticsQuery, useGetCourseAnalyticsQuery, useGetOrderAnalyticsQuery } from "@/redux/features/analytics/AnalyticApi";

const AdminPage = () => {
  const { data: userAnalytics, isLoading: isUserAnalyticsLoading, error: userAnalyticsError } = useGetUserAnalyticsQuery({});
  const { data: courseAnalytics, isLoading: isCourseAnalyticsLoading, error: courseAnalyticsError } = useGetCourseAnalyticsQuery({});
  const { data: orderAnalytics, isLoading: isOrderAnalyticsLoading, error: orderAnalyticsError } = useGetOrderAnalyticsQuery({});

  if (isUserAnalyticsLoading || isCourseAnalyticsLoading || isOrderAnalyticsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (userAnalyticsError || courseAnalyticsError || orderAnalyticsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading analytics. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <AnalyticsUser userAnalytics={userAnalytics?.users} />
      <AnalyticsCourse courseAnalytics={courseAnalytics?.courses} />
      <AnalyticsOrder orderAnalytics={orderAnalytics?.orders} />
    </div>
  );
};

export default AdminPage;
