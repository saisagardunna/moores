// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\api\clients\route.ts
// Fixed: Added null checks for client._id before toString() to resolve 'possibly undefined' errors.
// Ensured schedule and deadline are handled with fallbacks.

import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import type { Client } from "@/lib/models"

export async function GET() {
  try {
    const clients = await DatabaseService.getAllClients()

    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        if (!client._id) return null // Skip invalid clients
        const orders = await DatabaseService.getOrdersByClient(client._id.toString())
        const completedOrders = orders.filter((order) => order.paymentStatus === "completed")
        const unpaidOrders = orders.filter((order) => order.paymentStatus !== "completed")
        const totalOrders = orders.length
        const totalSpent = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        const totalOwed = unpaidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

        return {
          ...client,
          _id: client._id.toString(),
          totalOrders,
          totalSpent,
          totalOwed,
          lastOrderDate: orders.length > 0 ? new Date(orders[0].orderDate).toISOString() : undefined,
          schedule: client.schedule ?? undefined,
          deadline: client.deadline ? new Date(client.deadline).toISOString() : undefined,
        }
      })
    ).then(results => results.filter((result): result is NonNullable<typeof result> => result !== null))

    return NextResponse.json({ success: true, clients: clientsWithStats })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch clients" }, { status: 500 })
  }
}