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
import StatsPage from "./views/StatsPage";
import TriumphsDebug from "./views/TriumphsDebug";

export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={App}>
            <Route path="/" component={Home} />
            <Route path="/stats" mode="collectibles" component={StatsPage} />
            <Route
              path="/stats/collectibles"
              mode="collectibles"
              component={StatsPage}
            />
            <Route path="/stats/records" mode="records" component={StatsPage} />
            <Route path="/clan/:groupId" component={ClanPage} />
            <Route path="/triumph-report" component={TriumphReport} />
            <Route path="/compare-triumphs" component={CompareTriumphs} />
            <Route path="/new-collections" component={NewCollections} />
            <Route path="/:membershipType/:membershipId" component={UserPage} />
            <Route
              path="/:membershipType/:membershipId/debug"
              component={TriumphsDebug}
            />
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
