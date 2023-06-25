const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");

const userDir = path.join(__dirname, "users/");

function getUserFileInfo(req, store) {
  const {username} = querystring.parse(url.parse(req.url).query);
  const requestData = querystring.parse(store);
  const filepath = path.join(userDir, `${username}.json`);
  return { requestData, username, filepath };
}

function handlePostRequest(req, res, store) {

  const requestData = querystring.parse(store);
  const username = requestData.username;
  const filepath = path.join(userDir, `${username}.json`);
  
  fs.open(filepath, "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        res.statusCode = 500;
        console.error("File already exists!");
        res.end("Username already exists!");
      } else {
        res.statusCode = 500;
        console.error(`Error opening the file: ${err}`);
        res.end(`Error opening the file: ${err}`);
      }
    } else {
      console.log(`File ${username}.json created successfully!`);
      fs.writeFile(fd, JSON.stringify(requestData), (err) => {
        fs.close(fd, (err) => {
          if (err) {
            res.statusCode = 500;
            console.error(`Error closing the file: ${err}`);
            res.end(`Error closing the file: ${err}`);
          }
          res.writeHead(201, { "content-type": "text/plain" });
          res.end(`${username}.json successfully created`);
        });
      });
    }
  });
}

function handleGetRequest(req, res, store) {
  const { requestData, username, filepath } = getUserFileInfo(req, store);

  const readStream = fs.createReadStream(filepath);

  readStream.on("error", (err) => {
    console.error(`Error reading the file: ${err}`);
    res.statusCode = 500;
    res.end(`Error reading the file : ${err}`);
  });

  res.writeHead(201, { "content-type": "application/json" });
  readStream.pipe(res);
}

function handleDeleteRequest(req, res, store) {
  const { requestData, username, filepath } = getUserFileInfo(req, store);

  fs.unlink(filepath, (err) => {
    if (err) {
      console.error(`Error deleting the file: ${err}`);
      res.statusCode = 500; // Internal Server Error
      res.end(`Error deleting the file: ${err}`);
    } else {
      console.log(`File ${username}.json deleted successfully`);
      res.statusCode = 200; // OK
      res.end(`File ${username}.json deleted successfully`);
    }
  });
}

function handlePutRequest(req, res, store) {
  const { requestData, username, filepath } = getUserFileInfo(req, store);

  fs.open(filepath, "r+", (err, fd) => {
    if (err) {
      res.statusCode = 500;
      res.end(`error opening the file: ${err}`);
    } else {
      fs.ftruncate(fd, 0, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end(`error truncating the file: ${err}`);
        } else {
          fs.writeFile(fd, JSON.stringify(requestData), (err) => {
            if (err) {
              res.statusCode = 500;
              res.end(`error writing the file: ${err}`);
            } else {
              fs.close(fd, (err) => {
                if (err) {
                  res.statusCode = 500;
                  res.end(`error closing the file: ${err}`);
                } else {
                  res.statusCode = 200;
                  res.end(`${username}.json updated successfully`);
                }
              });
            }
          });
        }
      });
    }
  });
}

function handleRequest(req, res) {
  const requestMethod = req.method;
  const { pathname } = url.parse(req.url);

  let store = "";

  req.on("data", (chunk) => {
    store += chunk;
  });

  if (requestMethod === "POST" && pathname === "/users") {
    req.on("end", () => {
      handlePostRequest(req, res, store);
    });
  } else if (requestMethod === "GET" && pathname === "/users") {
    req.on("end", () => {
      handleGetRequest(req, res, store);
    });
  } else if (requestMethod === "DELETE" && pathname === "/users") {
    req.on("end", () => {
      handleDeleteRequest(req, res, store);
    });
  } else if (requestMethod === "PUT" && pathname === "/users") {
    req.on("end", () => {
      handlePutRequest(req, res, store);
    });
  } else {
    res.statusCode = 404;
    res.end("Page not found!");
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
