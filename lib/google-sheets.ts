
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getGoogleSheetsClient() {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn("Google Sheets credentials missing. Skipping sheet update.");
        return null;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: SCOPES,
        });

        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        console.error("Error initializing Google Sheets client:", error);
        return null;
    }
}

export async function appendOrderToSheet(order: any) {
    const sheets = await getGoogleSheetsClient();
    if (!sheets) return;

    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
        console.warn("GOOGLE_SHEET_ID is missing");
        return;
    }

    const items = Array.isArray(order.iceCreams)
        ? order.iceCreams.map((i: any) => `${i.name} (${i.quantity})`).join(', ')
        : 'None';

    const locationText = order.location
        ? `${order.addressDetails || ''} [${order.location.latitude}, ${order.location.longitude}]`
        : order.addressDetails || 'Not Provided';

    const row = [
        order._id?.toString() || order.orderId?.toString() || '',
        new Date(order.createdAt || Date.now()).toLocaleString(),
        order.name,
        order.phone,
        order.stallName,
        items,
        order.totalAmount,
        order.paymentMethod,
        order.status,
        locationText,
        order.message || ''
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:K',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });
        console.log("Order appended to Google Sheet");
    } catch (error) {
        console.error("Failed to append to Google Sheet:", error);
    }
}

export async function syncOrdersToSheet(orders: any[]) {
    const sheets = await getGoogleSheetsClient();
    if (!sheets) return;

    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) return;

    const rows = orders.map(order => {
        const items = Array.isArray(order.iceCreams)
            ? order.iceCreams.map((i: any) => `${i.name} (${i.quantity})`).join(', ')
            : 'None';

        const locationText = order.location
            ? `${order.addressDetails || ''} [${order.location.latitude}, ${order.location.longitude}]`
            : order.addressDetails || 'Not Provided';

        return [
            order._id?.toString() || '',
            new Date(order.createdAt).toLocaleString(),
            order.name,
            order.phone,
            order.stallName,
            items,
            order.totalAmount,
            order.paymentMethod,
            order.status,
            locationText,
            order.message || ''
        ];
    });

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:K',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: rows,
            },
        });
        console.log(`Synced ${rows.length} orders to Google Sheet`);
    } catch (error) {
        console.error("Failed to sync orders to Google Sheet:", error);
    }
}
