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
// Node imports.
var path = __importStar(require("path")); // for path to data file
// Library imports.
var Datastore = require("nedb"); // for nosql implementation
// We’re going to use this for all use cases, meaning when we add or delete a contact, as well as when listing contacts. In the case of adding a contact, the _id field won’t be populated initially, meaning the client won’t supply it. Instead, NeDB will be populating that for us, so we have to mark it as optional here; otherwise, our add operation wouldn’t meet the contract as a result of not having an _id field.
// The worker that will perform contact operations.
var Worker = /** @class */ (function () {
    /**
     * Constructor.
     */
    function Worker() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true,
        });
        // Upon construction, a NeDB Datastore object is created, and a path to the contacts. db file is given. We tell NeDB to load it automatically, and NeDB will create the file for us if it doesn’t already exist.
    } /* End constructor. */
    /**
     * Lists all contacts.
     *
     * @return A promise that eventually resolves to an array of IContact objects.
     */
    Worker.prototype.listContacts = function () {
        var _this = this;
        console.log("Contacts.Worker.listContacts()");
        return new Promise(function (inResolve, inReject) {
            _this.db.find({}, function (inError, inDocs) {
                if (inError) {
                    console.log("Contacts.Worker.listContacts(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.listContacts(): Ok", inDocs);
                    inResolve(inDocs);
                }
            });
        });
    }; /* End listContacts(). */
    /*
  As with nodemailer, NeDB doesn’t provide an async/await-based API, so we have to do the same sort of trick with wrapping it in Promises as we did with nodemailer in order to be able to write our code with async/await. Inside the Promise, it’s a simple matter
  of calling the find() method on the DataStore referenced by this.db and passing no search criteria as the first argument (well, technically an empty search criteria object,
  to be pedantic). That returns us all the records in the contacts.db file, which is our contacts collection, in NoSQL parlance. Since we know that the objects that will be returned will match the IContact interface’s structure, we can type the inDocs argument as such, even though technically NeDB doesn’t know about our type. It doesn’t have to, though: this is all TypeScript territory. Then, just like with nodemailer, we either reject the Promise, passing the error to the caller, or else we return the array of documents, which are our contact objects. Notice the use of generics for the return type: here, we’re promising to resolve with an array of IContact objects, which TypeScript is happy to see!
   */
    // Worker.addContact()
    /**
     * Add a new contact.
     *
     * @param  inContact The contact to add.
     * @return           A promise that eventually resolves to an IContact object.
     */
    Worker.prototype.addContact = function (inContact) {
        var _this = this;
        console.log("Contacts.Worker.addContact()", inContact);
        return new Promise(function (inResolve, inReject) {
            _this.db.insert(inContact, function (inError, inNewDoc) {
                if (inError) {
                    console.log("Contacts.Worker.addContact(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.addContact(): Ok", inNewDoc);
                    inResolve(inNewDoc);
                }
            });
        });
    }; /* End addContact(). */
    // Worker.deleteContact( )
    Worker.prototype.deleteContact = function (inID) {
        var _this = this;
        console.log("Contacts.Worker.deleteContact()", inID);
        return new Promise(function (inResolve, inReject) {
            _this.db.remove({ _id: inID }, {}, function (inError, inNumRemoved) {
                if (inError) {
                    console.log("Contacts.Worker.deleteContact(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.deleteContact(): Ok", inNumRemoved);
                    inResolve();
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
/*
Here, the remove() method is used, and for the first time, we need to provide a query. This method receives just the ID of the contact to delete, and we need a match on the _id field, hence the query object seen here. This method takes a second argument, an options argument, that provides some additional flexibility (at the time of this writing, the only option was whether to remove multiple documents if more than one matches the selection criteria – when using the _id field though, that would never be the case,
so an empty options object is sufficient here). In this case, the callback is passed the number of documents removed. Given the way the code is structured and how the
client will be written, there’s really no situation where anything but a value of 1 would be passed, so I saw no real purpose in returning anything at all when resolving the Promise. As long as it’s not rejected, we treat it as a successful removal.
 */
//# sourceMappingURL=Contacts.js.map