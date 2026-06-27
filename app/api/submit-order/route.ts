import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { transporter, mailOptions } from "@/lib/nodemailer"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      phone,
      stallName,
      iceCreams,
      deliveryDate,
      inquiryType,
      message,
      paymentMethod,
      totalAmount,
      location,
      addressDetails,
    } = body

    // 1. Save Order to Database
    const { db } = await connectToDatabase()
    const order = await db.collection("orders").insertOne({
      name,
      email,
      phone,
      stallName,
      iceCreams,
      deliveryDate,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || "cod",
      inquiryType: inquiryType || "order",
      message: message || "",
      addressDetails: addressDetails || "", // Extra landmarks/house info
      location: location || null, // Store client location { latitude, longitude }
      status: "pending",
      createdAt: new Date(),
    })

    // 2. Reverse Geocode to get address (Optional but very helpful for "Address Link")
    let displayAddress = "No address found"
    if (location) {
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`,
          { headers: { 'User-Agent': 'MooresIceCreamOrderSystem/1.0' } }
        )
        const geoData = await geoResponse.json()
        displayAddress = geoData.display_name || "Address not found"
      } catch (e) {
        console.error("Reverse geocoding failed:", e)
        displayAddress = "Error retrieving address"
      }
    }

    // 3. Prepare Email Content
    const items = Array.isArray(iceCreams)
      ? iceCreams
        .map((i: any) => `- ${i.name} (Qty:${i.quantity}, ₹${i.price})`)
        .join("\n")
      : "None"

    const mapsLink = location
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : ""

    const locationText = location
      ? `\nAddress: ${displayAddress}\nLandmarks/House: ${addressDetails || "None"}\nCoordinates: ${location.latitude}, ${location.longitude}\nMaps Link: ${mapsLink}`
      : "\nLocation: Not provided"

    const emailText = `
NEW ORDER RECEIVED
------------------
Name: ${name}
Phone: ${phone}
Stall: ${stallName}
Date: ${deliveryDate}${locationText}

Items:
${items}

Total: ₹${totalAmount || 0}
Payment: ${paymentMethod}
Message: ${message || "None"}

Order ID: ${order.insertedId}
    `.trim()

    const locationHtml = location
      ? `
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; border: 1px solid #cce3ff; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;"><strong>🏠 Delivery Address:</strong><br/>${displayAddress}</p>
          <p style="margin: 0 0 10px 0; color: #d35400;"><strong>📍 Landmarks / House Info:</strong> ${addressDetails || "No extra details"}</p>
          <p style="margin: 0 0 15px 0; color: #666; font-size: 12px;">Coordinates: ${location.latitude}, ${location.longitude}</p>
          <a href="${mapsLink}" target="_blank" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            📍 Open in Google Maps
          </a>
        </div>
      `
      : `<p style="color: #ff4444;"><strong>📍 Location:</strong> Not provided by customer</p>`

    const emailHtml = `
      <h2>🍦 New Order Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Stall:</strong> ${stallName}</p>
      <p><strong>Date:</strong> ${deliveryDate}</p>
      ${locationHtml}
      
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

    try {
      const recipients = ["moores1807@gmail.com"]
      if (email) recipients.push(email)

      await transporter.sendMail({
        ...mailOptions,
        to: recipients.join(","),
        subject: `Order Confirmation: ${name} - ₹${totalAmount}`,
        text: emailText, // Fallback plain text
        html: emailHtml, // HTML version
      })
      emailSent = true
    } catch (error) {
      console.error("Nodemailer Error:", error)
    }

    // 4. Send Data to Make.com (Automation)
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.insertedId,
            name,
            phone,
            stallName,
            deliveryDate,
            items: iceCreams,
            totalAmount,
            paymentMethod,
            message,
            address: {
              display: displayAddress,
              details: addressDetails,
              coordinates: location ? `${location.latitude},${location.longitude}` : null,
              mapLink: mapsLink
            },
            status: "pending",
            createdAt: new Date().toISOString()
          })
        });
        console.log("Order data sent to Make.com");
      } catch (webhookError) {
        console.error("Make.com Webhook Error:", webhookError);
        // We don't fail the request if the webhook fails, just log it
      }
    }

    // 5. Send Data to Google Sheet
    try {
      const { appendOrderToSheet } = await import("@/lib/google-sheets");
      await appendOrderToSheet({
        _id: order.insertedId,
        name,
        phone,
        stallName,
        iceCreams,
        totalAmount,
        paymentMethod: paymentMethod || "cod",
        status: "pending",
        createdAt: new Date(),
        location,
        addressDetails,
        message
      });
    } catch (sheetError) {
      console.error("Google Sheet Sync Error:", sheetError);
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
