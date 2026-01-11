// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\api\send-order-email\route.ts
// Fixed: Added better error handling for fetch response, ensured email content is escaped if needed (but plain text is fine).

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, selectedFlavors, inquiryType, message } = body

    // Prepare email content
    const emailContent = {
      access_key: "04af488a-752c-4a97-905b-1fcd534bca2d",
      subject: `New Ice Cream Order from ${name}`,
      from_name: "Moores Ice Cream Website",
      to: "moores1807@gmail.com",
      message: `
New Order Details:
==================

Customer Information:
- Name: ${name || "Not provided"}
- Phone: ${phone || "Not provided"}
- Email: ${email || "Not provided"}

Order Details:
- Inquiry Type: ${inquiryType || "General"}
- Selected Flavors: ${Array.isArray(selectedFlavors) && selectedFlavors.length > 0 ? selectedFlavors.join(", ") : "None selected"}

Additional Message:
${message || "No additional message"}

==================
This order was submitted through the Moores Ice Cream website.
Please contact the customer to confirm the order details and arrange delivery.
      `.trim(),
    }

    // Send email via Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(emailContent),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to send email`)
    }

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({ success: true, message: "Order email sent successfully" })
    } else {
      throw new Error(result.message || "Failed to send email")
    }
  } catch (error) {
    console.error("Error sending order email:", error)
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to send order email" }, { status: 500 })
  }
}