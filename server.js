const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// OAuth2 client setup
const creds = require('./path_to_your_credentials_file.json');
const client = new google.auth.JWT(
    creds.client_email,
    null,
    creds.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// Connect to Google Sheets
client.authorize(err => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Connected to Google Sheets API');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit-data', (req, res) => {
    const sheets = google.sheets({ version: 'v4', auth: client });
    const data = [
        req.body.username,
        req.body.email
    ];

    sheets.spreadsheets.values.append({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'A1', // adjust range accordingly
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [data]
        }
    }, (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error updating sheet');
        } else {
            res.send('Data added to Google Sheet');
        }
    });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
