const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const favicon = require("serve-favicon");
const path = require("path");
const flash = require("connect-flash");
const lusca = require("lusca");

mongoose
  .connect("mongodb://127.0.0.1/authDB")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: true,
    },
  })
);

app.use(flash());
app.use(lusca.csrf());

app.use((req, res, next) => {
  res.locals.messages = req.flash("messages");
  next();
});

app.set("view engine", "ejs");
app.set("views", "views");
app.use("", require("./routes/routes"));

// eslint-disable-next-line
app.use(favicon(path.join(__dirname, "favicon.ico")));

// eslint-disable-next-line
app.use(express.static(path.join(__dirname, "assets")));

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(8000, () => {
  console.log("Server running on local host port 8000");
});
