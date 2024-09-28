const express = require('express');
const axios = require('axios');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Your Twilio Account SID and Auth Token
const accountSid = 'AC472768b8bc92d2d375d66ac884ce75ed'; // Replace with your Twilio Account SID
const authToken = '8658dd84c63fe4d7a2411cacea8ece09'; // Replace with your Twilio Auth Token
const client = new twilio(accountSid, authToken);

// Your Google Maps API Key
const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API Key

// In-memory storage for user requests (replace with a database in a real application)
let userRequests = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle setting up a notification
app.post('/api/setNotification', (req, res) => {
    const { start, end, threshold, phoneNumber } = req.body;

    // Store user request data (replace with database storage in a real app)
    userRequests.push({ start, end, threshold, phoneNumber });

    console.log('Notification request received:', { start, end, threshold, phoneNumber });

    res.json({ success: true });
});

// Function to check commute time and send a notification if below the threshold
async function checkCommuteTime() {
    for (let request of userRequests) {
        const { start, end, threshold, phoneNumber } = request;
        try {
            // Make a request to the Google Maps Directions API
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&key=${googleMapsApiKey}`
            );

            // Calculate the duration in minutes
            const durationInMinutes = response.data.routes[0].legs[0].duration.value / 60;

            // Check if the commute time is below the user-defined threshold
            if (durationInMinutes <= threshold) {
                // Send a text message using Twilio
                await client.messages.create({
                    body: `Good news! Your commute time from ${start} to ${end} is now ${Math.round(durationInMinutes)} minutes, which is below your set threshold of ${threshold} minutes.`,
                    from: '7542813139', // Replace with your Twilio phone number
                    to: phoneNumber
                });
                console.log(`Text sent to ${phoneNumber}`);
            }
        } catch (error) {
            console.error(`Failed to get directions or send text: ${error}`);
        }
    }
}

// Set up an interval to check commute times every 5 minutes
setInterval(checkCommuteTime, 300000); // 300000 ms = 5 minutes

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
