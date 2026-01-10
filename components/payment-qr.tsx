"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, Wallet, CreditCard, Banknote, DollarSign, CheckCircle } from "lucide-react"
import styles from "./payment-button.module.css"

interface PaymentQRProps {
    amount: number
    orderDetails: string
    onPaymentComplete?: () => void
    customerEmail?: string
    orderData?: any
}

export function PaymentQR({ amount, orderDetails, onPaymentComplete, customerEmail, orderData }: PaymentQRProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [showQR, setShowQR] = useState(false)

    const handlePaymentClick = async () => {
        setIsProcessing(true)

        try {
            // Directly trigger the order submission
            // This will call the handleSubmit in contact-section.tsx
            // which sends to /api/submit-order (MongoDB + Gmail + Web3Forms)
            console.log("Payment confirmed - submitting order...")

            if (onPaymentComplete) {
                onPaymentComplete()
            }

            setIsProcessing(false)
        } catch (error) {
            console.error("Payment error:", error)
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-4">
            {!showQR ? (
                <Button
                    onClick={() => setShowQR(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                    size="lg"
                >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Pay with PhonePe
                </Button>
            ) : (
                <Card className="border-2 border-purple-500/50">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Smartphone className="w-6 h-6 text-purple-600" />
                            Scan to Pay with PhonePe
                        </CardTitle>
                        <CardDescription>
                            <Badge variant="secondary" className="text-lg font-bold mt-2">
                                ₹{amount.toFixed(2)}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                            <Image
                                src="/Photo.jpeg"
                                alt="PhonePe QR Code Scanner"
                                width={300}
                                height={300}
                                className="rounded-lg"
                                priority
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Scan this QR code with PhonePe app
                            </p>
                        </div>

                        <button
                            onClick={handlePaymentClick}
                            className={styles.payBtn}
                            disabled={isProcessing}
                        >
                            <div className={styles.iconContainer}>
                                <Wallet className={`${styles.icon} ${styles.walletIcon} ${styles.defaultIcon}`} />
                                <CreditCard className={`${styles.icon} ${styles.cardIcon}`} />
                                <Banknote className={`${styles.icon} ${styles.paymentIcon}`} />
                                <DollarSign className={`${styles.icon} ${styles.dollarIcon}`} />
                                <CheckCircle className={`${styles.icon} ${styles.checkIcon}`} />
                            </div>
                            <span className={styles.btnText}>
                                {isProcessing ? "Processing..." : "Complete Payment"}
                            </span>
                        </button>

                        <p className="text-xs text-center text-muted-foreground">
                            Confirmation will be sent to email
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
