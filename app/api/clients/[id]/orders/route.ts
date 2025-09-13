// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\api\clients\[id]\orders\route.ts
// No major changes needed, but added safeguards for missing fields and ensured _id/clientId are strings.

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orders = await DatabaseService.getOrdersByClient(params.id)

    const formattedOrders = orders.map((order) => ({
      ...order,
      _id: order._id?.toString() || "",
      clientId: order.clientId?.toString() || "",
      totalAmount: order.totalAmount || 0,
      orderDate: order.orderDate?.toISOString() || new Date().toISOString(),
      paymentStatus: order.paymentStatus || "unknown",
      status: order.status || "unknown",
      iceCreams: order.iceCreams || [],
    }))

    return NextResponse.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error("Error fetching client orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch client orders" }, { status: 500 })
  }
}