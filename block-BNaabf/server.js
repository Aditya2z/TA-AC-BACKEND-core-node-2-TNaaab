
var http = require("http");
var url = require("url");
var fs = require("fs");
var querystring = require("querystring");



var server = http.createServer(handleRequest);

server.listen(5678, () => {
    console.log("Server is listening to port 5678");
});

function handleRequest(req, res) {
    const {pathname} = url.parse(req.url);
    requestMethod = req.method;

    if(requestMethod === "GET" && pathname === "/form") {
        res.writeHead(201, {"content-type" : "text/html"});
        fs.createReadStream("form.html").pipe(res);
    } else if (requestMethod === "POST" && pathname === "/form") {
        res.writeHead(201, {"content-type" : "text/plain"});
        var store = "";
        req.on("data", (chunk) => {
            store += chunk;
        });
        req.on("end", () => {
            var requestData = querystring.parse(store);
            res.end(JSON.stringify(requestData));
        })
    }
}