var http = require("http");
var querystring = require("querystring");

var server = http.createServer(handleRequest);

server.listen(7000, () => {
    console.log("Server is listening to port 7000");
})

function handleRequest(req, res) {
    var store = "";
    var dataFormat = req.headers['content-type'];

    req.on("data", (chunk) => {
        store += chunk;
    });
    req.on("end", () => {
        if(dataFormat === "application/x-www-form-urlencoded") {
            const parsedData = querystring.parse(store);
            res.write(JSON.stringify(parsedData));
            res.end();
        } else if(dataFormat === "application/json") {
            const parsedData = JSON.parse(store);
            res.write(store);
            res.end();
        }
    });
}