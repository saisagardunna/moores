// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\api\orders\route.ts
// Fixed: Added null check for order._id before toString() to resolve 'possibly undefined' error.

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, stallName, iceCreams, inquiryType, message } = body

    const validIceCreams = Array.isArray(iceCreams) ? iceCreams : []
    const totalAmount = validIceCreams.reduce((total: number, item: any) => {
      const basePrice = 200
      return total + basePrice * (item.quantity || 0)
    }, 0)

    const clientData = {
      name: name || "Unknown",
      phone: phone || "",
      stallName: stallName || "",
    }
    const clientId = await DatabaseService.createClient(clientData)

    const orderData = {
      clientId: new ObjectId(clientId),
      clientName: name || "Unknown",
      clientPhone: phone || "",
      stallName: stallName || "",
      iceCreams: validIceCreams,
      totalAmount,
      orderDate: new Date(),
      paymentStatus: "pending" as const,
      inquiryType: inquiryType || "General",
      message: message || "",
      status: "pending" as const,
    }

    const orderId = await DatabaseService.createOrder(orderData)

    const paymentDeadline = new Date()
    paymentDeadline.setDate(paymentDeadline.getDate() + 7)

    await DatabaseService.createPayment({
      orderId: new ObjectId(orderId),
      clientId: new ObjectId(clientId),
      amount: totalAmount,
      status: "pending",
      deadline: paymentDeadline,
      remindersSent: 0,
    })

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await DatabaseService.getAllOrders()
    const formattedOrders = orders.map((order) => ({
      ...order,
      _id: order._id ? order._id.toString() : "",
      clientId: order.clientId.toString(),
      clientPhone: order.clientPhone || "",
      stallName: order.stallName || "",
      totalAmount: order.totalAmount || 0,
      orderDate: order.orderDate ? new Date(order.orderDate).toISOString() : new Date(order.createdAt).toISOString(),
      paymentStatus: order.paymentStatus || "unknown",
      status: order.status || "unknown",
      iceCreams: order.iceCreams || [],
    }))
    return NextResponse.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}