const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js")

/**
 * User Router
 * Handles all user-related operations including viewing connection requests, connections, and user feed
 * All routes require authentication
 */

// Define fields that are safe to expose to other users (used for populating user data)
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

/**
 * Get Received Connection Requests Route
 * Retrieves all pending connection requests sent to the authenticated user
 * 
 * @route GET /user/request/received
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @returns {Object} JSON response with all pending connection requests and sender details
 */
userRouter.get("/user/request/received",userAuth, async (req,res) => {

    try{

        // Find all connection requests where the current user is the recipient and status is 'interested'
        const allRequestsReceived = await ConnectionRequest.find({
            toUserId : req.user._id,
            status : "interested" // Only get pending requests that haven't been accepted/rejected yet
        }).populate("fromUserId", ["firstName","lastName","age","gender","about","skills","photoUrl"]); // Include sender user details

        // Return success response with the requests data
        res.json({
            message:"data fetch successfuly",
            data : allRequestsReceived,
        });

    }
    catch(err){

      // Return error if request retrieval fails
      res.status(400).send("Error :" + err);
    }

    

});

/**
 * Get User Connections Route
 * Retrieves all accepted connections for the authenticated user
 * 
 * @route GET /user/connections
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @returns {Object} JSON response with all connected users' details
 */
userRouter.get("/user/connections",userAuth, async (req,res) =>{

    try{

        // Find all connection requests where the current user is either sender or recipient and status is 'accepted'
        const allConnections = await ConnectionRequest.find({

            $or: [
                { fromUserId : req.user._id , status : "accepted"}, // User sent the request
                {toUserId : req.user._id , status : "accepted"}    // User received the request
            ]

        }).populate("fromUserId", ["firstName","lastName","age","gender","about","skills","photoUrl"]). // Include sender details
        populate("toUserId", ["firstName","lastName","age","gender","about","skills","photoUrl"]); // Include recipient details

        // Transform the data to only include the connected user (not the current user)
        const data = allConnections.map((row) => {
            if(row.fromUserId._id.toString() === req.user._id.toString()){
                return row.toUserId; // If current user is sender, return recipient
            }
            return row.fromUserId; // If current user is recipient, return sender
        });

        // Return success response with the connections data
        res.json({data});

    }
    catch(err){
        // Return error if connections retrieval fails
        res.status(400).send("Error : " + err);
    }
});

/**
 * Get User Feed Route
 * Retrieves potential connections for the authenticated user with pagination
 * Excludes users that already have connection requests and the current user
 * 
 * @route GET /feed
 * @middleware userAuth - Ensures user is authenticated before accessing this route
 * @param {number} req.query.page - Page number for pagination
 * @param {number} req.query.limit - Number of users per page
 * @returns {Array} Array of potential connection users with safe data fields
 */
userRouter.get("/feed",userAuth, async(req,res) =>{

    try{

        // Get the authenticated user
        const loggedInUser = req.user;

        // Parse pagination parameters from query string
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit; // Calculate offset for pagination

        // Find all connection requests involving the current user (sent or received)
        const connectionRequests = await ConnectionRequest.find({
            $or:[{ fromUserId: loggedInUser._id },{toUserId: loggedInUser}],
        }).select("fromUserId toUserId");

        // Create a set of user IDs to exclude from the feed (users with existing connection requests)
        const hideUsersFromFeed = new Set();

        // Add both sender and recipient IDs from each connection to the exclusion set
        connectionRequests.forEach((conn)=>{
            hideUsersFromFeed.add(conn.fromUserId.toString());
            hideUsersFromFeed.add(conn.toUserId.toString());
        });

        // Debug log to see excluded users
        console.log(hideUsersFromFeed);

        // Find users that are not in the exclusion set and not the current user
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) }}, // Exclude users with existing connections
                { _id: { $ne: loggedInUser._id}}, // Exclude the current user
            ],
        }).select(USER_SAFE_DATA) // Only include safe user data fields
        .skip(skip) // Apply pagination offset
        .limit(limit); // Limit number of results

        // Return the filtered users
        res.send(users);

    }
    catch(err){

        // Return error if feed retrieval fails
        res.status(400).json({message : err.message});

    }
});

// Export the router for use in other files
module.exports = userRouter;

