const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Email format is invalid"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  isApproved: { type: Boolean, default: false },
  image: { type: String },
  postsCount: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
