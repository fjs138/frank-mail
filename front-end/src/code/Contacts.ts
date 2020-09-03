// library imports
import axios, { AxiosResponse } from "axios";

// app imports
import { config } from "./config";

// define interface to describe a contact
// only have an _id field when retrieving or adding, so it has to be optional
export interface IContact { _id?: number, name: string, email: string }
// matches Contacts.ts for back-end
// we’re passing objects back and forth that need to have the same structure on both sides


// worker that performs contact operations
export class Worker {


    /**
     * Returns a list of all contacts from the server.
     *
     * @return An array of objects, on per contact.
     */
    public async listContacts(): Promise<IContact[]> {

        console.log("Contacts.Worker.listContacts()");

        const response: AxiosResponse = await axios.get(`${config.serverAddress}/contacts`);
        return response.data;

    } /* End listContacts(). */


    /**
     * Add a contact to the server.
     *
     * @oaram  inContact The contact to add.
     * @return           The inContact object, but now with a _id field added.
     */
    public async addContact(inContact: IContact): Promise<IContact> {

        console.log("Contacts.Worker.addContact()", inContact);

        const response: AxiosResponse = await axios.post(`${config.serverAddress}/contacts`, inContact);
        return response.data;

    } // end of addContact()
    // a post(), passing inContact as the second argument.
    // Axios takes care of serializing that to JSON and sending it in the request body
    // get back the same object but now with the _id field added, so that is returned so the caller can add it to the
    // list of contacts for display


    /**
     * Delete a contact from the server.
     *
     * @oaram inID The ID (_id) of the contact to add.
     */
    public async deleteContact(inID): Promise<void> {

        console.log("Contacts.Worker.deleteContact()", inID);

        await axios.delete(`${config.serverAddress}/contacts/${inID}`);

    } // end of deleteContact()
// the contact’s ID added to the URL, as per the REST interface server design.

} // end of Worker class