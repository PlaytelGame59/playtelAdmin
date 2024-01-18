const Player = require('../models/Player');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
// const multer = require('multer')
// const configMulter = require('../configMulter')
const Withdraw = require('../models/Withdraw');
const Transaction  = require('../models/Transaction')
const Notification = require('../models/Notification')
const User = require('../models/User');
const Wallet = require('../models/Wallet');


exports.userLogin = async function (req, res) {
    try {
        const { email, first_name, device_type, device_token, mobile } = req.body;
  
        let existingUser = await Player.findOne({ mobile });
  
        if (existingUser) {
            // Mobile number already exists, no need to update other details
            return res.status(200).json({
                success: true,
                token: "Token Here",
                data: existingUser,
                message: 'User logged in successfully.',
            });
        } else {
            // Mobile number doesn't exist, create a new user entry with provided details
            const newUser = await Player.create({
                email,
                first_name,
                device_type,
                device_token,
                mobile,
            });
            return res.status(200).json({
                success: true,
                token: "Token Here",
                data: newUser,
                message: 'New user created.',
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};






// const calculatePrizes = async (topUsers) => {
//     // Logic based on position and scores
//     return await topUsers.map((user, index) => ({ userId: user._id, winningAmount: `winningAmount for position ${index + 1}` }));
// }

// exports.topprize = async function (req, res) {
//     try {
//         // Fetch the top 10 users from the database, sorted by a relevant metric (e.g., score)
//         const topUsers = await PlayerModel.find().sort({ score: -1 }).limit(1);

//         // Calculate prizes based on your logic (this is just an example)
//         const prizes = calculatePrizes(topUsers);

//         return res.status(200).json({ success: true, prizes });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// }


// exports.withdrawRequest = async function (req, res) {
//     try {
//         const { player_id } = req.body;

//         // Check if the player exists
//         const player = await PlayerModel.findById({ player_id });
//         if(!player) {
//             return res.status(404).json({ status: 'error', message: 'Player not found' });
//         }

//         // Create a withdrawal request
//         const withdrawalRequest = new Withdraw({ player_id });
//         const savedWithdrawalRequest = await withdrawalRequest.save();

//         res.status(201).json({
//             status: 'success',
//             message: 'Withdrawal request submitted successfully',
//             data: savedWithdrawalRequest,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// };








