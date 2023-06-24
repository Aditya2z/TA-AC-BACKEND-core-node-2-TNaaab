var http = require("http");
var fs = require("fs");

var server = http.createServer(handleRequest);

server.listen(5000, () => {
    console.log("Server is listening to port 5000");
});

function handleRequest(req, res) {
    fs.createReadStream("./readme.txt").pipe(res);
}