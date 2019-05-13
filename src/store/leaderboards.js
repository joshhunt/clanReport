const INITIAL_STATE = {
  leaderboard: {}
};

const SET_LEADERBOARDS = "Set leaderboards";
const SET_STATUS = "Set leaderboards status";

export default function leaderboardsReducer(
  state = INITIAL_STATE,
  { type, payload }
) {
  switch (type) {
    case SET_LEADERBOARDS:
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          [payload.leaderboardType]: payload.leaderboard
        }
      };

    case SET_STATUS:
      return {
        ...state,
        status: payload
      };

    default:
      return state;
  }
}

export function getLeaderboardStatus() {
  return async dispatch => {
    dispatch({
      type: SET_STATUS,
      payload: await (await fetch("https://api.clan.report/status.json")).json()
    });
  };
}

export function getLeaderboard(leaderboardType = "all") {
  return async dispatch => {
    const url = `https://api.clan.report/leaderboards-${leaderboardType}.json`;
    const leaderboard = await (await fetch(url)).json();

    dispatch({
      type: SET_LEADERBOARDS,
      payload: { leaderboardType, leaderboard }
    });
  };
}
