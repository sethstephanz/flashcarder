const entrySchema = new mongoose.Schema({
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

const Entry = mongoose.model("Entry", entrySchema);

const bonjour = new Entry({
  phrase: "bonjour",
  meaning: "hello",
});
bonjour
  .save()
  .then((data) => {
    console.log("It Worked!");
    console.log(data);
  })
  .catch((err) => {
    console.log("Error!");
    console.log(err);
  });
