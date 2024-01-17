const mongoose = require('mongoose')

const TournamentSchema = mongoose.Schema({

// tournament_id, player_id, bonus_amount, play_amount, players (Optional), 
// use_of (Optional), notes (optional), refund (Optional)


    tournamentName: { 
        type: String,
        default:"" },
    betAmount: { 
        type: String,
        default:"0"
    }, 
    noPlayers: { 
        type: String,
        default:"0"
    }, 

    winningAmount: { 
        type: String,
        default:"0" },

    winnerCount: { 
        type: String,
        default:"0" },
    winningAmount1: { 
        type: String,
        default:"0" },
    winningAmount2: { 
        type: String,
        default:"0" },
    winningAmount3: { 
        type: String,
        default:"0" },   

    tournamentInterval: { type: String }, 
    tournamentType: { type: String }, 
    tournamentStatus: { type: Boolean }
})    

const Tournament = mongoose.model('tournament', TournamentSchema)

module.exports = Tournament


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