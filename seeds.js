const mongoose = require("mongoose");
const User = require("./models/user");
const Card = require("./models/card");
const bcrypt = require("bcrypt");

User.collection.drop();
Card.collection.drop();

mongoose
  .connect("mongodb://localhost:27017/flashcarder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

// const { username, email, password } = req.body;
// const hash = await bcrypt.hash(password, 12);
// const user = new User({
//   username,
//   email,
//   password: hash,
// });
// await user.save();
// req.session.user_id = user._id;
// res.redirect("/");

const seedUsers = [
  {
    username: "Anne",
    email: "anne@email.com",
    password: "Anne",
  },
  {
    username: "Bob",
    email: "bob@email.com",
    password: "Bob",
  },
  {
    username: "Charlie",
    email: "charlie@email.com",
    password: "Charlie",
  },
];

function generateCardsForUser(user_id) {
  return [
    {
      front: "l'homme",
      back: "the man",
      card_set: "French",
      tags: ["french", "language"],
      user_id: user_id,
    },
    {
      front: "el gato",
      back: "the cat",
      card_set: "spanish",
      tags: ["spanish", "language"],
      user_id: user_id,
    },
    {
      front: "das Auto",
      back: "the car",
      card_set: "german",
      tags: ["german", "language"],
      user_id: user_id,
    },
  ];
}

// User.insertMany(seedUsers)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// db.flashcarder.cards.remove({});
// cards.remove({});
// Card.remove({});
// flashcarder.remove({});

// Card.insertMany(seedCards)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

populateUsers(seedUsers);

function populateUsers(seedUsers) {
  const hashedUsers = seedUsers.map((user) => {
    let password = user.password;
    const hash = bcrypt.hashSync(password, 12);
    user.password = hash;
    return user;
  });
  User.insertMany(hashedUsers)
    .then((res) => {
      console.log(res);
      populateCards(res);
    })
    .catch((e) => {
      console.log(e);
    });
}

function populateCards(users) {
  users.forEach((user) => {
    let userCards = generateCardsForUser(user._id);
    Card.insertMany(userCards)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}
