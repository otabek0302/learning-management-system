import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

type MonthlyData = {
  month: string;
  count: number;
};

type AnalyticsUserProps = {
  userAnalytics: {
    last12Months: MonthlyData[];
    totalUsers?: number;
    newUsersThisMonth?: number;
    activeUsers?: number;
    inactiveUsers?: number;
  };
};

const AnalyticsUser = ({ userAnalytics }: AnalyticsUserProps) => {
  const { last12Months = [], totalUsers = 0, newUsersThisMonth = 0, activeUsers = 0 } = userAnalytics || {};

  // Calculate statistics from monthly data
  const totalUsersFromData = last12Months.reduce((sum, item) => sum + item.count, 0);
  const newUsersThisMonthFromData = last12Months[last12Months.length - 1]?.count || 0;
  const averageUsersPerMonth = Math.round(totalUsersFromData / 12);

  // Use provided data or fallback to calculated data
  const finalTotalUsers = totalUsers || totalUsersFromData;
  const finalNewUsersThisMonth = newUsersThisMonth || newUsersThisMonthFromData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Analytics</h2>
        <div className="text-sm text-gray-500">Last 12 months overview</div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalTotalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{finalNewUsersThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalNewUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers || averageUsersPerMonth}</div>
            <p className="text-xs text-muted-foreground">Average per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last12Months.length > 1 ? (((last12Months[last12Months.length - 1]?.count - last12Months[last12Months.length - 2]?.count) / Math.max(last12Months[last12Months.length - 2]?.count, 1)) * 100).toFixed(1) : 0}%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart - User Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly user registration over the last 12 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last12Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, "Users"]} labelFormatter={(label) => `Month: ${label}`} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly User Registration</CardTitle>
            <p className="text-sm text-muted-foreground">Side-by-side comparison of monthly registrations</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last12Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, "Users"]} labelFormatter={(label) => `Month: ${label}`} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed view of user registrations by month</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Month</th>
                  <th className="py-2 text-right font-medium">New Users</th>
                  <th className="py-2 text-right font-medium">Cumulative</th>
                  <th className="py-2 text-right font-medium">Growth %</th>
                </tr>
              </thead>
              <tbody>
                {last12Months.map((item, index) => {
                  const cumulative = last12Months.slice(0, index + 1).reduce((sum, month) => sum + month.count, 0);
                  const growth = index > 0 && last12Months[index - 1]?.count > 0 ? (((item.count - last12Months[index - 1].count) / last12Months[index - 1].count) * 100).toFixed(1) : index === 0 ? "0.0" : "N/A";

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2">{item.month}</td>
                      <td className="py-2 text-right font-medium">{item.count}</td>
                      <td className="py-2 text-right text-gray-600">{cumulative}</td>
                      <td className={`py-2 text-right ${growth === "N/A" ? "text-gray-400" : parseFloat(growth) > 0 ? "text-green-600" : parseFloat(growth) < 0 ? "text-red-600" : "text-gray-600"}`}>{growth === "N/A" ? "-" : `${growth}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsUser;
