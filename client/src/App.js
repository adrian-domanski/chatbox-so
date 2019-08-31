import React, { Component } from "react";
import NavBar from "./components/NavBar";
import { auth } from "./store/actions/authActions";
import { connect } from "react-redux";
import ChatBox from "./components/ChatBox";
import RegisterModal from "./components/auth/RegisterModal";
import Info from "./components/Info";

export class App extends Component {
  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.auth();
    }
  }
  render() {
    return (
      <div className="App">
        <NavBar></NavBar>
        <div className="content">
          <ChatBox />
          <Info />
        </div>
        <RegisterModal />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  auth: () => dispatch(auth())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
