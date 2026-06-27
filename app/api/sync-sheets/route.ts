
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { syncOrdersToSheet } from "@/lib/google-sheets"

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        // Fetch all orders
        const orders = await db.collection("orders").find({}).sort({ createdAt: 1 }).toArray()

        // Sync to sheet
        await syncOrdersToSheet(orders)

        return NextResponse.json({ success: true, count: orders.length, message: "Orders synced to Google Sheet" })
    } catch (error) {
        console.error("Sync Error:", error)
        return NextResponse.json({ success: false, error: "Failed to sync" }, { status: 500 })
    }
}
