import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { connect } from "react-redux";
import { logout } from "../store/actions/authActions";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";

class NavBar extends Component {
  state = {
    isOpen: false
  };
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
  render() {
    const guestLinks = (
      <React.Fragment>
        <NavItem>
          <NavLink href="#">
            <RegisterModal />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">
            <LoginModal />
          </NavLink>
        </NavItem>
      </React.Fragment>
    );

    const authLinks = (
      <React.Fragment>
        <NavItem>
          <NavLink href="#" onClick={() => this.props.logout()}>
            Logout{" "}
            <strong>
              ({this.props.isAuthenticated && this.props.user.name})
            </strong>
          </NavLink>
        </NavItem>
      </React.Fragment>
    );

    const { isAuthenticated } = this.props;
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">ChatBox</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  isLoading: state.authReducer.isLoading
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
