import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  type Store,
} from "redux";
import { thunk } from "redux-thunk";
import throttle from "lodash/throttle";

import player from "./player/playerReducer";
import songs from "./songs/songsReducer";
import playlists from "./playlists/playlistsReducer";
import settings from "./settings/settingsReducer";

import JSONStore from "./JSONStore";
import playerMiddleware from "./playerMiddleware";

const rootReducer = combineReducers({
  player,
  songs,
  playlists,
  settings,
});

const middlewares = [thunk, playerMiddleware];

const enhancers = [];
enhancers.push(applyMiddleware(...middlewares));
const enhancer = compose(...enhancers);

const composeEnhancers =
  typeof window !== "undefined" &&
  typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

let stateStore: JSONStore | null = null;
let store: Store | null = null;

export async function initStore(): Promise<Store> {
  if (store) {
    return store;
  }

  stateStore = await JSONStore.create({ fileName: "state" });
  const persistedRaw = stateStore.get();
  const persistedState =
    persistedRaw && typeof persistedRaw === "object"
      ? { ...(persistedRaw as Record<string, unknown>) }
      : {};

  const initialState = { ...persistedState };
  if (initialState.player && typeof initialState.player === "object") {
    (initialState.player as { playing?: boolean }).playing = false;
  }

  store = createStore(
    rootReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialState as any,
    composeEnhancers(enhancer)
  );

  store.subscribe(
    throttle(() => {
      if (stateStore && store) {
        void stateStore.set(undefined, store.getState());
      }
    }, 1000)
  );

  return store;
}

export const resetAll = () => {
  void stateStore?.set(undefined, {});
  window.location.reload();
};

export default function getStore(): Store {
  if (!store) {
    throw new Error("Redux store not initialized; await initStore() first");
  }
  return store;
}
