// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\api\clients\[id]\route.ts
// Fixed: Added null checks for _id before calling toString() to resolve 'possibly undefined' errors.
// Ensured formattedClient includes optional fields with fallbacks for consistency.

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import type { Client } from "@/lib/models"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, phone, stallName, email, totalOwed, schedule, deadline } = body

    const updatedClient = await DatabaseService.updateClient(params.id, {
      name,
      phone,
      stallName,
      email,
      totalOwed: Number(totalOwed) || 0,
      schedule: schedule || undefined,
      deadline: deadline ? new Date(deadline) : undefined,
    })

    if (!updatedClient) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      client: {
        ...updatedClient,
        _id: updatedClient._id ? updatedClient._id.toString() : "",
        createdAt: updatedClient.createdAt.toISOString(),
        updatedAt: updatedClient.updatedAt.toISOString(),
        deadline: updatedClient.deadline ? new Date(updatedClient.deadline).toISOString() : undefined,
      },
    })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ success: false, error: "Failed to update client" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await DatabaseService.getClient(params.id)
    if (!client) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 })
    }
    const formattedClient = {
      ...client,
      _id: client._id ? client._id.toString() : "",
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      deadline: client.deadline ? new Date(client.deadline).toISOString() : undefined,
    }
    return NextResponse.json({ success: true, client: formattedClient })
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json({ success: false, error: "Failed to update client" }, { status: 500 })
  }
}