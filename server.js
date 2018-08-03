const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();

const bodyparser = require("body-parser");
const port = process.env.PORT || 3000;
const Users = require("./routes/users");
app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
router.post("/login", Users.login);
router.get("/getusers", Users.getuser);
router.post("/register", Users.register);
app.use("/api", router);
app.listen(port, () => {
  console.log("Server Listening on port :" + port);
});
