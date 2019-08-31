import React, { Component } from "react";
import { Input, Label, FormGroup, Button } from "reactstrap";
import "../styles/ChatBox.css";
import openSocket from "socket.io-client";
import { connect } from "react-redux";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";

const socket = openSocket("/");

class ChatBox extends Component {
  state = {
    newMessage: "",
    messages: []
  };

  componentDidMount() {
    // Get messages from db
    socket.on("output", data => {
      this.setState({
        messages: data
      });
      this.scrollToBottom();
    });

    // Ref
    socket.on("refresh", data => {
      this.setState({ messages: [...this.state.messages, data] });
      this.scrollToBottom();
    });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    socket.emit("input", {
      msg: this.state.newMessage,
      author: this.props.user.name,
      author_color: this.props.user.name_color
    });

    // Clear input field
    this.setState({ newMessage: "" });
  };

  handleKeyPress = e => {
    // Submit after enter
    if (e.which === 13) this.handleSubmit(e);
  };

  scrollToBottom = () => {
    this.chat.scrollTop = this.chat.scrollHeight;
  };

  render() {
    const msgList = this.state.messages.length
      ? this.state.messages.map(msg => (
          <div className="message" key={msg._id}>
            <strong style={{ color: msg.author_color }}>{msg.author}: </strong>
            <span>{msg.msg}</span>
          </div>
        ))
      : "There aren't any messages yet - let's change that!";

    const { isAuthenticated } = this.props;
    const { newMessage } = this.state;
    return (
      <div className="container py-5">
        <div className="chatbox">
          <Label for="messages">Chat:</Label>
          <div className="messages" ref={el => (this.chat = el)} id="messages">
            {msgList}
          </div>
          {isAuthenticated ? (
            <FormGroup className="new_message_form">
              <Label for="newMessage">New message:</Label>
              <Input
                placeholder="Say Hello..."
                type="textarea"
                onChange={this.handleChange}
                name="newMessage"
                id="newMessage"
                value={newMessage}
                onKeyPress={this.handleKeyPress}
              />
              <Button color="success px-5" onClick={this.handleSubmit}>
                Send
              </Button>
            </FormGroup>
          ) : (
            <h3 className="text-center mt-5 tip">
              Please&nbsp;
              <a href="/" onClick={e => e.preventDefault()}>
                <RegisterModal title="register" />
              </a>
              &nbsp;or&nbsp;
              <a href="/" onClick={e => e.preventDefault()}>
                <LoginModal title="log in" />
              </a>
              &nbsp;to add new message
            </h3>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user
});

export default connect(mapStateToProps)(ChatBox);
