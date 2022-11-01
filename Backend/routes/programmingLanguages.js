const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const programmingLanguages = require('../services/programmingLanguage');

/* GET programming languages. */
const jwtConfig = {
  secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
  refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767'
}

router.get('/', async function(req, res, next) {
  try {
    let val = await programmingLanguages.getMultiple();
    console.log(val.data[0].inspecturo_userEmail);
    console.log(val.data.length);
    res.json(val.data);
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post('/login', async function(req, res, next) {
  try {
    const password = req.body.password;
    const email = req.body.email;
    let val = await programmingLanguages.getMultiple();
    let isValidUser = false;
    for(let i = 0; i < val.data.length; i++) {
      if(email == val.data[i].inspecturo_userEmail) {
        isValidUser = true;
        const validPassword = await bcrypt.compare(password, val.data[i].inspecturo_userPassword);
        if (validPassword) {
          const accessToken = jwt.sign({ id: val.data[i].inspecturo_userId }, jwtConfig.secret)
          res.status(200).json(accessToken);
        } else {
          res.status(400).json({ error: "Invalid Password" });
        }
      }
    }
    if(!isValidUser) res.status(400).json({ error: "User does not exist" });
    
  } catch (err) {
    console.error(`Error while logging in`, err.message);
    next(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    // console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    let val = await programmingLanguages.getMultiple();
    let isEmailAlreadyInUse = false;
    for(let i = 0; i < val.data.length; i++) {
      if(req.body.email == val.data[i].inspecturo_userEmail) isEmailAlreadyInUse = true;
    }
    // console.log(username);
    if(!isEmailAlreadyInUse) {
      let id = val.data.length + 1;
      const accessToken = jwt.sign({ id: id }, jwtConfig.secret)
      await programmingLanguages.create({id, username, email, password});
      res.json(accessToken);
    } else {
      res.json({error: {email: 'This email is already in use.'}});
    }
  } catch (err) {
    console.error(`Error while registering`, err.message);
    next(err);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
});

module.exports = router;