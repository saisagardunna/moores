"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, RefreshCw, Calendar, Trash2 } from "lucide-react"
import { exportMultipleOrdersToExcel } from "@/lib/excel-export"
import Link from "next/link"
import styles from "@/components/ice-cream-effects.module.css"
import { AdminChatbot } from "@/components/admin-chatbot"

interface Order {
    _id: string
    name: string
    phone: string
    stallName: string
    deliveryDate: string
    iceCreams: Array<{ name: string; quantity: number; price?: number }>
    paymentMethod: string
    totalAmount: number
    inquiryType: string
    message: string
    createdAt: string
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([])
    const [calls, setCalls] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
        fetchCalls()
    }, [])

    const fetchCalls = async () => {
        try {
            const response = await fetch("/api/calls")
            const data = await response.json()
            if (data.success) {
                setCalls(data.calls || [])
            }
        } catch (error) {
            console.error("Error fetching calls:", error)
        }
    }

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/orders")
            const data = await response.json()
            if (data.success) {
                setOrders(data.orders || [])
            }
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteOrder = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return

        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: "DELETE",
            })
            const data = await response.json()

            if (data.success) {
                setOrders(prev => prev.filter(o => o._id !== id))
            } else {
                alert("Failed to delete order: " + (data.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Error deleting order:", error)
            alert("Error deleting order")
        }
    }

    const handleExportAll = () => {
        if (orders.length === 0) return

        exportMultipleOrdersToExcel(orders.map(order => ({
            name: order.name,
            phone: order.phone,
            stallName: order.stallName,
            deliveryDate: order.deliveryDate,
            iceCreams: order.iceCreams || [],
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount,
            inquiryType: order.inquiryType,
            message: order.message,
            createdAt: new Date(order.createdAt),
            status: 'Completed'
        })))
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Moore's Ice Cream - Order Management
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/calls">
                            <Button variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                View Calendar
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">{orders.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">PhonePe Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                                {orders.filter(o => o.paymentMethod === 'phonepe').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Cash on Delivery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {orders.filter(o => o.paymentMethod === 'cod').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">
                                ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Orders</CardTitle>
                                <CardDescription>View and manage all ice cream orders</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button onClick={fetchOrders} variant="outline">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                                <Button onClick={handleExportAll} disabled={orders.length === 0}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export All to Excel
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                                <p className="mt-4 text-muted-foreground">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground">No orders yet</p>
                                <p className="text-sm text-muted-foreground">Orders will appear here when customers place them</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order._id} className="border-2 hover:border-orange-500 transition-all relative">
                                        <button
                                            className={`${styles.deleteButton} absolute top-2 right-2 z-10`}
                                            onClick={() => handleDeleteOrder(order._id)}
                                            title="Delete Order"
                                        >
                                            <svg
                                                viewBox="0 0 1.625 1.625"
                                                className={styles.lidSvg}
                                                height="15"
                                                width="15"
                                            >
                                                <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"></path>
                                                <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"></path>
                                                <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"></path>
                                            </svg>
                                            <svg
                                                width="16"
                                                fill="none"
                                                viewBox="0 0 39 7"
                                                className={styles.linesSvg}
                                            >
                                                <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
                                                <line strokeWidth="3" stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1="12"></line>
                                            </svg>
                                            <svg width="16" fill="none" viewBox="0 0 33 39" className={styles.binSvg}>
                                                <mask fill="white" id={`path-1-inside-1_8_19-${order._id}`}>
                                                    <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                                                </mask>
                                                <path
                                                    mask={`url(#path-1-inside-1_8_19-${order._id})`}
                                                    fill="white"
                                                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                                ></path>
                                                <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
                                                <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
                                            </svg>
                                        </button>
                                        <CardContent className="pt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {/* Customer Info */}
                                                <div>
                                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Customer</h4>
                                                    <p className="font-bold">{order.name}</p>
                                                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                                                    <p className="text-sm text-muted-foreground">{order.stallName}</p>
                                                </div>

                                                {/* Order Details */}
                                                <div>
                                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Ice Creams</h4>
                                                    {order.iceCreams?.slice(0, 3).map((item, idx) => (
                                                        <p key={idx} className="text-sm">
                                                            {item.name} x{item.quantity}
                                                        </p>
                                                    ))}
                                                    {order.iceCreams?.length > 3 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +{order.iceCreams.length - 3} more
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Payment & Date */}
                                                <div>
                                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Payment & Delivery</h4>
                                                    <Badge variant={order.paymentMethod === 'phonepe' ? 'default' : 'secondary'} className="mb-2">
                                                        {order.paymentMethod === 'phonepe' ? '💳 PhonePe' : '💵 Cash on Delivery'}
                                                    </Badge>
                                                    <p className="text-sm">₹{order.totalAmount.toFixed(2)}</p>
                                                    <p className="text-sm text-muted-foreground">Delivery: {order.deliveryDate}</p>
                                                </div>

                                                {/* Order Date */}
                                                <div>
                                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Order Date</h4>
                                                    <p className="text-sm">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleTimeString()}
                                                    </p>
                                                    {order.message && (
                                                        <p className="text-xs text-muted-foreground mt-2 italic">
                                                            "{order.message.substring(0, 50)}{order.message.length > 50 ? '...' : ''}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Admin Chatbot */}
                <AdminChatbot orders={orders} calls={calls} />
            </div>
        </div>
    )
}
