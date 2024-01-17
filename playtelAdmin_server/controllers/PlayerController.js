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

// exports.addPlayer = async function (req, res) {
//     try {
//         const {  aadhar, name, email, mobileNo } = req.body;
//         // email: { type: String }, 
//         // first_name: { type: String}, 
//         // device_type: { type: String}, 
//         // device_token: { type: String }, 
//         // user_type: { type: Number },
//         // image: { type: String }, 
//         // mobile: { type: String },
//         // amount: { type: String },
//         // winningAmount: { type: String },
//         // const { aadhar } = req.file;
//         // Create a new instance of the Player
//         // const base64Data = req.file.buffer.toString('base64');

//         const newPlayer = new Player({
//             // playerId, 
//             name, 
//             email, 
//             aadhar, 
//             mobileNo,
//             created_at: new Date(),
//         });

//         // Save the new Player to the database
//         const savedPlayer = await newPlayer.save();
//         console.log(savedPlayer);
//         // Respond with the saved Player data
//         res.status(201).json({ status: 'success', savedPlayer});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }

// exports.getPlayer = async function (rea, res) {
//     try {
//         // Fetch all tournament from the database
//         const player = await Player.find();

//         // Respond with the list of player
//         res.status(200).json({ msg: 'sucessfull', player });  
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// }

// exports.updatePlayer = async function (req, res) {

//     try {
//         const playerId = req.body.playerId;
//         const {  name, email, aadhar, mobileNo } = req.body;
    
//         // Find the player by ID
//         let player = await Player.findById(playerId);
    
//         if(player) {
//             // Update the player field
//             // player.playId = playId;   
//             player.name = name;
//             player.email = email;
//             player.aadhar = aadhar;
//             player.mobileNo = mobileNo
//             await player.save();
    
//             return res.status(200).json({ success: true, message: 'player updated successfully.', playerId: player._id, status: 'success' });
//         } else {
//             return res.status(400).json({ success: false, message: 'player not found.' });
//         }
//     } catch (error) {
//         console.error('Error updating player details:', error);
//         res.status(500).json({ success: false, message: 'Failed to update player details .', error: error.message });
//     }
// }

// exports.deletePlayer = async function (req, res) {
//     try {
//         const playerId = req.body.playerId
    
//         const deletedPlayers = await Player.findByIdAndDelete(playerId);     
    
//         if(!deletedPlayers) {
//             return res.status(404).json({ status: 'error', msg: 'Players not found' });
//         }
    
//         return res.status(200).json({ status: 'success', msg: 'Players deleted successfully', deletedPlayers });
//     } catch (error) {  
//         console.error(error);
//         return res.status(500).json({ status: 'error', msg: 'Internal server error', error });
//     }
// }

// exports.getleaderboard = async function (req, res) {
//     try {
//       // Fetch users from the database, sorted by a relevant metric (e.g., amount)
//       const leaderboard = await Player.find().sort({ amount: -1 }).limit(4);
  
//       // You can customize the sorting and limit based on your application's requirements
  
//       return res.status(200).json({ success: true, leaderboard });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// exports.getactivePlayer = async function (req, res) {
//     try {
//         const activePlayers = await Player.find({ isActive: true });

//         return res.status(200).json({
//             success: true,
//             message: 'Active players retrieved successfully.',
//             activePlayers,
//         });
//     } catch (error) {
//         console.error('Error fetching active players:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to fetch active players.',
//             error: error.message,
//         });
//     }
// }

// exports.getTransaction = async function (rea, res) {
//     try {
//         // Fetch all tournament from the database
//         const transaction = await Transaction.find();
//         // Respond with the list of tournament
//         res.status(200).json({ msg: 'sucessfull', transaction });  
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// }

// exports.getNotification = async function (rea, res) {
//     try {
//         // Fetch all tournament from the database
//         const notification = await Notification.find();
//         // Respond with the list of tournament
//         res.status(200).json({ msg: 'sucessfull', notification });  
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// }


// const uploadImage = configMulter('playerImage/', [
//     { name: 'image', maxCount: 1 }
// ]);

// exports.addPlayerImage = function (req, res) {
//     uploadImage(req, res, async function (err) {
//         if (err instanceof multer.MulterError) {
//         return res.status(500).json({ success: false, message: 'Multer error', error: err });
//         } else if (err) {
//         return res.status(500).json({ success: false, message: 'Error uploading file', error: err });
//         }

//         try {

