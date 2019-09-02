import React, { Component } from "react";
import { Input, Label, FormGroup, Button, Alert } from "reactstrap";
import "../styles/ChatBox.css";
import openSocket from "socket.io-client";
import { connect } from "react-redux";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import moment from "moment";

const socket = openSocket("/");

class ChatBox extends Component {
  state = {
    newMessage: "",
    messages: [],
    events: [],
    typingTimer: null,
    errorMsg: ""
  };

  componentDidMount() {
    const { events } = this.state;

    // Get messages from db
    socket.on("output", data => {
      this.setState({
        messages: data
      });
      this.scrollToBottom();
    });

    // Refresh - new messages
    socket.on("refresh", data => {
      this.setState({ messages: [...this.state.messages, data] });
      this.scrollToBottom();
    });

    // Typing event
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
    const { name, name_color, rank } = this.props.user;
    const { newMessage } = this.state;

    if (newMessage.length < 255) {
      // Clear Typing event
      socket.emit("stopTyping", this.props.user.name);

      // Emit new message
      socket.emit("input", {
        msg: newMessage,
        author: name,
        author_color: name_color,
        author_rank: rank
      });

      // Clear input field
      this.setState({ newMessage: "" });
    } else {
      this.setState({ errorMsg: "Message might have at most 255 characters" });

      // Clear error after 5sec
      setTimeout(() => {
        this.setState({ errorMsg: "" });
      }, 5000);
    }
  };

  handleKeyPress = e => {
    const { name } = this.props.user;
    const { typingTimer } = this.state;

    // Submit after enter
    if (e.which === 13) return this.handleSubmit(e);

    // Emit typing
    socket.emit("typing", name);

    // Emit stop typing after 5s break - clear event
    clearTimeout(typingTimer);
    this.setState({
      typingTimer: setTimeout(() => {
        socket.emit("stopTyping", name);
      }, 5000)
    });
  };

  // Scroll chatbox to bottom
  scrollToBottom = () => {
    this.chat.scrollTop = this.chat.scrollHeight;
  };

  render() {
    const { isAuthenticated } = this.props;
    const { newMessage, messages, events, errorMsg } = this.state;
    const msgList = messages.length
      ? messages.map(msg => (
          <div className="msg__wrapper" key={msg._id}>
            <span style={{ color: msg.author_color }} className="rank">
              {msg.author_rank}
            </span>
            <div className="message">
              <strong style={{ color: msg.author_color }}>
                {msg.author}:{" "}
              </strong>
              <span>{msg.msg}</span>
            </div>
            <div className="date">
              {moment(msg.date).format("HH:mm")}&nbsp;|&nbsp;
              {moment(msg.date).format("DD-MM-YYYY")}
            </div>
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
            {errorMsg !== "" ? (
              <Alert color="danger" className="my-3">
                {errorMsg}
              </Alert>
            ) : null}
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
