var path = require("path");

console.log(__dirname);
console.log(__filename);

var absPath = path.join(__dirname, "server.js");

console.log(absPath);