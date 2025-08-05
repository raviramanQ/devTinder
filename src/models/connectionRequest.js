const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the user collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required:true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }

},
{
timestamps:true,
}
); 

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;
    // check if the fromUserId is same toUserId

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself");
        
    }
    next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest", // mongoose will convert it into plural with lower case this is collection name mongoDB
    connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
