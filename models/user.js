const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

userSchema.statics.authenticateUser = async function (username, password) {
  // Find the user by username
  const user = await this.findOne({ username });
  if (!user) {
    return { user: null, error: "User not found" };
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return { user: null, error: "Incorrect password" };
  }

  return { user, error: null };
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
