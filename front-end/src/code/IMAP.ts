// library imports
import axios, { AxiosResponse } from "axios";

// app imports
import { config } from "./config";

// define interface to describe a mailbox
export interface IMailbox {
  name: string;
  path: string;
}

// define interface to describe a received message
// the body is optional since it isn't sent when listing messages
export interface IMessage {
  id: string;
  date: string;
  from: string;
  subject: string;
  body?: string;
}

// the worker that performs IMAP operations
export class Worker {
  /**
   * Returns a list of all (top-level) mailboxes.
   *
   * @return An array of objects, on per mailbox, that describes the mailbox.
   */
  public async listMailboxes(): Promise<IMailbox[]> {
    console.log("IMAP.Worker.listMailboxes()");

    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/mailboxes`
    );
    return response.data;
  } // end of listMailboxes()

  /**
   * Returns a list of messages in a named mailbox
   *
   * @param  inMailbox The name of the mailbox.
   * @return           An array of objects, on per message.
   */
  public async listMessages(inMailbox: string): Promise<IMessage[]> {
    console.log("IMAP.Worker.listMessages()");

    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/mailboxes/${inMailbox}`
    );
    return response.data;
  } // end of listMessages()

  /**
   * Returns the body of a specified message.
   *
   * @param  inID      The ID of the message to get the body of.
   * @param  inMailbox The path of the mailbox the message is in.
   * @return           The body of the message.
   */
  public async getMessageBody(
    inID: string,
    inMailbox: String
  ): Promise<string> {
    // the server, when sending a list of messages, does not send the message bodies.
    // only get the body of a selected message when needed, and that’s getMessageBody()'s responsibility

    console.log("IMAP.Worker.getMessageBody()", inID);

    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/messages/${inMailbox}/${inID}`
    );
    return response.data;
  } // end of getMessageBody()

  /**
   * Returns the body of a specified message.
   *
   * @param  inID      The ID of the message to delete.
   * @param  inMailbox The path of the mailbox the message is in.
   */
  public async deleteMessage(inID: string, inMailbox: String): Promise<void> {
    console.log("IMAP.Worker.getMessageBody()", inID);

    await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
  } // end of deleteMessage()
} // end of Worker class
