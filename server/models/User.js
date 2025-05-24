const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@iut-dhaka\.edu$/, // restrict to university email
  },
  password: { type: String, required: true },
  university: String,
  department: String,
  program: String,
  year: String,
  dob: Date,
  phone: String,
  isAdmin: { type: Boolean, default: false }, // for student-admins
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
