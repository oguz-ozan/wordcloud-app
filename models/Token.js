const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    number: String,
    used: {
        type: Boolean,
        default: false
    }
});

module.exports = Token = mongoose.model('token',TokenSchema);