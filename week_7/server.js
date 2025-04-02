const express = require("express");
const app = express();
const router = require('./route')
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.route('/api', router)

app.listen(PORT, () => {
  console.log(`App run on http://localhost:${PORT}`);
});
