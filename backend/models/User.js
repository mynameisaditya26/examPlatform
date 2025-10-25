const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
