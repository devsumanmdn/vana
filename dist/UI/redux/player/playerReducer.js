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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
/* eslint-disable no-nested-ternary */
var playerActionTypes_1 = require("./playerActionTypes");
var initialState = {
    queue: [],
    activeSongId: '',
    playing: false,
    totalDuration: 0,
    playedDuration: 0,
    volume: 80,
    isMute: false,
    showQueue: false
};
var playerReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    var payload = action.payload, type = action.type;
    switch (type) {
        case playerActionTypes_1.ADD_SONGS_TO_QUEUE:
            return __assign(__assign(__assign({}, state), { queue: __spreadArray([], new Set(__spreadArray(__spreadArray([], state.queue, true), payload, true)), true) }), (!state.activeSongId && { activeSongId: payload[0] }));
        case playerActionTypes_1.CLEAR_QUEUE:
            return __assign(__assign({}, state), { activeSongId: '', queue: [] });
        case playerActionTypes_1.REMOVE_SONGS_FROM_QUEUE:
            return __assign(__assign({}, state), { queue: state.queue.filter(function (songId) { return !payload.includes(songId); }) });
        case playerActionTypes_1.SET_ACTIVE_SONG:
            return __assign(__assign({}, state), { activeSongId: payload });
        case playerActionTypes_1.SET_PLAYING:
            return __assign(__assign({}, state), { playing: payload });
        case playerActionTypes_1.SET_SHOW_QUEUE:
            return __assign(__assign({}, state), { showQueue: payload });
        case playerActionTypes_1.SET_TOTAL_DURATION:
            return __assign(__assign({}, state), { totalDuration: payload });
        case playerActionTypes_1.SET_PLAYED_DURATION:
            return __assign(__assign({}, state), { playedDuration: payload });
        case playerActionTypes_1.SET_VOLUME:
            return __assign(__assign({}, state), { volume: payload });
        case playerActionTypes_1.TOGGLE_MUTE:
            return __assign(__assign({}, state), { isMute: !state.isMute });
        default:
            return state;
    }
};
exports["default"] = playerReducer;
//# sourceMappingURL=playerReducer.js.map