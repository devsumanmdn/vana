"use strict";
exports.__esModule = true;
exports.removeSongsFromSelection = exports.addSongsToSelection = exports.removeSongsFromPlaylist = exports.addSongs = void 0;
var songsActionTypes_1 = require("./songsActionTypes");
function addSongs(songs) {
    return {
        type: songsActionTypes_1.ADD_SONGS,
        payload: songs
    };
}
exports.addSongs = addSongs;
function removeSongsFromPlaylist(songs) {
    return {
        type: songsActionTypes_1.REMOVE_SONGS,
        payload: songs
    };
}
exports.removeSongsFromPlaylist = removeSongsFromPlaylist;
function addSongsToSelection(songs) {
    if (songs === void 0) { songs = []; }
    return {
        type: songsActionTypes_1.ADD_SONGS_TO_SELECTION,
        payload: songs
    };
}
exports.addSongsToSelection = addSongsToSelection;
function removeSongsFromSelection(songs) {
    if (songs === void 0) { songs = []; }
    return {
        type: songsActionTypes_1.REMOVE_SONGS_FROM_SELECTION,
        payload: songs
    };
}
exports.removeSongsFromSelection = removeSongsFromSelection;
//# sourceMappingURL=songsActions.js.map