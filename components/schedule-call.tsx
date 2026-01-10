"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, Phone, Clock, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScheduleCallProps {
    customerName: string
    customerPhone: string
}

export function ScheduleCall({ customerName, customerPhone }: ScheduleCallProps) {
    const [callDate, setCallDate] = useState("")
    const [callTime, setCallTime] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleScheduleCall = async () => {
        if (!callDate || !callTime) {
            toast({
                title: "Missing Information",
                description: "Please select both date and time for the call",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const scheduledDateTime = new Date(`${callDate}T${callTime}`)

            const response = await fetch("/api/schedule-call", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName,
                    customerPhone,
                    scheduledDate: callDate,
                    scheduledTime: callTime,
                    scheduledDateTime: scheduledDateTime.toISOString(),
                    notificationEmail: "saisagardunna04@gmail.com",
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: "Call Scheduled Successfully! 📞",
                    description: `We'll call you on ${new Date(scheduledDateTime).toLocaleString()}. A notification has been sent to the admin.`,
                })
                setCallDate("")
                setCallTime("")
            } else {
                throw new Error("Scheduling failed")
            }
        } catch (error) {
            toast({
                title: "Scheduling Failed",
                description: "Please try again or contact us directly.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="border-2 border-blue-500/30 animate-fade-in">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Schedule a Phone Call
                </CardTitle>
                <CardDescription>
                    Choose a convenient time for us to call you back
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="call-date" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date
                        </Label>
                        <Input
                            id="call-date"
                            type="date"
                            value={callDate}
                            onChange={(e) => setCallDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="call-time" className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Time
                        </Label>
                        <Input
                            id="call-time"
                            type="time"
                            value={callTime}
                            onChange={(e) => setCallTime(e.target.value)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleScheduleCall}
                    disabled={isSubmitting || !callDate || !callTime}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
                >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Scheduling..." : "Schedule Call"}
                </Button>

                {callDate && callTime && (
                    <div className="text-sm text-center text-muted-foreground animate-fade-in p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                        📅 We'll call you on {new Date(`${callDate}T${callTime}`).toLocaleString()}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
