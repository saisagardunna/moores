import clientPromise from "./mongodb"
import type { Client, Order, Payment } from "./models"
import { ObjectId, WithId } from "mongodb"

const DB_NAME = "moores_icecream"

export class DatabaseService {
  static async getDatabase() {
    const client = await clientPromise
    return client.db(DB_NAME)
  }

  // Client operations
  static async createClient(clientData: Omit<Client, "_id" | "createdAt" | "updatedAt">): Promise<string> {
    const db = await this.getDatabase()
    const client: Client = {
      ...clientData,
      totalOwed: clientData.totalOwed ?? 0,
      schedule: clientData.schedule ?? undefined,
      deadline: clientData.deadline ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection<Client>("clients").insertOne(client)
    return result.insertedId.toString()
  }

  static async getClient(clientId: string): Promise<Client | null> {
    const db = await this.getDatabase()
    return await db.collection<Client>("clients").findOne({ _id: new ObjectId(clientId) })
  }

  static async getAllClients(): Promise<Client[]> {
    const db = await this.getDatabase()
    return await db.collection<Client>("clients").find({}).sort({ createdAt: -1 }).toArray()
  }

  static async updateClient(clientId: string, updateData: Partial<Client>): Promise<Client | null> {
    const db = await this.getDatabase()
    const update: Partial<Client> = {
      ...updateData,
      totalOwed: updateData.totalOwed ?? 0,
      schedule: updateData.schedule ?? undefined,
      deadline: updateData.deadline ? new Date(updateData.deadline) : undefined,
      updatedAt: new Date(),
    }
    const result = await db
      .collection<Client>("clients")
      .findOneAndUpdate(
        { _id: new ObjectId(clientId) },
        { $set: update },
        { returnDocument: "after" }
      )
    return (result as WithId<Client> | null) ?? null
  }

  // Order operations
  static async createOrder(orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">): Promise<string> {
    const db = await this.getDatabase()
    const order: Order = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection<Order>("orders").insertOne(order)
    return result.insertedId.toString()
  }

  static async getAllOrders(): Promise<Order[]> {
    const db = await this.getDatabase()
    return await db.collection<Order>("orders").find({}).sort({ createdAt: -1 }).toArray()
  }

  static async getOrdersByClient(clientId: string): Promise<Order[]> {
    const db = await this.getDatabase()
    return await db
      .collection<Order>("orders")
      .find({ clientId: new ObjectId(clientId) })
      .sort({ orderDate: -1 })
      .toArray()
  }

  static async updateOrder(orderId: string, updateData: Partial<Order>): Promise<Order | null> {
    const db = await this.getDatabase()
    const result = await db
      .collection<Order>("orders")
      .findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: "after" }
      )
    return (result as WithId<Order> | null) ?? null
  }

  // Payment operations
  static async createPayment(paymentData: Omit<Payment, "_id" | "createdAt" | "updatedAt">): Promise<string> {
    const db = await this.getDatabase()
    const payment: Payment = {
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection<Payment>("payments").insertOne(payment)
    return result.insertedId.toString()
  }

  static async getOverduePayments(): Promise<Payment[]> {
    const db = await this.getDatabase()
    const now = new Date()
    return await db
      .collection<Payment>("payments")
      .find({
        status: "pending",
        deadline: { $lt: now },
      })
      .toArray()
  }

  static async updatePaymentStatus(paymentId: string, status: "pending" | "completed" | "failed"): Promise<Payment | null> {
    const db = await this.getDatabase()
    const result = await db
      .collection<Payment>("payments")
      .findOneAndUpdate(
        { _id: new ObjectId(paymentId) },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: "after" }
      )
    return (result as WithId<Payment> | null) ?? null
  }

  // Revenue operations
  static async getMonthlyRevenue(year: number, month: number): Promise<{ month: string; year: number; totalRevenue: number; totalOrders: number; orders: Order[] }> {
    const db = await this.getDatabase()
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const orders = await db
      .collection<Order>("orders")
      .find({
        orderDate: { $gte: startDate, $lte: endDate },
        paymentStatus: "completed",
      })
      .toArray()

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    return {
      month: `${year}-${month.toString().padStart(2, "0")}`,
      year,
      totalRevenue,
      totalOrders: orders.length,
      orders,
    }
  }

  static async getYearlyRevenue(year: number): Promise<{ month: string; year: number; totalRevenue: number; totalOrders: number; orders: Order[] }[]> {
    const monthlyData: { month: string; year: number; totalRevenue: number; totalOrders: number; orders: Order[] }[] = []
    for (let month = 1; month <= 12; month++) {
      const data = await this.getMonthlyRevenue(year, month)
      if (data.totalOrders > 0) {
        monthlyData.push(data)
      }
    }
    return monthlyData
  }
}