const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation.js")
const bcrypt = require("bcrypt");
const User = require("../models/user");



authRouter.post("/signup",async (req,res) => {
    try{
    // validate data
    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);

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


authRouter.post("/login",async (req,res) =>{
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
                expires: new Date(Date.now() + 133 * 55000)
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


authRouter.post("/logout", async (req,res)=>{

    res.cookie('token',null, {
        expires: new Date(Date.now())
    });

    res.send("logout successfully")
    
})    

module.exports = authRouter;
    