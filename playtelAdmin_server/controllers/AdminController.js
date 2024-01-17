const Admin = require('../models/Admin');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Tournament = require("../models/Tournment");
const Disclamer = require('../models/Disclamer');
const Notification = require('../models/Notification');
const configMulter = require('../configMulter')
const multer = require('multer');
const Player = require('../models/Player');
const Withdraw = require('../models/Withdraw');
const Transaction  = require('../models/Transaction')
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// Admin module <----------------------->
exports.signUp = async function (req, res) {
    const { username, email, password } = req.body

    const isUser = await Admin.findOne({ email })
    if(isUser) {
        res.send({ msg : "user already exits please login", isUser })
    } else {
        bcrypt.hash(password, 5, async function(err, hash) {
            if(err) {
                res.send({ msg: "something went wrong, plz try again later", err })
            } 
            else {
                const user = new Admin({  
                    username,  
                    email,  
                    password: hash
                })
                try {          
                    await user.save()
                    res.status(200).send({ msg: "signUp Successful", user })
                } catch (err) {
                    console.log(err)
                    res.send({ msg: "something went wrong, plz try again", err })
                }
            }   
        });
    }   
}
exports.login = async function (req, res) {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
  
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      return res.json({ msg: 'Login successful', token, userId: user._id });
    } else {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
};
exports.resetPassword = async function (req, res) {
    const { userId, newPassword, confirmPassword } = req.body;

    try {
        // Validate new password and confirm password
        if(newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
        }
        console.log(newPassword)
        // Update user's password in the database
        const hashedPassword = await bcrypt.hash(newPassword, 5);
        await Admin.updateOne({ _id: userId }, { password: hashedPassword });

        console.log('Password reset successfully', hashedPassword);
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred during password reset' });
    }
};


