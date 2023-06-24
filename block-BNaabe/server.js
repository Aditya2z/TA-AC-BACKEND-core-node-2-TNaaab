var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var querystring = require("querystring");

var server = http.createServer(handleRequest);

server.listen(9000, () => {
    console.log("Server is listening to port 9000");
})

function handleRequest(req, res) {
    const requestMethod = req.method;
    const requestUrl = req.url;
    const parsedUrl = url.parse(requestUrl);
    const pathname = parsedUrl.pathname;

    const dataFormat = req.headers["content-type"];

    if(requestMethod === "POST" && pathname === "/" && dataFormat === "application/json") {
        var store = "";
        req.on("data", (chunk) => {
            store += chunk;
        })
        req.on("end", () => {
            res.writeHead(201, {"content-type" : "application/json"});
            res.end(store);
        })
    } else if(requestMethod === "POST" && pathname === "/" && dataFormat === "application/x-www-form-urlencoded") {
        var store = "";
        req.on("data", (chunk) => {
            store += chunk;
        })
        req.on("end", () => {
            res.writeHead(201, {"content-type" : "text/plain"});

            var parsedData = querystring.parse(store);

            res.end(JSON.stringify(parsedData));
        })
    }
}