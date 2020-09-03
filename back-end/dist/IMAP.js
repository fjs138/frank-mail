"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
var mailparser_1 = require("mailparser");
var ImapClient = require("emailjs-imap-client");
// Disable certificate validation (less secure, but needed for some servers).
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // by default, Node will attempt to validate the certificate presented by the server when connecting over TLS
// This setting tells Node to skip that step. To be clear, this makes a TLS connection insecure, since you can’t be sure you’re talking to the legitimate server, which is the point of validating the certificate. But there can be a fair bit of work that goes into getting that validation to work, so this setting allows us to skip that. To be clear, if you intend to use MailBag in production, then you will want to change this! But, as a learning exercise, one that will be connecting to an IMAP server you provide and so know to be good, it’s sufficient, I think. Also note that
// if you aren’t connecting to the server over TLS in the first place, then naturally this is all irrelevant.
// The worker that will perform IMAP operations.
var Worker = /** @class */ (function () {
    /**
     * Constructor.
     */
    function Worker(inServerInfo) {
        console.log("IMAP.Worker.constructor", inServerInfo);
        Worker.serverInfo = inServerInfo;
    } /* End constructor. */
    // Now, the first real method we come to is connectToServer(). This is to avoid redundancy: all the other methods will make use of this when connecting to the IMAP server. It is responsible for creating the emailjs-imap-client object and connecting it to the server:
    Worker.prototype.connectToServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new ImapClient.default(// the client is created, passing in the host and port from serverInfo
                        Worker.serverInfo.imap.host, Worker.serverInfo.imap.port, { auth: Worker.serverInfo.imap.auth } // passing in the user and pass field from auth object
                        );
                        client.logLevel = client.LOG_LEVEL_NONE; // suppress some of the logging
                        client.onerror = function (inError) {
                            console.log("IMAP.Worker.listMailboxes(): Connection error", inError // just logs the error, doesnt resolve the problem!
                            );
                        };
                        return [4 /*yield*/, client.connect()];
                    case 1:
                        _a.sent();
                        console.log("IMAP.Worker.listMailboxes(): Connected");
                        return [2 /*return*/, client];
                }
            });
        });
    };
    // Worker.listMailboxes( )
    /**
     * Returns a list of all (top-level) mailboxes.
     *
     * @return An array of objects, on per mailbox, that describes the nmilbox.
     */
    Worker.prototype.listMailboxes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, mailboxes, finalMailboxes, iterateChildren;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.listMailboxes()");
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.listMailboxes()];
                    case 2:
                        mailboxes = _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        finalMailboxes = [];
                        iterateChildren = function (inArray) {
                            inArray.forEach(function (inValue) {
                                finalMailboxes.push({
                                    name: inValue.name,
                                    path: inValue.path
                                });
                                iterateChildren(inValue.children); // handles the mailbox hierarchy, making it "flat"
                            });
                        };
                        iterateChildren(mailboxes.children);
                        return [2 /*return*/, finalMailboxes]; // In the end, finalMailboxes will be a one-dimensional array of objects, each containing name, and path, exactly like the client will want.
                }
            });
        });
    }; /* End listMailboxes(). */
    // Worker.listMessages( )
    // list messages doesn't list message bodies
    /**
     * Lists basic information about messages in a named mailbox.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     * @return              An array of objects, one per message.
     */
    Worker.prototype.listMessages = function (inCallOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var client, mailbox, messages, finalMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.listMessages()", inCallOptions);
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.selectMailbox(inCallOptions.mailbox)];
                    case 2:
                        mailbox = _a.sent();
                        console.log("IMAP.Worker.listMessages(): Message count = " + mailbox.exists);
                        if (!(mailbox.exists === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 4: return [4 /*yield*/, client.listMessages(inCallOptions.mailbox, "1:*", ["uid", "envelope"])];
                    case 5:
                        messages = _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 6:
                        _a.sent();
                        finalMessages = [];
                        messages.forEach(function (inValue) {
                            finalMessages.push({
                                id: inValue.uid,
                                date: inValue.envelope.date,
                                from: inValue.envelope.from[0].address,
                                subject: inValue.envelope.subject
                            });
                        });
                        return [2 /*return*/, finalMessages]; // contains these objects: For each message returned, an object is constructed, pulling the information the client will need out of the object returned by client.listMessages(): the unique message id, the date it was sent, where it’s from (just the email address, which is in the address property of the object returned), and the subject.
                }
            });
        });
    }; /* End listMessages(). */
    // Worker.getMessageBody( )
    /**
     * Gets the plain text body of a single message.
     *
     * @param  inCallOptions An object implementing the ICallOptions interface.
     * @return               The plain text body of the message.
     */
    Worker.prototype.getMessageBody = function (inCallOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var client, messages, parsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.getMessageBody()", inCallOptions);
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.listMessages(inCallOptions.mailbox, inCallOptions.id, ["body[]"], { byUid: true })];
                    case 2:
                        messages = _a.sent();
                        return [4 /*yield*/, mailparser_1.simpleParser(messages[0]["body[]"])];
                    case 3:
                        parsed = _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, parsed.text];
                }
            });
        });
    };
    /* End getMessageBody().*/
    /*
    There’s no special function in emailjs-imap-client to get bodies, you simply use the listMessages() method, but this time specifying that we want the body. More precisely, because the body can be in multiple parts, it’s actually an array that we request. Note here that we are specifying a specific message ID in the call, and to do that we have
    to pass the fourth argument, { byUid : true }, to tell the method that we’re listing messages based on a specific ID. Unlike listMessages(), where we were dealing with a range of messages based on their ordinal number, here it’s a unique ID for a specific message; hence, that option is required.

    Once we have the message, we can then pass it along to the simpleParser() constructor, which parses the message into a ParsedMail object. After closing the connection, we just return the text property of that object, which is the plain text body content, all necessary concatenation of multiple body parts dealt with for us. Note that the client already has any metadata needed for this message; hence, it’s only the body content we care about here.

     */
    // Worker.deleteMessage( )
    Worker.prototype.deleteMessage = function (inCallOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.deleteMessage()", inCallOptions);
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.deleteMessages(inCallOptions.mailbox, inCallOptions.id, { byUid: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
//# sourceMappingURL=IMAP.js.map