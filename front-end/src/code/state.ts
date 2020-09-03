// app imports
import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";

// defines an object that BaseLayout will include, and it's where all state for the application will live

// this function will be called inside BaseLayout, and the state object will be returned
// that object will then become a member of BaseLayout

// This function must be called once and only once from BaseLayout
export function createState(inParentComponent) {
  // this function takes in a reference to the component that contains it, in this case, BaseLayout
  // then this function returns an object, the state object:
  return {
    pleaseWaitVisible: false, // flag for "is the please wait dialog visible?"
    // when the server is called by the app, the please wait dialog will be visible

    contacts: [], // list of contacts

    mailboxes: [], // list of mailboxes.

    messages: [], // List of messages in the current mailbox.
    // also, assuming a mailbox has been selected, the app needs the list of messages within it

    currentView: "welcome",
    /*
    the view that is currently showing:
    starts with the "welcome" view, then changes to one of "welcome", "message" (when viewing a message),
    "compose" (when creating a message), "contact" (when viewing a contact), and "contactAdd" (when adding a contact).

    when the user clicks a mailbox or clicks the NEW MESSAGE or NEW CONTACT button or clicks a contact in the list,
    what they see in the middle of the screen changes. this is referred to as the “view,” and which view is current must
    be known for react to render the correct content
    */

    currentMailbox: null, // the currently selected mailbox, if any

    // the details of the message currently being viewed or composed, if any:

    // what state is necessary when either viewing or creating a message:
    messageID: null, // would only ever be populated when viewing an existing message
    messageDate: null,
    messageFrom: null,
    messageTo: null,
    messageSubject: null,
    messageBody: null,

    // the details of the contact currently being viewed or added, if any:

    // when viewing or creating a contact, state is required too
    contactID: null,
    contactName: null,
    contactEmail: null,

    // view switch functions:

    /**
     * Shows or hides the please wait dialog during server calls.
     *
     * @param inVisible True to show the dialog, false to hide it.
     */

    // state mutator method
    /*
    with react, you don’t directly tell components to do things, instead, you mutate state in some way,
    using the setState() method on the component that holds the state, which causes react to repaint the pertinent
    parts of the ui as needed.
    */
    showHidePleaseWait: function (this: any,inVisible: boolean): void {
      this.setState({ pleaseWaitVisible: inVisible });
      /*
    in this case, to show the please wait popup, the app needs to update the pleaseWaitVisible state attribute,
    setting it to true; react will then redraw the UI, and the popup element will now be set to visible.
    */
    }.bind(inParentComponent), // end of showHidePleaseWait()

    /*
      since the app is limited to calling the setState() method on the component that contains the state object,
      any code that tries to call it must execute within the context of that component

      when defining a separate object for state as was done in order to break it out into its own source file,
      the this reference in the methods inside state won’t be what is needed

      in other words, any method inside the state object won’t have access to setState() because its execution context,
      at least in some instances, won’t be the BaseLayout component

      that’s where the bind() statements come in, and notice these on every function in the state object

      when the state object is constructed via the call to createState(), a reference to the BaseLayout instance was
      passed in. That’s what the app binds all the mutator functions to

      this will provide them access to setState() as is needed

      note that if any of them needs to touch the state object itself, which they need to sometimes,
      they can do so by accessing this.state, since components always expose their state via that property
      */

    /**
     * Show ContactView in view mode.
     *
     * @param inID    The ID of the contact to show.
     * @param inName  The name of the contact to show.
     * @oaram inEmail The Email address of the contact to show.
     */
    showContact: function (this: any,
      inID: string,
      inName: string,
      inEmail: string
    ): void {
      console.log("state.showContact()", inID, inName, inEmail);

      this.setState({
        currentView: "contact",
        contactID: inID,
        contactName: inName,
        contactEmail: inEmail,
      });
    }.bind(inParentComponent), // end of showContact()

    //show ContactView in add mode
    showAddContact: function (this: any,): void {
      console.log("state.showAddContact()");

      this.setState({
        currentView: "contactAdd",
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
    }.bind(inParentComponent), // end of showAddContact()

    /**
     * Show MessageView in view mode.
     *
     * @param inMessage The message object that was clicked.
     */
    showMessage: async function (this: any, inMessage: IMAP.IMessage): Promise<void> {
      console.log("state.showMessage()", inMessage);

      // get message's body.
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const mb: String = await imapWorker.getMessageBody(
        inMessage.id,
        this.state.currentMailbox
      );
      this.state.showHidePleaseWait(false);

      // update state
      this.setState({
        currentView: "message",
        messageID: inMessage.id,
        messageDate: inMessage.date,
        messageFrom: inMessage.from,
        messageTo: "",
        messageSubject: inMessage.subject,
        messageBody: mb,
      });
    }.bind(inParentComponent), // end of showMessage()

    /**
     * Show MessageView in compose mode.
     *
     * @param inType Pass "new" if this is a new message, "reply" if it's a reply to the message currently being
     *                    viewed, and "contact" if it's a message to the contact currently being viewed.
     */
    showComposeMessage: function (this: any, inType: string): void {
      console.log("state.showComposeMessage()");

      switch (inType) {
        case "new":
          this.setState({
            currentView: "compose",
            messageTo: "",
            messageSubject: "",
            messageBody: "",
            messageFrom: config.userEmail,
          });
          break;

        case "reply":
          this.setState({
            currentView: "compose",
            messageTo: this.state.messageFrom,
            messageSubject: `Re: ${this.state.messageSubject}`,
            messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`,
            messageFrom: config.userEmail,
          });
          break;

        case "contact":
          this.setState({
            currentView: "compose",
            messageTo: this.state.contactEmail,
            messageSubject: "",
            messageBody: "",
            messageFrom: config.userEmail,
          });
          break;
      }
    }.bind(inParentComponent), // end of showComposeMessage()



    // List functions:

    /**
     * Add a mailbox to the list of mailboxes.
     *
     * @param inMailbox A mailbox descriptor object.
     */
    addMailboxToList: function (this: any, inMailbox: IMAP.IMailbox): void {
      console.log("state.addMailboxToList()", inMailbox);
      /*
REMEMBER: when calling setState(), never pass references to objects in state

don't directly push inMailbox into state.mailboxes and then try to call this.setState({this.state. mailboxes})

it won’t work because what's passed into setState() replaces what’s in state at the time

make a copy of the array using slice(0), then push the new mailbox into that copy, then pass that copy to setState().

it's  only required to do this sort of copying/updating/setting when dealing with objects and collections.
      */

      // copy list
      const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0);

      // add new element
      cl.push(inMailbox);

      // update list in state
      this.setState({ mailboxes: cl });
    }.bind(inParentComponent), // end of End addMailboxToList()

    /**
     * Add a contact to the list of contacts.
     *
     * @param inContact A contact descriptor object.
     */
    addContactToList: function (this: any, inContact: Contacts.IContact): void {
      console.log("state.addContactToList()", inContact);

      // copy list
      const cl = this.state.contacts.slice(0);

      // add new element
      cl.push({
        _id: inContact._id,
        name: inContact.name,
        email: inContact.email,
      });

      // update list in state
      this.setState({ contacts: cl });
    }.bind(inParentComponent), // end of addContactToList()

    /**
     * Add a message to the list of messages in the current mailbox.
     *
     * @param inMessage A message descriptor object.
     */
    addMessageToList: function (this: any,inMessage: IMAP.IMessage): void {
      console.log("state.addMessageToList()", inMessage);

      // copy list
      const cl = this.state.messages.slice(0);

      // add new element
      cl.push({
        id: inMessage.id,
        date: inMessage.date,
        from: inMessage.from,
        subject: inMessage.subject,
      });

      // update list in state
      this.setState({ messages: cl });
    }.bind(inParentComponent), // end of addMessageToList()

    // clear the list of messages currently displayed
    clearMessages: function (this: any,): void {
      console.log("state.clearMessages()");

      this.setState({ messages: [] });
    }.bind(inParentComponent), // end of clearMessages()

    // Event Handler functions:

    /**
     * Set the current mailbox.
     *
     * @param inPath The path of the current mailbox.
     */
    setCurrentMailbox: function (this: any,inPath: String): void {
      console.log("state.setCurrentMailbox()", inPath);

      // update state
      this.setState({ currentView: "welcome", currentMailbox: inPath });

      // get the list of messages for the mailbox
      this.state.getMessages(inPath);
    }.bind(inParentComponent), // end of setCurrentMailbox()

    /**
     * Get a list of messages in the currently selected mailbox, if any.
     *
     * @param inPath The path to the mailbox to get messages for.  Note that because this method is called when the
     *               current mailbox is set, we can't count on state having been updated by the time this is called,
     *               hence why the mailbox is passed in.  This avoids the problem with setState() being asynchronous.
     */
    getMessages: async function (this: any, inPath: string): Promise<void> {
      console.log("state.getMessages()");

      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
      this.state.showHidePleaseWait(false);

      this.state.clearMessages();
      messages.forEach((inMessage: IMAP.IMessage) => {
        this.state.addMessageToList(inMessage);
      });
    }.bind(inParentComponent), // end of getMessages()

    /**
     * Fires any time the user types in an editable field.
     *
     * @param inEvent The event object generated by the keypress.
     */
    fieldChangeHandler: function (this: any, inEvent: any): void {
      console.log(
        "state.fieldChangeHandler()",
        inEvent.target.id,
        inEvent.target.value
      );

      // enforce max length for contact name
      if (
        inEvent.target.id === "contactName" &&
        inEvent.target.value.length > 16
      ) {
        return;
      }

      this.setState({ [inEvent.target.id]: inEvent.target.value });
    }.bind(inParentComponent), // end of fieldChangeHandler()

    // save contact
    saveContact: async function (this: any,): Promise<void> {
      console.log(
        "state.saveContact()",
        this.state.contactID,
        this.state.contactName,
        this.state.contactEmail
      );

      // copy list
      const cl = this.state.contacts.slice(0);

      // save to server
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: Contacts.IContact = await contactsWorker.addContact({
        name: this.state.contactName,
        email: this.state.contactEmail,
      });
      this.state.showHidePleaseWait(false);

      // add to list
      cl.push(contact);

      // update state
      this.setState({
        contacts: cl,
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
    }.bind(inParentComponent), // end of saveContact()

    // delete the currently viewed contact
    deleteContact: async function (this: any,): Promise<void> {
      console.log("state.deleteContact()", this.state.contactID);

      // delete from server
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.deleteContact(this.state.contactID);
      this.state.showHidePleaseWait(false);

      // remove from list
      const cl = this.state.contacts.filter(
        (inElement) => inElement._id != this.state.contactID
      );

      // update state
      this.setState({
        contacts: cl,
        contactID: null,
        contactName: "",
        contactEmail: "",
      });
    }.bind(inParentComponent), // end of deleteContact()

    // delete the currently viewed message
    deleteMessage: async function (this: any,): Promise<void> {
      console.log("state.deleteMessage()", this.state.messageID);

      // delete from server
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      await imapWorker.deleteMessage(
        this.state.messageID,
        this.state.currentMailbox
      );
      this.state.showHidePleaseWait(false);

      // remove from list
      const cl = this.state.messages.filter(
        (inElement) => inElement.id != this.state.messageID
      );

      // update state
      this.setState({ messages: cl, currentView: "welcome" });
    }.bind(inParentComponent), // end of deleteMessage()

    // delete a message (from the server and the contact list)
    sendMessage: async function (this: any,): Promise<void> {
      console.log(
        "state.sendMessage()",
        this.state.messageTo,
        this.state.messageFrom,
        this.state.messageSubject,
        this.state.messageBody
      );

      // send the message
      this.state.showHidePleaseWait(true);
      const smtpWorker: SMTP.Worker = new SMTP.Worker();
      await smtpWorker.sendMessage(
        this.state.messageTo,
        this.state.messageFrom,
        this.state.messageSubject,
        this.state.messageBody
      );
      this.state.showHidePleaseWait(false);

      // update state
      this.setState({ currentView: "welcome" });
    }.bind(inParentComponent), // end of sendMessage()
  };
}
