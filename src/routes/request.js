const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

/**
 * Connection Request Router
 * Handles all connection request operations between users including sending and reviewing requests
 * All routes require authentication
 */

/**
 * Send Connection Request Route
 * Creates a new connection request from the authenticated user to another user
 * 
 * @route POST /request/send/:status/:toUserId
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @param {string} req.params.status - Status of the connection request (interested or ignored)
 * @param {string} req.params.toUserId - ID of the user to whom the request is being sent
 * @returns {Object} JSON response with message and connection request data
 */
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {

    try{

        // Get the ID of the authenticated user (sender)
        const fromUserId = req.user._id;
        // Get the ID of the recipient user from URL parameters
        const toUserId = req.params.toUserId;
        // Get the status of the connection request from URL parameters
        const status = req.params.status;

        // Define allowed status values for sending a request
        const isAllowedStatus = ["ignored","interested"];

        // Validate that the provided status is allowed
        if(!isAllowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: " + status});
        };

        // is toUsedId exist in db

        // Check if the recipient user exists in the database
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"user not found"});
        }

        // if there is already existing connection request in db

        // Check if a connection request already exists between these users (in either direction)
        const isExistConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId}, // From current user to target user
                {fromUserId:toUserId , toUserId:fromUserId}, // From target user to current user
            ],
        });

        // If a connection already exists, return an error
        if(isExistConnectionRequest){
           return res.status(400).json({message:"Connection request already exist"});
        }


        // Create a new connection request object
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
           
        });

        // Save the connection request to the database
        const data = await connectionRequest.save();

        // Return success response with connection details
        res.json({
            message: `${req.user.firstName} is ${status} ${status === 'interested' ? 'in' : ''} ${toUser.firstName}`,
            data,
        });


    }
    catch(err){
        // Return error if request creation fails
        res.status(400).send("ERROR: "+ err.message);
    }
    
    });


/**
 * Review Connection Request Route
 * Allows a user to accept or reject a connection request sent to them
 * 
 * @route POST /request/review/:status/:requestId
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @param {string} req.params.status - New status for the request (accepted or rejected)
 * @param {string} req.params.requestId - ID of the connection request to review
 * @returns {string} Success message when request is updated successfully
 */
requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res) =>{

   try{

    // Get the new status from URL parameters
    const status = req.params.status;
    // Define allowed status values for reviewing a request
    const allowedStatus = ["accepted","rejected"];

    // Check if the provided status is allowed
    const isAllowedStatus = allowedStatus.includes(status);

    // If status is not valid, return an error
    if(!isAllowedStatus){

        res.status(400).send("invalid status");
    }

    // Get the ID of the authenticated user (recipient of the request)
    const toUserId = req.user._id;
    // Get the ID of the connection request from URL parameters
    const reqId = req.params.requestId;


    // Find the connection request that matches the request ID, is sent to the current user, and has 'interested' status
    const isExistConnectionRequest = await ConnectionRequest.findOne({
        _id:reqId,
        toUserId:toUserId,
        status:"interested" // Only 'interested' requests can be reviewed
    
    }
    );

    // Debug log to track the found connection request
    console.log(isExistConnectionRequest);
    

    // If no matching request is found, return an error
    if(!isExistConnectionRequest){
        res.status(400).send("invalid connection request not found");
    }

    // Update the status of the connection request
    isExistConnectionRequest.status = status;

     // Save the updated connection request to the database
     await isExistConnectionRequest.save();

    // Return success response
    res.status(200).send("success");

   }
   catch(err){

    // Return error if request review fails
    res.status(400).send("Error : " + err);

   }       

});


// Export the router for use in other files
module.exports = requestRouter;
