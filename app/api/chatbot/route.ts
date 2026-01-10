import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { message, context } = await request.json()

        const systemPrompt = `You are an admin assistant for Moore's Ice Cream. You have access to today's data:
- Total orders today: ${context.todayOrdersCount}
- Total calls scheduled today: ${context.todayCallsCount}
- Deliveries for today: ${context.todayDeliveriesCount}
- Today's revenue: ₹${context.totalRevenue}
- PhonePe payments: ${context.phonePeCount}
- Cash on Delivery: ${context.codCount}

You MUST ONLY answer questions related to:
1. Today's orders (count, revenue, payment methods)
2. Today's scheduled calls
3. Today's deliveries
4. Order and call statistics

If asked about anything else, politely decline and say you can only help with order and call information.
Be concise, professional, and helpful. Use bullet points when listing multiple items.`

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        })

        if (!response.ok) {
            throw new Error("Failed to get response from Groq API")
        }

        const data = await response.json()
        const aiResponse = data.choices[0]?.message?.content || "I couldn't generate a response."

        return NextResponse.json({
            success: true,
            response: aiResponse
        })
    } catch (error) {
        console.error("Chatbot error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to process request" },
            { status: 500 }
        )
    }
}
