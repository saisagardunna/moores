import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { message, context } = await request.json()

        const systemPrompt = `You are an admin assistant for Moore's Ice Cream. You have access to the following business data:
        
TODAY'S OVERVIEW:
- Orders today: ${context.todayOrdersCount}
- Calls scheduled today: ${context.todayCallsCount}
- Deliveries due today: ${context.todayDeliveriesCount}
- Revenue today: ₹${context.todayRevenue}
- Today's Payments: PhonePe (${context.todayPhonePe}), COD (${context.todayCod})

ALL-TIME / TOTAL STATISTICS:
- Total All-Time Orders: ${context.totalOrdersCount}
- Total All-Time Calls: ${context.totalCallsCount}
- Total All-Time Revenue: ₹${context.totalRevenue}
- All-Time Payments: PhonePe (${context.allTimePhonePe}), COD (${context.allTimeCod})

DETAILED LOGS (Last 100 entries):
Orders Log:
${context.formattedOrdersList}

Calls Log:
${context.formattedCallsList}

INSTRUCTIONS:
1. If the user asks for "total orders", "all orders", or "overall stats", use the ALL-TIME data.
2. If the user explicitly asks for "today", use TODAY'S data.
3. If the user asks for a SPECIFIC DATE (e.g., "orders on Jan 12th"), search the "Orders Log" or "Calls Log" provided above and summarize the data for that specific date.
4. If unspecified (e.g., "how many orders?"), provide BOTH today's count and the all-time total for better context.
5. You can also answer specific questions about recent orders if asked.

Be concise, professional, and helpful. Use bullet points for clarity.`

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
