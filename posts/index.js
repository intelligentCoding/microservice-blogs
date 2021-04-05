const express = require("express");
const { randomBytes } = require("crypto");
const cors = require('cors');
const app = express();

// parse requests of content-type: application/json
app.use(express.json());
app.use(cors());
//store all the resources in memory
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  if (title) {
    posts[id] = {
      id,
      title,
    };

    return res.status(201).send(posts[id]);
  }
  return res.status(400).send({ error: "Must send title" });
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
