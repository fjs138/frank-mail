// emailjs-imap-client - responsible for interacting with the IMAP server on behalf of MailBag. It describes itself as a “low-level IMAP client for all your IMAP needs.”
//  mailparser - you can use the simpleParser that mailparser provides; What you’ll get back is a ParsedMail object. This object contains several properties, including subject, from, to, date, and text (the body of the message in plain text).
// they both support async/await calls

// library imports
import { ParsedMail } from "mailparser";
import { simpleParser } from "mailparser";
const ImapClient = require("emailjs-imap-client");

// app imports
import { IServerInfo } from "./ServerInfo";

// interface to describe a mailbox and optionally a specific message to be supplied to various methods here
export interface ICallOptions {
    mailbox: string,
    id?: number
}

// list mailboxes
// list messages within a mailbox
// retrieve a message
// delete a message

// interface for message:
// used when listing messages in a mailbox or when retrieving an individual message
// Define interface to describe a received message.  Note that body is optional since it isn't sent when listing
// messages.
export interface IMessage {
    id: string,
    date: string,
    from: string,
    subject: string,
    body?: string
}

// interface to describe a mailbox
export interface IMailbox {
    name: string,
    path: string
}
// by default, Node will attempt to validate the certificate presented by the server when connecting over TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// this makes a TLS connection insecure, but this application isn't being used in production

// worker that performs IMAP operations
export class Worker {

    // server information
    private static serverInfo: IServerInfo;


    constructor(inServerInfo: IServerInfo) {

        console.log("IMAP.Worker.constructor", inServerInfo);
        Worker.serverInfo = inServerInfo;

    } // end of constructor


// other methods will make use of this when connecting to the IMAP server.
// it is responsible for creating the emailjs-imap-client object and connecting it to the server
    private async connectToServer(): Promise<any> {
        const client: any = new ImapClient.default( // the client is created, passing in the host and port from serverInfo
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            {auth: Worker.serverInfo.imap.auth} // passing in the user and pass field from auth object
        );
        client.logLevel = client.LOG_LEVEL_NONE; // suppress some of the logging
        client.onerror = (inError: Error) => { // error handler
            console.log(
                "IMAP.Worker.listMailboxes(): Connection error", inError // just logs the error, doesnt resolve the problem!
            );
        };
        await client.connect();
        console.log("IMAP.Worker.listMailboxes(): Connected");

        return client;
    }

// Worker.listMailboxes( )
    /**
     * Returns a list of all (top-level) mailboxes.
     *
     * @return An array of objects, on per mailbox, that describes the nmilbox.
     */
    public async listMailboxes(): Promise<IMailbox[]> {

        console.log("IMAP.Worker.listMailboxes()");

        const client: any = await this.connectToServer();

        const mailboxes: any = await client.listMailboxes();

        await client.close();

        // translate from emailjs-imap-client mailbox objects to app-specific objects
        // at the same time, flatten the list of mailboxes via recursion
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (inArray: any[]): void => {
            inArray.forEach((inValue: any) => {
                finalMailboxes.push({
                    name: inValue.name,
                    path: inValue.path
                });
                iterateChildren(inValue.children); // handles the mailbox hierarchy, making it "flat"
            });
        };
        iterateChildren(mailboxes.children);

        return finalMailboxes;

    } // end of listMailboxes()

// Worker.listMessages( )
// list messages doesn't list message bodies
    /**
     * Lists basic information about messages in a named mailbox.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     * @return              An array of objects, one per message.
     */
    public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {

        console.log("IMAP.Worker.listMessages()", inCallOptions);

        const client: any = await this.connectToServer();
        // the inCallOptions object will contain the name of the mailbox in its mailbox field,
        // so we pass that to client.selectMailbox(), and we get back a mailbox object


        // first, a mailbox is accepted;  this gives the message count.
        const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
        console.log(`IMAP.Worker.listMessages(): Message count = ${mailbox.exists}`);

        // if there are no messages then just return an empty array
        if (mailbox.exists === 0) {
            await client.close();
            return [];
            // mailbox exists property returns an empty array if no messages, or the mail count if there are messages

        }

        // get messages; note that they are returned in order by uid, so it's FIFO.
        // noinspection TypeScriptValidateJSTypes
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            "1:*",
            ["uid", "envelope"]
        );    // this method takes in the name of the mailbox, what messages to retrieve, and what properties are wanted
        // the second argument is a query that determines what messages it will get
        // this specifies messages beginning with the first one and all messages after it (asterisk=all or any value)

        await client.close();

        // translate from emailjs-imap-client message objects to app-specific objects
        const finalMessages: IMessage[] = [];
        messages.forEach((inValue: any) => {
            finalMessages.push({
                id: inValue.uid,
                date: inValue.envelope.date,
                from: inValue.envelope.from[0].address,
                subject: inValue.envelope.subject
            });
        });

        return finalMessages; // contains these objects: For each message returned, an object is constructed, pulling the information the client will need out of the object returned by client.listMessages(): the unique message id, the date it was sent, where it’s from (just the email address, which is in the address property of the object returned), and the subject.

    } /* End listMessages(). */


// Worker.getMessageBody( )
    /**
     * Gets the plain text body of a single message.
     *
     * @param  inCallOptions An object implementing the ICallOptions interface.
     * @return               The plain text body of the message.
     */
    public async getMessageBody(inCallOptions: ICallOptions): Promise<any> {

        console.log("IMAP.Worker.getMessageBody()", inCallOptions);

        const client: any = await this.connectToServer();

// noinspection TypeScriptValidateJSTypes
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            inCallOptions.id,
            ["body[]"],
            {byUid: true}
        );
        const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);

        await client.close();

        return parsed.text;

    }

    // end of getMessageBody()


    /*
    in emailjs-imap-client, to get bodies, use the listMessages() method, but specifying the body
    because the body can be in multiple parts, an array is requested
    a specific message ID is specified in the call, by passing a fourth argument, { byUid : true },
    to tell the method that we’re listing messages based on a specific ID.

    unlike listMessages(), where messages were dealt with based on their ordinal number,
    here it’s a unique ID for a specific message; that option is required.

   once the message is received it can be passed to the simpleParser() constructor, which parses the message into a ParsedMail object
   after closing the connection, the text property of that object is returned, which is the plain text body content
   note that the client already has any metadata needed for this message
     */


// Worker.deleteMessage( )
    public async deleteMessage(inCallOptions: ICallOptions):
        Promise<any> {
        console.log("IMAP.Worker.deleteMessage()", inCallOptions);
        const client: any = await this.connectToServer();
        await client.deleteMessages(
            inCallOptions.mailbox, inCallOptions.id, {byUid: true}
        );
        await client.close();
    }

    //similar to getMessageBody(), the mailbox name and the unique ID of the message to delete is passed

}
