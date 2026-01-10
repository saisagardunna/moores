import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid call ID" },
                { status: 400 }
            )
        }

        const { db } = await connectToDatabase()

        // Check if call exists
        const call = await db.collection("scheduled_calls").findOne({ _id: new ObjectId(id) })
        if (!call) {
            return NextResponse.json(
                { success: false, error: "Call not found" },
                { status: 404 }
            )
        }

        const result = await db.collection("scheduled_calls").deleteOne({
            _id: new ObjectId(id)
        })

        return NextResponse.json({
            success: true,
            message: "Call deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting call:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete call" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { status } = body

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid call ID" },
                { status: 400 }
            )
        }

        if (!status || !["pending", "completed"].includes(status)) {
            return NextResponse.json(
                { success: false, error: "Invalid status" },
                { status: 400 }
            )
        }

        const { db } = await connectToDatabase()

        const result = await db.collection("scheduled_calls").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Call not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Call status updated successfully",
        })
    } catch (error) {
        console.error("Error updating call status:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update call status" },
            { status: 500 }
        )
    }
}
