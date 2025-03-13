const { google } = require('googleapis');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser'); // Used to parse incoming form data
const app = express();
dotenv.config();

// Set up middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for JSON data as well
const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

const sheet_id = process.env.SHEET_ID;  // Get sheet ID from .env
app.use(express.static(path.join(__dirname, 'public')));
// Google Sheets API authentication
const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKey,  // Path to your service account key JSON file
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});

// Route to handle form submission
app.post('/submit-spending', async (req, res) => {
    debugger
    const { item, price } = req.body;

    const description = item;
    const cost = parseFloat(price);
    const date = new Date().toLocaleDateString();

    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Append data to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheet_id,
            range: "Sheet1!A:B",  // You can change the range based on where you want to append
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [description, cost, date] // Add description, price, and date
                ]
            }
        });

        res.send('Spending added successfully!');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to add spending.');
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
