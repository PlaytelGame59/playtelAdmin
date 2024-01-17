const express = require("express")
const router = express.Router();

const PlayerController = require('../controllers/PlayerController');

router.post('/login', PlayerController.userLogin);

// router.post('/players-create', PlayerController.addPlayer);

// router.get('/players-list', PlayerController.getPlayer);

// router.post('/update-players', PlayerController.updatePlayer);

// router.post('/delete-players-data', PlayerController.deletePlayer);

// router.post('/add-player-image', PlayerController.addPlayerImage);

// router.post('/profile-image/get', PlayerController.getPlayerProfileImage)

// // router.post('/get-friends-list', PlayerController.getFriendsList);

// router.get('/leaderboard', PlayerController.getleaderboard);

// router.get('/active', PlayerController.getactivePlayer)

// router.get('/banned-player', PlayerController.getBannedPlayers)

// router.get('/approve-withdraw', PlayerController.getapproveWithdraw)  // getapproveWithdraw

// router.get('/reject-withdraw', PlayerController.getRejectedWithdraw) // getRejectedWithdraw

// router.get('/transaction-list', PlayerController.getTransaction);

// router.get('/get-notification', PlayerController.getNotification)

// // router.post('/add-notification', PlayerController.addNotification)

// router.post('/add-wallet', PlayerController.addAmount) // addAmount  /admin/add-wallet

// // router.get('/top_ten_prize', PlayerController.topprize);  // getTransaction

// // router.post('/withdraw/request', PlayerController.requestWithdraw);
// // router.post('/wallet/withdraw/request', PlayerController.withdrawRequest)



module.exports = router;
