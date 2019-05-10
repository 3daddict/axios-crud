require('dotenv').config();
const axios = require('axios');
const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DATABASE
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});


app.post('/insert', function(req, res){
  const user = {
    firstname: req.query.firstname,
    lastname: req.query.lastname,
    email: req.query.email,
    phone: req.query.phone
  }
  connection.query('INSERT INTO users SET ?', user, (err, rows) => {
    if (err) {
      console.error('An error occurred while executing the query')
      throw err
    }
    console.log(rows)
    res.end()
  })
});

app.get('/get', (req, res) => {
  connection.query(`SELECT * FROM users`, (err, rows) => {
    if(err) throw err
    console.log(rows);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows))
  })
})


app.listen(PORT, () => {
  console.log(`App Lisening on Port: ${PORT}`)
})

