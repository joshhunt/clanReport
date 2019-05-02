import React, { Component } from "react";
import { sortBy, flow, mapValues, filter, groupBy } from "lodash/fp";
import { connect } from "react-redux";
import { getMilestones } from "src/lib/destiny";

import { getProfile } from "src/store/clan";
import { getCharacterPGCRHistory, toggleSinceForsaken } from "src/store/pgcr";
import Modal from "src/components/Modal";
import Icon from "src/components/Icon";
import SearchForPlayer from "src/components/SearchForPlayer";

import s from "./styles.styl";
import beavertime, { fastishTimes } from "./beavertime";

const PGCR_MODE = 46;
const FORSAKEN_ISH = new Date(2018, 8, 2);

const FASTEST = "Fastest";
const TEAM_SCORE = "Team Score";

window.beavertime = beavertime;

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function fmtSeconds(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
}

function getMinMaxTime(compFn, hash) {
  const hashs = hash.toString ? hash.toString() : hash;
  const timeA = beavertime[hashs];
  const timeB = fastishTimes[hashs];

  const result = compFn(timeA, timeB);

  return fmtSeconds(result);
}

function getMinTime(hash) {
  return getMinMaxTime(Math.min, hash);
}
function getMaxTime(hash) {
  return getMinMaxTime(Math.max, hash);
}

