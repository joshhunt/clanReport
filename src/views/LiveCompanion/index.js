import React, { Component } from "react";
import cx from "classnames";
import { get } from "lodash";
import { Link } from "react-router";
import { connect } from "react-redux";

import { useDarkMode } from "src/lib/hooks";
import { getProfile } from "src/store/clan";
import Character from "src/components/Character";
import Objectives from "src/views/CompareTriumphs/Objectives";
import destinyAuth from "src/lib/destinyAuth";
import { setAuth } from "src/store/auth";

import s from "./styles.styl";

const PERSUITS_BUCKET_HASH = 1345459588;

const DarkMode = ({ children }) => {
  useDarkMode();

  return children;
};

class LiveCompanion extends Component {
  componentDidMount() {
    destinyAuth((err, result) => {
      this.props.setAuth({ err, result });

      if (result.isFinal && result.isAuthenticated) {
        this.props.getProfile(this.props.routeParams, { fetchInventory: true });
      }
    });
  }

  render() {
    const { profile, routeParams, persuits, itemDefs } = this.props;
    const { membershipType, membershipId, characterId } = routeParams;
    const characters = Object.values(get(profile, "characters.data", {}));

    return (
      <DarkMode>
        <div className={s.page}>
          <h1>Live</h1>
          <div className={s.characterList}>
            {characters.map(character => (
              <Link
                to={`/live/${membershipType}/${membershipId}/${character.characterId}`}
                className={cx(
                  s.character,
                  characterId &&
                    character.characterId !== characterId &&
                    s.characterInactive
                )}
              >
                <Character character={character} />
              </Link>
            ))}
          </div>

          <br />
          <br />

          <table className={s.table}>
            <tbody>
              {persuits.map(persuit => {
                const persuitItem = itemDefs[persuit.itemHash];

                return (
                  <tr className={s.row}>
                    <td>{persuitItem && persuitItem.displayProperties.name}</td>

                    <td>
                      <Objectives
                        objectives={persuit.$objectives}
                        className={s.objectives}
                      />

                      {/* <table className={s.objectiveTable}>
                        <tbody>
                          {persuit.$objectives.map(objectiveData => {
                            const objective =
                              objectiveDefs[objectiveData.objectiveHash];

                            const completionValue =
                              objectiveData.completionValue ||
                              (objective && objective.completionValue);

                            return (
                              <tr className={s.objectiveRow}>
                                <td>
                                  {objective && objective.progressDescription}
                                </td>
                                <td>
                                  {objectiveData.progress} / {completionValue}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <link
            href="https://fonts.googleapis.com/css?family=Fira+Mono&display=swap"
            rel="stylesheet"
          />
        </div>
      </DarkMode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { membershipId, membershipType, characterId } = ownProps.routeParams;

  const itemDefs = state.definitions.DestinyInventoryItemDefinition || {};
  const objectiveDefs = state.definitions.DestinyObjectiveDefinition || {};

  const pKey = `${membershipType}/${membershipId}`;
  const profile = state.clan.profiles[pKey];

  const characterInventory = get(
    profile,
    `characterInventories.data[${characterId}].items`,
    []
  );

  const persuits = characterInventory
    .filter(item => item.bucketHash === PERSUITS_BUCKET_HASH)
    .map(item => {
      const uninstancedData =
        profile.characterUninstancedItemComponents[characterId].objectives.data[
          item.itemHash
        ];

      const uninstancedObjectives = uninstancedData
        ? uninstancedData.objectives
        : [];

      const instancedData =
        item.itemInstanceId &&
        profile.itemComponents.objectives.data[item.itemInstanceId];

      const instancedObjectives = instancedData ? instancedData.objectives : [];

      if (item.itemHash === 552709552) {
        console.log({
          item,
          instancedObjectives
        });
      }

      return {
        ...item,
        $objectives: [...uninstancedObjectives, ...instancedObjectives]
      };
    });

  return { profile, persuits, itemDefs, objectiveDefs };
};

const mapActionsToDispatch = {
  setAuth,
  getProfile
};

export default connect(
  mapStateToProps,
  mapActionsToDispatch
)(LiveCompanion);
