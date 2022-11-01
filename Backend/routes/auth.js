const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const programmingLanguages = require('../services/programmingLanguage');
const AuthService = require('../services/authService');

router.get('/me', async function(req, res, next) {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.decode(token, { complete: true });
        if (decoded) {
            const { id: userId } = decoded.payload;
            let val = await programmingLanguages.getMultiple();
            let isValidUser = false;
            for(let i = 0; i < val.data.length; i++) {
                if(userId == val.data[i].inspecturo_userId) {
                    isValidUser = true;
                    const userData = JSON.parse(JSON.stringify({id: val.data[i].inspecturo_userId, email: val.data[i].inspecturo_userEmail, role: 'admin'}));
                    res.status(200).json(userData);
                }
              }
          } else {
            res.status(200).json({ error: { error: 'Invalid User' } });
          }
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
});

router.post('/forgotpassword', async function(req , res) {
  const data = await AuthService.verifyEmail(req.body.email);
  console.log(data)
  const resd=data.data[0];
  if(resd){
    res.send({
      success: true,
      returnId: resd.inspecturo_userId
    })
  }
  else{
    res.send({})
  }
})

router.post('/resetpassword', async function(req , res) {
  const data = await AuthService.resetPassword(req.body.email,req.body.password);
  if(data.data.affectedRows==1){
    res.send({
      success: true,
    })
  }
  else{
    res.send({})
  }
})

module.exports = router;