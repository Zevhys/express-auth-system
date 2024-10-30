const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1/authDB")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (password.length < 8) {
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

  const hashPassword = bcrypt.hashSync(password, 12);
  const newUser = new User({ username, password: hashPassword });
  await newUser.save();

  res.redirect("/dashboard");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }

  //  if (checking.name === req.body.name && checking.password === req.body.password) {
  //       res.send("user details already exists")
  //   } else {
  //       await LogInCollection.insertMany([data])
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.listen(8000, () => {
  console.log("Server running on local host port 8000");
});