//         const image = req.files['image'] ? req.files['image'][0].path.replace(/^.*playerImage[\\/]/, 'playerImage/') : '';

//         const newPlayerImage = new PlayerModel({ image });
//         await newPlayerImage.save();

//         res.status(201).json({ success: true, message: 'Player image uploaded successfully.', data: newPlayerImage });
//         } catch (error) {
//         console.error('Error uploading player image:', error);
//         res.status(500).json({ success: false, message: 'Failed to upload player image.', error: error.message });
//         }
//     });
// };


// // Use Multer middleware for file uploads
// const uploadImage = configMulter('notificationImage/', [
//     { name: 'notificationImg', maxCount: 1 }
// ]);

// // add_notification
// exports.addNotification = async function (req, res) {
//     console.log('Before Multer:', req.files); // Add this line
//     uploadImage(req, res, async function (err) {
//         if(err instanceof multer.MulterError) {
//             return res.status(500).json({ success: false, message: 'Multer error', error: err });
//         } else if (err) {
//             return res.status(500).json({ success: false, message: 'Error uploading file', error: err });
//         }
//         try {
//             // console.log('req.body:', req.body);
//             if(err) {
//                 return res.status(500).json({ success: false, message: 'Error uploading file', error: err });
//             }
//             console.log('After Multer:', req.files);   
//             const { list_id, notificationTitle, notificationMessage } = req.body;

//             // Check if 'req.files' is defined and 'notificationImage' exists in it
//             // const notificationImg = req.files && req.files['notificationImg'] ? req.files['notificationImg'][0].path.replace(/^.*notificationImage[\\/]/, 'notificationImage/') : '';
//             const notificationImg = req.files['notificationImg'] ? req.files['notificationImg'][0].path.replace(/^.*playerImage[\\/]/, 'playerImage/') : '';
//             console.log('notificationImg:', notificationImg);     
    
//             const newNotification = new Notification({
//                 list_id,
//                 notificationTitle,
//                 notificationMessage,
//                 notificationImg: notificationImg,
//             });

//             const savedNotification = await newNotification.save();
//             res.status(201).json({ status: 'success', savedNotification });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     });
// };



// // add_amount
// exports.addAmount = async function (req, res) {

//     // transactionType: { type: String },
//     // walletType: { type: String },
//     // addAmount: { type: String },
//     // notes: { type: String }

//     try {
//         const { 
//             list_id, 
//             transactionType, 
//             addAmount, 
//             notes
//         } = req.body;

//         const newWallet = new Wallet({
//             player_id: list_id,
//             transactionType, 
//             addAmount, 
//             notes
//         });

//         const savedWallet = await newWallet.save();
//         res.status(201).json({ status: 'success', savedWallet });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// //report
// // banned player
// exports.getBannedPlayers = async function (req, res) {
//     try {
//         const bannedPlayers = await Player.find({ isBanned: 1 }); // Fetch players where isBanned is 1 (true).

//         return res.status(200).json({
//             success: true,
//             message: 'Banned players retrieved successfully.',
//             bannedPlayers,
//         });
//     } catch (error) {
//         console.error('Error fetching banned players:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to fetch banned players.',
//             error: error.message,
//         });
//     }
// }


// exports.getapproveWithdraw = async function (req, res) {
//     try {
//         const approveWithdraw = await Player.find({ isApprove: true });

//         return res.status(200).json({
//             success: true,
//             message: 'approve players retrieved successfully.',
//             approveWithdraw,
//         });

        
//     } catch (error) {
//         console.error('Error fetching approve players:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to fetch approve players.',
//             error: error.message,
//         });
//     }
// }

// // Change the name of the function and the success message
// exports.getRejectedWithdraw = async function (req, res) {
//     try {
//         // Find players with isApprove set to false (rejected)
//         const rejectedWithdraw = await Player.find({ isApprove: false });

//         return res.status(200).json({
//             success: true,
//             message: 'Rejected players retrieved successfully.',
//             rejectedWithdraw,
//         });
//     } catch (error) {
//         console.error('Error fetching rejected players:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to fetch rejected players.',
//             error: error.message,
//         });
//     }
// };

// // Add a new endpoint to handle approve, withdraw, and reject actions
// exports.updateWithdrawStatus = async function (req, res) {
//     try {
//         const { playerId, action } = req.body;

//         let updateFields;

