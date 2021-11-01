"use strict";
exports.__esModule = true;
exports.seekPlayer = exports.setPlayerVolume = exports.loadSong = exports.playPlayer = exports.pausePlayer = exports.TOGGLE_VISUALIZATION = exports.SEEK = exports.SET_VOLUME = exports.LOAD_SONG = exports.PAUSE = exports.PLAY = void 0;
var PLAYER_SUFFIX = 'PLAYER';
exports.PLAY = PLAYER_SUFFIX + "/PLAY";
exports.PAUSE = PLAYER_SUFFIX + "/PAUSE";
exports.LOAD_SONG = PLAYER_SUFFIX + "/LOAD_SONG";
exports.SET_VOLUME = PLAYER_SUFFIX + "/SET_VOLUME";
exports.SEEK = PLAYER_SUFFIX + "/SEEK";
exports.TOGGLE_VISUALIZATION = PLAYER_SUFFIX + "/TOGGLE_VISUALIZATION";
var pausePlayer = function () { return ({
    type: exports.PAUSE
}); };
exports.pausePlayer = pausePlayer;
var playPlayer = function () { return ({
    type: exports.PLAY
}); };
exports.playPlayer = playPlayer;
var loadSong = function (_a) {
    var songDataURL = _a.songDataURL, play = _a.play;
    return ({
        type: exports.LOAD_SONG,
        payload: { songDataURL: songDataURL, play: play }
    });
};
exports.loadSong = loadSong;
var setPlayerVolume = function (volume) { return ({
    type: exports.SET_VOLUME,
    payload: volume
}); };
exports.setPlayerVolume = setPlayerVolume;
var seekPlayer = function (duration) { return ({
    type: exports.SEEK,
    payload: duration
}); };
exports.seekPlayer = seekPlayer;
//# sourceMappingURL=playerMiddleWareActions.js.map