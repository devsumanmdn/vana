"use strict";
exports.__esModule = true;
exports.renamePlaylist = exports.removePlaylist = exports.addPlaylist = exports.removeSongsFromPlaylist = exports.addSongsToPlaylist = void 0;
var playlistsActionTypes_1 = require("./playlistsActionTypes");
function addSongsToPlaylist(songs) {
    return {
        type: playlistsActionTypes_1.ADD_SONGS_TO_PLAYLIST,
        payload: songs
    };
}
exports.addSongsToPlaylist = addSongsToPlaylist;
function removeSongsFromPlaylist(songs) {
    return {
        type: playlistsActionTypes_1.REMOVE_SONGS_FROM_PLAYLIST,
        payload: songs
    };
}
exports.removeSongsFromPlaylist = removeSongsFromPlaylist;
function addPlaylist(_a) {
    var name = _a.name, _b = _a.songs, songs = _b === void 0 ? [] : _b;
    return {
        type: playlistsActionTypes_1.ADD_PLAYLIST,
        payload: {
            name: name,
            songs: songs
        }
    };
}
exports.addPlaylist = addPlaylist;
function removePlaylist(playlistId) {
    return {
        type: playlistsActionTypes_1.REMOVE_PLAYLIST,
        payload: playlistId
    };
}
exports.removePlaylist = removePlaylist;
function renamePlaylist(_a) {
    var playlistId = _a.playlistId, name = _a.name;
    return {
        type: playlistsActionTypes_1.RENAME_PLAYLIST,
        payload: { playlistId: playlistId, name: name }
    };
}
exports.renamePlaylist = renamePlaylist;
//# sourceMappingURL=playlistsActions.js.map