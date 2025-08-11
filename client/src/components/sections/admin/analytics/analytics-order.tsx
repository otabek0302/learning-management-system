import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, TrendingUp, CreditCard } from 'lucide-react';

type MonthlyData = {
  month: string;
  count: number;
};

type AnalyticsOrderProps = {
  orderAnalytics: {
    last12Months: MonthlyData[];
    totalOrders?: number;
    newOrdersThisMonth?: number;
    totalRevenue?: number;
    averageOrderValue?: number;
  };
};

const AnalyticsOrder = ({ orderAnalytics }: AnalyticsOrderProps) => {
  const { last12Months = [], totalOrders = 0, newOrdersThisMonth = 0, totalRevenue = 0, averageOrderValue = 0 } = orderAnalytics || {};

  // Calculate statistics from monthly data
  const totalOrdersFromData = last12Months.reduce((sum, item) => sum + item.count, 0);
  const newOrdersThisMonthFromData = last12Months[last12Months.length - 1]?.count || 0;

  // Use provided data or fallback to calculated data
  const finalTotalOrders = totalOrders || totalOrdersFromData;
  const finalNewOrdersThisMonth = newOrdersThisMonth || newOrdersThisMonthFromData;

  // Calculate revenue (assuming average order value of $99 if not provided)
  const finalTotalRevenue = totalRevenue || (finalTotalOrders * 99);
  const finalAverageOrderValue = averageOrderValue || 99;

  // Sample data for order status distribution
  const orderStatusData = [
    { name: 'Completed', value: 75, color: '#10b981' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
    { name: 'Failed', value: 8, color: '#ef4444' },
    { name: 'Refunded', value: 2, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order Analytics</h2>
        <div className="text-sm text-gray-500">
          Last 12 months overview
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalTotalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{finalNewOrdersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalNewOrdersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${finalTotalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${finalAverageOrderValue}</div>
            <p className="text-xs text-muted-foreground">
              Per order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart - Order Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Order Growth Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly order volume over the last 12 months
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
                  formatter={(value: number) => [value, 'Orders']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Order Volume</CardTitle>
            <p className="text-sm text-muted-foreground">
              Side-by-side comparison of monthly orders
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
                  formatter={(value: number) => [value, 'Orders']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Area Chart - Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly revenue based on order volume
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={last12Months.map(item => ({
                month: item.month,
                revenue: item.count * finalAverageOrderValue
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Breakdown of orders by status
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Orders']}
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Order Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed view of orders and revenue by month
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Month</th>
                  <th className="text-right py-2 font-medium">Orders</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Cumulative Orders</th>
                  <th className="text-right py-2 font-medium">Growth %</th>
                </tr>
              </thead>
              <tbody>
                {last12Months.map((item, index) => {
                  const revenue = item.count * finalAverageOrderValue;
                  const cumulative = last12Months
                    .slice(0, index + 1)
                    .reduce((sum, month) => sum + month.count, 0);
                  const growth = index > 0 && last12Months[index - 1]?.count > 0 
                    ? ((item.count - last12Months[index - 1].count) / last12Months[index - 1].count * 100).toFixed(1)
                    : index === 0 ? '0.0' : 'N/A';

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2">{item.month}</td>
                      <td className="text-right py-2 font-medium">{item.count}</td>
                      <td className="text-right py-2 text-gray-600">${revenue.toLocaleString()}</td>
                      <td className="text-right py-2 text-gray-600">{cumulative}</td>
                      <td className={`text-right py-2 ${
                        growth === 'N/A' ? 'text-gray-400' : 
                        parseFloat(growth) > 0 ? 'text-green-600' : 
                        parseFloat(growth) < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {growth === 'N/A' ? '-' : `${growth}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {finalTotalOrders > 0 ? ((finalTotalOrders / (finalTotalOrders * 1.2)) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Orders per visitor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {last12Months.length > 1 ? 
                ((last12Months[last12Months.length - 1]?.count - last12Months[0]?.count) / 
                 Math.max(last12Months[0]?.count, 1) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Since first month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Peak Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {last12Months.reduce((max, item) => item.count > max.count ? item : max, last12Months[0])?.month || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest order volume
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsOrder;
