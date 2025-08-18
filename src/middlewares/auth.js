
/**
 * Authentication Middleware
 * Provides JWT-based authentication for protected routes
 */

// Import required modules
const User = require("../models/user.js") // User model for database operations
const jwt = require("jsonwebtoken"); // JWT token verification


/**
 * Authentication middleware to protect routes
 * Verifies JWT token from cookies and attaches user to request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if authentication succeeds, sends error response otherwise
 */
const userAuth = async (req,res,next)=>{

    try{
    // Check if request has cookies object
    if(!req.cookies){
            throw new Error('cookie not found')
    }

    // Debug log to see request details
    console.log(req);

    // Extract JWT token from cookies
    const {token} = req.cookies;


    // If no token is found, user is not authenticated
    if(!token){
       return res.status(401).send("Please Login!");
    }

    // Verify the JWT token with the secret key
    var decoded = await jwt.verify(token,'urs48#jfj')

    // Extract user ID from the decoded token
    const {_id_} = decoded;

    // Find the user in the database by ID
    let user_detail = await User.findById(_id_).exec();

    // If user not found in database, token is invalid
    if(!user_detail){

     throw new Error('invalid user');
    }

    // Attach the user object to the request for use in route handlers
    req.user = user_detail;

    // Proceed to the next middleware or route handler
    next()
}
catch(err){
    // Handle authentication errors and return appropriate response
    res.status(400).send('error:'+err.message);
}
}



/**
 * Export authentication middleware functions
 */
module.exports = {
userAuth // Authentication middleware for protected routes
};