const http = require("node:http");

const server = http.createServer(function (req,res){
    res.end("hello sir1233");
});

server.listen(7777);