const express = require("express")
const router = express.Router();
const axios = require('axios');

function paymentIntegration() {

    // const PAYTEL_API_KEY = 'your-api-key';  // Secret Key: scrrXzsvOIuWVLF6GNQBJPa3HFOSPAtiE2L
    // const PAYTEL_API_SECRET = 'your-api-secret';  // Salt Key: salftNTkLKNbas2v1tiieq4GNMEFiOziV
    // PG_URL = 'https://pg.paytelpg.com/PaymentGateway/RequestPG';
    // PGStatusCheck_URL = 'https://pg.paytelpg.com/PaymentGateway/StatusPG';
    // PGCancel_URL = 'https://pg.paytelpg.com/PaymentGateway/CancelPG';
    // PGRefund_URL = 'https://pg.paytelpg.com/PaymentGateway/RefundPG';

    // const MerchantID = 900000000000071;
    // const PAYTEL_API_BASE_URL = 'https://pg.paytelpg.com/PaymentGateway'; // https://pg.paytelpg.com/PaymentGateway/RequestPG  https://api.paytel.in
    // const PAYTEL_API_KEY = 'scrrXzsvOIuWVLF6GNQBJPa3HFOSPAtiE2L'; 
    // const PAYTEL_API_SECRET = 'salftNTkLKNbas2v1tiieq4GNMEFiOziV';

    // router.post('/generate-paymentlink', async (req, res) => {
    //     try {
    //         const paymentDetails = req.body
    //         const response = await axios.post(
    //             `${PAYTEL_API_BASE_URL}/RequestPG`, paymentDetails,
    //             // `${PAYTEL_API_BASE_URL}/v1/payments`, paymentDetails,
    
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${PAYTEL_API_KEY}:${PAYTEL_API_SECRET}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //                 MerchantID: 900000000000071
    //             }
    //         );
    
    //         // Handle the response from Paytel
    //         console.log('Payment created:', response.data);
    //         res.json({ ...response.data, status: true });

    //     } catch (error) {
    //         console.error('Error creating payment:', error.message);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // });

    router.post('/payment-status', async (req, res) => {
        const paymentLink = req.body;
    
        // Verify the payload signature
        const paymentStatusUrl = `${PAYTEL_API_BASE_URL}/v1/payments${paymentLink}`  // const paymentStatusUrl = '';  // ${paymentLink}
        try {
            const response = await axios.get(paymentStatusUrl, {
                headers: {
                    'Authorization': `Bearer ${PAYTEL_API_KEY}:${PAYTEL_API_SECRET}`,
                    'Content-Type': 'application/json',
                },
            });
    
            // Process the payment notification
            const paymentStatus = response.data;  // Assuming the status is directly in the response body
    
            // Update payment status in your application database
            console.log('Payment status received:', paymentStatus);
            res.json({ paymentStatus, status: true });
        } catch (error) {
            console.error('Error fetching payment status:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}

module.exports = {
    paymentIntegration,
};



    // //api for generating payment link
    // router.post("/generatePaymentlink", async (req, res) => {
    //     const options = req.body;
    //     let username = "rzp_test_kdmTAXhBXP6b0J"; // rzp_test_kdmTAXhBXP6b0J	
    //     let password = "XLmethyNwL2GVAo8RlOcCzOk"; // XLmethyNwL2GVAo8RlOcCzOk
    //     let basicAuth = "Basic " + btoa(username + ":" + password);
    //     const url = `https://api.razorpay.com/v1/payment_links`;
    //     const response = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json", 
    //             Authorization: basicAuth,
    //         },
    //         body: JSON.stringify(options),
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //     res.send(data);
    // });
  
    // //api for payment status after cystomer sucessfully done payment
    // router.post("/paymentStatus", async (req, res) => {
    //     const { paymentLink } = req.body;
    //     let username = "rzp_test_kdmTAXhBXP6b0J";
    //     let password = "XLmethyNwL2GVAo8RlOcCzOk";
    //     let basicAuth = "Basic " + btoa(username + ":" + password);
    //     const url = `https://api.razorpay.com/v1/payment_links/${paymentLink}`;
    //     const response = await fetch(url, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: basicAuth,
    //         },
    //     });
    //     const payment_status = await response.json();
    //     //  console.log(payment_status);
    //     res.send(payment_status);
    // });
