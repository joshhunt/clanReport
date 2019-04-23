import React, { Component } from "react";
import { flow, map, mapValues, filter, orderBy, groupBy } from "lodash/fp";
import { connect } from "react-redux";

// import Icon from "src/components/Icon";
import { getProfile } from "src/store/clan";
import { getCharacterPGCRHistory } from "src/store/pgcr";
import Modal from "src/components/Modal";
import SearchForPlayer from "src/components/SearchForPlayer";

import s from "./styles.styl";

const PGCR_MODE = 46;

let NIGHTFALL_WHITELIST = [
  936308438, // 'Nightfall: A Garden World'
  1282886582, // 'Nightfall: Exodus Crash'
  3372160277, // 'Nightfall: Lake of Shadows'
  3280234344, // "Nightfall: Savathûn's Song"
  522318687, // 'Nightfall: Strange Terrain'
  3145298904, // 'Nightfall: The Arms Dealer'
  3034843176, // 'Nightfall: The Corrupted'
  3701132453, // 'Nightfall: The Hollowed Lair'
  1034003646, // 'Nightfall: The Insight Terminus'
  4259769141, // 'Nightfall: The Inverted Spire'
  3289589202, // 'Nightfall: The Pyramidion'
  3718330161, // 'Nightfall: Tree of Probabilities'
  3108813009, // 'Nightfall: Warden of Nothing'
  272852450 // 'Nightfall: Will of the Thousands'
];

function NightfallTable({
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
              <td>
                {activityDefs &&
                  activityDefs[nightfallHash].displayProperties.name}
                <br />
                <small className={s.grey}>{nightfallHash}</small>
              </td>

              {playersToCompare.map(pKey => {
                const forPlayer = activities[pKey];
                const thisNightfall = forPlayer && forPlayer[nightfallHash];

                return (
                  <td>{thisNightfall && nightfallCell(thisNightfall, pKey)}</td>
                );
              })}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function getDisplayValue(pgcr, pKey, valueKey) {
  return pgcr && getEntry(pgcr, pKey).values[valueKey].basic.displayValue;
}

function NightfallSummary({ pgcr, pKey, highlight }) {
  return (
    <a
      href={`https://www.bungie.net/en/PGCR/${pgcr.activityDetails.instanceId}`}
      target="_blank"
      className={s.nightfallLink}
    >
      <table className={s.nightfallSummary}>
        <tbody>
          <tr className={highlight === "duration" && s.bold}>
            <td className={s.grey}>Duration:</td>
            <td>{getDisplayValue(pgcr, pKey, "activityDurationSeconds")}</td>
          </tr>
          <tr className={highlight === "team score" && s.bold}>
            <td className={s.grey}>Team score:</td>
            <td>{getDisplayValue(pgcr, pKey, "teamScore")}</td>
          </tr>
          <tr className={highlight === "player score" && s.bold}>
            <td className={s.grey}>Player score:</td>
            <td>{getDisplayValue(pgcr, pKey, "score")}</td>
          </tr>
        </tbody>
      </table>
    </a>
  );
}

class CompareDebug extends Component {
  state = {};

  componentDidMount() {
    this.fetchProfiles(this.props.playersToCompare);
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
                  fetchPGCRDetails: true,
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

  render() {
    const { activityDefs, profiles, playersToCompare, activities } = this.props;
    const { addPlayerModalVisible } = this.state;

    const firstActivities = Object.values(activities).filter(Boolean)[0];
    const nightfalls = firstActivities && Object.keys(firstActivities);

    return (
      <div className={s.root}>
        <h2>Compare</h2>

        <button onClick={this.toggleAddPlayer}>Add player</button>

        <section>
          <h3>Fastest</h3>
          <NightfallTable
            nightfalls={nightfalls}
            profiles={profiles}
            activities={activities}
            playersToCompare={playersToCompare}
            activityDefs={activityDefs}
            nightfallCell={(nightfall, pKey) =>
              nightfall.fastest && (
                <NightfallSummary
                  pgcr={nightfall.fastest}
                  pKey={pKey}
                  highlight="duration"
                />
              )
            }
          />
        </section>
        <section>
          <h3>Highest team score</h3>
          <NightfallTable
            nightfalls={nightfalls}
            profiles={profiles}
            activities={activities}
            playersToCompare={playersToCompare}
            activityDefs={activityDefs}
            nightfallCell={(nightfall, pKey) =>
              nightfall.highestTeamScore && (
                <NightfallSummary
                  pgcr={nightfall.highestTeamScore}
                  pKey={pKey}
                  highlight="team score"
                />
              )
            }
          />
        </section>
        <section>
          <h3>Highest player score</h3>
          <NightfallTable
            nightfalls={nightfalls}
            profiles={profiles}
            activities={activities}
            playersToCompare={playersToCompare}
            activityDefs={activityDefs}
            nightfallCell={(nightfall, pKey) =>
              nightfall.highestPlayerScore && (
                <NightfallSummary
                  pgcr={nightfall.highestPlayerScore}
                  pKey={pKey}
                  highlight="player score"
                />
              )
            }
          />
        </section>

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

function getEntry({ entries }, pKey) {
  const membershipId = pKey.split("/")[1];

  return entries.find(
    entry => entry.player.destinyUserInfo.membershipId === membershipId
  );
}

const OBJECTIVE_COMPLETED = "Objective Completed";

function getMinMaxValue(pgcrList, pKey, getValue, compareValues) {
  return (
    pgcrList &&
    pgcrList.length > 0 &&
    pgcrList.reduce((currentMinPGCR, pgcr) => {
      if (!currentMinPGCR) {
        return pgcr;
      }

      const currentMinValue = getValue(getEntry(currentMinPGCR, pKey));
      const thisValue = getValue(getEntry(pgcr, pKey));

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
      map(activity => state.pgcr.pgcr[activity.activityDetails.instanceId]),
      filter(Boolean),
      filter(pgcr =>
        NIGHTFALL_WHITELIST.includes(pgcr.activityDetails.directorActivityHash)
      ),
      groupBy(pgcr => pgcr.activityDetails.directorActivityHash),
      mapValues(pgcrList => {
        const completed = pgcrList.filter(pgcr => {
          return (
            getEntry(pgcr, pKey).values.completionReason.basic.displayValue ===
            OBJECTIVE_COMPLETED
          );
        });

        const highestTeamScore = getMaxValue(
          completed,
          pKey,
          entry => entry.values.teamScore.basic.value
        );
        const highestPlayerScore = getMaxValue(
          completed,
          pKey,
          entry => entry.values.score.basic.value
        );
        const fastest = getMinValue(
          completed,
          pKey,
          entry => entry.values.activityDurationSeconds.basic.value
        );

        return {
          fastest,
          highestTeamScore,
          highestPlayerScore,
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
    activities
  };
}

const mapDispatchToActions = { getProfile, getCharacterPGCRHistory };

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(CompareDebug);
