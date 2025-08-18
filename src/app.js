/**
 * Main Application Entry Point
 * Sets up Express server with middleware, routes, and database connection
 */

// Import required packages and modules
const express = require("express"); // Web framework for Node.js
const connectDB = require("./config/database"); // Database connection function
const app = express(); // Create Express application instance
const User = require("./models/user"); // User model for database operations
const {validateSignUpData} = require("./utils/validation.js") // Data validation utilities
const bcrypt = require("bcrypt"); // Password hashing library
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const jwt = require("jsonwebtoken"); // JWT token generation and verification
const {userAuth} = require("./middlewares/auth.js") // Authentication middleware
const cors = require("cors"); // Cross-Origin Resource Sharing middleware

app.use(cors({
    origin: "http://localhost:5173", // Allow requests from the frontend running on this URL
    credentials: true, // Allow cookies and authentication headers to be included in requests/responses
})
);

app.use(express.json()); // Parse JSON request bodies

app.use(cookieParser()); // Parse cookies from request headers

// Import route handlers for different API endpoints
const authRouter = require("./routes/auth"); // Authentication routes (login, signup, logout)
const profileRouter = require("./routes/profile"); // User profile management routes
const requestRouter = require("./routes/request"); // Connection request routes
const userRouter = require("./routes/user"); // User-related routes (feed, connections)


// Register route handlers with the Express application
app.use("/",authRouter); // Mount authentication routes
app.use("/",profileRouter); // Mount profile management routes
app.use("/",requestRouter); // Mount connection request routes
app.use("/",userRouter); // Mount user-related routes


// Connect to the database and start the server if successful
connectDB().then(()=>{
    console.log("DB connected"); // Log successful database connection
    app.listen(3000, ()=>{ // Start server on port 3000
        console.log('congratulation my server is running') // Log successful server start
    });
}).catch(err=>{
    // Handle database connection errors
    console.error("Database cannot be established");
});



