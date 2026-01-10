import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, stallName, iceCreams, deliveryDate, inquiryType, message, paymentMethod, totalAmount } = body

    const { db } = await connectToDatabase()

    const order = await db.collection("orders").insertOne({
      name,
      phone,
      stallName,
      iceCreams: iceCreams || [],
      deliveryDate,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || "cod",
      inquiryType: inquiryType || "order",
      message: message || "",
      status: "confirmed",
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      orderId: order.insertedId,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const formattedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      name: order.name || "",
      phone: order.phone || "",
      stallName: order.stallName || "",
      iceCreams: order.iceCreams || [],
      deliveryDate: order.deliveryDate || "",
      totalAmount: order.totalAmount || 0,
      paymentMethod: order.paymentMethod || "cod",
      inquiryType: order.inquiryType || "order",
      message: order.message || "",
      status: order.status || "confirmed",
      createdAt: order.createdAt ? order.createdAt.toISOString() : new Date().toISOString(),
    }))

    return NextResponse.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}