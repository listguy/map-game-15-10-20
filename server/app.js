const express = require("express");
const fs = require("fs").promises;
const app = new express();
const PORT = process.env.PORT || 3001;
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
});

//Sends scores in groups of 40, starting from offset
app.get("/api/v1/scores", async (req, res) => {
  const { offset } = req.query;
  const buffer = await fs.readFile("./scores.json");
  const scores = JSON.parse(buffer);
  res.json({
    scores: scores.slice(offset * 40, (offset + 1) * 40 + 1),
    pages: Math.floor(scores.length / 40) + 1,
  });
});

app.post("/api/v1/scores", async (req, res) => {
  const { body: newScore } = req;
  const json = await fs.readFile("./scores.json");
  const scores = JSON.parse(json);
  console.log(scores);

  try {
    let inserted = false;
    for (let i in scores) {
      if (scores[i].score < newScore.score) {
        scores.splice(i, 0, newScore);
        inserted = true;
        break;
      }
    }

    if (!inserted) scores.push(newScore);
    await fs.writeFile("./scores.json", JSON.stringify(scores));
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ msg: "Bad request" });
  }
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
