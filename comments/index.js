const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const app = express();

// parse requests of content-type: application/json
app.use(express.json());
app.use(cors());
//store all the resources in memory
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  if (content) {
    console.log(content);
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content });

    commentsByPostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
      type: "CommentAdded",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
      },
    });

    return res.status(201).send(comments);
  }
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
