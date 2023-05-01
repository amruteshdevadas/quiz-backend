const mongoose = require('mongoose');
// Define a question schema and model
const questionBankSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    options: [],
    answer: {
        type: String,
        required: true
    },
    question_category: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('question_bank', questionBankSchema);