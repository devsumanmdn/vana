import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { remote } from 'electron';

import player from './player/playerReducer';
import songs from './songs/songsReducer';
import playlists from './playlists/playlistsReducer';
import settings from './settings/settingsReducer';

const rootReducer = combineReducers({
  player,
  songs,
  playlists,
  settings
});

const middlewares = [thunk];

const enhancers = [];

// Apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(...middlewares));
const enhancer = compose(...enhancers);

const composeEnhancers =
  (remote.process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(enhancer)
);

export default store;
