import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { transporter, mailOptions } from "@/lib/nodemailer"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {
            customerName,
            customerPhone,
            scheduledDate,
            scheduledTime,
            scheduledDateTime,
            notificationEmail,
        } = body

        // 1. Save Call to MongoDB
        const { db } = await connectToDatabase()
        const call = await db.collection("scheduled_calls").insertOne({
            customerName,
            customerPhone,
            scheduledDate,
            scheduledTime,
            scheduledDateTime: new Date(scheduledDateTime),
            notificationEmail,
            status: "pending",
            createdAt: new Date(),
        })

        // 2. Prepare Email Content
        const formattedDate = new Date(scheduledDateTime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
        })

        const emailText = `
NEW CALL SCHEDULED
------------------
Name: ${customerName}
Phone: ${customerPhone}

Date: ${scheduledDate}
Time: ${scheduledTime}
Full: ${formattedDate}

Call ID: ${call.insertedId}
        `.trim()

        const emailHtml = `
            <h2>📞 New Call Scheduled</h2>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <br/>
            <p><strong>Date:</strong> ${scheduledDate}</p>
            <p><strong>Time:</strong> ${scheduledTime}</p>
            <p><strong>Full Date:</strong> ${formattedDate}</p>
            <hr />
            <p>Call ID: ${call.insertedId}</p>
        `

        // 3. Send Email via Nodemailer
        let emailSent = false

        try {
            const recipients = ["moores1807@gmail.com"]
            if (notificationEmail) recipients.push(notificationEmail)

            await transporter.sendMail({
                ...mailOptions,
                to: recipients.join(","),
                subject: `📞 Call Scheduled - ${customerName}`,
                text: emailText,
                html: emailHtml,
            })
            emailSent = true
        } catch (err) {
            console.error("❌ Nodemailer scheduling error:", err)
        }

        return NextResponse.json({
            success: true,
            callId: call.insertedId,
            emailSent,
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to schedule call" },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { db } = await connectToDatabase()
        const upcomingCalls = await db
            .collection("scheduled_calls")
            .find({})
            .sort({ scheduledDateTime: 1 })
            .toArray()

        return NextResponse.json({
            success: true,
            calls: upcomingCalls,
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch calls" },
            { status: 500 }
        )
    }
}
