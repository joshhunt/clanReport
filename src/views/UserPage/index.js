import { orderBy } from "lodash";
import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

import { getClansForUser, getProfile } from "src/store/clan";
import {
  getCharacterPGCRHistory,
  toggleViewPGCRDetails,
  getPGCRDetails
} from "src/store/pgcr";
import GamesTable from "app/components/GamesTable";
import CurrentActivity from "app/components/CurrentActivity";

import { getCurrentActivity } from "src/lib/destinyUtils";

import s from "./styles.styl";

class UserPage extends Component {
  componentDidMount() {
    this.props.getClansForUser(this.props.routeParams);
    this.props.getProfile(this.props.routeParams).then(profile => {
      Object.keys(profile.characters.data).forEach(characterId => {
        this.props.getCharacterPGCRHistory(
          this.props.routeParams,
          characterId,
          {
            completeHistory: true,
            mode: this.props.router.location.query.mode || "None"
          }
        );
      });
    });
  }

  renderName() {
    const { profile, pKey } = this.props;
    return profile ? profile.profile.data.userInfo.displayName : pKey;
  }

  viewPGCRDetails = pgcrId => {
    this.props.toggleViewPGCRDetails(pgcrId);
    this.props.getPGCRDetails(pgcrId);
  };

  render() {
    const { gameHistory, profile } = this.props;
    const clans = this.props.clans || [];
    const currentActivity = profile && getCurrentActivity(profile);

    return (
      <div className={s.root}>
        <h2>{this.renderName()}</h2>

        {currentActivity && (
          <CurrentActivity currentActivity={currentActivity} />
        )}

        {clans.map(clan => (
          <p key={clan.group.groupId}>
            Clan:{" "}
            <Link to={`/clan/${clan.group.groupId}`}>{clan.group.name}</Link>
          </p>
        ))}

        <h3>Recent games</h3>

        <GamesTable
          games={gameHistory}
          pgcrDetails={this.props.pgcrDetails}
          onGameRowClick={this.viewPGCRDetails}
          activePgcrs={this.props.activePgcrs}
        />
      </div>
    );
  }
}

const MAX_GAMES = 100;

function mapStateToProps(state, ownProps) {
  const pKey = `${ownProps.routeParams.membershipType}/${
    ownProps.routeParams.membershipId
  }`;

  const profile = state.clan.profiles[pKey];

  const byCharacter = Object.values(state.pgcr.histories[pKey] || {});
  const allGames = [].concat(...byCharacter).filter(Boolean);
  const gameHistory = orderBy(allGames, g => new Date(g.period), [
    "desc"
  ]).slice(0, MAX_GAMES);

  return {
    isAuthenticated: state.auth.isAuthenticated,
    clans: state.clan.clanResults,
    gameHistory,
    activePgcrs: state.pgcr.viewDetails,
    pgcrDetails: state.pgcr.pgcr,
    pKey,
    profile
  };
}

const mapDispatchToActions = {
  getClansForUser,
  getProfile,
  getCharacterPGCRHistory,
  toggleViewPGCRDetails,
  getPGCRDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(UserPage);
