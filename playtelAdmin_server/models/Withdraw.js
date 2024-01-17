const mongoose = require('mongoose')
const Player = require('../models/Player');

const WithdrawSchema = mongoose.Schema({
    player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
})    

const Withdraw = mongoose.model('withdraw', WithdrawSchema)

module.exports = Withdraw


// tournamentName: { type:  mongoose.Schema.Types.ObjectId, ref: 'PlayerModel' }, 

// const astrologerWalletSchema = new mongoose.Schema({
//     astrologer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Astrologer'
//     },
//     customer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Customers'
//     },
//     wallet_balance: {
//         type: Number,
//         default: 0
//     }
// },
// { 
//     collection: 'AstrologerWallet', 
//     timestamps: true 
// }
// );

// astrologerWalletSchema.virtual('formatted_wallet_balance').get(function () {
//     return this.wallet_balance.toFixed(2);
// });

// const AstrologerWallet = mongoose.model('AstrologerWallet', astrologerWalletSchema);

// module.exports = AstrologerWallet;