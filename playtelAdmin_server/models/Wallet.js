const mongoose = require('mongoose')
const Player = require('../models/Player');

const WalletSchema = mongoose.Schema({

    player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    // walletAmount: { type: String, default: 0 },
    // bonusWalletAmount: { type: String, default: 0 }

    transactionType: { type: String },
    walletType: { type: String },
    addAmount: { type: String },
    notes: { type: String }

})    

const Wallet = mongoose.model('wallet', WalletSchema)

module.exports = Wallet
