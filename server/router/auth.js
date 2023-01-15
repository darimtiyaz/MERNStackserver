const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");

require('../db/conn');
const User = require("../model/userSchema");

router.get('/', (req, res) =>{
  res.send(`Hello World from the server router js`);
});
// using promises
// router.post('/register', (req, res) => {
//    const {name, email, phone, work, password, cpassword} = req.body;
//
//    if (!name || !email || !phone || !work || !password || !cpassword) {
//        return res.status(422).json({ error: "plz filled the field properly" });
//    }
//    User.findOne({ email: email })
//        .then((userExist) => {
//          if(userExist) {
//            return res.status(422).json({ error: "Email already Exists"});
//          }
//          const user = new User({name, email, phone, work, password, cpassword });
//
//          user.save().then(() => {
//            res.status(201).json({ message: "user registered successfuly" });
//          }).catch((err) => res.status(500).json({ error: "Failed to registered" }));
//        }).catch(err => { console.log(err); });
//});


router.post('/register', async(req, res) => {
  const { name, email, phone, work, password, cpassword} = req.body;
  
  if(!name || !email || !phone || !work || !password || !cpassword){
    return res.status(422).json({error:"plz filled the field properly"})
  }                                                                                                      try{  
      const userExist = await User.findOne({ email: email });
      const token = await userLogin.generateAuthToken();
      
        if(userExist) {
          return res.status(422).json({ error: "Email already Exists"});
        }else if(password != cpassword){
          return res.status(422).json({ error: "password not matching"});
        } else {

            const user = new User({name, email, phone, work, password, cpassword});
        
        //yetat
       /* const userRegister =*/ await user.save();
        //console.log(`${user} user Registered successfully`);
        //console.log(userRegister);
        res.status(201).json({ message: "user registered successfully"});
        }
  } catch(err) {
      consolr.log(err);
  }  
});

// login route
router.post('/signin', async(req, res)=>{
  try {
    let token;
      const { email, password } =req.body;

      if(!email || !password) {
          return res.status(400).json({error:"plz filled the data"})
      }
      const userLogin = await User.findOne({ email: email });
      //console.log(userLogin);
      if(userLogin) {
          const isMatch = await bcrypt.compare(password, userLogin.password);

          token = await userLogin.generateAuthToken();
          console.log(token);

          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 238964000000),
            httpOnly:true
          });

      if(!isMatch){
        res.status(400).json({ error: " Invalid Credientials "});
      }else{
        res.json({ message: "user Signin successfully"});
      }
      }else {
      res.status(400).json({ error: "Invalid Credientials "});
    }

    } catch (err){
      console.log(err);
    }
});
// about ka page
router.get('/about', authenticate, (req, res) => {
  console.log(`Hello my about`);
  res.send(req.rootUser);
});
//get userdata for contact us and home page
router.get('/getdata', authenticate, (req, res) => {
  console.log(`Hello my About`);
  res.send(req.rootUser);
});

// contact us page

router.post('/contact', authenticate, async (req, res) => {
  try {
    const { name, email, phone, message} = req.body;

    if(!name || !email || !phone || !message) {
      console.log("error in contact form");
      return res.json({ error: "plzz filled the contact form "});
    }
    const userContact = await User.findOne({ _id:req.userID });
    
    if(userContact) {
      const userMessage = await userContact.addMessage(name, email, phone, message);
      await userContact.save();
      res.status(201).json({ message: "user contact successfully" });
    }

  } catch(error) {
    console.log(error);
  }
});
//logout ka page
router.get('/logout', (req, res) => {
  console.log(`Hello my About page`);
  res.clearCookie('jwtoken', {path:'/'});
  res.status(200).send('User logout');
  //res.send(req.rootUser);
});

module.exports = router;