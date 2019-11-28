import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Nav from "./components/Nav/nav";
import Homepage from "./pages/Homepage/homepage";
import Register from "./pages/Register/register";
import Login from "./pages/Login/login";
import ForgotPassword from "./pages/ForgotPass/forgotPassword";
import ResetPassword from "./pages/ResetPass/resetPassword";
import Confirmation from "./pages/Confirmation/confirmation";
import Dashboard from "./pages/Dashboard/dashboard";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Error404 from "./components/Error-404";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { ToastContainer } from "react-toastify";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import "react-toastify/dist/ReactToastify.min.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer position="top-center" autoClose={8000} />
        <Nav />
        <Switch>
          <Route exact path="/" render={props => <Homepage {...props} />} />
          <Route
            exact
            path="/register"
            render={props => <Register {...props} />}
          />
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route
            exact
            path="/forgotPassword"
            render={props => <ForgotPassword {...props} />}
          />
          <Route
            exact
            path="/resetPassword/:id"
            render={props => <ResetPassword {...props} />}
          />
          <Route
            exact
            path="/confirmation/:id"
            render={props => <Confirmation {...props} />}
          />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route component={Error404} />
        </Switch>
      </React.Fragment>
    );
  }
}
export default App;
