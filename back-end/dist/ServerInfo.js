"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
var path = require("path"); // path
var fs = require("fs"); // file system
// intent is to read the serverInfo.json file in,
// create an object that adheres to the IServerInfo interface,
// and that the serverInfo variable points to
var rawInfo = fs.readFileSync(path.join(__dirname, "../serverInfo.json")); // file is read in as a plain string
// path join is used to get a fully qualified path to the file
exports.serverInfo = JSON.parse(rawInfo); // pare the string into an object
console.log("ServerInfo: ", exports.serverInfo);
//# sourceMappingURL=ServerInfo.js.map