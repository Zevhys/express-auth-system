const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");

// mongod --dbpath C:\data\db

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

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("", require("./routes/routes"));

app.listen(8000, () => {
  console.log("Server running on local host port 8000");
});
