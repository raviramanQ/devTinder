const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation.js")
const bcrypt = require("bcrypt");
const User = require("../models/user");

/**
 * Authentication Router
 * Handles all authentication related routes including signup, login, and logout
 * Uses JWT for authentication and bcrypt for password hashing
 */

/**
 * User Signup Route
 * Creates a new user account with encrypted password and returns JWT token
 * 
 * @route POST /signup
 * @param {Object} req.body - User registration data
 * @param {string} req.body.firstName - User's first name
 * @param {string} req.body.lastName - User's last name
 * @param {string} req.body.emailId - User's email address
 * @param {string} req.body.password - User's password (will be encrypted)
 * @param {Array} req.body.skills - User's skills
 * @param {number} req.body.age - User's age
 * @param {string} req.body.gender - User's gender
 * @param {string} req.body.photoUrl - URL to user's profile photo
 * @returns {Object} JSON response with user data and success message
 */
authRouter.post("/signup",async (req,res) => {
    try{
    // validate data from request body
    validateSignUpData(req);

    const {firstName,lastName,emailId,password,skills,age,gender,photoUrl} = req.body;

    // Encrypt the password using bcrypt with salt rounds of 10
    const passwordHash = await bcrypt.hash(password,10);

    // creating a new instance of the user model with validated data
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash, // store the hashed password, not the plain text
        skills,
        age,
        gender,
        photoUrl

    });

    // Save the new user to the database
    const saveUser = await user.save();

    // Generate JWT token for the newly created user
    const token = await saveUser.getJWT();  
            
    // Set the token in a cookie that expires in ~2 hours
    res.cookie('token',token, {
        expires: new Date(Date.now() + 133 * 55000)
    });

    
    // Return success response with the saved user data
    res.json({message:"user added successfully",data:saveUser});

    }catch (err) {
        // Return error if user creation fails
        res.status(400).send("Error saving the user:" + err.message);
    }
});


/**
 * User Login Route
 * Authenticates a user and returns JWT token if credentials are valid
 * 
 * @route POST /login
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.emailId - User's email address
 * @param {string} req.body.password - User's password
 * @returns {Object} User object if authentication succeeds
 */
authRouter.post("/login",async (req,res) =>{
    try{
        // Extract email and password from request body
        const {emailId,password} = req.body;
    
    
        // Find user with the provided email in the database
        const user = await User.findOne({ emailId: emailId}).exec();
    
        console.log('------1234567',user); // Debug log to track user retrieval
    
        if(!user){
            // If no user found with that email, throw error
            throw new Error("invalid credentials");
            
        }
    
        /*  NOTE: 
                previously we have done bcrypt here
                const isPasswordValid = await bcrypt.compare(password,user.password);  
        */
    
        // Validate password using the method defined in the user model
        const isPasswordValid = await user.validatePassword(password);  
    
    
        if(isPasswordValid){
          
        /*  NOTE:
                previously we have done jwt sign here but now we take in to user schema which is helper method level.
                var token = jwt.sign({ _id_: user._id }, 'urs48#jfj', { expiresIn: '30s' });
        */
    
            // create a jwt token using the user model method
            const token = await user.getJWT();  
            
            // Add the token to the cookie and send the response back to the user
    
            // Set cookie with token that expires in ~2 hours
            res.cookie('token',token, {
                expires: new Date(Date.now() + 133 * 55000)
            });
    
            // Send the complete user object as response
            res.send(user);
    
        }
        else{
            // If password is invalid, throw error
            throw new Error("invalid credentials");
            
        }
    }catch (err){
        // Return error if authentication fails
        res.status(400).send("ERROR :" + err.message);
    }
        
    });


/**
 * User Logout Route
 * Invalidates the user's authentication token by setting it to null and expiring it
 * 
 * @route POST /logout
 * @returns {string} Success message indicating logout was successful
 */
authRouter.post("/logout", async (req,res)=>{

    // Invalidate the token by setting it to null and expiring it immediately
    res.cookie('token',null, {
        expires: new Date(Date.now())
    });

    // Send confirmation message to client
    res.send("logout successfully")
    
})    

module.exports = authRouter;
    