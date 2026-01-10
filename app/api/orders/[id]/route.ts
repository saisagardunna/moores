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
                { success: false, error: "Invalid order ID" },
                { status: 400 }
            )
        }

        const { db } = await connectToDatabase()

        const result = await db.collection("orders").deleteOne({
            _id: new ObjectId(id)
        })

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Order not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Order deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting order:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete order" },
            { status: 500 }
        )
    }
}
