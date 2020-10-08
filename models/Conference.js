const mongoose = require('mongoose');

const ConferenceSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

module.exports = Conference = mongoose.model('conference',ConferenceSchema);