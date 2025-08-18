/**
 * Connection Request Model
 * Represents a connection request between two users in the application
 */

// Import Mongoose for schema definition and database operations
const mongoose = require("mongoose");

/**
 * Connection Request Schema
 * Defines the structure for connection requests between users
 * Includes sender, recipient, and status information
 */
const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: "User", // Reference to the User model for population
        required: true, // This field must be provided
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        required: true, // This field must be provided
        ref: "User" // Reference to the User model for population
    },
    status: {
        type: String, // String field for status
        required: true, // This field must be provided
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"], // Allowed status values
            message: `{VALUE} is incorrect status type` // Custom error message for invalid values
        }
    }

},
{
    timestamps: true, // Automatically add createdAt and updatedAt fields
}
); 

/**
 * Pre-save middleware
 * Validates that users cannot send connection requests to themselves
 * Runs before each document save operation
 */
connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this; // Current document being saved
    
    // Check if the sender and recipient are the same user
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself");
    }
    
    // Proceed with the save operation if validation passes
    next();
});

/**
 * Create the Mongoose model from the schema
 */
const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest", // Collection name (Mongoose will convert to 'connectionrequests' in MongoDB)
    connectionRequestSchema, // Schema definition
);

// Export the model for use in other files
module.exports = ConnectionRequestModel;
