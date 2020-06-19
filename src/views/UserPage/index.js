import React, { Component } from "react";
import { orderBy } from "lodash";
import { Link } from "react-router";
import { connect } from "react-redux";

import { getClansForUser, getProfile } from "../../store/clan";
import {
  getLeaderboardForPlayer,
  getLeaderboardStatus,
} from "../../store/leaderboards";
import {
  getCharacterPGCRHistory,
  toggleViewPGCRDetails,
  getPGCRDetails,
} from "../../store/pgcr";
import GamesTable from "../../components/GamesTable";
import Stat from "../../components/Stat";
import PrettyDate from "../../components/Date";

import s from "./styles.module.css";

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

function Ordinal({ value }) {
  return (
    <span>
      {value.toLocaleString()}
      <sup>{getOrdinal(value)}</sup>
    </span>
  );
}

class UserPage extends Component {
  componentDidMount() {
    this.props.getLeaderboardStatus();
    this.props.getLeaderboardForPlayer(this.props.routeParams);
    this.props.getClansForUser(this.props.routeParams);
    this.props.getProfile(this.props.routeParams).then((profile) => {
      Object.keys(profile.characters.data).forEach((characterId) => {
        this.props.getCharacterPGCRHistory(
          this.props.routeParams,
          characterId,
          {
            completeHistory: true,
            mode: this.props.router.location.query.mode || "None",
          }
        );
      });
    });
  }

  renderName() {
    const { profile, pKey } = this.props;
    return profile ? profile.profile.data.userInfo.displayName : pKey;
  }

  viewPGCRDetails = (pgcrId) => {
    this.props.toggleViewPGCRDetails(pgcrId);
    this.props.getPGCRDetails(pgcrId);
  };

  render() {
    const { gameHistory, ranks, leaderboardStatus } = this.props;
    const clans = this.props.clans || [];

    return (
      <div className={s.root}>
        <h2>{this.renderName()}</h2>

        {clans.map((clan) => (
          <p key={clan.group.groupId}>
            Clan:{" "}
            <Link to={`/clan/${clan.group.groupId}`}>{clan.group.name}</Link>
          </p>
        ))}

        {ranks && ranks.profile && (
          <div className={s.ranks}>
            <Stat
              className={s.rank}
              name="Triumph score"
              extra={<Ordinal value={ranks.triumphRank} />}
              value={ranks.profile.triumphScore}
            />
            <Stat
              className={s.rank}
              name="Collected items"
              extra={<Ordinal value={ranks.collectionRank} />}
              value={ranks.profile.collectionScore}
            />
          </div>
        )}

        <h3>Recent games</h3>

        <GamesTable
          games={gameHistory}
          pgcrDetails={this.props.pgcrDetails}
          onGameRowClick={this.viewPGCRDetails}
          activePgcrs={this.props.activePgcrs}
        />

        {leaderboardStatus && (
          <p className={s.status}>
            <em>
              <small>
                Tracking {leaderboardStatus.profileCount.toLocaleString()}{" "}
                profiles, last updated{" "}
                <PrettyDate date={leaderboardStatus.latestProfileLastCrawled} />
              </small>
            </em>
            <br />
          </p>
        )}
      </div>
    );
  }
}

const MAX_GAMES = 100;

function mapStateToProps(state, ownProps) {
  const pKey = `${ownProps.routeParams.membershipType}/${ownProps.routeParams.membershipId}`;

  const profile = state.clan.profiles[pKey];

  const byCharacter = Object.values(state.pgcr.histories[pKey] || {});
  const allGames = [].concat(...byCharacter).filter(Boolean);
  const gameHistory = orderBy(allGames, (g) => new Date(g.period), [
    "desc",
  ]).slice(0, MAX_GAMES);

  return {
    isAuthenticated: state.auth.isAuthenticated,
    leaderboardStatus: state.leaderboards.status,
    ranks: state.leaderboards.players[pKey],
    clans: state.clan.clanResults,
    gameHistory,
    activePgcrs: state.pgcr.viewDetails,
    pgcrDetails: state.pgcr.pgcr,
    pKey,
    profile,
  };
}

const mapDispatchToActions = {
  getClansForUser,
  getLeaderboardForPlayer,
  getLeaderboardStatus,
  getProfile,
  getCharacterPGCRHistory,
  toggleViewPGCRDetails,
  getPGCRDetails,
};

export default connect(mapStateToProps, mapDispatchToActions)(UserPage);
