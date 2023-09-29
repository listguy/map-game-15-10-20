const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const Score = require("./models/score");

const app = new express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

//When work on server is finished, remove proxy from package json, build and check and then deploy to heroku

app.get("/api/v1/scores", async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;

  try {
    const totalDocs = await Score.countDocuments().exec();

    const scores = await Score.find()
      .skip(offset * 40)
      .limit(40)
      .sort({ score: -1 })
      .exec();

    res.json({ scores: scores, pages: Math.floor(totalDocs / 40) + 1 });
  } catch (e) {
    console.log(`Error occured: ${e}`);
    res.sendStatus(404);
  }
});

app.post("/api/v1/scores", async (req, res) => {
  const {
    body: { name, score },
  } = req;

  try {
    const newScore = new Score({
      name: name,
      score: parseInt(score),
    });

    const doc = await newScore.save();

    res.json(doc);
  } catch (e) {
    console.log(`Error occured: ${e}`);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
