const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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

  await user.save();
  req.session.user_id = user._id;
  res.redirect("/dashboard");
});

router.get("/login", authRedirect, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { user, error } = await User.authenticateUser(username, password);

  if (error === "User not found") {
    return res.redirect("/signup");
  } else if (error === "Incorrect password") {
    return res.send("Incorrect password");
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
    res.status(500).send("error fetching user data");
  }
});

module.exports = router;
