const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

const auth = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect("/signup");
  }

  next();
};

const authRedirect = (req, res, next) => {
  if (!req.session.user_id) {
    return next();
  }

  res.redirect("/dashboard");
};

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/signup", authRedirect, (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();

  req.session.user_id = user._id;

  res.redirect("/dashboard");
});

router.get("/login", authRedirect, (req, res) => {
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

router.post("/logout", auth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
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
