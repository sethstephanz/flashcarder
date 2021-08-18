const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passportLocalMongoose); //adds password, username verification

// const userSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },

// });

const User = mongoose.model("User", userSchema);

module.exports = User;

// {
//     "username": "Cman",
//     "email": "recovery@email",
//     "password": "password"
// },
