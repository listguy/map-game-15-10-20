const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const url = process.env.MONGO_DB_URI;

//Establish mongoose connection
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => console.log("connected Successfully!")) //Remove this line in build.
  .catch((e) => console.log(`failed to connect to MongoDB\n${e.message}`)); // Remove this line in build

//Score model
const scoreSchema = mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

module.exports = mongoose.model("Score", scoreSchema);
