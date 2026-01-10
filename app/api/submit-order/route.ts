import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { transporter, mailOptions } from "@/lib/nodemailer"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      phone,
      stallName,
      iceCreams,
      deliveryDate,
      inquiryType,
      message,
      paymentMethod,
      totalAmount,
    } = body

    // 1. Save Order to Database
    const { db } = await connectToDatabase()
    const order = await db.collection("orders").insertOne({
      name,
      phone,
      stallName,
      iceCreams,
      deliveryDate,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || "cod",
      inquiryType: inquiryType || "order",
      message: message || "",
      status: "pending",
      createdAt: new Date(),
    })

    // 2. Prepare Email Content
    const items = Array.isArray(iceCreams)
      ? iceCreams
        .map((i: any) => `- ${i.name} (Qty:${i.quantity}, ₹${i.price})`)
        .join("\n")
      : "None"

    const emailText = `
NEW ORDER RECEIVED
------------------
Name: ${name}
Phone: ${phone}
Stall: ${stallName}
Date: ${deliveryDate}

Items:
${items}

Total: ₹${totalAmount || 0}
Payment: ${paymentMethod}
Message: ${message || "None"}

Order ID: ${order.insertedId}
    `.trim()

    const emailHtml = `
      <h2>🍦 New Order Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Stall:</strong> ${stallName}</p>
      <p><strong>Date:</strong> ${deliveryDate}</p>
      
      <h3>Items:</h3>
      <pre>${items}</pre>
      
      <p><strong>Total:</strong> ₹${totalAmount || 0}</p>
      <p><strong>Payment:</strong> ${paymentMethod}</p>
      <p><strong>Message:</strong> ${message || "None"}</p>
      
      <hr />
      <p>Order ID: ${order.insertedId}</p>
    `

    // 3. Send Email using Nodemailer
    let emailSent = false

    // Checks if environment variables are set before trying
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: "chvamshi482@gmail.com", // Receiver
          subject: `Order: ${name} - ₹${totalAmount}`,
          text: emailText, // Fallback plain text
          html: emailHtml, // HTML version
        })
        emailSent = true
      } catch (error) {
        console.error("Nodemailer Error:", error)
      }
    } else {
      console.warn("Skipping email: EMAIL_USER or EMAIL_PASS not set in .env.local")
    }

    // 4. Return Response
    return NextResponse.json({
      success: true,
      orderId: order.insertedId,
      message: "Order placed successfully",
      emailSent,
    })

  } catch (error: any) {
    console.error("Order API Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
