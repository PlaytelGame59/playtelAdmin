const mongoose = require('mongoose')
const Player = require('../models/Player')

const TransactionSchema = mongoose.Schema({
    player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    amount: { type: Number, required: true }, 
    txnDateTime: { type: Date, required: true },
    type: { type: String, required: true }, 
    txnBy: { type: String, required: true },
    // notes: { type: String, required: true },
    // walletType: { type: String, required: true },
},
// {
//     timestamps: true, // This will add createdAt and updatedAt fields
// }
)

const Transaction = mongoose.model('transaction', TransactionSchema)

module.exports = Transaction 