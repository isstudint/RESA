const express = require('express');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.post("/sign", async (req, res) => {
  if (req.body.username === "admin" && req.body.password === "12345") {
    res.json({ message: "ok" });
  } else {
    res.json({ message: "not ok" });
  }
});

app.listen(3000, () => {
  console.log("running");
});
