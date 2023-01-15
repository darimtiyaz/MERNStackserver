const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env'});
require('./db/conn');
//const User = require('./model/userSchema');

app.use(express.json());

//we link the router files to make our route easy
app.use(require('./router/auth'));
const PORT = process.env.PORT;



//Middleware
//const middleware = (req, res, next) =>{
//  console.log(`Hello my middleware`);
//  next();
//}
//middleware();

app.get('/', (req, res) =>{
  res.send(`Hello World from the server`);
} );

// app.get('/about', middleware, (req, res) =>{
//   console.log(`Hello my about`);
//   res.send(`Hello About world from the server`);
// });


app.get('/contact', (req, res) =>{
  //res.cookie("Test", 'thapa');
  res.send(`Hello Contact World from the server `);
});

// app.get('/signin', (req, res)=>{
//   res.send(`Hello Login world from the server`);
// });
app.get('/signup', (req, res) =>{
  res.send(`Hello Registration world from the server`);
});
//console.log(`subscribe my channel`);

app.listen(PORT, () =>{
  console.log(`server is running at port no ${PORT}`);
})