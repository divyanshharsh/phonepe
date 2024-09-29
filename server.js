const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Your API key (store securely in an environment variable in production)
const apiKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';

// Your callback URL endpoint
app.post('/phonepe/callback', (req, res) => {
    // Extract the body of the incoming request
    const requestBody = req.body;
    
    // Extract the X-VERIFY header
    const xVerifyHeader = req.headers['x-verify'];
    
    // Generate a checksum for verification
    const checksum = generateChecksum(apiKey, JSON.stringify(requestBody));
    
    // Verify if the checksum matches
    if (xVerifyHeader !== checksum) {
        console.log('Invalid checksum');
        return res.status(400).send({ message: 'Checksum verification failed' });
    }

    // Process the payment response
    console.log('Payment Callback Received:', requestBody);

    // You can store the status in your database, trigger email notifications, etc.
    // Respond to PhonePe to acknowledge receipt
    res.status(200).send({ success: true });
});

// Helper function to generate checksum
function generateChecksum(apiKey, requestBody) {
    const data = requestBody + apiKey;
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
