const mysql = require('mysql2');

// Connecting to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employee_tracker_db',
  },
  console.log('You are now connected!')
);

module.exports = db;
