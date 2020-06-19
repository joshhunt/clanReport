import React, { Fragment } from "react";

import tableStyles from "../Table/styles.module.css";
import GameDetails from "../GameDetails";
import GameRow from "./GameRow";

export default function GamesTable({
  games,
  activePgcrs,
  pgcrDetails,
  onGameRowClick,
}) {
  return (
    <div className={tableStyles.tableScrollWrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <td>game</td>
            <td>stats</td>
            <td />
            <td />
            <td>duration</td>
            <td>date</td>
            <td>links</td>
            <td>pgcr</td>
            <td>platform</td>
          </tr>
        </thead>

        <tbody>
          {games.map((game, index) => (
            <Fragment key={index}>
              <GameRow
                game={game}
                onClick={onGameRowClick}
                isActive={activePgcrs[game.activityDetails.instanceId]}
              />

              {activePgcrs[game.activityDetails.instanceId] && (
                <tr>
                  <td colSpan={8}>
                    <GameDetails
                      pgcr={pgcrDetails[game.activityDetails.instanceId]}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
