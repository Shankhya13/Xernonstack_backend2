const mysql = require("mysql2");
const DATABASE_URL =
  'mysql://ee716ecopy2jkrrraerg:pscale_pw_w1aKo4oiMtUoOsVO4Jn0l9URr1LlFmX16TYCDLwGAbe@ap-south.connect.psdb.cloud/xenonstack_backend?ssl={"rejectUnauthorized":true}';

const connection = mysql.createConnection(DATABASE_URL);

module.exports = connection;
