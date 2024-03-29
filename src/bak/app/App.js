import React, { Component } from "react";
import "./App.css";
import { Route, withRouter, Switch } from "react-router-dom";
import { getCurrentUser } from "../util/APIUtils";
import PollList from "../poll/PollList";
import NewPoll from "../poll/NewPoll";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import Profile from "../user/profile/Profile";
import AppHeader from "../common/AppHeader";
import NotFound from "../common/NotFound";
import PrivateRoute from "../common/PrivateRoute";
import LoadingIndicator from "../common/LoadingIndicator";

import { Layout, notification } from "antd";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    };

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3
    });
  }

  loadCurrentUser = () => {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  };

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout = (
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) => {
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Polling App",
      description: description
    });
  };

  handleLogin = () => {
    notification.success({
      message: "Polling App",
      description: "You're successfully logged in."
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  };

  render() {
    const { isAuthenticated, isLoading, currentUser } = this.state;
    if (isLoading) {
      return <LoadingIndicator />;
    }

    return (
      <Layout className="app-container">
        <AppHeader
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={this.handleLogout}
        />
        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <PollList
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    handleLogout={this.handleLogout}
                    {...props}
                  />
                )}
              />
              <Route
                path="/login"
                render={props => (
                  <Login onLogin={this.handleLogin} {...props} />
                )}
              />
              <Route path="/signup" component={Signup} />
              <Route
                path="/users/:username"
                render={props => (
                  <Profile
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    {...props}
                  />
                )}
              />
              <PrivateRoute
                authenticated={isAuthenticated}
                path="/poll/new"
                component={NewPoll}
                handleLogout={this.handleLogout}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
