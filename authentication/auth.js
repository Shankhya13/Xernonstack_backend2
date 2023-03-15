const user = require("../model/user");
const sql = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  //Validate data
  //Read data from request body
  console.log(req.body);
  const { name, password } = req.body;
  let errors = [];
  if (!name || !password) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  //check for errors
  if (errors.length > 0) {
    return res.status(401).send(errors);
  } else {
    const saltRounds = 10;
    var hashPassword = req.body.password;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(hashPassword, salt, function (err, hash) {
        hashPassword = hash;
        const newUser = new user({
          name: req.body.name,
          password: hashPassword,
        });
        sql.query("INSERT INTO user SET ?", newUser, (err, result) => {
          if (err) {
            const errorMessage =
              err.errno == 1062
                ? `${req.body.name} already exist`
                : err.sqlMessage;
            // console.log(errorMessage)
            return res.status(400).send(errorMessage);
          } else {
            console.log("user Registered");
            return res.status(200).send(newUser);
          }
        });
      });
    });
  }
};

exports.login = async (req, res, next) => {
  //Read data from request body
  console.log(req.body);
  const { name, password } = req.body;
  let errors = [];

  //Validate data
  if (!name || !password) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  //Check for errors
  if (errors.length > 0) {
    res.status(401).send(errors);
  }
  sql.query("SELECT * FROM user WHERE name=?", name, async (err, result) => {
    if (result.length == 0) {
      return res.status(401).send("Email is Not Registered");
    } else {
      const hashPassword = result[0].password;

      // If the user doesn't exist or the password is incorrect, return an error response
      if (!(await bcrypt.compare(password, hashPassword))) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET);

      // res.clearCookie('access_token')
      // Return the token
      return res.status(200).json({
        token: token,
      });
      // });
    }
  });
};
