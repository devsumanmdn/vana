"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/* eslint-disable consistent-return */
var playerMiddleWareActions_1 = require("./playerMiddleWareActions");
var playerActions_1 = require("../player/playerActions");
var visualizer_1 = __importDefault(require("../../components/visualizer"));
exports["default"] = (function (_a) {
    var dispatch = _a.dispatch;
    return function (next) {
        var player = new Audio();
        player.addEventListener('loadeddata', function () {
            dispatch((0, playerActions_1.setTotalDuration)(player.duration));
        });
        player.addEventListener('timeupdate', function () {
            dispatch((0, playerActions_1.setPlayedDuration)(player.currentTime));
        });
        player.addEventListener('volumechange', function () {
            dispatch((0, playerActions_1.setVolume)(player.volume));
        });
        player.addEventListener('ended', function () {
            dispatch((0, playerActions_1.playNextSong)());
        });
        player.addEventListener('play', function () {
            dispatch((0, playerActions_1.setPlaying)(true));
        });
        player.addEventListener('pause', function () {
            dispatch((0, playerActions_1.setPlaying)(false));
        });
        setImmediate(function () {
            (0, visualizer_1["default"])(player);
        });
        return function (action) {
            var type = action.type, payload = action.payload;
            switch (type) {
                case playerMiddleWareActions_1.PLAY:
                    return player.play();
                case playerMiddleWareActions_1.PAUSE:
                    return player.pause();
                case playerMiddleWareActions_1.LOAD_SONG:
                    player.src = payload.songDataURL;
                    if (payload.play) {
                        player.play();
                    }
                    return;
                case playerMiddleWareActions_1.SET_VOLUME:
                    player.volume = payload;
                    return;
                case playerMiddleWareActions_1.SEEK:
                    player.currentTime = payload;
                    return;
                case playerMiddleWareActions_1.TOGGLE_VISUALIZATION:
                default:
                    return next(action);
            }
        };
    };
});
//# sourceMappingURL=index.js.map