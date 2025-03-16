const mongoose = require("mongoose");
const { isEmail } = require("validator");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    default: "admin",
    required: true
  }
});

module.exports = {
  Admin: mongoose.model("Admin", adminSchema, "admins"),
};