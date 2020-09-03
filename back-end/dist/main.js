"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node imports.
var path_1 = __importDefault(require("path"));
// Library imports.
var express_1 = __importDefault(require("express"));
// App imports.
var ServerInfo_1 = require("./ServerInfo");
var IMAP = __importStar(require("./IMAP"));
var SMTP = __importStar(require("./SMTP"));
var Contacts = __importStar(require("./Contacts"));
var app = express_1.default();
// when Express handles a request, all the middleware that was registered with the app via the app.use() calls
// forms a chain. Each is executed in turn.
// for this project, inNext() continues the chain
// all the app.xxx() calls, where xxx is an http method, require a callback function
// to execute when a matching request is received, and they all receive the incoming request
// and the response object used to produce the response to the caller
// middleware
// Handle JSON in request bodies.
app.use(express_1.default.json()); // handles parsing incoming request bodies that contain JSON
// Serve the client.
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../front-end/dist"))); // basic web server, serves static resources
// __dirname is a built-in variable that node supplies, which is the name of the directory the current script is in,
// then that is combined with the relative path pointing to the front-end/dist directory.
// The path.join() method will take care of disambiguating those pieces, resulting in a fully qualified path,
// complete with proper separators for the current operating system, then that is passed to express.static(),
// handling CORS issues during development and testing
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    // server must return a header of Access-Control-Allow-Origin that lists the domains that can call it
    // * will accept calls from any domain
    inResponse.header("Access-Control-Allow-Methods", // what HTTP methods to accept from clients
    "GET, POST, DELETE, OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    inNext();
});
// REST Endpoint: List Mailboxes
app.get("/mailboxes", 
// async, because of the need to make asynchronous calls using await
function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, mailboxes, inError_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.listMailboxes()];
            case 1:
                mailboxes = _a.sent();
                console.log("GET /mailboxes (1): Ok", mailboxes);
                inResponse.json(mailboxes);
                return [3 /*break*/, 3];
            case 2:
                inError_1 = _a.sent();
                console.log("GET /mailboxes (1): Error", inError_1);
                inResponse.send("error"); // if exceptions are thrown...
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// the express app is working as a middle-man between the app at large and the IMAP, SMTP, Contacts objects
// the objects are genuinely responsible for the "real" functionality.
// REST Endpoint: List Messages
// this retrieves the metadata about each message, not the actual message
app.get("/mailboxes/:mailbox", // :mailbox specifies the name of the mailbox, a replacement token
function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, messages, inError_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /mailboxes (2)", inRequest.params.mailbox);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.listMessages({
                        mailbox: inRequest.params.mailbox
                    })];
            case 2:
                messages = _a.sent();
                console.log("GET /mailboxes (2): Ok", messages);
                inResponse.json(messages);
                return [3 /*break*/, 4];
            case 3:
                inError_2 = _a.sent();
                console.log("GET /mailboxes (2): Error", inError_2);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// REST Endpoint: Get a Message
// gets the body contents of a specific message in a specific mailbox
app.get("/messages/:mailbox/:id", // :mailbox, :id are replacement tokens
function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, messageBody, inError_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /messages (3)", inRequest.params.mailbox, inRequest.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.getMessageBody({
                        mailbox: inRequest.params.mailbox,
                        id: parseInt(inRequest.params.id, 10)
                        // request parameters are strings, so parseInt is used here
                    })];
            case 2:
                messageBody = _a.sent();
                console.log("GET /messages (3): Ok", messageBody);
                inResponse.send(messageBody); // message body sent as plain text
                return [3 /*break*/, 4];
            case 3:
                inError_3 = _a.sent();
                console.log("GET /messages (3): Error", inError_3);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// REST Endpoint: Delete a Message
app.delete("/messages/:mailbox/:id", function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, inError_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("DELETE /messages");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.deleteMessage({
                        mailbox: inRequest.params.mailbox,
                        id: parseInt(inRequest.params.id, 10)
                    })];
            case 2:
                _a.sent();
                console.log("DELETE /messages: Ok");
                inResponse.send("ok");
                return [3 /*break*/, 4];
            case 3:
                inError_4 = _a.sent();
                console.log("DELETE /messages: Error", inError_4);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// REST Endpoint: Send a Message
app.post("/messages", function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var smtpWorker, inError_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("POST /messages", inRequest.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, smtpWorker.sendMessage(inRequest.body)];
            case 2:
                _a.sent();
                inResponse.send("ok");
                return [3 /*break*/, 4];
            case 3:
                inError_5 = _a.sent();
                console.log("POST /messages: Error", inError_5);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// REST Endpoint: List Contacts
app.get("/contacts", function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var contactsWorker, contacts, inError_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /contacts");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                contactsWorker = new Contacts.Worker();
                return [4 /*yield*/, contactsWorker.listContacts()];
            case 2:
                contacts = _a.sent();
                console.log("GET /contacts: Ok", contacts);
                inResponse.json(contacts);
                return [3 /*break*/, 4];
            case 3:
                inError_6 = _a.sent();
                console.log("GET /contacts: Error", inError_6);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// REST Endpoint: Add Contact
app.post("/contacts", function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var contactsWorker, contact, inError_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("POST /contacts", inRequest.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                contactsWorker = new Contacts.Worker();
                return [4 /*yield*/, contactsWorker.addContact(inRequest.body)];
            case 2:
                contact = _a.sent();
                console.log("POST /contacts: Ok", contact);
                inResponse.json(contact);
                return [3 /*break*/, 4];
            case 3:
                inError_7 = _a.sent();
                console.log("POST /contacts: Error", inError_7);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// REST Endpoint: Delete Contact
app.delete("/contacts/:id", function (inRequest, inResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var contactsWorker, inError_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("DELETE /contacts", inRequest.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                contactsWorker = new Contacts.Worker();
                return [4 /*yield*/, contactsWorker.deleteContact(inRequest.params.id)];
            case 2:
                _a.sent();
                console.log("Contact deleted");
                inResponse.send("ok");
                return [3 /*break*/, 4];
            case 3:
                inError_8 = _a.sent();
                console.log(inError_8);
                inResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// end of REST setup
// Start app listening.
app.listen(80, function () {
    console.log("frank-mail server open for requests");
});
//# sourceMappingURL=main.js.map