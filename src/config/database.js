/**
 * Database Configuration
 * Provides MongoDB connection functionality using Mongoose
 */

// Import Mongoose for MongoDB interactions
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Establishes connection to MongoDB Atlas cluster for the devTinder application
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when connection is established
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB Atlas using connection string
        await mongoose.connect(
           "mongodb+srv://manvi0706:Manvi%400706@namastenode.lo6vnmq.mongodb.net/devTinder"
        );
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Exit process with failure if connection fails
        process.exit(1);
    }
};

// Export the connection function for use in app.js
module.exports = connectDB;