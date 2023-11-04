
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
/*   host: 'localhost',
  user: 'root',
  password: "",
  database: 'newtimebank', */
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "newtimebank",
  });
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0


module.exports = pool;