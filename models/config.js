const mongoose = require('mongoose');
// Define a question schema and model
const configSchema = new mongoose.Schema({
    congif_name: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = mongoose.model('config', configSchema);