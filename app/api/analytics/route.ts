// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\api\analytics\route.ts
// Fixed: Added client filtering for completed orders, ensured all fields are strings/numbers, added error handling for missing data.

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())

    // Get monthly revenue data
    const monthlyData = await DatabaseService.getYearlyRevenue(year)

    // Get all orders for flavor analysis
    const allOrders = await DatabaseService.getAllOrders()
    const completedOrders = allOrders.filter((order) => order.paymentStatus === "completed")

    // Calculate flavor analytics
    const flavorStats: { [key: string]: { quantity: number; revenue: number } } = {}

    completedOrders.forEach((order) => {
      const totalQuantity = order.iceCreams.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
      if (totalQuantity === 0) return // Skip if no items

      const pricePerUnit = order.totalAmount / totalQuantity

      order.iceCreams.forEach((iceCream: any) => {
        const flavorName = iceCream.name || "Unknown"
        if (!flavorStats[flavorName]) {
          flavorStats[flavorName] = { quantity: 0, revenue: 0 }
        }
        const qty = iceCream.quantity || 0
        flavorStats[flavorName].quantity += qty
        flavorStats[flavorName].revenue += pricePerUnit * qty
      })
    })

    const flavorAnalytics = Object.entries(flavorStats)
      .map(([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: Math.round(stats.revenue),
        color: "#8884d8",
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // Calculate total stats
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const totalOrders = completedOrders.length
    const uniqueClients = new Set(completedOrders.map((order) => order.clientId?.toString() || "")).size
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    const totalStats = {
      totalRevenue,
      totalOrders,
      totalClients: uniqueClients,
      avgOrderValue,
    }

    return NextResponse.json({
      success: true,
      monthlyData,
      flavorAnalytics,
      totalStats,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}