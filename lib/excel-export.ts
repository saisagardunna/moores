import * as XLSX from 'xlsx'

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

export function exportOrderToExcel(orderData: OrderData) {
    // Prepare data for Excel
    const excelData = [
        {
            'Order Date': new Date(orderData.createdAt).toLocaleString(),
            'Customer Name': orderData.name,
            'Phone Number': orderData.phone,
            'Stall Name': orderData.stallName,
            'Delivery Date': orderData.deliveryDate,
            'Ice Creams': orderData.iceCreams.map(ic => `${ic.name}(${ic.quantity})`).join(', '),
            'Payment Method': orderData.paymentMethod === 'phonepe' ? 'PhonePe' : 'Cash on Delivery',
            'Total Amount': `₹${orderData.totalAmount}`,
            'Inquiry Type': orderData.inquiryType,
            'Additional Message': orderData.message || 'N/A',
            'Status': orderData.status || 'Completed'
        }
    ]

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const columnWidths = [
        { wch: 20 }, // Order Date
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone Number
        { wch: 20 }, // Stall Name
        { wch: 15 }, // Delivery Date
        { wch: 40 }, // Ice Creams
        { wch: 18 }, // Payment Method
        { wch: 15 }, // Total Amount
        { wch: 15 }, // Inquiry Type
        { wch: 30 }, // Additional Message
        { wch: 12 }  // Status
    ]
    worksheet['!cols'] = columnWidths

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    // Generate filename with timestamp
    const fileName = `Order_${orderData.name.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`

    // Download file
    XLSX.writeFile(workbook, fileName)

    return fileName
}

export function exportMultipleOrdersToExcel(orders: OrderData[]) {
    // Prepare data for Excel
    const excelData = orders.map(order => ({
        'Order Date': new Date(order.createdAt).toLocaleString(),
        'Customer Name': order.name,
        'Phone Number': order.phone,
        'Stall Name': order.stallName,
        'Delivery Date': order.deliveryDate,
        'Ice Creams': order.iceCreams.map(ic => `${ic.name}(${ic.quantity})`).join(', '),
        'Payment Method': order.paymentMethod === 'phonepe' ? 'PhonePe' : 'Cash on Delivery',
        'Total Amount': `₹${order.totalAmount}`,
        'Inquiry Type': order.inquiryType,
        'Additional Message': order.message || 'N/A',
        'Status': order.status || 'Completed'
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const columnWidths = [
        { wch: 20 }, // Order Date
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone Number
        { wch: 20 }, // Stall Name
        { wch: 15 }, // Delivery Date
        { wch: 40 }, // Ice Creams
        { wch: 18 }, // Payment Method
        { wch: 15 }, // Total Amount
        { wch: 15 }, // Inquiry Type
        { wch: 30 }, // Additional Message
        { wch: 12 }  // Status
    ]
    worksheet['!cols'] = columnWidths

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Orders')

    // Generate filename with timestamp
    const fileName = `All_Orders_${new Date().toISOString().split('T')[0]}.xlsx`

    // Download file
    XLSX.writeFile(workbook, fileName)

    return fileName
}
