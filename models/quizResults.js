const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    quiz_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz_category: [],
    quiz_score: { type: Number, required: true },
    quiz_questions: [{
        question: { type: String, required: true },
        correct_answer: { type: String, required: true },
        user_answer: { type: String, required: true },
        is_correct: { type: Boolean, required: true },
    }],
    quiz_attempted_date: { type: Date, default: Date.now },
    quiz_username: { type: String, required: true },
    quiz_email: { type: String, required: true },
    quiz_user_phone_number: { type: String, required: true }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
