var http = require("http");

var server = http.createServer(handleRequest);

server.listen(3456, () => {
    console.log("Server is listening to port 3456");
})

function handleRequest(req, res) {
    var store = "";
    req.on("data", (chunk) => {
        store += chunk;
    });
    req.on("end", () => {
        res.write(store);
        res.end();
    });
}