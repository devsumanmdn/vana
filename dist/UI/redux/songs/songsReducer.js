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
exports.__esModule = true;
var songsActionTypes_1 = require("./songsActionTypes");
var initialState = {
    all: {},
    selection: null
};
function counter(state, action) {
    if (state === void 0) { state = initialState; }
    var payload = action.payload, type = action.type;
    switch (type) {
        case songsActionTypes_1.ADD_SONGS:
            return __assign(__assign({}, state), { all: __assign(__assign({}, state.all), payload.reduce(function (acc, song) {
                    var _a;
                    return (__assign(__assign({}, acc), (_a = {}, _a[song.id] = song, _a)));
                }, {})) });
        case songsActionTypes_1.REMOVE_SONGS:
            var newAllSongs_1 = __assign({}, state.all);
            var allSongs = payload.forEach(function (key) {
                delete newAllSongs_1[key];
            });
            return __assign(__assign({}, state), { all: newAllSongs_1 });
        case songsActionTypes_1.ADD_SONGS_TO_SELECTION:
            return __assign(__assign({}, state), { selection: [payload] });
        case songsActionTypes_1.REMOVE_SONGS_FROM_SELECTION:
            return __assign(__assign({}, state), { selection: [payload] });
        default:
            return state;
    }
}
exports["default"] = counter;
//# sourceMappingURL=songsReducer.js.map