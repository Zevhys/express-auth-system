const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (password.length < 12) {
    return res.send("password harus minimal 8 karakter");
  }

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password)) {
    return res.send("password harus huruf besar, kecil, dan symbol");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send("username telah dipakai, silahkan ganti");
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashPassword });
  await newUser.save();

  res.redirect("/dashboard");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      req.session.user_id = user._id;
      res.redirect("/dashboard");
    } else {
      res.send("inccorect password");
    }
  } else {
    res.redirect("/signup");
  }
});

router.post("/logout", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/signup");
  }

  req.session.destroy(() => {
    res.redirect("/home");
  });
});

router.get("/dashboard", async (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/signup");
  }

  try {
    const user = await User.findById(req.session.user_id);

    res.render("dashboard", { user });
  } catch (error) {
    res.status(500).send("error fetching user data");
  }
});

module.exports = router;
