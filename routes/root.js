const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  console.log("root.js")
  //   res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
