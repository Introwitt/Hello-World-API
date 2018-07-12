/**
 * 
 * RESTful JSON API
 * 
 */

 // Required modules
 var http = require("http");
 var path = require("path");
 var url  = require("url");
 var stringDecoder = require("string_decoder").StringDecoder;
 



 // Configure the server to respond to only POST method
 var server = http.createServer(function(req, res){
    // Get the HTTP method
    var method = req.method.toLowerCase();
    
    // Parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the trimmedPath
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the headers
    var headers = req.headers;

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the payload, if any
    var decoder = new stringDecoder("utf-8");
    var buffer = "";

    req.on("data", function(data){
        buffer += decoder.write(data);
    })

    req.on("end", function(){
        buffer += decoder.end();
    })

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    var chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to be sent to the handler
    var data ={
        "method" : method,
        "path"   : path,
        "headers" : headers,
        "queryStringObject" : queryStringObject,
        "payload" : buffer
    }

    // Route the request to chosenHandler and get statusCode and payload, and set to default if not received or undefined
    chosenHandler(data, function(statusCode, payload){


        statusCode = typeof(statusCode) == "number" ? statusCode : 200;

        payload = typeof(payload) == "object" && payload !== undefined ? payload : {};

        // Convert the payload to string
        var payloadString = JSON.stringify(payload);

        // Send the response
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);

    })
 })





 server.listen(5000,function(){
     console.log("Server has started");
 })

 // Define the handlers
 var handlers ={};

 // Not Found Handler
 handlers.notFound = function(data, callback){
     callback(404,{"Error": "Page not found"});
 }

 // Hello Handler
 handlers.hello = function(data, callback){
     if(data.method == "post"){
         callback(200, {"Success": "Welcome to the hello page"});
     } else{
         callback(405,{"Error" : "Method not allowed"});
     }
 }

 // Define router
 var router = {
     "hello" : handlers.hello
 }
 
