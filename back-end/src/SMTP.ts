// library imports
import Mail from "nodemailer/lib/mailer";

import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
// app imports
import { IServerInfo } from "./ServerInfo";
// const nodemailer = require("nodemailer");

/*
nodemailer:
create a “transport”, which is an object that knows how to talk a particular protocol to send mail with (SMTP)
providing the transport whatever information is needed to connect, and then call the sendMail() method on the transport,
passing it the details of the message to send.
 */

/* nodemailer async/await:
nodemailer doesn’t natively provide an async/await- compatible API, it instead uses the callback approach.
async/await is used when calling the Worker classes; you can wrap a call to a callback-based APIit in a Promise,
then return the Promise from the function that makes the call, and that caller can then use async/await to call it
next, in the function, have the callback passed to the underlying function reject or resolve as appropriate.

all the calls to nodemailer are wrapped up in the created Promise object
the nodemailer.createTransport() method is first called, passing it the server information
that provides a connection to the SMTP server, then, the transport.sendmail() method is called, passing it inOptions,
which contains the message details passed in from the client
a callback function is the second argument to transport.sendMail()
and that callback is passed an Error object and information about the sent message.
the error object can be null, which to TypeScript is a different type.
tto avoid a compilation error, union type is used, which is what Error | null is
tells TypeScript that the inError can be one of two types: either Error or null
last, inside the callback, if there is an error object, then something went wrong, and the Promise must reject,
otherwise, it was successful and is resolved
 */
export class Worker {
  private static serverInfo: IServerInfo;
  constructor(inServerInfo: IServerInfo) {
    console.log("SMTP.Worker.constructor", inServerInfo);
    Worker.serverInfo = inServerInfo; // the server information is passed in to the constructor and stored.
  }
  /*
 return type is Promise<string>
 why a generic <string>? TypeScript looks at what is being returned, whether as a result of a resolve or reject, from the function.
 if the caller specifies a type for the variable that gets the eventual outcome of the Promise, that type must match,
 or TypeScript will complain, so, Promise<string> is telling TypeScript:
 “this function returns a Promise, but it promises to return a string eventually,
 so make sure the variable that the returned value goes into is that type.”
 the generic variable declaration is how we express that promised final type is expressed to TypeScript.
   */


  /**
   * Send a message.
   *
   * @param  inOptions An object containing to, from, subject and text properties (matches the IContact interface,
   *                   but can't be used since the type comes from nodemailer, not app code).
   * @return           A Promise that eventually resolves to a string (null for success, error message for an error).
   */
  // Worker.sendMessage( )
  public sendMessage(inOptions: SendMailOptions): Promise<string> {
    return new Promise((inResolve, inReject) => {
      const transport: Mail = nodemailer.createTransport(
        Worker.serverInfo.smtp
      );
      transport.sendMail(
        inOptions,
        (inError: Error | null, inInfo: SentMessageInfo) => {
          if (inError) {
            inReject(inError);
          } else {
            inResolve();
          }
        }
      );
    });
  }
}

// when instantiated, the server information must be sent in,
// and it is then stored in the static ServerInfo member.
// it didn't need to be static, but it won't cause an issue being static

// logTypes()???
