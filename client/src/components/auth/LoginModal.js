import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup
} from "reactstrap";
import { connect } from "react-redux";
import { login } from "../../store/actions/authActions";

class LoginModal extends Component {
  state = {
    modal: false,
    email: "",
    password: ""
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    // Attempt to login new user
    const { email, password } = this.state;
    this.props.login({ email, password });
  };

  render() {
    const { email, password } = this.state;

    return (
      <div>
        <div onClick={this.toggle}>Login</div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Login Form</ModalHeader>
          <ModalBody>
            <Form>
              {/* Email */}
              <FormGroup>
                <label htmlFor="email">Email:</label>
                <Input
                  type="email"
                  id="email"
                  onChange={this.handleChange}
                  value={email}
                  name="email"></Input>
              </FormGroup>
              {/* Password */}
              <FormGroup>
                <label htmlFor="password">Password:</label>
                <Input
                  type="password"
                  id="password"
                  onChange={this.handleChange}
                  value={password}
                  name="password"></Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.handleSubmit}>
              Log in
            </Button>{" "}
            <Button color="danger" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
});

export default connect(
  null,
  mapDispatchToProps
)(LoginModal);
