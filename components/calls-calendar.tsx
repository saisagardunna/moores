"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Phone, Clock, Trash2, CheckCircle, RefreshCw } from "lucide-react"
import { format } from "date-fns"

interface ScheduledCall {
    _id: string
    customerName: string
    customerPhone: string
    scheduledDate: string
    scheduledTime: string
    scheduledDateTime: string
    status: string
    createdAt: string
}

export function CallsCalendar() {
    const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())

    useEffect(() => {
        fetchScheduledCalls()
    }, [])

    const fetchScheduledCalls = async () => {
        try {
            const response = await fetch("/api/schedule-call")
            const data = await response.json()
            if (data.success && Array.isArray(data.calls)) {
                setScheduledCalls(data.calls)
            } else {
                console.warn("Invalid calls data:", data)
                setScheduledCalls([])
            }
        } catch (error) {
            console.error("Error fetching scheduled calls:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCall = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this scheduled call?")) return

        try {
            const response = await fetch(`/api/schedule-call/${id}`, {
                method: "DELETE",
            })
            const data = await response.json()
            if (data.success) {
                setScheduledCalls(prev => prev.filter(call => call._id !== id))
            }
        } catch (error) {
            console.error("Error deleting call:", error)
        }
    }

    const handleStatusChange = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "pending" ? "completed" : "pending"
        try {
            const response = await fetch(`/api/schedule-call/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            })
            const data = await response.json()
            if (data.success) {
                setScheduledCalls(prev => prev.map(call =>
                    call._id === id ? { ...call, status: newStatus } : call
                ))
            }
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const getCallsForDate = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd")
        return scheduledCalls.filter(call => call.scheduledDate === dateStr)
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return { daysInMonth, startingDayOfWeek, year, month }
    }

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate)

    const prevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse">Loading calendar...</div>
                </CardContent>
            </Card>
        )
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        Scheduled Calls Calendar
                    </CardTitle>
                    <button
                        onClick={fetchScheduledCalls}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        title="Refresh Calls"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <CardDescription>
                    View all upcoming customer calls
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={prevMonth}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                        ← Prev
                    </button>
                    <h3 className="text-lg font-semibold">
                        {monthNames[month]} {year}
                    </h3>
                    <button
                        onClick={nextMonth}
                        className="px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                        Next →
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="text-center font-semibold text-sm py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const currentDate = new Date(year, month, day)
                        const calls = getCallsForDate(currentDate)
                        const isToday = format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

                        return (
                            <div
                                key={day}
                                className={`
                  aspect-square p-2 border rounded-lg transition-all cursor-pointer
                  ${isToday ? "border-primary bg-primary/10 font-bold" : "border-muted"}
                  ${calls.length > 0 ? "bg-blue-50 dark:bg-blue-950" : ""}
                  hover:bg-accent hover:scale-105
                `}
                            >
                                <div className="text-sm">{day}</div>
                                {calls.length > 0 && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                        {calls.length} 📞
                                    </Badge>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Upcoming Calls List */}
                <div className="mt-8">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Upcoming Calls ({scheduledCalls.length})
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {scheduledCalls.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No scheduled calls yet
                            </p>
                        ) : (
                            scheduledCalls.map(call => (
                                <div
                                    key={call._id}
                                    className="p-4 border rounded-lg hover:bg-accent transition-colors animate-slide-up"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <p className="font-semibold">{call.customerName}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Phone className="w-3 h-3" />
                                                {call.customerPhone}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {new Date(call.scheduledDateTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge
                                                variant={call.status === "pending" ? "default" : "secondary"}
                                                className={`cursor-pointer ${call.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                                onClick={() => handleStatusChange(call._id, call.status)}
                                            >
                                                {call.status === "pending" ? "Pending" : "Completed"}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(call._id, call.status)}
                                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                    title={call.status === "pending" ? "Mark Completed" : "Mark Pending"}
                                                >
                                                    {call.status === "pending" ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Clock className="w-4 h-4 text-orange-500" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCall(call._id)}
                                                    className="p-1 hover:bg-red-100 rounded-full transition-colors" // Fixed red color bg
                                                    title="Delete Call"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