function NightfallTable({
  currentNightfallHashes,
  nightfalls,
  profiles,
  activities,
  playersToCompare,
  activityDefs,
  nightfallCell
}) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          <td />
          {playersToCompare.map(pKey => (
            <td>
              {profiles[pKey] &&
                profiles[pKey].profile.data.userInfo.displayName}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {nightfalls &&
          nightfalls.map(nightfallHash => (
            <tr>
              <td
                className={
                  currentNightfallHashes.includes(nightfallHash) &&
                  s.thisNightfall
                }
              >
                {activityDefs &&
                  activityDefs[nightfallHash].displayProperties.name}{" "}
                {currentNightfallHashes.includes(nightfallHash) && (
                  <Icon name="calendar-check" />
                )}
                <br />
                <small className={s.grey}>
                  {" "}
                  {getMinTime(nightfallHash)} - {getMaxTime(nightfallHash)}{" "}
                </small>
                {/* <small className={s.grey}>{nightfallHash}</small> */}
              </td>

              {playersToCompare.map(pKey => {
                const forPlayer = activities[pKey];
                const thisNightfall = forPlayer && forPlayer[nightfallHash];

                return (
                  <td>
                    {thisNightfall &&
                      nightfallCell(thisNightfall, pKey, nightfallHash)}
                  </td>
                );
              })}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function getDisplayValue(pgcr, valueKey) {
  return pgcr && pgcr.values[valueKey].basic.displayValue;
}

function NightfallSummary({ nightfallHash, pgcr, pKey, highlight }) {
  const speedSeconds = pgcr.values.activityDurationSeconds.basic.value;
  const isFast = speedSeconds <= beavertime[nightfallHash.toString()];
  const isFastish = speedSeconds <= fastishTimes[nightfallHash.toString()];

  return (
    <a
      href={`https://www.bungie.net/en/PGCR/${pgcr.activityDetails.instanceId}`}
      target="_blank"
      className={s.nightfallLink}
    >
      <table className={s.nightfallSummary}>
        <tbody>
          <tr className={highlight === "duration" && s.bold}>
            <td className={s.grey}>
              <Icon name="stopwatch" />
            </td>
            <td>
              {getDisplayValue(pgcr, "activityDurationSeconds")}

              {(isFast || isFastish) && (
                <span>
                  {" "}
                  {isFast && <Icon name="star" solid />}
                  {isFastish && !isFast && <Icon name="star-half-alt" solid />}
                </span>
              )}
            </td>
          </tr>
          <tr className={highlight === "team score" && s.bold}>
            <td className={s.grey}>
              <Icon name="users" />
            </td>
            <td>{getDisplayValue(pgcr, "teamScore")}</td>
          </tr>
        </tbody>
      </table>
    </a>
  );
}

class CompareDebug extends Component {
  state = {
    view: FASTEST,
    currentNightfallHashes: []
  };

  componentDidMount() {
    this.fetchProfiles(this.props.playersToCompare);

    getMilestones().then(milestones => {
      console.log({ milestones });
      const currentNightfallHashes = milestones[2171429505].activities
        .filter(activity => activity.modifierHashes)
        .map(activity => activity.activityHash.toString());

      console.log({ currentNightfallHashes });

      this.setState({ currentNightfallHashes });
    });
  }

  componentDidUpdate(prevProps) {
    const newPlayers = this.props.playersToCompare.filter(currentPlayer => {
      return !prevProps.playersToCompare.includes(currentPlayer);
    });

    if (newPlayers.length) {
      this.setState({ addPlayerModalVisible: false });
    }

    this.fetchProfiles(newPlayers);
  }

  toggleAddPlayer = () => {
    this.setState({
      addPlayerModalVisible: !this.state.addPlayerModalVisible
    });
  };

  fetchProfiles(playersToCompare) {
    playersToCompare
      .filter(playerKey => !this.props.profiles[playerKey])
      .forEach(playerKey => {
        const [membershipType, membershipId] = playerKey.split("/");
        this.props
          .getProfile({ membershipType, membershipId })
          .then(profile => {
            Object.keys(profile.characters.data).forEach(characterId => {
              this.props.getCharacterPGCRHistory(
                { membershipType, membershipId },
                characterId,
                {
                  completeHistory: true,
                  mode: this.props.router.location.query.mode || PGCR_MODE
                }
              );
            });
          });
      });
  }

  toggleAddPlayer = () => {
    this.setState({
      addPlayerModalVisible: !this.state.addPlayerModalVisible
    });
  };

  forsakenToggle = ev => {
    this.props.toggleSinceForsaken();
  };

  setView = view => {
    this.setState({ view });
  };

  render() {
    const {
      activityDefs,
      profiles,
      playersToCompare,
      activities,
      sinceForsaken
    } = this.props;
    const { addPlayerModalVisible, view, currentNightfallHashes } = this.state;

    const firstActivities = Object.values(activities).filter(Boolean)[0];

    const CUSTOM_SORT_INDEX = {
      1034003646: 999999100,
      3701132453: 999999101,
      3108813009: 999999102,
      3034843176: 999999103,
      1207505828: 999999999
    };

    const nightfalls =
      firstActivities &&
      activityDefs &&
      flow(
        sortBy(hash => activityDefs[hash].displayProperties.name),
        sortBy((hash, index) => CUSTOM_SORT_INDEX[hash] || 1)
      )(Object.keys(firstActivities));

    const VIEWS = [FASTEST, TEAM_SCORE];

    return (
      <div className={s.root}>
        <h2>Compare</h2>

        <button onClick={this.toggleAddPlayer}>Add player</button>
        <label>
          <input
            type="checkbox"
            onChange={this.forsakenToggle}
            checked={sinceForsaken}
          />
          Since Forsaken
        </label>

        <h3>
          {VIEWS.map(viewName => (
            <span
              key={viewName}
              onClick={() => this.setView(viewName)}
              className={view === viewName ? s.optionActive : s.option}
            >
              {viewName}
            </span>
          ))}
        </h3>

        {view === FASTEST && (
          <section>
            <NightfallTable
              currentNightfallHashes={currentNightfallHashes}
              nightfalls={nightfalls}
              profiles={profiles}
              activities={activities}
              playersToCompare={playersToCompare}
              activityDefs={activityDefs}
              nightfallCell={(nightfall, pKey, nightfallHash) =>
                nightfall.fastest && (
                  <NightfallSummary
                    nightfallHash={nightfallHash}
                    pgcr={nightfall.fastest}
                    pKey={pKey}
                    highlight="duration"
                  />
                )
              }
            />
          </section>
        )}
        {view === TEAM_SCORE && (
          <section>
            <NightfallTable
              currentNightfallHashes={currentNightfallHashes}
              nightfalls={nightfalls}
              profiles={profiles}
              activities={activities}
              playersToCompare={playersToCompare}
              activityDefs={activityDefs}
              nightfallCell={(nightfall, pKey, nightfallHash) =>
                nightfall.highestTeamScore && (
                  <NightfallSummary
                    nightfallHash={nightfallHash}
                    pgcr={nightfall.highestTeamScore}
                    pKey={pKey}
                    highlight="team score"
                  />
                )
              }
            />
          </section>
        )}

        <Modal
          isOpen={addPlayerModalVisible}
          onRequestClose={this.toggleAddPlayer}
        >
          <SearchForPlayer className={s.addPlayerModal} url="compare-debug" />
        </Modal>
      </div>
    );
  }
}

function mapToValues(arr, fn) {
  return arr.reduce((acc, key) => {
    return {
      ...acc,
      [key]: fn(key)
    };
  }, {});
}

const OBJECTIVE_COMPLETED = "Objective Completed";

function getMinMaxValue(pgcrList, getValue, compareValues) {
  return (
    pgcrList &&
    pgcrList.length > 0 &&
    pgcrList.reduce((currentMinPGCR, pgcr) => {
      if (!currentMinPGCR) {
        return pgcr;
      }

      const currentMinValue = getValue(currentMinPGCR);
      const thisValue = getValue(pgcr);

      return compareValues(currentMinValue, thisValue) ? currentMinPGCR : pgcr;
    })
  );
}

const getMinValue = (...args) =>
  getMinMaxValue(...args, (currentBest, dis) => currentBest < dis);
const getMaxValue = (...args) =>
  getMinMaxValue(...args, (currentBest, dis) => currentBest > dis);

function mapStateToProps(state, ownProps) {
  const {
    DestinyPresentationNodeDefinition: presentationNodeDefs,
    DestinyRecordDefinition: recordDefs,
    DestinyActivityDefinition: activityDefs
  } = state.definitions;

  const { sinceForsaken } = state.pgcr;

  const { players } = ownProps.router.location.query;
  const playersToCompare = players ? players.split(",") : [];
  const profiles = mapToValues(
    playersToCompare,
    pKey => state.clan.profiles[pKey]
  );

  const activities = mapToValues(playersToCompare, pKey => {
    const byCharacter = Object.values(state.pgcr.histories[pKey] || {});
    const allGames = [].concat(...byCharacter).filter(Boolean);

    const nightfalls = flow(
      filter(Boolean),
      filter(pgcr =>
        sinceForsaken ? new Date(pgcr.period) > FORSAKEN_ISH : true
      ),
      groupBy(pgcr => pgcr.activityDetails.directorActivityHash),
      mapValues(pgcrList => {
        const completed = pgcrList.filter(pgcr => {
          return (
            pgcr.values.completionReason.basic.displayValue ===
            OBJECTIVE_COMPLETED
          );
        });

        const highestTeamScore = getMaxValue(
          completed,
          pgcr => pgcr.values.teamScore.basic.value
        );
        const fastest = getMinValue(
          completed,
          pgcr => pgcr.values.activityDurationSeconds.basic.value
        );

        return {
          fastest,
          highestTeamScore,
          all: pgcrList,
          completed
        };
      })
    )(allGames);

    return nightfalls;
  });

  return {
    recordDefs,
    activityDefs,
    presentationNodeDefs,
    playersToCompare,
    profiles,
    activities,
    sinceForsaken
  };
}

const mapDispatchToActions = {
  getProfile,
  getCharacterPGCRHistory,
  toggleSinceForsaken
};

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(CompareDebug);
