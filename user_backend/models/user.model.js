const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  address: { type: String },
  photo: { type: String },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
