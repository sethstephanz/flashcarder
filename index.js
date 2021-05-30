const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/French", {
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

app.use("/", express.static(__dirname + "/public"));

const frenchSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: true,
  },
  meaning: {
    type: String,
    required: true,
  },
  lastReviewed: Date,
});

const French = mongoose.model("French", frenchSchema);

const bonjour = new French({
  phrase: "bonjour",
  meaning: "hello",
  lastReviewed: "2021-4-21",
});

const acheter = new French({
  phrase: "acheter",
  meaning: "to buy",
  lastReviewed: "2021-4-21",
});

const homme = new French({
  phrase: "l‘homme",
  meaning: "the man",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home.ejs", {
    title: "Flashcarder",
    words: "banana",
    arr: [100, 200, 300],
  });
});

app.get("/flashcards", async (req, res) => {
  let result = await French.find();
  res.render("flashcards.ejs", { title: "Flashcards", flashcards: result });
});

app.get("/stacks", async (req, res) => {
  // res.render("stacks.ejs", { title: "Stacks" });
  const phrases = await French.find({});
  console.log(phrases);
  res.render("stacks/index", { phrases });
});

app.get("/stats", (req, res) => {
  res.render("stats.ejs", { title: "Stats" });
});

app.listen(3000, () => {
  console.log("listening on route 3000");
});
