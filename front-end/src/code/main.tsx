// style imports
import "normalize.css";
/*
normalize.css: a CSS reset, meaning that it normalizes style conditions across browsers
don’t use any styles in normalize.css directly, they’re strictly something that gets applied automatically
before the app’s styles do
 */
import "../css/main.css";

// react imports
import React from "react";
import ReactDOM from "react-dom";

// app imports
import BaseLayout from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";

// render the ui
const baseComponent = ReactDOM.render(<BaseLayout />, document.body);

// fetch the user's mailboxes, then their contacts.
baseComponent.state.showHidePleaseWait(true); // when true, display a “please wait” popup,
// so the user knows something is happening. This will also serve the purpose of blocking the UI for a moment
// so that the user can’t go and do something that causes problems while the server works
async function getMailboxes() {
  /*
  get back an array of mailboxes, and then iterate them and call the addMailboxToList() method on the state object
  (because there is a reference to the BaseLayout component via the baseComponent variable)
  that will update the mailboxes array in state, causing react to render the screen to show the mailboxes on the left
   */
  const imapWorker: IMAP.Worker = new IMAP.Worker();
  const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
  mailboxes.forEach((inMailbox) => {
    baseComponent.state.addMailboxToList(inMailbox);
  });
}
getMailboxes().then(function () {
  // fetch the user's contacts
  async function getContacts() {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
    contacts.forEach((inContact) => {
      baseComponent.state.addContactToList(inContact);
    });
  }
  getContacts().then(() => baseComponent.state.showHidePleaseWait(false));
});
/*
the list of mailboxes must be completed before getting the list of contacts, so it is known that all server calls are
done before the please wait popup is hidden, so then() syntax is used to chain them.
inside the then() callback, another function is defined, getContacts(), for the same reason: async/await usage
once defined, the app can call getContacts() and again use the then() syntax so that we can call showHidePleaseWait(),
passing false this time, to cause react to hide the please wait popup
 */
