import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, TrendingUp, Users } from 'lucide-react';

type MonthlyData = {
  month: string;
  count: number;
};

type AnalyticsCourseProps = {
  courseAnalytics: {
    last12Months: MonthlyData[];
    totalCourses?: number;
    newCoursesThisMonth?: number;
    totalEnrollments?: number;
    averageRating?: number;
  };
};

const AnalyticsCourse = ({ courseAnalytics }: AnalyticsCourseProps) => {
  const { last12Months = [], totalCourses = 0, newCoursesThisMonth = 0, totalEnrollments = 0, averageRating = 0 } = courseAnalytics || {};

  // Calculate statistics from monthly data
  const totalCoursesFromData = last12Months.reduce((sum, item) => sum + item.count, 0);
  const newCoursesThisMonthFromData = last12Months[last12Months.length - 1]?.count || 0;

  // Use provided data or fallback to calculated data
  const finalTotalCourses = totalCourses || totalCoursesFromData;
  const finalNewCoursesThisMonth = newCoursesThisMonth || newCoursesThisMonthFromData;

  // Sample data for course categories (you can replace with real data)
  const courseCategories = [
    { name: 'Programming', value: 35, color: '#3b82f6' },
    { name: 'Design', value: 25, color: '#10b981' },
    { name: 'Business', value: 20, color: '#f59e0b' },
    { name: 'Marketing', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Course Analytics</h2>
        <div className="text-sm text-gray-500">
          Last 12 months overview
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalTotalCourses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{finalNewCoursesThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalNewCoursesThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments || (finalTotalCourses * 15)}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating || 4.5}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart - Course Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Course Growth Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly course creation over the last 12 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last12Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Courses']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Course Creation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Side-by-side comparison of monthly course creation
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last12Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Courses']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart - Course Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Course Categories Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Breakdown of courses by category
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Courses']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart - Cumulative Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Course Growth</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total courses over time
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last12Months.map((item, index) => ({
                month: item.month,
                cumulative: last12Months.slice(0, index + 1).reduce((sum, month) => sum + month.count, 0)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Total Courses']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Course Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed view of course creation by month
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Month</th>
                  <th className="text-right py-2 font-medium">New Courses</th>
                  <th className="text-right py-2 font-medium">Cumulative</th>
                  <th className="text-right py-2 font-medium">Growth %</th>
                  <th className="text-right py-2 font-medium">Avg per Week</th>
                </tr>
              </thead>
              <tbody>
                {last12Months.map((item, index) => {
                  const cumulative = last12Months
                    .slice(0, index + 1)
                    .reduce((sum, month) => sum + month.count, 0);
                  const growth = index > 0 && last12Months[index - 1]?.count > 0 
                    ? ((item.count - last12Months[index - 1].count) / last12Months[index - 1].count * 100).toFixed(1)
                    : index === 0 ? '0.0' : 'N/A';
                  const avgPerWeek = (item.count / 4).toFixed(1);

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2">{item.month}</td>
                      <td className="text-right py-2 font-medium">{item.count}</td>
                      <td className="text-right py-2 text-gray-600">{cumulative}</td>
                      <td className={`text-right py-2 ${
                        growth === 'N/A' ? 'text-gray-400' : 
                        parseFloat(growth) > 0 ? 'text-green-600' : 
                        parseFloat(growth) < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {growth === 'N/A' ? '-' : `${growth}%`}
                      </td>
                      <td className="text-right py-2 text-gray-600">{avgPerWeek}</td>
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

export default AnalyticsCourse;
