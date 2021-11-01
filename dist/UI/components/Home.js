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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var makeStyles_1 = __importDefault(require("@mui/styles/makeStyles"));
var react_window_1 = require("react-window");
var react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
var uuid_1 = require("uuid");
var Button_1 = __importDefault(require("@mui/material/Button"));
var Add_1 = __importDefault(require("@mui/icons-material/Add"));
var PlayArrow_1 = __importDefault(require("@mui/icons-material/PlayArrow"));
var Shuffle_1 = __importDefault(require("@mui/icons-material/Shuffle"));
var Refresh_1 = __importDefault(require("@mui/icons-material/Refresh"));
var react_redux_1 = require("react-redux");
var remote_1 = require("@electron/remote");
var songsActions_1 = require("../redux/songs/songsActions");
var playerActions_1 = require("../redux/player/playerActions");
var SongListItem_1 = __importDefault(require("./SongListItem"));
var Player_1 = __importDefault(require("./Player"));
// import Sidebar from './Sidebar';
var SettingsDialog_1 = __importDefault(require("./SettingsDialog"));
var shuffle_1 = __importDefault(require("../util/shuffle"));
// import { toggleSettingsModal as toggleSettingsModalAction } from '../redux/settings/settingsActions';
var settingsReducer_1 = require("../redux/settings/settingsReducer");
var store_1 = require("../redux/store");
// const Button = props => <MUIButton variant="outlined" {...props} />;
var useStyles = (0, makeStyles_1["default"])({
    "@global": {
        body: {
            background: function (_a) {
                var transparentMode = _a.transparentMode, _b = _a.backgroundColor, backgroundColor = _b === void 0 ? "#444" : _b;
                return (transparentMode ? "transparent" : backgroundColor);
            }
        }
    },
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0000",
        color: "white",
        minHeight: "100%",
        overflow: "hidden",
        borderRadius: 6
    },
    mainView: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        height: "100vh"
    },
    songsList: {
        flexGrow: 1,
        overflow: "auto hidden",
        overflowY: "hidden"
    },
    buttonContainer: {
        WebkitAppRegion: "drag",
        margin: "0 5px",
        display: "flex",
        // alignSelf: 'flex-start',
        zIndex: 99999,
        "& button": {
            minWidth: "fit-content",
            "-webkit-app-region": "no-drag",
            "& .text": {
                whiteSpace: "nowrap"
            }
        },
        "&.overflowing": {
            "& button": {
                overflow: "hidden",
                minWidth: 40,
                "& .material-icons": {
                    marginRight: 0
                },
                "& .text": {
                    display: "none"
                }
            }
        }
    }
});
var Row = (0, react_1.memo)(function (_a) {
    var data = _a.data, index = _a.index, style = _a.style;
    var metaData = data[index];
    return metaData ? ((0, jsx_runtime_1.jsx)(SongListItem_1["default"], { style: style, metaData: metaData }, metaData.id)) : null;
}, react_window_1.areEqual);
// Row.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
//   index: PropTypes.number.isRequired,
//   style: PropTypes.shape().isRequired,
// };
var Home = function (_a) {
    var songs = _a.songs, player = _a.player, addSongs = _a.addSongs, playSong = _a.playSong, addSongsToQueue = _a.addSongsToQueue, clearQueue = _a.clearQueue, 
    // toggleSettingsModal,
    settings = _a.settings;
    var _b = (0, react_1.useState)(false), expandedView = _b[0], setExpandedView = _b[1];
    var buttonContainerRef = (0, react_1.createRef)();
    var allSongs = songs.all;
    var activeSongId = player.activeSongId;
    var classes = useStyles(settings);
    (0, react_1.useEffect)(function () {
        if (expandedView) {
            window.maxBarHeight = 150;
        }
        else {
            window.maxBarHeight = 100;
        }
    }, [expandedView]);
    var chooseFolderDialog = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, canceled, filePaths, listOfSongPaths;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, remote_1.dialog.showOpenDialog(remote_1.BrowserWindow.getFocusedWindow(), {
                        properties: ["openDirectory"]
                    })];
                case 1:
                    _a = _b.sent(), canceled = _a.canceled, filePaths = _a.filePaths;
                    if (!!canceled) return [3 /*break*/, 3];
                    return [4 /*yield*/, window.electron.getArrayOfFiles(filePaths[0])];
                case 2:
                    listOfSongPaths = _b.sent();
                    addSongs(listOfSongPaths.map(function (path) { return ({ location: path, id: (0, uuid_1.v4)() }); }));
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var playAll = function () {
        clearQueue();
        var songIds = Object.values(allSongs).map(function (_a) {
            var id = _a.id;
            return id;
        });
        addSongsToQueue(songIds);
        if (songIds[0]) {
            playSong(songIds[0]);
        }
    };
    var shuffleAll = function () {
        clearQueue();
        var songIds = (0, shuffle_1["default"])(__spreadArray([], Object.values(allSongs).map(function (_a) {
            var id = _a.id;
            return id;
        }), true));
        addSongsToQueue(songIds);
        if (songIds[0]) {
            playSong(songIds[0], true);
        }
    };
    var activeSong = allSongs[activeSongId];
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.container }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.mainView }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ 
                        // style={{ visibility: 'hidden' }}
                        className: classes.buttonContainer, ref: buttonContainerRef, id: "mainActions" }, { children: [(0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ title: "Add songs", onClick: chooseFolderDialog }, { children: (0, jsx_runtime_1.jsx)(Add_1["default"], {}, void 0) }), void 0), (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ title: "Play all songs", onClick: playAll }, { children: (0, jsx_runtime_1.jsx)(PlayArrow_1["default"], {}, void 0) }), void 0), (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ title: "Shuffle all songs", onClick: shuffleAll }, { children: (0, jsx_runtime_1.jsx)(Shuffle_1["default"], {}, void 0) }), void 0), (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ title: "Reset", onClick: store_1.resetAll }, { children: (0, jsx_runtime_1.jsx)(Refresh_1["default"], {}, void 0) }), void 0)] }), void 0), (0, jsx_runtime_1.jsx)("div", __assign({ style: expandedView || player.showQueue
                            ? { visibility: "hidden", maxHeight: 0 }
                            : {}, className: classes.songsList }, { children: (0, jsx_runtime_1.jsx)(react_virtualized_auto_sizer_1["default"], { children: function (_a) {
                                var height = _a.height, width = _a.width;
                                return ((0, jsx_runtime_1.jsx)(react_window_1.FixedSizeList, __assign({ height: height, itemCount: Object.keys(allSongs).length, itemData: Object.values(allSongs), itemSize: 80, width: width }, { children: Row }), void 0));
                            } }, void 0) }), void 0), (0, jsx_runtime_1.jsx)(Player_1["default"], { expandedView: expandedView, setExpandedView: setExpandedView, activeSong: activeSong, playerState: player }, void 0)] }), void 0), (0, jsx_runtime_1.jsx)(SettingsDialog_1["default"], {}, void 0)] }), void 0));
};
Home.propTypes = {
    songs: prop_types_1["default"].shape({
        all: prop_types_1["default"].objectOf(prop_types_1["default"].shape({})).isRequired
    }).isRequired,
    player: prop_types_1["default"].shape({
        activeSongId: prop_types_1["default"].string,
        playing: prop_types_1["default"].bool,
        showQueue: prop_types_1["default"].bool.isRequired
    }).isRequired,
    addSongs: prop_types_1["default"].func.isRequired,
    addSongsToQueue: prop_types_1["default"].func.isRequired,
    clearQueue: prop_types_1["default"].func.isRequired,
    playSong: prop_types_1["default"].func.isRequired,
    // toggleSettingsModal: PropTypes.func.isRequired,
    settings: settingsReducer_1.settingsPropType.isRequired
};
var mapStateToProps = function (_a) {
    var songs = _a.songs, player = _a.player, settings = _a.settings;
    return ({
        songs: songs,
        player: player,
        settings: settings
    });
};
var mapDispatchToProps = {
    addSongs: songsActions_1.addSongs,
    addSongsToQueue: playerActions_1.addSongsToQueue,
    clearQueue: playerActions_1.clearQueue,
    playSong: playerActions_1.playSong
};
exports["default"] = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(Home);
//# sourceMappingURL=Home.js.map