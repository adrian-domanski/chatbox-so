import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import { register } from "../../store/actions/authActions";

class RegisterModal extends Component {
  state = {
    modal: false,
    error: null,
    name: "",
    email: "",
    password: ""
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.error.id !== prevProps.error.id &&
      this.props.error.id === "REGISTER_FAIL"
    ) {
      this.setState({ error: this.props.error.msg });
      this.props.clearErrors();

      setTimeout(() => {
        this.setState({ error: null });
      }, 5000);
    }
  }

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
    // Attempt to register new user
    const { name, email, password } = this.state;
    this.props.register({ name, email, password });
  };

  render() {
    const { name, email, password, error } = this.state;
    return (
      <div>
        <div onClick={this.toggle}>Register</div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Registration Form</ModalHeader>
          <ModalBody>
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Form>
              {/* Name */}
              <FormGroup>
                <label htmlFor="name">Name:</label>
                <Input
                  type="text"
                  id="name"
                  onChange={this.handleChange}
                  value={name}
                  name="name"></Input>
              </FormGroup>
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
              Register
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

const mapStateToProps = state => ({
  error: state.errorReducer
});

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user)),
  clearErrors: () => dispatch({ type: "CLEAR_ERRORS" })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterModal);
