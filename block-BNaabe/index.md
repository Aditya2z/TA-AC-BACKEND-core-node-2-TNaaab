## BLOCK-writeCode

#### Path
Q. Suppose we have 3 files inside a directory on desktop
The structure is
  - node(folder)
    - app.js
    - server.js
    - index.html
You are currently inside server.js

Write code to 
- capture absolute path of `server.js`(itself)
- get absolute path of `app.js`
- get realtive path of `index.html`
- get absolute path of `index.html` using `path module` 
 
```js
const path = require('path');

const serverJSPath = __filename;
console.log('Absolute path of server.js:', serverJSPath);

const appJSPath = path.join(__dirname, 'app.js');
console.log('Absolute path of app.js:', appJSPath);

const indexHTMLRelativePath = 'index.html';
console.log('Relative path of index.html:', indexHTMLRelativePath);

const indexHTMLAbsolutePath = path.join(__dirname, 'index.html');
console.log('Absolute path of index.html using path module:', indexHTMLAbsolutePath);
```

#### Capture data on server

Q. Create a server using http
- handle post method on '/' route
- send json data on it from postman

```js
// data format is
{
  team: 'kxip',
  players: 18,
  captain: 'KL Rahul'
}
```
- capture data from request on server side using data and end event on request object
- when end event fires, send entire captured data in response with status code 201.

```js
var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");


var server = http.createServer(handleRequest);

server.listen(3000, () => {
    console.log("Server is listening to port 3000");
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
    }
}
```

Q. Follow above steps with form data from postman instead of json data.
- once data has been captured, send only captain's name in response.

```js
var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var querystring = require("querystring");

var server = http.createServer(handleRequest);

server.listen(3000, () => {
    console.log("Server is listening to port 3000");
})

function handleRequest(req, res) {
    const requestMethod = req.method;
    const requestUrl = req.url;
    const parsedUrl = url.parse(requestUrl);
    const pathname = parsedUrl.pathname;

    const dataFormat = req.headers["content-type"];

    if(requestMethod === "POST" && pathname === "/" && dataFormat === "application/x-www-form-urlencoded") {
        var store = "";
        req.on("data", (chunk) => {
            store += chunk;
        })
        req.on("end", () => {
            res.writeHead(201, {"content-type" : "text/plain"});

            var parsedData = querystring.parse(store);

            res.end(JSON.stringify(parsedData.captain));
        })
    }
}
```

Q. Create server which can handle both json/form data without specifying which format of data is being received.
- add listener on port 9000
- use `data/end` event to capture json/form data
- use `req.headers['Content-Type']` to check data format
- parse respective data format i.e. json/form 
- send entire data in response
- data sent from postman should have fields:
  - city
  - state
  - country
  - pin

```js
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
```

Q. create server, send json data in request from postman, parse in on the server and send html response with entire parsed data information.
- format of json data is {name: your name, email: "", }
- Html response format is <h1>Name</h1><h2>email</h2>

```js
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
            res.writeHead(201, {"content-type" : "text/html"});
            store = JSON.parse(store);
            res.end(`<h1>${store.name}</h1><h2>${store.email}</h2>`);
        })
    } 
}
```

Q. Follow above question with form data containing fields i.e name and email. 
- Parse form-data using `querystring` module
- respond with HTML page containing only email from data in H2 tag.

#### Note:- 
Make sure to convert objects into strings using `JSON.stringify` before passing the data through response.

```js


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

    if(requestMethod === "POST" && pathname === "/" && dataFormat === "application/x-www-form-urlencoded") {
        var store = "";
        req.on("data", (chunk) => {
            store += chunk;
        })
        req.on("end", () => {
            res.writeHead(201, {"content-type" : "text/html"});

            var parsedData = querystring.parse(store);

            res.end(`<h2>${JSON.stringify(parsedData.email)}</h2>`);
        })
    }
}
```