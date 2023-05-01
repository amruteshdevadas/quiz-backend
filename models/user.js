const mongoose = require('mongoose');
// Define a user schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    dob: { type: Date },
    mobile: { type: String }
});
module.exports = mongoose.model('User', userSchema);