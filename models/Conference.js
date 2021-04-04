const mongoose = require('mongoose');

const ConferenceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    questions: [{
        title: String,
        answers: [String]
    }],
    name: {
        type: String,
        required: true
    },
    employees: [{
        name: String,
        email: String,
        isSent: {type:Boolean, default:false}
    }]
});

module.exports = Conference = mongoose.model('conference',ConferenceSchema);