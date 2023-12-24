const User = require("../models/User");

module.exports.renderSignUpPage = (req ,res)=>{
    res.render("user/signup.ejs");
 }

module.exports.signUp = async (req , res )=>{
    try {

     let {username , email , password} = req.body;
     const newUser=  new User({ username , email})
     const registerdUser = await User.register(newUser , password);
     console.log(registerdUser);
 
     req.login(registerdUser , (err)=>{

         if(err){
            return next(err)
         }
         req.flash("success" , "Welcome To TravelBliss");
         res.redirect("/listings");
     })
    } catch(e) {
     req.flash("error" , e.message);
     res.redirect("/signup");
    }
} 

module.exports.renderLoginPage = (req , res)=>{
    res.render("user/login.ejs");
}

module.exports.login =async(req , res)=>{
   
    req.flash("success" , "Welcome To TravelBliss" );
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);

   }
module.exports.logout = (req , res , next)=>{
       req.logOut((err)=>{
          if(err){
           return next(err);
          }
       req.flash("success" , "You are Logged Out");
       res.redirect("/listings");
    })
}   




