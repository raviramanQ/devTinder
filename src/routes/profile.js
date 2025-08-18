const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validation.js");

/**
 * Profile Router
 * Handles all user profile related operations including viewing and editing profiles
 * Requires authentication for all routes
 */

/**
 * View User Profile Route
 * Returns the authenticated user's profile information
 * 
 * @route GET /profile/view
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @returns {Object} JSON object containing user profile data
 */
profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    try{
    
        // Send the user object that was attached by the auth middleware
        res.send({message:'user----',user:req.user});
    
    }
    catch(err){
    
        // Return error if profile retrieval fails
        res.status(400).send("ERROR---- : " + err.message);
    
    }
    });


/**
 * Edit User Profile Route
 * Updates the authenticated user's profile information
 * 
 * @route PATCH /profile/edit
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @param {Object} req.body - Fields to update in the user profile
 * @returns {string} Success message when profile is updated successfully
 */
profileRouter.patch("/profile/edit",userAuth,async (req,res) => {

    try{

      // Validate the edit profile data from request
      const isValidEditData = validateEditProfileData(req);

      // If validation fails, throw an error
      if(!isValidEditData){

        throw new Error("invalid data");
      }

      // Get the authenticated user from the request object (set by auth middleware)
      const loggedInUser = req.user;

      // Update each field in the user object with corresponding values from request body
      Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));

      // Save the updated user to the database
      await loggedInUser.save();

      // Return success message
      res.send("profileUpdate successfully");


    }
    catch(err){

        // Return error if profile update fails
        res.status(400).send("error :" + err.message);
    }

});


/**
 * Edit User Password Route (Incomplete)
 * This route appears to be incomplete/under development
 * 
 * @route PATCH /profile/editPassword
 */
// profileRouter.patch("/profile/editPassword"){}

// Export the router for use in other files
module.exports = profileRouter;
