const express = require("express");
const router = express.Router();
const User = require("../models/user");

const auth = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/signup");
  }
  next();
};

const authRedirect = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect("/dashboard");
  }
  next();
};

router.get("/", (req, res) => {
  res.redirect("/signup");
});

router.get("/signup", authRedirect, (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  const existingUser = await User.findOne({ username });
  let passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_=+\-]).{12,25}$/;
  let usernamePattern =
    /^(?!\s)(?!.*\s\s)[a-zA-Z0-9]{5,20}(?: [a-zA-Z0-9]+)*(?<!\s)$/;

  if (existingUser) {
    req.flash("messages", "Username already exist");
    return res.redirect("/signup");
  }

  if (!username) {
    req.flash("messages", "Username is required");
    return res.redirect("/signup");
  } else if (!password) {
    req.flash("messages", "Password is required");
    return res.redirect("/signup");
  }

  if (!passwordPattern.test(password)) {
    req.flash(
      "messages",
      "Password must be 12-25 chars, with upper, lower, number & symbol"
    );
    return res.redirect("/signup");
  }

  if (!usernamePattern.test(username)) {
    req.flash(
      "messages",
      " name must contain only letters and numbers, no double spaces or special characters"
    );
    return res.redirect("/signup");
  }

  try {
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error saving user:", error);
    req.flash("messages", "Failed to create account. Please try again.");
    res.redirect("/signup");
  }
});

router.get("/login", authRedirect, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { user, error } = await User.authenticateUser(username, password);

  if (!username) {
    req.flash("messages", "Username is required");
    return res.redirect("/login");
  } else if (!password) {
    req.flash("messages", "Password is required");
    return res.redirect("/login");
  }

  if (error === "User not found") {
    return res.redirect("/signup");
  } else if (error === "Incorrect password") {
    req.flash("messages", "Incorrect Password");
    return res.redirect("login");
  }

  req.session.user_id = user._id;
  res.redirect("/dashboard");
});

router.post("/logout", auth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signup");
  });
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user_id);
    res.render("dashboard", { user });
  } catch (error) {
    res.status(500).send("Error fetching user data");
  }
});

module.exports = router;
