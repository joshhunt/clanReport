import React, { Component, Fragment } from "react";
import { get } from "lodash";
import { connect } from "react-redux";

import SearchForPlayer from "../../components/SearchForPlayer";
import PlayerLink from "../../components/PlayerLink";

import destinyAuth from "../../lib/destinyAuth";
import { setAuth, getMembership } from "../../store/auth";

import s from "./styles.module.css";

const CLIENT_ID = process.env.REACT_APP_BUNGIE_CLIENT_ID;
const AUTH_URL = `https://www.bungie.net/en/OAuth/Authorize?client_id=${CLIENT_ID}&response_type=code`;

class App extends Component {
  componentDidMount() {
    destinyAuth((err, result) => {
      this.props.setAuth({ err, result });

      if (result.isFinal && result.isAuthenticated) {
        this.props.getMembership();
      }
    });
  }

  render() {
    const { memberships, isAuthenticated } = this.props;

    return (
      <div className={s.root}>
        <div className={s.selectPlayer}>
          {isAuthenticated ? (
            <Fragment>
              <h2>Your linked accounts</h2>
              {memberships.map((player) => (
                <PlayerLink player={player} />
              ))}
            </Fragment>
          ) : (
            <Fragment>
              <a className={s.authLink} href={AUTH_URL}>
                Login with Bungie.net to see your linked accounts
              </a>
            </Fragment>
          )}

          <SearchForPlayer className={s.playerSearch} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    memberships: get(state, "auth.membership.destinyMemberships", []),
    isAuthenticated: state.auth.isAuthenticated,
  };
}

const mapDispatchToActions = {
  setAuth,
  getMembership,
};

export default connect(mapStateToProps, mapDispatchToActions)(App);
