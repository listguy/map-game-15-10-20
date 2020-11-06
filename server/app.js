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

//Sends scores in groups of 40, starting from offset
// app.get("/api/v1/scores", async (req, res) => {
//   const { offset } = req.query;
//   const buffer = await fs.readFile("./scores.json");
//   const scores = JSON.parse(buffer);
//   res.json({
//     scores: scores.slice(offset * 40, (offset + 1) * 40 + 1),
//     pages: Math.floor(scores.length / 40) + 1,
//   });
// });

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
    res.sendStatus(404);
  }
});

app.get("/api/v1/place", async (req, res) => {});

// app.post("/api/v1/scores", async (req, res) => {
//   const { body: newScore } = req;
//   const json = await fs.readFile("./scores.json");
//   const scores = JSON.parse(json);
//   console.log(scores);

//   try {
//     let inserted = false;
//     for (let i in scores) {
//       if (scores[i].score < newScore.score) {
//         scores.splice(i, 0, newScore);
//         inserted = true;
//         break;
//       }
//     }

//     if (!inserted) scores.push(newScore);
//     await fs.writeFile("./scores.json", JSON.stringify(scores));
//     res.status(204).end();
//   } catch (e) {
//     res.status(400).json({ msg: "Bad request" });
//   }
// });

app.post("/api/v1/scores", (req, res) => {
  const {
    body: { name, score },
  } = req;

  const newScore = new Score({
    name: name,
    score: parseInt(score),
  });

  newScore
    .save()
    .then((doc) => res.json(doc))
    .catch((e) => res.sendStatus(400));
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
