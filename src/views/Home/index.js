import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';

import SearchForPlayer from 'src/components/SearchForPlayer';
import PlayerLink from 'src/components/PlayerLink';

import destinyAuth from 'src/lib/destinyAuth';
import { setAuth, getMembership } from 'src/store/auth';

import s from './styles.styl';

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
        {isAuthenticated ? (
          <Fragment>
            <h2>Your linked accounts</h2>
            {memberships.map(player => (
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
    );
  }
}

function mapStateToProps(state) {
  return {
    memberships: get(state, 'auth.membership.destinyMemberships', []),
    isAuthenticated: state.auth.isAuthenticated
  };
}

const mapDispatchToActions = { setAuth, getMembership };

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(App);

// function mapStateToProps(state) {
//   return {
//     isAuthenticated: state.auth.isAuthenticated
//   };
// }

// const mapDispatchToActions = { setAuth, getMembership };

// export const AuthRequired = connect(mapStateToProps, mapDispatchToActions)(
//   _AuthRequired
// );
