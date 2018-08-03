const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jatin",
  database: "pro"
});
connection.connect(err => {
  if (err) {
    throw err;
    console.log(err);
  }

  console.log("Connected to the Database Successfully");
});
module.exports.connection = connection;
