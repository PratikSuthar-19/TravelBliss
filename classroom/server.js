const express = require("express");
const session = require('express-session');
var flash = require('connect-flash');

const app = express();

let port = 3001;
const sessionOption =
{
    secret : "mysupersecretstring" ,
 resave : false ,
  saveUninitialized :true 
}
app.use(session(sessionOption));
app.use(flash());

app.get("/" , (req , res)=>{
    console.log(req.session);
})
app.get("/register" , (req , res)=>{
   
    let {name = "anonymouse" } = req.query;
    req.session.name = name;
// res.send( `helllo ${name}`);
res.redirect("/hello");
})

app.get("/hello" , (req , res)=>{
    res.send( `helllo ${req.session.name}`);

})
app.get("/test" , (req , res)=>{
    req.session.pratik = "pratik"
    console.log(req.session);
    res.send("test successfull");
})
app.listen(port , ()=>{
    console.log("app is listning");
})