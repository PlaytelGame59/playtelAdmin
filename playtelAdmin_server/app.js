const express = require('express')
const app = express();
const cors = require('cors')
const db = require("./config/db");
const bodyParser = require('body-parser');


const playerRoutes = require('./routes/PlayerRoutes')
const adminRoutes  = require('./routes/AdminRoutes')
// const playerDetailsRoutes = require('./routes/playerDetailsRoutes')
// const tournamentRoutes  = require('./routes/TournamentRoutes')
// const transactionRoutes  = require('./routes/TransactionRoutes')
// const noticeRoutes = require('./routes/NoticeRoutes')      

require("dotenv").config()

const { createServer } = require("http");
const { Server } = require("socket.io");
const {initializeSocketIO } = require("./socket/service");
const { paymentIntegration } = require('./payment/payment');
const { default: axios } = require('axios');
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const PORT = process.env.PORT || 2001       

// app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(express.json())  
app.use(cors()) 
// // Increase the payload limit (e.g., 10MB)   
// app.use(express.json({ limit: '5mb' }));
// app.use(express.urlencoded({ extended: true, limit: '5mb' }));
// Increase limit according to your requirements
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));   

// // Error handling middleware
// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//     res.status(400).json({ success: false, message: 'Invalid JSON payload' });
//   } else {
//     next();
//   }
// });
  
db();

// define api Routes
      
app.use('/admin', adminRoutes)
app.use('/player', playerRoutes)

// Use payment routes
app.use('/payment', paymentIntegration);

// app.use('/playerdetails', playerDetailsRoutes)
// app.use('/tournament', tournamentRoutes)   
// app.use('/transaction', transactionRoutes)  
// app.use('/notice', noticeRoutes) 

    // const PAYTEL_API_KEY = 'your-api-key';  // Secret Key: scrrXzsvOIuWVLF6GNQBJPa3HFOSPAtiE2L
    // const PAYTEL_API_SECRET = 'your-api-secret';  // Salt Key: salftNTkLKNbas2v1tiieq4GNMEFiOziV
    // PG_URL = 'https://pg.paytelpg.com/PaymentGateway/RequestPG';
    // PGStatusCheck_URL = 'https://pg.paytelpg.com/PaymentGateway/StatusPG';
    // PGCancel_URL = 'https://pg.paytelpg.com/PaymentGateway/CancelPG';
    // PGRefund_URL = 'https://pg.paytelpg.com/PaymentGateway/RefundPG';

    // Test-   https://pg.paytelpg.com/PaymentGateway/RequestPG
    // Production-   https://pg.paytelpg.com/PaymentGateway/RequestPG

    const MerchantID = 900000000000071;
    const PAYTEL_API_BASE_URL = 'https://pg.paytelpg.com/PaymentGateway'; // https://pg.paytelpg.com/PaymentGateway/RequestPG  https://api.paytel.in
    const PAYTEL_API_KEY = 'scrrXzsvOIuWVLF6GNQBJPa3HFOSPAtiE2L'; 
    const PAYTEL_API_SECRET = 'salftNTkLKNbas2v1tiieq4GNMEFiOziV';

    app.post('/generate-paymentlink', async (req, res) => {
        try {
            const paymentDetails = req.body
            const response = await axios.post(
                `${PAYTEL_API_BASE_URL}/RequestPG`, paymentDetails,
              
    
                {
                    headers: {
                        'Authorization': `Bearer ${PAYTEL_API_KEY}:${PAYTEL_API_SECRET}:${MerchantID}`,
                        'Content-Type': 'application/json',
                    },
                    // MerchantID: 900000000000071
                }
            );
    
            // Handle the response from Paytel
            console.log('Payment created:', response.data);
            res.json({ ...response.data, status: true });

        } catch (error) {
            // console.error('Error creating payment:', error.message);
            // console.error('Error response:', error.response.data);
            // // res.status(500).json({ error: 'Internal Server Error' });
            // res.status(error.response.status || 500).json({ error: 'Internal Server Error' });
            
            if(error.response) {
              console.error('Error response:', error.response.data);
              console.error('Status Code:', error.response.status);
            }
      
          res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
        }
    });

io.use((socket, next) => {
  if(socket.handshake.query.token === "UNITY") {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

initializeSocketIO(io)
// paymentIntegration()

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;