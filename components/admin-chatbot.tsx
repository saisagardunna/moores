"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"

interface Message {
    role: "user" | "assistant"
    content: string
}

interface AdminChatbotProps {
    orders: any[]
    calls: any[]
}

export function AdminChatbot({ orders, calls }: AdminChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I can help you with information about today's orders, calls, and deliveries. What would you like to know?"
        }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const getTodayOrders = () => {
        const today = new Date().toDateString()
        return orders.filter(order => new Date(order.createdAt).toDateString() === today)
    }

    const getTodayCalls = () => {
        const today = new Date().toDateString()
        return calls.filter(call => new Date(call.scheduledDate).toDateString() === today)
    }

    const getTodayDeliveries = () => {
        const today = new Date().toDateString()
        return orders.filter(order => new Date(order.deliveryDate).toDateString() === today)
    }

    const generateContextualAnswer = (userMessage: string) => {
        const todayOrders = getTodayOrders()
        const todayCalls = getTodayCalls()
        const todayDeliveries = getTodayDeliveries()

        // Calculate Today's Stats
        const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

        // Calculate All-Time Stats
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        const allTimePhonePe = orders.filter(o => o.paymentMethod === 'phonepe').length
        const allTimeCod = orders.filter(o => o.paymentMethod === 'cod').length

        const context = {
            // Today's Data
            todayOrdersCount: todayOrders.length,
            todayCallsCount: todayCalls.length,
            todayDeliveriesCount: todayDeliveries.length,
            todayRevenue: todayRevenue.toFixed(2),
            todayPhonePe: todayOrders.filter(o => o.paymentMethod === 'phonepe').length,
            todayCod: todayOrders.filter(o => o.paymentMethod === 'cod').length,

            // All-Time Data
            totalOrdersCount: orders.length,
            totalCallsCount: calls.length,
            totalRevenue: totalRevenue.toFixed(2),
            allTimePhonePe: allTimePhonePe,
            allTimeCod: allTimeCod,

            // Raw Data (Limit to recent for token efficiency if needed, but passing all for now)
            // Raw Data Lists (Formatted for AI to read dates)
            formattedOrdersList: orders.slice(0, 100).map(o =>
                `[Date: ${new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, Delivery: ${o.deliveryDate}, Amount: ₹${o.totalAmount}, Payment: ${o.paymentMethod}, Name: ${o.name}]`
            ).join('\n'),
            formattedCallsList: calls.slice(0, 100).map(c =>
                `[Date: ${new Date(c.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, Status: ${c.status || 'pending'}, Name: ${c.customerName || c.name}]`
            ).join('\n')
        }

        return context
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setLoading(true)

        try {
            const context = generateContextualAnswer(userMessage)

            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    context: context
                })
            })

            const data = await response.json()

            if (data.success) {
                setMessages(prev => [...prev, { role: "assistant", content: data.response }])
            } else {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "Sorry, I couldn't process your request. Please try again."
                }])
            }
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "An error occurred. Please try again later."
            }])
        } finally {
            setLoading(false)
        }
    }

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50 cursor-pointer" onClick={() => setIsMinimized(false)}>
                <img
                    src="/Live chat bot.gif"
                    alt="Chat"
                    className="w-24 h-24 hover:scale-110 transition-transform duration-300"
                />
            </div>
        )
    }

    return (
        <Card className="fixed bottom-4 right-4 w-96 h-[600px] z-50 shadow-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-2">
                    <img src="/Live chat bot.gif" alt="Chat" className="w-8 h-8" />
                    <CardTitle>Admin Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)}>
                    <Minimize2 className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === "user"
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800"
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about orders, calls, deliveries..."
                        disabled={loading}
                    />
                    <Button onClick={handleSend} disabled={loading} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
