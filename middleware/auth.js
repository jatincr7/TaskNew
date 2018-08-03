const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.use((req, res, next) => {
  const token = req.body.token || req.body.headers[token];

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, err => {
      if (err) {
        res.status(404).send("Token is Invalid");
      } else {
        next();
      }
    });
  } else {
    res.status(403).send("Please Send a token");
  }
});
