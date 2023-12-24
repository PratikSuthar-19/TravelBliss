const express = require("express");
const User = require("../models/User");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const {saveRedirectURL} = require("../middleware.js");
const userController = require("../controllers/user.js");


// "/"

//signup Page and signup
router.route("/signup")
      .get(userController.renderSignUpPage)
      .post(wrapAsync(userController.signUp));


//login page and login

router.route("/login")
      .get(userController.renderLoginPage)
      .post(saveRedirectURL, passport.authenticate("local" , {failureFlash: true , failureRedirect:"/login"}),userController.login);


//logout
router.get("/logout" , userController.logout);

module.exports = router;



//signup page 
// router.get("/signup" , userController.renderSignUpPage);

//signup
// router.post("/signup" ,wrapAsync(userController.signUp));

//login page
// router.get("/login",userController.renderLoginPage);

//login
// router.post("/login" ,saveRedirectURL, passport.authenticate("local" , {failureFlash: true , failureRedirect:"/login"}),userController.login);
 
//logout
// router.get("/logout" , userController.logout);


