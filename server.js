//todo: leave all login/logout authorization stuff here; all other routes should be taken out and put in routes folder

//global requires
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoutes = require("./routes/users");
const router = require("./routes/users");
// const flash = require("express-flash");
//global requires
var cards;
//models
const Card = require("./models/card");
const User = require("./models/user");
//models

// routes
const testRoute = require("./routes/testRoute")(app);
const collectionsRoute = require("./routes/collections")(app);
const statsRoute = require("./routes/stats")(app);
// routes

//global variables
let cardData = "test";
let userId = null;
let isAdmin = false;
let currentUser = { username: null, password: null };
let isAuthenticated = false;
//global variables

//mongoose connect
mongoose
  .connect("mongodb://localhost:27017/flashcarder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!");
    console.log(err);
  });
//mongoose connect

//for public assets
const views = app.set("views", path.join(__dirname, "/views"));
//for public assets

//ejs stuff
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
//ejs stuff

//middleware
app.use("/", express.static(__dirname + "/public")); //for serving public files
app.use(express.urlencoded({ extended: true })); //reads form data
app.use(express.json()); //reads json data
app.use(methodOverride("_method"));
app.use(
  session({ secret: "notgreat", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", userRoutes);
passport.use(new LocalStrategy(User.authenticate));
//middleware

//passport serialization and deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//passport serialization and deserialization

const requireLogin = (req, res, next) => {
  //makes this function modular so can just call requireLogin as callback in other routes
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  next();
};

app.get("/", async (req, res) => {
  console.log("Flashcarder connected!");
  res.render("landingPage");
});

app.get("/allcards", async (req, res) => {
  const cards = await Card.find({}); //finds all
  res.render("products/test", { cards });
});

app.get("/users", async (req, res) => {
  const users = await User.find({}); //should find all users and render them on admin page
  console.log(users);
  res.render("users/index", { users });
});

// app.post(
//   "/register",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

//card stuff
app.get("/cards/new", async (req, res) => {
  const user = req.token;
  const { id } = req.params;
  const userId = await User.findById(id);
  res.render("products/new", { userId });
});

app.post("/cards", async (req, res) => {
  const user = req.token;
  console.log("userId (post make cards): " + userId);
  let payload = { ...req.body, userId };
  console.log("payload.userId: " + payload.user_id);
  console.log("req.body: " + req.body);
  const newCard = await new Card(payload); //add input into db
  await newCard.save();
  res.redirect(`/cards/${newCard._id}`);
  // res.redirect("/");
});

app.get("/cards/:id", async (req, res) => {
  const { id } = req.params;
  const card = await Card.findById(id);
  console.log(card);
  res.render("products/testShow", { card });
  //   res.render("products/show", { card });
});

app.get("/cards/:id/edit", async (req, res) => {
  const { id } = req.params;
  const card = await Card.findById(id);
  res.render("products/edit", { card });
  //   const { id } = req.params;
  //   const product = await Card.findById(id);
  //   res.render("products/edit", { card, categories });
});

// app.get("/:user", async (req, res) => {
//   if (!req.session.user_id) {
//     return res.redirect("/login");
//   }
//   res.render("secret");
// });

app.put("/cards/:id", async (req, res) => {
  const { id } = req.params;
  const card = await Card.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/cards/${card._id}`);
});

app.delete("/cards/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCard = await Card.findByIdAndDelete(id);
  res.redirect("/allcards");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log("username: " + username);
  console.log("password: " + password);
  currentUser.username = username;
  currentUser.password = password;
  const validPassword = await bcrypt.compare(password, user.password); //if password and user.password match, validPassword is set to true

  if (validPassword) {
    //   req.session.user_id = user._id;
    //   isAuthenticated = true;
    //   userId = user._id;
    //   res.redirect("/secret");
    // } else res.redirect("/login");
    req.session.user_id = user._id;
    isAuthenticated = true;
    userId = user._id;
    console.log("userId: " + userId);
    res.redirect("/users/" + userId);
  } else res.send("Try Again!");
});

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

//bcrypt registration
// app.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   const hash = await bcrypt.hash(password, 12);
//   const user = new User({
//     username,
//     email,
//     password: hash,
//   });
//   await user.save();
//   req.session.user_id = user._id;
//   res.redirect("/");
// });

// app.get("user/:username", (req, res) => {
//   console.log(":username");
//   res.render("/views/userBoilerplate");
// });

app.get("/secret", requireLogin, async (req, res) => {
  const { id } = req.params;
  const ID = await User.findById(id);
  res.render("secret", { ID });
});

app.get("/user/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("userBoilerplate", { user });
});

app.get("/stacks", async (req, res) => {
  const { id } = req.params;
  const cards = await Card.findById(id); //should go off owner ID, eventually
  console.log(cards);
  res.render("flashcardProgram/index", { cards });
});

//passport login stuff
// app.use(flash());
const initializePassport = require("./passport-config");
initializePassport(passport, (id) => User.findById(id));

// app.get("/", checkAuthenticated, (req, res) => {
//   res.render("user/:id", { name: req.user.name });
// });

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    // failureFlash: true,
  })
);

// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   console.log("currentUser: " + currentUser);
//   next();
// });

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.get("/logout", (req, res) => {
  isAuthenticated = false;
  currentUser.username = null;
  currentUser.password = null;
  userId = null;
  req.logOut();
  res.redirect("/");
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const cards = await Card.find({ userId: id });
  // const collection = await Card.find({ card_set });
  app.locals.cardData;
  if (isAuthenticated) {
    if (userId == id) {
      // res.render("users/show", { user, cards, userId });
      res.render("users/userLandingPage", { user, cards, userId });
    } else {
      res.redirect("/login");
    }
    // console.log("userId: " + userId);
    // res.render("users/userLandingPage", { user, cards, userId });
  } else {
    res.redirect("/login");
  }
});

app.get("users/:id/collections", async (req, res) => {
  // const { card_set } = req.params;
  // const user = await User.findById(id);
  // collections = await Card.find({});
  // if (isAuthenticated & (userId == id)) {
  //   console.log("hello");
  // }
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    // console.log(req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // console.log("hashedPassword: " + hashedPassword);
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("newUser: " + newUser);
    await newUser.save();
    // const user = await User.findOne({ username });
    // currentUser.username = username;
    // currentUser.password = password;

    req.session.user_id = newUser._id;
    isAuthenticated = true;
    userId = newUser._id;
    const { username, password } = req.body;

    const validPassword = await bcrypt.compare(password, user.password);

    console.log(`/users/${newUser._id}`);
    res.redirect(`/users/${newUser._id}`);
  } catch {
    res.redirect("/register");
  }
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});
//passport login stuff

app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000! (serving from server.js)");
});

app.get("/users/:collection/collections", async (req, res) => {
  const { collection } = req.params;
  console.log(collection);
  const collections = await Card.find({ card_set: collection });
  console.log(collections);
  res.render("users/collections", { collections });
});
