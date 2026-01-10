import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface OrderData {
    name: string
    phone: string
    stallName: string
    deliveryDate: string
    iceCreams: Array<{ name: string; quantity: number }>
    paymentMethod: string
    totalAmount: number
    inquiryType: string
    message: string
    createdAt: Date
    status?: string
}

export function generateOrderPDF(orderData: OrderData) {
    const doc = new jsPDF()

    // Add company header
    doc.setFontSize(20)
    doc.setTextColor(255, 140, 0) // Orange color
    doc.text("Moore's Ice Cream", 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Order Receipt', 105, 30, { align: 'center' })

    // Add date
    doc.setFontSize(10)
    doc.text(`Date: ${new Date(orderData.createdAt).toLocaleString()}`, 14, 40)

    // Customer Information
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Customer Information', 14, 55)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    let yPos = 65
    doc.text(`Name: ${orderData.name}`, 14, yPos)
    yPos += 7
    doc.text(`Phone: ${orderData.phone}`, 14, yPos)
    yPos += 7
    doc.text(`Stall Name: ${orderData.stallName}`, 14, yPos)
    yPos += 7
    doc.text(`Delivery Date: ${orderData.deliveryDate}`, 14, yPos)

    // Order Details Table
    yPos += 15
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Order Details', 14, yPos)

    // Prepare table data
    const tableData = orderData.iceCreams.map((item, index) => [
        index + 1,
        item.name,
        item.quantity,
        `₹230`,
        `₹${(item.quantity * 230).toFixed(2)}`
    ])

    autoTable(doc, {
        startY: yPos + 5,
        head: [['#', 'Ice Cream Flavor', 'Quantity', 'Price/Unit', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [255, 140, 0] },
        foot: [[
            '', '', '', 'Total Amount:', `₹${orderData.totalAmount.toFixed(2)}`
        ]],
        footStyles: { fillColor: [255, 140, 0], fontStyle: 'bold' }
    })

    // Payment Information
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 60
    yPos = finalY + 15

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Payment Information', 14, yPos)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    yPos += 10
    const paymentMethodText = orderData.paymentMethod === 'phonepe' ? 'PhonePe (Paid)' : 'Cash on Delivery'
    doc.text(`Payment Method: ${paymentMethodText}`, 14, yPos)
    yPos += 7
    doc.text(`Status: ${orderData.status || 'Confirmed'}`, 14, yPos)

    // Additional Information
    if (orderData.message) {
        yPos += 15
        doc.setFont('helvetica', 'bold')
        doc.text('Additional Notes:', 14, yPos)
        doc.setFont('helvetica', 'normal')
        yPos += 7
        const splitMessage = doc.splitTextToSize(orderData.message, 180)
        doc.text(splitMessage, 14, yPos)
    }

    // Footer
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Thank you for choosing Moore\'s Ice Cream!', 105, 280, { align: 'center' })
    doc.text('For any queries, contact: 6309312041 | chvamshi482@gmail.com', 105, 287, { align: 'center' })

    // Generate filename with timestamp
    const fileName = `Order_${orderData.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`

    // Download PDF
    doc.save(fileName)

    return fileName
}
