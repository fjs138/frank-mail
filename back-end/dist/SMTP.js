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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
var nodemailer = __importStar(require("nodemailer"));
// const nodemailer = require("nodemailer");
/*
nodemailer:
create a “transport”, which is an object that knows how to talk a particular protocol to send mail with (SMTP)
providing the transport whatever information is needed to connect, and then call the sendMail() method on the transport,
passing it the details of the message to send.
 */
/* nodemailer async/await:
nodemailer doesn’t natively provide an async/await- compatible API. It instead uses the callback approach.
But, if you go back to the code of main.ts, you’ll see that async/await is used when calling the Worker classes. How?
Any time you have a callback-based API, you can wrap a call to it in a Promise.
Then return the Promise from the function that makes the call, and that caller can then use async/await to call it.
Next, in the function, you simply have the callback passed to the underlying function reject or resolve as appropriate.
So, here, all the calls to nodemailer are wrapped up in the created Promise object.
Inside it, the nodemailer.createTransport() method is first called, passing it the server information.
That gets us a connection to the SMTP server. Then, the transport. sendmail() method is called, passing it inOptions,
which contains the message details passed in from the client.
A callback function is the second argument to transport. sendMail(),
and that callback is passed an Error object and information about the sent message.
Note that the error object can be null, which to TypeScript is a different type.
To avoid a compilation error, we have to use what’s called a union type, which is what Error | null is.
This tells TypeScript that the inError can be one of two types: either Error or null (we also could have inError as any;
that would accomplish the goal too, but is less TypeScript-y, so to speak!).
Finally, inside the callback, if there is an error object, then something went wrong, and the Promise must reject.
Otherwise, it was successful and is resolved.
 */
var Worker = /** @class */ (function () {
    function Worker(inServerInfo) {
        console.log("SMTP.Worker.constructor", inServerInfo);
        Worker.serverInfo = inServerInfo; // the server information is passed in to the constructor and stored.
    }
    /*
    One final subtle issue comes up here, and it’s where that detour into generics earlier comes in! Notice the return type here is Promise<string>. The Promise part makes sense: any function that is to be called with async/await must return a Promise. But why do we have a generic <string> there? Well, TypeScript is smart enough to look at what is ultimately being returned, whether as a result of a resolve or reject, from the function. If the caller specifies a type for the variable that gets the eventual outcome of the Promise, as is good form in TypeScript and as such is done in main.ts, then that type must match, or TypeScript will complain. So, with Promise<string>, we’re essentially saying to TypeScript: “this function returns a Promise, but it promises to return a string eventually, so make sure the variable that the returned value goes into is that type.” The generic variable declaration is how we express that promised final type to TypeScript.
     */
    /**
     * Send a message.
     *
     * @param  inOptions An object containing to, from, subject and text properties (matches the IContact interface,
     *                   but can't be used since the type comes from nodemailer, not app code).
     * @return           A Promise that eventually resolves to a string (null for success, error message for an error).
     */
    // Worker.sendMessage( )
    Worker.prototype.sendMessage = function (inOptions) {
        return new Promise(function (inResolve, inReject) {
            var transport = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(inOptions, function (inError, inInfo) {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve();
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
// when instantiated, the server information must be sent in,
// and it is then stored in the static ServerInfo member.
// it didn't need to be static, but it won't cause an issue being static
// logTypes()???
//# sourceMappingURL=SMTP.js.map