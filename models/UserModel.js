const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, min: 4, max: 18 },
    lastName: { type: String, required: true, max: 18 },
    NIDNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true, min: 4 },
    bloodGroup: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;