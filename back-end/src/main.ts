// node imports
import path from "path";

// library imports
import express, {Express, NextFunction, Request, Response} from "express";

// app imports
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

const app: Express = express();
// when Express handles a request, all the middleware that was registered with the app via the app.use() calls
// forms a chain. Each is executed in turn.
// for this project, inNext() continues the chain


// all the app.xxx() calls, where xxx is an http method, require a callback function
// to execute when a matching request is received, and they all receive the incoming request
// and the response object used to produce the response to the caller


// middleware
// Handle JSON in request bodies.
app.use(express.json()); // handles parsing incoming request bodies that contain JSON

// Serve the client.
app.use("/", express.static(path.join(__dirname, "../../front-end/dist"))); // basic web server, serves static resources
// __dirname is a built-in variable that node supplies, which is the name of the directory the current script is in,
// then that is combined with the relative path pointing to the front-end/dist directory.
// The path.join() method will take care of disambiguating those pieces, resulting in a fully qualified path,
// complete with proper separators for the current operating system, then that is passed to express.static(),

// handling CORS issues during development and testing
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
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
    async ( inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
        console.log("GET /mailboxes (1): Ok", mailboxes);
        inResponse.json(mailboxes);
    } catch (inError) {
        console.log("GET /mailboxes (1): Error", inError);
        inResponse.send("error"); // if exceptions are thrown...
    }
    }
);



// the express app is working as a middle-man between the app at large and the IMAP, SMTP, Contacts objects
// the objects are genuinely responsible for the "real" functionality.

// REST Endpoint: List Messages
// this retrieves the metadata about each message, not the actual message
app.get("/mailboxes/:mailbox",  // :mailbox specifies the name of the mailbox, a replacement token
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /mailboxes (2)", inRequest.params.mailbox);
        try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messages: IMAP.IMessage[] = await imapWorker.listMessages({
            mailbox : inRequest.params.mailbox
        });
        console.log("GET /mailboxes (2): Ok", messages);
        inResponse.json(messages);
    } catch (inError) {
        console.log("GET /mailboxes (2): Error", inError);
        inResponse.send("error");
    }
}
);

// REST Endpoint: Get a Message
// gets the body contents of a specific message in a specific mailbox
app.get("/messages/:mailbox/:id", // :mailbox, :id are replacement tokens
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /messages (3)", inRequest.params.mailbox, inRequest.params.id);
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody({
                mailbox : inRequest.params.mailbox,
                id : parseInt(inRequest.params.id, 10)
                // request parameters are strings, so parseInt is used here
            });
            console.log("GET /messages (3): Ok", messageBody);
            inResponse.send(messageBody);  // message body sent as plain text
            // the client will be responsible for handling cases where it is in HTML
        } catch (inError) {
            console.log("GET /messages (3): Error", inError);
            inResponse.send("error");
        }
    }
    );


// REST Endpoint: Delete a Message
app.delete("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("DELETE /messages");
        try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        console.log("DELETE /messages: Ok");
        inResponse.send("ok");
    } catch (inError) {
        console.log("DELETE /messages: Error", inError);
        inResponse.send("error")
    }
    }
    );

// REST Endpoint: Send a Message
app.post("/messages",
    async (inRequest: Request, inResponse: Response) => {
        console.log("POST /messages", inRequest.body);
        try { // the incoming request body will contain all the information required to send a message,
        // including target email address, subject, and message text, and the express.json middleware
        // will have parsed that into an object for to pass along to smtpWorker.sendMessage()
        const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
        await smtpWorker.sendMessage(inRequest.body);
        inResponse.send("ok");
    } catch (inError) {
        console.log("POST /messages: Error", inError);
        inResponse.send("error");
    }
    }
    );

// REST Endpoint: List Contacts
app.get("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /contacts");
        try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contacts: IContact[] = await contactsWorker.listContacts();
        console.log("GET /contacts: Ok", contacts);
        inResponse.json(contacts);
    } catch (inError) {
        console.log("GET /contacts: Error", inError);
        inResponse.send("error");
    }
    }
    );

// REST Endpoint: Add Contact
app.post("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        console.log("POST /contacts", inRequest.body);
        try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: IContact = await contactsWorker.addContact(inRequest.body);
        console.log("POST /contacts: Ok", contact);
        inResponse.json(contact);
    } catch (inError) {
        console.log("POST /contacts: Error", inError);
        inResponse.send("error");
    }
    }
    );

// REST Endpoint: Delete Contact
app.delete("/contacts/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("DELETE /contacts", inRequest.body);
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(inRequest.params.id);
            console.log("Contact deleted");
            inResponse.send("ok");
        } catch (inError) {
            console.log(inError);
            inResponse.send("error");
        }
    }
);

// end of REST setup



// start app listening
app.listen(80, () => {
    console.log("frank-mail server open for requests");
});