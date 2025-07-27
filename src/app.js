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

app.post("/signup",async (req,res) => {
    try{
    // validate data

    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password

    const passwordHash = await bcrypt.hash(password,10);

    // console.log(passwordHash);

    // creating a new instance of the user model

    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    });

   
    await user.save();
    res.send("user added successfully")
    }catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
});

app.post("/login",async (req,res) =>{
try{
    const {emailId,password} = req.body;


    const user = await User.findOne({ emailId: emailId}).exec();

    console.log('------1234567',user);

    if(!user){
        throw new Error("invalid credentials");
        
    }

    /*  NOTE: 
            previously we have done bcrypt here
            const isPasswordValid = await bcrypt.compare(password,user.password);  
    */

        const isPasswordValid = await user.validatePassword(password);  


    if(isPasswordValid){
      
    /*  NOTE:
            previously we have done jwt sign here but now we take in to user schema which is helper method level.
            var token = jwt.sign({ _id_: user._id }, 'urs48#jfj', { expiresIn: '30s' });
    */

        // create a jwt token  
        const token = await user.getJWT();  
        
        // Add the token to the cookie and send the response back to  the user

        res.cookie('token',token, {
            expires: new Date(Date.now() + 1 * 15000)
        });



        res.send("Login Successfully");
    }
    else{
        throw new Error("invalid credentials");
        
    }
}catch (err){
    res.status(400).send("ERROR :" + err.message);
}
    
});

app.post("/profile",userAuth,async (req,res)=>{

try{

    res.send({message:'user----',user:req.user});

}
catch(err){

    res.status(400).send("ERROR---- : " + err.message);

}
});

app.post("/sendConnectionRequest",userAuth,async (req,res)=>{

const user = req.user;

res.send(user.firstName + " sent the connection request ");


});









connectDB().then(()=>{
    console.log("DB connected");
    app.listen(3000, ()=>{
        console.log('congratulation my server is running')
    });
}).catch(err=>{
    console.error("Database cannot be established");
});



