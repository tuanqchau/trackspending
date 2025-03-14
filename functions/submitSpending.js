const { google } = require('googleapis');
const dotenv = require('dotenv');
const { Handler } = require('@netlify/functions');
dotenv.config();

// Google Sheets API authentication
const auth = new google.auth.GoogleAuth({
    credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL
    },  
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const sheet_id = process.env.SHEET_ID;  // Get sheet ID from .env

// The handler function that Netlify will call
const submitSpending = async (event, context) => {
    const { item, price } = JSON.parse(event.body || '{}');
    const description = item;
    const cost = parseFloat(price);
    const date = new Date().toLocaleDateString();

    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Append data to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheet_id,
            range: 'Sheet1!A:B',  // Change the range as needed
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [description, cost, date], // Add description, price, and date
                ],
            },
        });

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Spending added successfully!' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to add spending.' }),
        };
    }
};

// Export the handler for Netlify to use
module.exports.handler = submitSpending;
