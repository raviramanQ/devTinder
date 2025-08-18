/**
 * Simple HTTP Server
 * Creates a basic HTTP server that responds with a text message
 */

// Import the Node.js HTTP module
const http = require("node:http");

/**
 * Create an HTTP server instance
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 */
const server = http.createServer(function (req,res){
    // Send a simple text response and end the request
    res.end("hello sir1233");
});

// Start the server on port 7777
server.listen(7777, () => {
    console.log('Server running on port 7777');
});