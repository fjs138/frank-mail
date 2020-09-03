// node imports
import * as path from "path"; // for path to data file

// library imports
const Datastore = require("nedb"); // for nosql implementation

// define interface to describe a contact
export interface IContact {
  _id?: number; // optional, as it is only needed when retrieving or adding
  name: string;
  email: string;
}
// used in all use cases;  when adding or deleting a contact, or listing contacts
// in the case of adding a contact, the _id field won’t be populated initially (the client won’t supply it)
// instead, NeDB will be populating that, so it is marked as optional here;
// without it, the add operation wouldn’t meet the contract due to not having an _id field

// worker that performs contact operations
export class Worker {
  // The Nedb datastore instance for contacts
  private db: Nedb;


  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "contacts.db"),
      autoload: true,
    });
    // upon construction, an NeDB Datastore object is created, and a path to the contacts.db file is given.
    // NeDB will load it automatically, and NeDB will create the file if it doesn’t already exist.
  } // end of constructor function

  /**
   * Lists all contacts.
   *
   * @return A promise that eventually resolves to an array of IContact objects.
   */
  public listContacts(): Promise<IContact[]> {
    console.log("Contacts.Worker.listContacts()");

    return new Promise((inResolve, inReject) => {
      this.db.find({}, (inError: Error, inDocs: IContact[]) => {
        if (inError) {
          console.log("Contacts.Worker.listContacts(): Error", inError);
          inReject(inError);
        } else {
          console.log("Contacts.Worker.listContacts(): Ok", inDocs);
          inResolve(inDocs);
        }
      });
    });
  } // end of listContacts()
  /*
like nodemailer, NeDB doesn’t provide an async/await-based API;
wrapping it in Promises like with nodemailer in order to be able to code with async/await.
in the Promise, the find() method is calle on the DataStore referenced by this.db and passing no search criteria as the first argument
returns all the records in the contacts.db file, which is the contacts collection (NoSQL)

since the objects that will be returned will match the IContact interface’s structure, the inDocs argument can be typed as such
even though NeDB doesn’t know about the type, it doesn’t have to, this is TypeScript territory
like with nodemailer, either the Promise is rejected, passing the error to the caller,
or else the array of documents is returned, which are the contact objects
note the use of generics for the return type;  promising to resolve with an array of IContact objects
 */

  // Worker.addContact()
  /**
   * Add a new contact.
   *
   * @param  inContact The contact to add.
   * @return           A promise that eventually resolves to an IContact object.
   */
  public addContact(this:any, inContact: IContact): Promise<IContact> {
    console.log("Contacts.Worker.addContact()", inContact);
    return new Promise((inResolve, inReject) => {
      this.db.insert(inContact, (inError: Error, inNewDoc: IContact) => {
        if (inError) {
          console.log("Contacts.Worker.addContact(): Error", inError);
          inReject(inError);
        } else {
          console.log("Contacts.Worker.addContact(): Ok", inNewDoc);
          inResolve(inNewDoc);
        }
      });
    });
  } // end of addContact()

  // Worker.deleteContact( )
  public deleteContact(this:any,inID: string): Promise<string> {
    console.log("Contacts.Worker.deleteContact()", inID);

    return new Promise((inResolve, inReject) => {
      this.db.remove(
        { _id: inID },
        {},
        (inError: Error, inNumRemoved: number) => {
          if (inError) {
            console.log("Contacts.Worker.deleteContact(): Error", inError);
            inReject(inError);
          } else {
            console.log("Contacts.Worker.deleteContact(): Ok", inNumRemoved);
            inResolve();
          }
        }
      );
    });
  }
}
/*
the remove() method is used, and a query is required
remove() receives just the ID of the contact to delete, and a match is needed on the _id field, hence the query object
remove() takes a second argument, an options argument; here, the callback is passed the number of documents removed
a value of 1 will be passed, so no need to return anything when resolving the promise
as long as it’s not rejected, it's treated as a successful removal
 */
