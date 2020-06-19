// eslint-disable no-console
import React, { Component } from "react";
import { Router, Route, browserHistory } from "react-router";
import { Provider } from "react-redux";

import store from "./store";
import App from "./views/App";
import Home from "./views/Home";
import UserPage from "./views/UserPage";
import ClanPage from "./views/ClanPage";
import CompareNightfalls from "./views/CompareDebug";

export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={App}>
            <Route path="/" component={Home} />
            <Route path="/clan/:groupId" component={ClanPage} />
            <Route path="/compare-nightfalls" component={CompareNightfalls} />
            <Route path="/compare-nightfalls/" component={CompareNightfalls} />
            <Route path="/:membershipType/:membershipId" component={UserPage} />
          </Route>
        </Router>
      </Provider>
    );
  }
}
