const mongoose = require('mongoose')

const DisclamerSchema = mongoose.Schema({
    addDisclamer: { type: String, required: true }
})

const Disclamer = mongoose.model("disclamer", DisclamerSchema)

module.exports = Disclamer  