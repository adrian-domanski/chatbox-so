import React, { Component } from "react";
import { Input, Label, FormGroup, Button } from "reactstrap";
import "../styles/ChatBox.css";
import openSocket from "socket.io-client";
import { connect } from "react-redux";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";

const socket = openSocket(`http://localhost:${process.env.PORT || 5000}`);

class ChatBox extends Component {
  state = {
    newMessage: "",
    messages: [],
    events: [],
    typingTimer: null
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

    // Typing event
    const { events } = this.state;
    socket.on("typing", name => {
      const event = {
        type: "TYPING",
        author: name,
        msg: `${name} is typing a message...`
      };
      const currEvent = events.find(
        e => e.type === "TYPING" && e.author === name
      );
      if (!currEvent) {
        this.setState({ events: [...events, event] });
        this.scrollToBottom();
      }
    });

    // Clear typing event
    socket.on("stopTyping", name => {
      console.log("clear");
      const typeEvent = events.find(
        e => e.type === "TYPING" && e.author === name
      );

      // Delete event
      const index = events.indexOf(typeEvent);
      const arr = events.splice(index, 1);
      this.setState({ events: arr });
    });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    // Clear Typing event
    socket.emit("stopTyping", this.props.user.name);

    // Emit new message
    socket.emit("input", {
      msg: this.state.newMessage,
      author: this.props.user.name,
      author_color: this.props.user.name_color
    });

    // Clear input field
    this.setState({ newMessage: "" });
  };

  handleKeyPress = e => {
    const { name } = this.props.user;
    this.setState({ isTyping: true });
    // Submit after enter
    if (e.which === 13) return this.handleSubmit(e);

    // Emit typing
    socket.emit("typing", name);

    // Handle stop typing - clear event
    clearTimeout(this.state.typingTimer);
    this.setState({
      typingTimer: setTimeout(() => {
        socket.emit("stopTyping", name);
      }, 5000)
    });
  };

  scrollToBottom = () => {
    this.chat.scrollTop = this.chat.scrollHeight;
  };

  render() {
    const { isAuthenticated } = this.props;
    const { newMessage, messages, events } = this.state;
    const msgList = messages.length
      ? messages.map(msg => (
          <div className="message" key={msg._id}>
            <strong style={{ color: msg.author_color }}>{msg.author}: </strong>
            <span>{msg.msg}</span>
          </div>
        ))
      : "There aren't any messages yet - let's change that!";
    const eventsList = events.length
      ? events.map((event, id) => (
          <div className="text-muted" key={id}>
            {event.msg}
          </div>
        ))
      : "";
    return (
      <div className="chatbox">
        <Label for="messages">Chat:</Label>
        <div className="messages" ref={el => (this.chat = el)} id="messages">
          {msgList}
          {eventsList}
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
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user
});

export default connect(mapStateToProps)(ChatBox);
