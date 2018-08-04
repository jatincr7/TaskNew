//const con = require("../Database/db");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const AWS = require("aws-sdk");
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
exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  con.query("SELECT * FROM cloud_user WHERE email = ?", [email], function(
    error,
    results,
    fields
  ) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        code: 400,
        failed: "error ocurred"
      });
    } else {
      // console.log('The solution is: ', results);
      if (results.length > 0) {
        if (results[0].password == password) {
          res.send({
            code: 200,
            success: "login sucessfull"
          });
        } else {
          res.send({
            code: 204,
            success: "Email and password does not match"
          });
        }
      } else {
        res.send({
          code: 204,
          success: "Email does not exists"
        });
      }
    }
  });
};

//api for getting all  users//
exports.getuser = (req, res) => {
  con.connect((err, connection) => {
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

    con.release();
  });
};
exports.createInstance = (req, res) => {
  console.log("creating instance");
  AWS.config.update({ region: "us-east-2" });
  // Load credentials and set region from JSON file
  AWS.config.loadFromPath("./config.json");

  // Create EC2 service object
  // var ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

  // AMI is amzn-ami-2011.09.1.x86_64-ebs
  var instanceParams = {
    ImageId: "AMI_ID",
    InstanceType: "t1.micro",
    KeyName: "KEY_PAIR_NAME",
    MinCount: 1,
    MaxCount: 1
  };
  // console.log("ip", instanceParams);
  //Create a promise on an EC2 service object
  var instancePromise = new AWS.EC2({ apiVersion: "2016-11-15" })
    .runInstances(instanceParams)
    .promise();
  console.log("ip", instancePromise);
  //Handle promise's fulfilled/rejected states
  instancePromise.then(function(data) {
    console.log(data);
    var instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    tagParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: "Name",
          Value: "SDK Sample"
        }
      ]
    };
    //Create a promise on an EC2 service object
    var tagPromise = new AWS.EC2({ apiVersion: "2016-11-15" })
      .createTags(tagParams)
      .promise();
    // Handle promise's fulfilled/rejected states
    tagPromise
      .then(function(data) {
        console.log("Instance tagged");
      })
      .catch(function(err) {
        console.error(err, err.stack);
      });
    if (err) {
      console.log(err);
      return res.status(500).send("Sometthing went Wrong");
    } else {
      return res.status(200).send("Success");
    }
  });
};
