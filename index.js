const express = require("express");
const app = express();
const path = require("path");

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
