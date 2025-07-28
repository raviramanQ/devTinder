const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation.js")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth.js")

app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth"); 
const profileRouter = require("./routes/profile"); 
const requestRouter = require("./routes/request"); 


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB().then(()=>{
    console.log("DB connected");
    app.listen(3000, ()=>{
        console.log('congratulation my server is running')
    });
}).catch(err=>{
    console.error("Database cannot be established");
});



