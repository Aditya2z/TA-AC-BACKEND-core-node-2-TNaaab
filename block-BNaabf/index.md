## BLOCK-writeCode

#### path
Q. Suppose on desktop, inside projects we have 2 folder each with a file
Structure is:-
Desktop
  - projects
    - client(dir)
      - index.js
    - server(dir)
      - app.js

You are currently in server.js

Write code to
  - get relative path of `index.js` 
  - get absolute path of `index.js`

```js
var fs = require("fs");
var relativeIndex = "../client/index.js";
const path = require('path');

const indexPath = path.join(__dirname, '../client/index.js');
```

#### server
Create a basic http server which should grab data from a HTML form rendered on a specific route and display the content on a seperate page.

Folder structure is:-

Project folder
  - server.js
  - form.html(html form)

form.html is a basic html form with multiple inputs. Each input except input of `type=submit` must contain `name` attribute which is the key for value submitted on that specific input.
- name
- email
- age

lastly also add an `input type=submit` to submit the form

Write code inside `server.js` to
- create a basic server
- add listener on port 5678
- display the form.html page on `/form` route using `GET` http method
- once the form is submitted, capture the data on server side using `data/end` event on request object
- make sure to add `method` and `action` attribute to `HTML form` in form.html
- send captured data in response as html page 

You have to basically handle 2 routes
1. to display the form data -> GET on `/form` route
2. to capture data from form and display it -> POST on `/form` route

##### Note:-
- action attribute determines the route which will be requested on server side
- method defines HTTP method used to submit the form(ideally POST)

```js

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
```