//         switch (action) {
//             case 'approve':
//                 updateFields = { isApprove: true, approveAt: new Date() };
//                 break;
//             case 'withdraw':
//                 updateFields = { isWithdrawn: true, withdrawAt: new Date() };
//                 break;
//             case 'reject':
//                 updateFields = { isApprove: false, isWithdrawn: false, rejectAt: new Date() };
//                 break;
//             default:
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid action specified.',
//                 });
//         }

//         // Update the player's status based on the action
//         const updatedPlayer = await Player.findByIdAndUpdate(playerId, updateFields, { new: true });

//         return res.status(200).json({
//             success: true,
//             message: 'Player status updated successfully.',
//             updatedPlayer,
//         });
//     } catch (error) {
//         console.error('Error updating player status:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to update player status.',
//             error: error.message,
//         });
//     }
// };


// exports.addNotification = async function (req, res) {
//     try {
//         const { 
//             list_id, // Assuming list_id is an array of player IDs
//             notificationTitle, 
//             notificationMessage, 
//             aadharImg 
//         } = req.body;

//         // Check if the player exists before saving the notification
//         // You may need to loop through the list_id array and check each player
//         // For simplicity, this example assumes that all players exist

//         const notifications = [];

//         // Create a new notification for each player in the list
//         for(const player_id of list_id) {
//             const newNotification = new Notification({
//                 player_id,
//                 notificationTitle,
//                 notificationMessage,
//                 aadharImg
//             });

//             // Save the new Notification to the database
//             const savedNotification = await newNotification.save();
//             notifications.push(savedNotification);
//         }

//         // Respond with the saved Notification data
//         res.status(201).json({ status: 'success', notifications });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }



// exports.requestWithdraw = async function (req, res) {
//     try {
//         const { player_id, amount } = req.body;
//         const player = await PlayerModel.findById({player_id})
//         if (!player || player.walletAmount < amount) {
//             return res.status(400).json({ success: false, message: 'Insufficient funds' });
//         }

//         const withdrawRequest = await WithdrawModel.create({ player_id, amount });
//         // Update player's wallet balance (subtracting the withdrawal amount)
//         await PlayerModel.findByIdAndUpdate(player_id, { $inc: { walletAmount: -amount } });

//         return res.status(201).json({
//             success: true,
//             message: 'Withdrawal request submitted successfully',
//             withdrawRequest,
//         });

//     } catch (error) {
//         console.error('Error fetching withdraw request:', error)
//         return res.status(500).json({
//             success: false,
//             message: 'failed to withdraw request',
//             error: error.message
//         })
//     }
// }

// exports.getPlayerProfileImage = async function (req, res) {
//     try {
//         const { player_id } = req.body;

//         // Find the player by player_id
//         const player = await PlayerModel.findOne({ player_id });

//         if(!player) {
//             // If player not found, return a 404 status
//             return res.status(404).json({ message: 'Player not found' });
//         }

//         // Respond with the player's profile image
//         res.status(200).json({ status: 'success', profileImage: player.player_image });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };   

// // // API endpoint for getting friends list
// // exports.getFriendsList = async function (req, res) {
// //     try {
// //       const { user_id, email } = req.body;
  
// //       // Find the user by either user_id or email
// //       const user = await UserModel.findOne({
// //         $or: [{ _id: user_id }, { email }],
// //       });
  
// //       if (!user) {
// //         return res
// //           .status(404)
// //           .json({ success: false, message: "User not found" });
// //       }
  
// //       // Get the list of friend IDs
// //       const friendIds = user.friends;
  
// //       // Find friends using the list of friend IDs
// //       const friends = await UserModel.find({ _id: { $in: friendIds } });
  
// //       res.status(200).json({ success: true, friends });
// //     } catch (error) {
// //       console.error(error);
// //       res.status(500).json({ success: false, message: "Internal Server Error" });
// //     }
// // };


// exports.getleaderboard = async function (req, res) {
//     try {
//       // Fetch users from the database, sorted by a relevant metric (e.g., amount)
//       const leaderboard = await PlayerModel.find().sort({ amount: -1 }).limit(10);
  
//       // You can customize the sorting and limit based on your application's requirements
  
//       return res.status(200).json({ success: true, leaderboard });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// //  // Function to calculate prizes based on your logic
// // function calculatePrizes(topUsers) {
// //    // Your logic to assign prizes based on positions, scores, etc.
// //    // This is just a placeholder, customize it as per your requirements
// //    // return topUsers.map((user, index) => ({ userId: user._id, prize: Prize for position ${index + 1} }));
// // }

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








