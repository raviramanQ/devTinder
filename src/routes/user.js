const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js")

const USER_SAFE_DATA = "firsrName lastName photoUrl age gender about skills";

// Get all the pending request for the loggedIn user
userRouter.get("/user/request/received",userAuth, async (req,res) => {

    try{

        const allRequestsReceived = await ConnectionRequest.find({
            toUserId : req.user._id,
            status : "interested"
        }).populate("fromUserId", ["firstName","lastName","age","gender","about","skills"]);

        res.json({
            message:"data fetch successfuly",
            data : allRequestsReceived,
        });

    }
    catch(err){

      res.status(400).send("Error :" + err);
    }

    

});

userRouter.get("/user/connections",userAuth, async (req,res) =>{

    try{

        const allConnections = await ConnectionRequest.find({

            $or: [
                { fromUserId : req.user._id , status : "accepted"},
                {toUserId : req.user._id , status : "accepted"}
            ]

        }).populate("fromUserId", ["firstName","lastName","age","gender","about","skills"]).
        populate("toUserId", ["firstName","lastName","age","gender","about","skills"]);;

        const data = allConnections.map((row) => {
            if(row.fromUserId._id.toString() === req.user._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});

    }
    catch(err){
        res.status(400).send("Error : " + err);
    }
});

userRouter.get("/feed",userAuth, async(req,res) =>{

    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[{ fromUserId: loggedInUser._id },{toUserId: loggedInUser}],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.foreach((conn)=>{
            hideUsersFromFeed.add(conn.fromUserId.toString());
            hideUsersFromFeed.add(conn.toUserId.toString());
        });

        console.log(hideUsersFromFeed);

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) }},
                { _id: { $ne: loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.send(users);

    }
    catch(err){

        res.status(400).json({message : err.message});

    }
});

module.exports = userRouter;

