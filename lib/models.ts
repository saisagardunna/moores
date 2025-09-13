// lib/models.ts
// Updated: Added totalOwed, schedule, deadline to Client interface to fix TypeScript errors.
// Ensured compatibility with existing Order, Payment, and added IceCreamFlavor, Revenue interfaces.
// Made _id optional where appropriate for creation scenarios.

import type { ObjectId } from "mongodb"

export interface IceCreamFlavor {
  name: string
  category: string
  quantity: number
}

export interface Client {
  _id?: ObjectId
  name: string
  phone: string
  stallName: string
  email?: string
  createdAt: Date
  updatedAt: Date
  totalOwed?: number
  schedule?: string
  deadline?: Date
}

export interface Order {
  _id?: ObjectId
  clientId: ObjectId
  clientName: string
  clientPhone: string
  stallName: string
  iceCreams: IceCreamFlavor[]
  totalAmount: number
  orderDate: Date
  deliveryDate?: Date
  paymentStatus: "pending" | "completed" | "overdue"
  paymentDeadline?: Date
  inquiryType: string
  message?: string
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  _id?: ObjectId
  orderId: ObjectId
  clientId: ObjectId
  amount: number
  status: "pending" | "completed" | "failed"
  paymentDate?: Date
  deadline: Date
  remindersSent: number
  createdAt: Date
  updatedAt: Date
}

export interface Revenue {
  _id?: ObjectId
  month: string
  year: number
  totalRevenue: number
  totalOrders: number
  completedPayments: number
  pendingPayments: number
  createdAt: Date
}