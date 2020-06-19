import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { staleThenRevalidate, _Dexie } from "@destiny-plumbing/definitions";

import app from "./app";
import auth from "./auth";
import clan from "./clan";
import pgcr from "./pgcr";
import leaderboards from "./leaderboards";

import definitions, {
  setBulkDefinitions,
  definitionsStatus,
  definitionsError,
  SET_BULK_DEFINITIONS,
} from "./definitions";

// Clean up previous definitions
_Dexie.delete("destinyManifest");

const rootReducer = combineReducers({
  app,
  auth,
  clan,
  pgcr,
  definitions,
  leaderboards,
});

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionsBlacklist: [SET_BULK_DEFINITIONS],
        stateSanitizer: (state) => ({
          ...state,
          definitions: state.definitions ? "[hidden]" : state.definitions,
        }),
      })
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = createStore(rootReducer, enhancer);
window.__store = store;

store.subscribe(() => (window.__state = store.getState()));

const LANGUAGE = "en";

staleThenRevalidate(
  process.env.REACT_APP_API_KEY,
  LANGUAGE,
  [],
  (err, result) => {
    console.log("definitions cb:", { err, result });

    if (err) {
      store.dispatch(definitionsError(err));
      return;
    }

    if (result && result.loading) {
      store.dispatch(definitionsStatus({ status: "downloading" }));
    }

    if (result && result.definitions) {
      store.dispatch(definitionsStatus({ status: null }));
      store.dispatch(setBulkDefinitions(result.definitions));
    }
  }
);

export default store;
