// eslint-disable no-console
import React, { Component } from "react";
import { Router, Route, browserHistory } from "react-router";
import { Provider } from "react-redux";

import store from "./store";
import App from "./views/App";
import Home from "./views/Home";
import UserPage from "./views/UserPage";
import ClanPage from "./views/ClanPage";
import CrawlPage from "./views/CrawlPage";
import TriumphReport from "./views/TriumphReport";
import CompareTriumphs from "./views/CompareTriumphs";
import NewCollections from "./views/NewCollections";
import ActivityGraphPage from "./views/ActivityGraphPage";

export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={App}>
            <Route path="/" component={Home} />
            <Route path="/clan/:groupId" component={ClanPage} />
            <Route path="/triumph-report" component={TriumphReport} />
            <route path="/compare-triumphs" component={CompareTriumphs} />
            <route path="/new-collections" component={NewCollections} />
            <Route path="/:membershipType/:membershipId" component={UserPage} />
            <Route
              path="/:membershipType/:membershipId/crawl"
              component={CrawlPage}
            />
            <Route
              path="/:membershipType/:membershipId/activity-graph"
              component={ActivityGraphPage}
            />
          </Route>
        </Router>
      </Provider>
    );
  }
}
