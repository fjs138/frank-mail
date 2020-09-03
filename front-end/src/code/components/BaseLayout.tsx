// react imports
import React, { Component } from "react";

// loader animation for please wait dialog
import RiseLoader from '@bit/davidhu2000.react-spinners.rise-loader';


// library imports
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// app imports
import Toolbar from "./Toolbar";
import MailboxList from "./MailboxList";
import MessageList from "./MessageList";
import ContactList from "./ContactList";
import WelcomeView from "./WelcomeView";
import ContactView from "./ContactView";
import MessageView from "./MessageView";
import { createState } from "../state";


class BaseLayout extends Component {
  /*
   state data for the app
 includes all mutator functions for manipulating state so only  have to pass this entire object down through props
 this is not the best design, but it is simpler (for now at least)
   */
  state = createState(this);


  render() {
    return (
      <div className="appContainer">
        <Dialog
          open={this.state.pleaseWaitVisible}
          disableBackdropClick={true}            // disableBackdropClick prop prevents the user from clicking outside of the dialog to dismiss
          disableEscapeKeyDown={true}          // disableEscapeKeyDown prevents them from dismissing via Esc key
          transitionDuration={1}          // transitionDuration is the animation duration length

        >
          <DialogTitle style={{ textAlign: "center" }}>Please Wait</DialogTitle>
          <DialogContent><RiseLoader
              size='15'
              color='#3f51b5'
              margin="20px"
          />
            <DialogContentText style={{textAlign: "center"}}>Connecting...</DialogContentText>
          </DialogContent>
        </Dialog>

        <div className="toolbar">
          <Toolbar state={this.state} />
        </div>

        <div className="mailboxList">
          <MailboxList state={this.state} />
        </div>

        <div className="centerArea">
          <div className="messageList">
            <MessageList state={this.state} />
          </div>
          <div className="centerViews">
            {this.state.currentView === "welcome" && <WelcomeView />}
            {(this.state.currentView === "message" ||
              this.state.currentView === "compose") && (
              <MessageView state={this.state} />
            )}
            {(this.state.currentView === "contact" ||
              this.state.currentView === "contactAdd") && (
              <ContactView state={this.state} />
            )}
          </div>
        </div>

        <div className="contactList">
          <ContactList state={this.state} />
        </div>
      </div>
    );
  } // end of render
} // end of BaseLayout class.

export default BaseLayout;
