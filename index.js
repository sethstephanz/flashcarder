const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// //date constructor
// const today = new Date();
// const dd = String(today.getDate()).padStart(2, "0");
// const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
// const yyyy = today.getFullYear();
// today = mm + "/" + dd + "/" + yyyy;

mongoose
  .connect("mongodb://localhost:27017/entries", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose connected to MongoDB");
  })
  .catch((err) => {
    console.log("Mongoose error");
    console.log(err);
  });

const entrySchema = new mongoose.Schema({
  phrase: String,
  meaning: String,
  lastReviewed: Date,
});

const Entry = mongoose.model("Entry", entrySchema);

const bonjour = new Entry({
  phrase: "bonjour",
  meaning: "hello",
  lastReviewed: "2020-4-21",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs", { title: "Flashcarder" });
});

app.get("/stacks", (req, res) => {
  res.render("stacks.ejs", { title: "Stacks" });
});

app.get("/stats", (req, res) => {
  res.render("stats.ejs", { title: "Stats" });
});

app.listen(3000, () => {
  console.log("listening on route 3000");
});
