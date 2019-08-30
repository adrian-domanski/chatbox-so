import React, { Component } from "react";
import { Input, Label, FormGroup, Button } from "reactstrap";
import "../styles/ChatBox.css";

class ChatBox extends Component {
  render() {
    return (
      <div className="container py-5">
        <div className="chatbox">
          <Label for="messages">Chat:</Label>
          <div className="messages" id="messages"></div>
          <FormGroup className="new_message_form">
            <Label for="newMessage">New message:</Label>
            <Input type="textarea" name="newMessage" id="newMessage" />
            <Button color="success px-5">Send</Button>
          </FormGroup>
        </div>
      </div>
    );
  }
}

export default ChatBox;
