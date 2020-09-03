const path = require("path"); // path
const fs = require("fs"); // file system

// interface that mimics serverInfo.json
export interface IServerInfo {
  smtp: {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    },
  };
  imap: {
    host: string;
    port: number;
    auth: {
      user: string,
      pass: string, },
  },
}

// declare variable typed to the interface
export let serverInfo: IServerInfo;

// intent is to read the serverInfo.json file in,
// create an object that adheres to the IServerInfo interface,
// and that the serverInfo variable points to
const rawInfo: string =
    fs.readFileSync(path.join(__dirname, "../serverInfo.json")); // file is read in as a plain string
// path join is used to get a fully qualified path to the file
serverInfo = JSON.parse(rawInfo); // pare the string into an object
console.log("ServerInfo: ", serverInfo);
