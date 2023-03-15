const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const connection = require("./db");
const route = require("./router/router");
const PORT = process.env.PORT || 3002;
const host = "0.0.0.0";
require("dotenv").config({ path: "./config/.env" });

app.use(cookieParser());

app.use(cors());

bodyParser.urlencoded({ extended: false });
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use("/", route);
connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the Myconnection server.");
});

const server = app.listen(
  PORT,
  host,
  console.log(`Server is running on ${PORT}`)
);
