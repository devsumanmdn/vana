"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.resetAll = void 0;
var redux_1 = require("redux");
var redux_thunk_1 = __importDefault(require("redux-thunk"));
var throttle_1 = __importDefault(require("lodash/throttle"));
var playerReducer_1 = __importDefault(require("./player/playerReducer"));
var songsReducer_1 = __importDefault(require("./songs/songsReducer"));
var playlistsReducer_1 = __importDefault(require("./playlists/playlistsReducer"));
var settingsReducer_1 = __importDefault(require("./settings/settingsReducer"));
var JSONStore_1 = __importDefault(require("./JSONStore"));
var playerMiddleware_1 = __importDefault(require("./playerMiddleware"));
var stateStore = new JSONStore_1["default"]({ fileName: "state" });
var persistedState = stateStore.get();
var rootReducer = (0, redux_1.combineReducers)({
    player: playerReducer_1["default"],
    songs: songsReducer_1["default"],
    playlists: playlistsReducer_1["default"],
    settings: settingsReducer_1["default"]
});
var middlewares = [redux_thunk_1["default"], playerMiddleware_1["default"]];
var enhancers = [];
// Apply Middleware & Compose Enhancers
enhancers.push(redux_1.applyMiddleware.apply(void 0, middlewares));
var enhancer = redux_1.compose.apply(void 0, enhancers);
var composeEnhancers = (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    redux_1.compose;
var initialState = __assign({}, persistedState);
if (persistedState && persistedState.player && persistedState.player) {
    initialState.player.playing = false;
}
var store = (0, redux_1.createStore)(rootReducer, initialState, composeEnhancers(enhancer));
var resetAll = function () {
    stateStore.set(undefined, {});
    window.location.reload();
};
exports.resetAll = resetAll;
store.subscribe((0, throttle_1["default"])(function () {
    stateStore.set(undefined, store.getState());
}, 1000));
exports["default"] = store;
//# sourceMappingURL=store.js.map