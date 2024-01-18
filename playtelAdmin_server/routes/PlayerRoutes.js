const express = require("express")
const router = express.Router();

const PlayerController = require('../controllers/PlayerController');

router.post('/login', PlayerController.userLogin);


// router.post('/get-friends-list', PlayerController.getFriendsList);

// router.get('/top_ten_prize', PlayerController.topprize);  // getTransaction

// router.post('/withdraw/request', PlayerController.requestWithdraw);
// router.post('/wallet/withdraw/request', PlayerController.withdrawRequest)



module.exports = router;
