//const con = require("../Database/db");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const mysql = require("mysql");
process.env.SECRET_KEY = "jatin";
router.use(cors());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jatin",
  database: "pro"
});

con.connect((err, conn) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connection established");
  }
});

//api for registering user//
module.exports.register = function(req, res) {
  console.log("Getting register request");
  let today = new Date();

  let user_data = {
    id: "1",
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  };
  console.log("req", req);
  // con.connect((err, conn) => {
  //   if (err) {
  //     console.log(err.message);
  //     return res.status(500).send("Internal Server Error");
  //   } else {
  con.query(`INSERT INTO cloud_user SET ?`, user_data, (err, data, field) => {
    if (err) {
      console.log(err);
      console.log(user_data.first_name);
      return res.status(400).send("Error Occured");
    } else {
      return res.status(201).send("User Registered Successfully");
    }
  });
  //}
  //con.end();
  //});
};
//api for login//
exports.login = function(auth, req, res) {
  console.log("Getting login request");
  const email = req.body.email;

  const password = req.body.password;

  db.connection.connect(err => {
    if (err) {
      return res.status(500).send("Internal Server error");
    } else {
      db.connection.query(
        "SELECT * FROM cloud_user where email=?",
        [email],
        (err, row, field) => {
          if (err) {
            return res.status(400).send("Error Occured");
          } else {
            if (row.length > 0) {
              if (row[0].password == password) {
                token = jwt.sign(row[0], process.env.SECRET_KEY, {
                  expiresIn: 5000
                });
                return res.status(200).send(token);
              } else {
                return res.status(204).send("email or password is incorrect");
              }
            }
          }
          connection.release();
        }
      );
    }
  });
};
//api for getting all  users//
exports.getuser = (req, res) => {
  connection.connect((err, connection) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    } else {
      db.connection.query("SELECT * FROM cloud_user", (err, res, field) => {
        if (!err) {
          return res.status(200).json(res);
        } else {
          return res.status(204).send("No Data Found");
        }
      });
    }

    connection.release();
  });
};
