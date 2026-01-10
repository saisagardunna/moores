"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar } from "lucide-react"

interface RevenueData {
  month: string
  year: number
  totalRevenue: number
  totalOrders: number
  orders: any[]
}

interface FlavorData {
  name: string
  quantity: number
  revenue: number
  color: string
}

interface TotalStats {
  totalRevenue: number
  totalOrders: number
  totalClients: number
  avgOrderValue: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

export function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [flavorData, setFlavorData] = useState<FlavorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalStats, setTotalStats] = useState<TotalStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
    avgOrderValue: 0,
  })

  useEffect(() => {
    fetchAnalytics()
  }, [selectedYear])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?year=${selectedYear}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch analytics`)
      const data = await response.json()
      console.log("Fetched analytics:", data)

      if (data.success) {
        setRevenueData(data.monthlyData || [])
        setFlavorData(data.flavorAnalytics || [])
        setTotalStats(data.totalStats || {
          totalRevenue: 0,
          totalOrders: 0,
          totalClients: 0,
          avgOrderValue: 0,
        })
      } else {
        throw new Error(data.error || "Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`
  }

  const getGrowthPercentage = () => {
    if (revenueData.length < 2) return 0
    const currentMonth = revenueData[revenueData.length - 1]?.totalRevenue || 0
    const previousMonth = revenueData[revenueData.length - 2]?.totalRevenue || 0
    if (previousMonth === 0) return 0
    return (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1)
  }

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Revenue Analytics</h2>
          <p className="text-muted-foreground">Track your business performance and growth</p>
        </div>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, 2026].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {Number.parseFloat(getGrowthPercentage()) >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              {getGrowthPercentage()}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{selectedYear} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStats.avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue and order count by month for {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Revenue Data Yet</h3>
              <p>Revenue charts will appear here once you have completed orders.</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-")
                      return new Date(Number.parseInt(year), Number.parseInt(month) - 1).toLocaleDateString("en-US", {
                        month: "short",
                      })
                    }}
                  />
                  <YAxis yAxisId="revenue" orientation="left" tickFormatter={(value) => `₹${String(value)}`} />
                  <YAxis yAxisId="orders" orientation="right" tickFormatter={(value) => String(value)} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      name === "totalRevenue" ? formatCurrency(value as number) : value,
                      name === "totalRevenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="totalOrders"
                    stroke="var(--color-orders)"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Breakdown</CardTitle>
            <CardDescription>Bar chart view of monthly performance</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No data available</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-")
                        return new Date(Number.parseInt(year), Number.parseInt(month) - 1).toLocaleDateString("en-US", {
                          month: "short",
                        })
                      }}
                    />
                    <YAxis tickFormatter={(value) => `₹${String(value)}`} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                    />
                    <Bar dataKey="totalRevenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Ice Cream Flavors</CardTitle>
            <CardDescription>Best selling flavors by quantity and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {flavorData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No flavor data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={flavorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="quantity"
                      >
                        {flavorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [`${value} units`, "Sold"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="space-y-2">
                  {flavorData.slice(0, 5).map((flavor, index) => (
                    <div key={flavor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{flavor.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{flavor.quantity} units</Badge>
                        <p className="text-xs text-muted-foreground">{formatCurrency(flavor.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}