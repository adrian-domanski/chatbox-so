import React, { Component } from "react";
import NavBar from "./components/NavBar";
import { auth } from "./store/actions/authActions";
import { connect } from "react-redux";

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
