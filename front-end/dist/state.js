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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = void 0;
const Contacts = __importStar(require("./Contacts"));
const config_1 = require("./config");
const IMAP = __importStar(require("./IMAP"));
const SMTP = __importStar(require("./SMTP"));
function createState(inParentComponent) {
    return {
        pleaseWaitVisible: false,
        contacts: [],
        mailboxes: [],
        messages: [],
        currentView: "welcome",
        currentMailbox: null,
        messageID: null,
        messageDate: null,
        messageFrom: null,
        messageTo: null,
        messageSubject: null,
        messageBody: null,
        contactID: null,
        contactName: null,
        contactEmail: null,
        showHidePleaseWait: function (inVisible) {
            this.setState({ pleaseWaitVisible: inVisible });
        }.bind(inParentComponent),
        showContact: function (inID, inName, inEmail) {
            console.log("state.showContact()", inID, inName, inEmail);
            this.setState({
                currentView: "contact",
                contactID: inID,
                contactName: inName,
                contactEmail: inEmail,
            });
        }.bind(inParentComponent),
        showAddContact: function () {
            console.log("state.showAddContact()");
            this.setState({
                currentView: "contactAdd",
                contactID: null,
                contactName: "",
                contactEmail: "",
            });
        }.bind(inParentComponent),
        showMessage: function (inMessage) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("state.showMessage()", inMessage);
                this.state.showHidePleaseWait(true);
                const imapWorker = new IMAP.Worker();
                const mb = yield imapWorker.getMessageBody(inMessage.id, this.state.currentMailbox);
                this.state.showHidePleaseWait(false);
                this.setState({
                    currentView: "message",
                    messageID: inMessage.id,
                    messageDate: inMessage.date,
                    messageFrom: inMessage.from,
                    messageTo: "",
                    messageSubject: inMessage.subject,
                    messageBody: mb,
                });
            });
        }.bind(inParentComponent),
        showComposeMessage: function (inType) {
            console.log("state.showComposeMessage()");
            switch (inType) {
                case "new":
                    this.setState({
                        currentView: "compose",
                        messageTo: "",
                        messageSubject: "",
                        messageBody: "",
                        messageFrom: config_1.config.userEmail,
                    });
                    break;
                case "reply":
                    this.setState({
                        currentView: "compose",
                        messageTo: this.state.messageFrom,
                        messageSubject: `Re: ${this.state.messageSubject}`,
                        messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`,
                        messageFrom: config_1.config.userEmail,
                    });
                    break;
                case "contact":
                    this.setState({
                        currentView: "compose",
                        messageTo: this.state.contactEmail,
                        messageSubject: "",
                        messageBody: "",
                        messageFrom: config_1.config.userEmail,
                    });
                    break;
            }
        }.bind(inParentComponent),
        addMailboxToList: function (inMailbox) {
            console.log("state.addMailboxToList()", inMailbox);
            const cl = this.state.mailboxes.slice(0);
            cl.push(inMailbox);
            this.setState({ mailboxes: cl });
        }.bind(inParentComponent),
        addContactToList: function (inContact) {
            console.log("state.addContactToList()", inContact);
            const cl = this.state.contacts.slice(0);
            cl.push({
                _id: inContact._id,
                name: inContact.name,
                email: inContact.email,
            });
            this.setState({ contacts: cl });
        }.bind(inParentComponent),
        addMessageToList: function (inMessage) {
            console.log("state.addMessageToList()", inMessage);
            const cl = this.state.messages.slice(0);
            cl.push({
                id: inMessage.id,
                date: inMessage.date,
                from: inMessage.from,
                subject: inMessage.subject,
            });
            this.setState({ messages: cl });
        }.bind(inParentComponent),
        clearMessages: function () {
            console.log("state.clearMessages()");
            this.setState({ messages: [] });
        }.bind(inParentComponent),
        setCurrentMailbox: function (inPath) {
            console.log("state.setCurrentMailbox()", inPath);
            this.setState({ currentView: "welcome", currentMailbox: inPath });
            this.state.getMessages(inPath);
        }.bind(inParentComponent),
        getMessages: function (inPath) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("state.getMessages()");
                this.state.showHidePleaseWait(true);
                const imapWorker = new IMAP.Worker();
                const messages = yield imapWorker.listMessages(inPath);
                this.state.showHidePleaseWait(false);
                this.state.clearMessages();
                messages.forEach((inMessage) => {
                    this.state.addMessageToList(inMessage);
                });
            });
        }.bind(inParentComponent),
        fieldChangeHandler: function (inEvent) {
            console.log("state.fieldChangeHandler()", inEvent.target.id, inEvent.target.value);
            if (inEvent.target.id === "contactName" &&
                inEvent.target.value.length > 16) {
                return;
            }
            this.setState({ [inEvent.target.id]: inEvent.target.value });
        }.bind(inParentComponent),
        saveContact: function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("state.saveContact()", this.state.contactID, this.state.contactName, this.state.contactEmail);
                const cl = this.state.contacts.slice(0);
                this.state.showHidePleaseWait(true);
                const contactsWorker = new Contacts.Worker();
                const contact = yield contactsWorker.addContact({
                    name: this.state.contactName,
                    email: this.state.contactEmail,
                });
                this.state.showHidePleaseWait(false);
                cl.push(contact);
                this.setState({
                    contacts: cl,
                    contactID: null,
                    contactName: "",
                    contactEmail: "",
                });
            });
        }.bind(inParentComponent),
        deleteContact: function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("state.deleteContact()", this.state.contactID);
                this.state.showHidePleaseWait(true);
                const contactsWorker = new Contacts.Worker();
                yield contactsWorker.deleteContact(this.state.contactID);
                this.state.showHidePleaseWait(false);
                const cl = this.state.contacts.filter((inElement) => inElement._id != this.state.contactID);
                this.setState({
                    contacts: cl,
                    contactID: null,
                    contactName: "",
                    contactEmail: "",
                });
            });
        }.bind(inParentComponent),
        deleteMessage: function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("state.deleteMessage()", this.state.messageID);
                this.state.showHidePleaseWait(true);
                const imapWorker = new IMAP.Worker();
                yield imapWorker.deleteMessage(this.state.messageID, this.state.currentMailbox);
                this.state.showHidePleaseWait(false);
                const cl = this.state.messages.filter((inElement) => inElement.id != this.state.messageID);
                this.setState({ messages: cl, currentView: "welcome" });
            });
        }.bind(inParentComponent),
        sendMessage: function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("state.sendMessage()", this.state.messageTo, this.state.messageFrom, this.state.messageSubject, this.state.messageBody);
                this.state.showHidePleaseWait(true);
                const smtpWorker = new SMTP.Worker();
                yield smtpWorker.sendMessage(this.state.messageTo, this.state.messageFrom, this.state.messageSubject, this.state.messageBody);
                this.state.showHidePleaseWait(false);
                this.setState({ currentView: "welcome" });
            });
        }.bind(inParentComponent),
    };
}
exports.createState = createState;
//# sourceMappingURL=state.js.map