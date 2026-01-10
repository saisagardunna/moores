"use client"

import { CallsCalendar } from "@/components/calls-calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
                        <CardDescription>
                            Manage your ice cream orders and scheduled customer calls
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            View all scheduled calls below and manage your customer communications
                        </p>
                    </CardContent>
                </Card>

                <CallsCalendar />
            </div>
        </div>
    )
}
