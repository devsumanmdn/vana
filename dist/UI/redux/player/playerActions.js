"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.setShowQueue = exports.toggleMute = exports.setPlaying = exports.setVolume = exports.setPlayedDuration = exports.setTotalDuration = exports.pauseSong = exports.playPrevSong = exports.playNextSong = exports.playSong = exports.prepareSong = exports.resumeSong = exports.setActiveSong = exports.removeSongsFromQueue = exports.addSongsToQueue = exports.clearQueue = void 0;
var playerActionTypes_1 = require("./playerActionTypes");
var playerMiddleWareActions_1 = require("../playerMiddleware/playerMiddleWareActions");
function clearQueue() {
    return {
        type: playerActionTypes_1.CLEAR_QUEUE
    };
}
exports.clearQueue = clearQueue;
function addSongsToQueue(songs) {
    return {
        type: playerActionTypes_1.ADD_SONGS_TO_QUEUE,
        payload: songs
    };
}
exports.addSongsToQueue = addSongsToQueue;
function removeSongsFromQueue(songs) {
    return {
        type: playerActionTypes_1.REMOVE_SONGS_FROM_QUEUE,
        payload: songs
    };
}
exports.removeSongsFromQueue = removeSongsFromQueue;
var setActiveSong = function (songId) { return ({
    type: playerActionTypes_1.SET_ACTIVE_SONG,
    payload: songId
}); };
exports.setActiveSong = setActiveSong;
var resumeSong = function () { return function (dispatch) {
    return dispatch((0, playerMiddleWareActions_1.playPlayer)());
}; };
exports.resumeSong = resumeSong;
var prepareSong = function (_a) {
    var location = _a.location, codec = _a.codec, _b = _a.play, play = _b === void 0 ? false : _b;
    return function (dispatch) {
        if (location && codec) {
            return window.electron.readFile(location, function (err, data) {
                try {
                    if (err)
                        throw err;
                    var songDataURL = window.electron.getDataURL(location);
                    if (songDataURL) {
                        dispatch((0, playerMiddleWareActions_1.loadSong)({ songDataURL: songDataURL, play: play }));
                    }
                    else {
                        throw Error('Unable to construct data URL');
                    }
                }
                catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            });
        }
        return Promise.resolve();
    };
};
exports.prepareSong = prepareSong;
var playSong = function (songId, load) {
    if (load === void 0) { load = false; }
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var state, _a, queue, location, metaData, codec;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    _a = getState().player.queue, queue = _a === void 0 ? [] : _a;
                    if (songId === state.player.activeSongId && !load) {
                        return [2 /*return*/, dispatch((0, exports.resumeSong)())];
                    }
                    if (songId && !queue.find(function (queueSongId) { return queueSongId === songId; })) {
                        dispatch(addSongsToQueue([songId]));
                    }
                    dispatch((0, exports.setActiveSong)(songId));
                    location = (state.songs.all[songId] || {}).location;
                    return [4 /*yield*/, window.electron.getMusicMetaData(location)["catch"](function (e) {
                            alert(e.message);
                        })];
                case 1:
                    metaData = _c.sent();
                    if (metaData) {
                        codec = (_b = metaData === null || metaData === void 0 ? void 0 : metaData.format) === null || _b === void 0 ? void 0 : _b.container;
                        return [2 /*return*/, dispatch((0, exports.prepareSong)({ location: location, codec: codec, play: true }))];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.playSong = playSong;
var playNextSong = function () { return function (dispatch, getState) {
    var playerState = getState().player;
    if (playerState.queue.length === 0) {
        return;
    }
    var presentActiveSongIndex = playerState.queue.findIndex(function (songId) { return songId === playerState.activeSongId; });
    var nextSongIndex = presentActiveSongIndex !== -1 &&
        presentActiveSongIndex < playerState.queue.length - 1
        ? presentActiveSongIndex + 1
        : 0;
    var nextSongId = playerState.queue[nextSongIndex] || '';
    if (presentActiveSongIndex === nextSongIndex) {
        dispatch((0, playerMiddleWareActions_1.seekPlayer)(0));
        dispatch((0, playerMiddleWareActions_1.playPlayer)());
    }
    else {
        dispatch((0, exports.playSong)(nextSongId));
    }
}; };
exports.playNextSong = playNextSong;
var playPrevSong = function () { return function (dispatch, getState) {
    var playerState = getState().player;
    if (playerState.queue.length === 0) {
        return;
    }
    var presentActiveSongIndex = playerState.queue.findIndex(function (songId) { return songId === playerState.activeSongId; });
    var prevSongIndex = presentActiveSongIndex !== -1 ? presentActiveSongIndex - 1 : 0;
    var prevSongId = playerState.queue[prevSongIndex] || '';
    if (presentActiveSongIndex === prevSongIndex) {
        dispatch((0, playerMiddleWareActions_1.seekPlayer)(0));
        dispatch((0, playerMiddleWareActions_1.playPlayer)());
    }
    else {
        dispatch((0, exports.playSong)(prevSongId));
    }
}; };
exports.playPrevSong = playPrevSong;
var pauseSong = function () { return function (dispatch) {
    dispatch((0, playerMiddleWareActions_1.pausePlayer)());
}; };
exports.pauseSong = pauseSong;
function setTotalDuration(totalDuration) {
    return {
        type: playerActionTypes_1.SET_TOTAL_DURATION,
        payload: totalDuration
    };
}
exports.setTotalDuration = setTotalDuration;
function setPlayedDuration(playedDuration) {
    return {
        type: playerActionTypes_1.SET_PLAYED_DURATION,
        payload: playedDuration
    };
}
exports.setPlayedDuration = setPlayedDuration;
var setVolume = function (volume) { return ({
    type: playerActionTypes_1.SET_VOLUME,
    payload: volume
}); };
exports.setVolume = setVolume;
var setPlaying = function (isPlaying) { return ({
    type: playerActionTypes_1.SET_PLAYING,
    payload: isPlaying
}); };
exports.setPlaying = setPlaying;
function toggleMute() {
    return {
        type: playerActionTypes_1.TOGGLE_MUTE
    };
}
exports.toggleMute = toggleMute;
var setShowQueue = function (value) { return ({
    type: playerActionTypes_1.SET_SHOW_QUEUE,
    payload: value
}); };
exports.setShowQueue = setShowQueue;
//# sourceMappingURL=playerActions.js.map