// Tournament module <----------------------->
exports.addTorunment = async function (req, res) {
    try {
        const { 
            tournamentName, 
            betAmount, 
            noPlayers,
            winningAmount,
            winningAmount1,
            winningAmount2,
            winningAmount3,
            tournamentInterval, 
            tournamentType, 
            tournamentStatus
        } = req.body;

        // Parse noPlayers as an integer before comparison
        const parsedNoPlayers = parseInt(noPlayers);

        // Set winnerCount based on noPlayers
        let winnerCount;
        if (parsedNoPlayers === 2 || parsedNoPlayers === 3) {
            winnerCount = 1;
        } else if (parsedNoPlayers === 4) {
            winnerCount = 3;
        } else {
            // Handle other values if needed
            winnerCount = 0; // Default value
        }

        console.log("noPlayers:", parsedNoPlayers);
        console.log("winnerCount:", winnerCount);

        // Create a new instance of the TournamentModel
        const newTournament = new Tournament({
            tournamentName,
            betAmount,
            noPlayers,
            winningAmount,
            winnerCount,
            winningAmount1,
            winningAmount2,
            winningAmount3, 
            tournamentInterval,
            tournamentType, 
            tournamentStatus
        });

        // Save the new tournament to the database
        const savedTournament = await newTournament.save();

        // Respond with the saved tournament data
        res.status(201).json({msg: "add tournament data successfuly", savedTournament, status: "success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.getTorunment = async function (req, res) {
    try {
        // Fetch all tournament from the database
        const tournament = await Tournament.find();

        // Respond with the list of tournament
        res.status(200).json({ msg: 'sucessfull', tournament });  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
exports.updateTournament = async function(req, res){
    try {
        const  tournamentId  = req.body.tournamentId;
        const { 
            tournamentName, 
            betAmount, 
            noPlayers,  
            winningAmount,
            // winnerCount,
            winningAmount1,
            winningAmount2,
            winningAmount3, 
            tournamentInterval, 
            tournamentType, 
            tournamentStatus 
        } = req.body;

         // Parse noPlayers as an integer before comparison
        const parsedNoPlayers = parseInt(noPlayers);

         // Set winnerCount based on noPlayers
        let winnerCount;
        if(parsedNoPlayers === 2 || parsedNoPlayers === 3) {
            winnerCount = 1;
        } else if (parsedNoPlayers === 4) {
            winnerCount = 3;
        } else {
             // Handle other values if needed
             winnerCount = 0; // Default value
        }
 
        console.log("noPlayers:", noPlayers);
        console.log("winnerCount:", winnerCount);
        // Find the tournament by ID
        let tournament = await Tournament.findById(tournamentId);

        if(tournament) {
            // Prepare update object based on provided fields
            const updateFields = {};
            if(tournamentName) updateFields.tournamentName = tournamentName;
            if(betAmount) updateFields.betAmount = betAmount;
            if(noPlayers) updateFields.noPlayers = noPlayers;
            if(winningAmount) updateFields.winningAmount = winningAmount;
            if(winnerCount) updateFields.winnerCount = winnerCount;
            if(winningAmount1) updateFields.winningAmount1 = winningAmount1;
            if(winningAmount2) updateFields.winningAmount2 = winningAmount2;
            if(winningAmount3) updateFields.winningAmount3 = winningAmount3;
            if(tournamentInterval) updateFields.tournamentInterval = tournamentInterval;
            if(tournamentType) updateFields.tournamentType = tournamentType;
            if(tournamentStatus) updateFields.tournamentStatus = tournamentStatus;

            // Update only the specified fields using $set operator
            await Tournament.updateOne({ _id: tournamentId }, { $set: updateFields });

            return res.status(200).json({ success: true, message: 'Tournament updated successfully.', tournamentId: tournament._id, status: 'success' });
        } else {
            return res.status(400).json({ success: false, message: 'Tournament not found.' });
        }
    } catch (error) {
        console.error('Error updating tournament details:', error);
        res.status(500).json({ success: false, message: 'Failed to update tournament details.', error: error.message });
    }
};
exports.deleteTorunment = async function (req, res) {
    
    try {
        const tournamentId = req.body.tournamentId

        const deletedTournaments = await Tournament.findByIdAndDelete(tournamentId);     

        if(!deletedTournaments) {
            return res.status(404).json({ status: 'error', msg: 'tournaments not found' });
        }

        return res.status(200).json({ status: 'success', msg: 'tournaments deleted successfully', deletedTournaments });
    } catch (error) {  
        console.error(error);
        return res.status(500).json({ status: 'error', msg: 'Internal server error', error });
    }
}

exports.addDisclamer = async function (req, res) {
    try {
        const { 
            addDisclamer
        } = req.body;

        // Create a new instance of the Disclamer
        const newDisclamer = new Disclamer({
            addDisclamer

        });

        // Save the new disclamer to the database
        const savedDisclamer = await newDisclamer.save();

        // Respond with the saved disclamer data
        res.status(201).json({msg: "add disclamer data successfuly", savedDisclamer, status: "success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


// Player module <----------------------->
exports.addPlayer = async function (req, res) {
    try {
        const {  player_image, name, email, mobileNo } = req.body;
        // email: { type: String }, 
        // first_name: { type: String}, 
        // device_type: { type: String}, 
        // device_token: { type: String }, 
        // user_type: { type: Number },
        // image: { type: String }, 
        // mobile: { type: String },
        // amount: { type: String },
        // winningAmount: { type: String },
        // const { player_image } = req.file;
        // Create a new instance of the Player
        // const base64Data = req.file.buffer.toString('base64');

        const newPlayer = new Player({
            // playerId, 
            name, 
            email, 
            player_image, 
            mobileNo,
            created_at: new Date(),
        });

        // Save the new Player to the database
        const savedPlayer = await newPlayer.save();
        console.log(savedPlayer);
        // Respond with the saved Player data
        res.status(201).json({ status: 'success', savedPlayer});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}  
exports.getPlayer = async function (rea, res) {
    try {
        // Fetch all tournament from the database
        const player = await Player.find();

        // Respond with the list of player
        res.status(200).json({ msg: 'sucessfull', player });  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
exports.updatePlayer = async function (req, res) {

    try {
        const playerId = req.body.playerId;
        const {  name, email, player_image, mobileNo } = req.body;
    
        // Find the player by ID
        let player = await Player.findById(playerId);
    
        if(player) {
            // Update the player field
            // player.playId = playId;   
            player.name = name;
            player.email = email;
            player.player_image = player_image;
            player.mobileNo = mobileNo
            await player.save();
    
            return res.status(200).json({ success: true, message: 'player updated successfully.', playerId: player._id, status: 'success' });
        } else {
            return res.status(400).json({ success: false, message: 'player not found.' });
        }
    } catch (error) {
        console.error('Error updating player details:', error);
        res.status(500).json({ success: false, message: 'Failed to update player details .', error: error.message });
    }
}
exports.deletePlayer = async function (req, res) {
    try {
        const playerId = req.body.playerId
    
        const deletedPlayers = await Player.findByIdAndDelete(playerId);     
    
        if(!deletedPlayers) {
            return res.status(404).json({ status: 'error', msg: 'Players not found' });
        }
    
        return res.status(200).json({ status: 'success', msg: 'Players deleted successfully', deletedPlayers });
    } catch (error) {  
        console.error(error);
        return res.status(500).json({ status: 'error', msg: 'Internal server error', error });
    }
}
exports.getleaderboard = async function (req, res) {
    try {
      // Fetch users from the database, sorted by a relevant metric (e.g., amount)
      const leaderboard = await Player.find().sort({ amount: -1 }).limit(4);
  
      // You can customize the sorting and limit based on your application's requirements
  
      return res.status(200).json({ success: true, leaderboard });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.getactivePlayer = async function (req, res) {
    try {
        const activePlayers = await Player.find({ isActive: true });

        return res.status(200).json({
            success: true,
            message: 'Active players retrieved successfully.',
            activePlayers,
        });
    } catch (error) {
        console.error('Error fetching active players:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch active players.',
            error: error.message,
        });
    }
}
// Update player status endpoint
exports.updateBanned = async function (req, res) {
    try {
        const { playerId, isBanned } = req.body;
        console.log('Request Body:', req.body);

        // Validate input
        if (!playerId || isBanned === undefined) {
            return res.status(400).json({ error: 'Invalid request. playerId and isBanned are required.' });
        }

      // Update player status in the database
        const updatedPlayer = await Player.findByIdAndUpdate(
            playerId,
            { isBanned },
            { new: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ error: 'Player not found.' });
        }

        return res.status(200).json(updatedPlayer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}
//report
// banned player
exports.getBannedPlayers = async function (req, res) {
    try {
        const bannedPlayers = await Player.find({ isBanned: 1 }); // Fetch players where isBanned is 1 (true).

        return res.status(200).json({
            success: true,
            message: 'Banned players retrieved successfully.',
            bannedPlayers,
        });
    } catch (error) {
        console.error('Error fetching banned players:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch banned players.',
            error: error.message,
        });
    }
}



// notification module <----------------------->
exports.getNotification = async function (rea, res) {
    try {
        // Fetch all tournament from the database
        const notification = await Notification.find();
        // Respond with the list of tournament
        res.status(200).json({ msg: 'sucessfull', notification });  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// Use Multer middleware for file uploads
const uploadImage = configMulter('notificationImage/', [
    { name: 'notificationImg', maxCount: 1 }
]);
// add_notification
exports.addNotification = async function (req, res) {
    uploadImage(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, message: 'Multer error', error: err });
        } else if (err) {
            return res.status(500).json({ success: false, message: 'Error uploading file', error: err });
        }

        try {
            console.log('After Multer:', req.files);
            const { list_id, notificationTitle, notificationMessage } = req.body;

            const notificationImg = req.files && req.files['notificationImg']
                ? req.files['notificationImg'][0].path.replace(/^.*notificationImage[\\/]/, 'notificationImage/')
                : '';

            console.log('notificationImg:', notificationImg);

            const newNotification = new Notification({
                list_id,
                notificationTitle,
                notificationMessage,
                notificationImg: notificationImg,
            });

            const savedNotification = await newNotification.save();
            res.status(201).json({ status: 'success', savedNotification });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};



// Transaction module <----------------------->
exports.getTransaction = async function (rea, res) {
    try {
        // Fetch all tournament from the database
        const transaction = await Transaction.find();
        // Respond with the list of tournament
        res.status(200).json({ msg: 'sucessfull', transaction });  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// wallet module <----------------------->
// add_amount
exports.addAmount = async function (req, res) {

    // transactionType: { type: String },
    // walletType: { type: String },
    // addAmount: { type: String },
    // notes: { type: String }

    try {
        const { 
            list_id, 
            transactionType, 
            addAmount, 
            notes
        } = req.body;

        const newWallet = new Wallet({
            player_id: list_id,
            transactionType, 
            addAmount, 
            notes
        });

        const savedWallet = await newWallet.save();
        res.status(201).json({ status: 'success', savedWallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// withdraw module <----------------------->
exports.getapproveWithdraw = async function (req, res) {
    try {
        const approveWithdraw = await Player.find({ isApprove: true });

        return res.status(200).json({
            success: true,
            message: 'approve players retrieved successfully.',
            approveWithdraw,
        });

        
    } catch (error) {
        console.error('Error fetching approve players:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch approve players.',
            error: error.message,
        });
    }
}
// Change the name of the function and the success message
exports.getRejectedWithdraw = async function (req, res) {
    try {
        // Find players with isApprove set to false (rejected)
        const rejectedWithdraw = await Player.find({ isApprove: false });

        return res.status(200).json({
            success: true,
            message: 'Rejected players retrieved successfully.',
            rejectedWithdraw,
        });
    } catch (error) {
        console.error('Error fetching rejected players:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch rejected players.',
            error: error.message,
        });
    }
};  
// Add a new endpoint to handle approve, withdraw, and reject actions
exports.updateWithdrawStatus = async function (req, res) {
    try {
        const { playerId, action } = req.body;

        let updateFields;

        switch (action) {
            case 'approve':
                updateFields = { isApprove: true, approveAt: new Date() };
                break;
            case 'withdraw':
                updateFields = { isWithdrawn: true, withdrawAt: new Date() };
                break;
            case 'reject':
                updateFields = { isApprove: false, isWithdrawn: false, rejectAt: new Date() };
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid action specified.',
                });
        }

        // Update the player's status based on the action
        const updatedPlayer = await Player.findByIdAndUpdate(playerId, updateFields, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Player status updated successfully.',
            updatedPlayer,
        });
    } catch (error) {
        console.error('Error updating player status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update player status.',
            error: error.message,
        });
    }
};