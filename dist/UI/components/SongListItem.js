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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var makeStyles_1 = __importDefault(require("@mui/styles/makeStyles"));
var PlayArrowRounded_1 = __importDefault(require("@mui/icons-material/PlayArrowRounded"));
var PauseRounded_1 = __importDefault(require("@mui/icons-material/PauseRounded"));
var react_redux_1 = require("react-redux");
var playerActions_1 = require("../redux/player/playerActions");
var useStyles = (0, makeStyles_1["default"])({
    root: {
        borderTop: '1px solid #ddd2',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        color: 'lightgrey',
        cursor: 'default',
        '&:hover': {
            color: 'white'
        }
    },
    playBtn: {
        backgroundColor: 'transparent',
        color: '#fff',
        border: '1px solid #fff',
        borderRadius: '50%',
        height: 30,
        width: 30,
        minWidth: 30,
        marginRight: 10,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        cursor: 'pointer',
        '& > svg': {
            fontSize: 18
        }
    },
    albumArt: {
        height: 40,
        width: 40,
        marginRight: 20
    }
});
function SongListItem(_a) {
    var _this = this;
    var metaData = _a.metaData, playing = _a.playing, playSong = _a.playSong, pauseSong = _a.pauseSong, rest = __rest(_a, ["metaData", "playing", "playSong", "pauseSong"]);
    var _b = (0, react_1.useState)(null), songInfo = _b[0], setSongInfo = _b[1];
    (0, react_1.useEffect)(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, window.electron.getMusicMetaData(metaData.location)["catch"](function (e) {
                            alert(e.message);
                        })];
                    case 1:
                        info = _a.sent();
                        if (info) {
                            setSongInfo(info);
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [metaData.location]);
    var classes = useStyles();
    var albumArtDataURL = songInfo && songInfo.albumArt;
    var handlePlayPause = function () {
        if (playing) {
            pauseSong();
        }
        else {
            playSong(metaData.id);
        }
    };
    return songInfo ? ((0, jsx_runtime_1.jsxs)("div", __assign({ role: "presentation", onClick: handlePlayPause, className: classes.root }, rest, { children: [(0, jsx_runtime_1.jsx)("img", { className: classes.albumArt, src: albumArtDataURL, alt: "albumArt" }, void 0), (0, jsx_runtime_1.jsx)("button", __assign({ type: "button", className: classes.playBtn }, { children: playing ? (0, jsx_runtime_1.jsx)(PauseRounded_1["default"], {}, void 0) : (0, jsx_runtime_1.jsx)(PlayArrowRounded_1["default"], {}, void 0) }), void 0), (0, jsx_runtime_1.jsx)("p", { children: songInfo.common.title }, void 0), (0, jsx_runtime_1.jsx)("audio", { src: metaData.location }, void 0)] }), void 0)) : ((0, jsx_runtime_1.jsx)("div", __assign({ className: classes.root }, rest), void 0));
}
SongListItem.propTypes = {
    metaData: prop_types_1["default"].shape({
        location: prop_types_1["default"].string,
        id: prop_types_1["default"].string,
        title: prop_types_1["default"].string,
        albumArt: prop_types_1["default"].string
    }).isRequired,
    playing: prop_types_1["default"].bool.isRequired,
    playSong: prop_types_1["default"].func.isRequired,
    pauseSong: prop_types_1["default"].func.isRequired
};
var mapDispatchToProps = {
    playSong: playerActions_1.playSong,
    pauseSong: playerActions_1.pauseSong
};
var mapStateToProps = function (_a, ownProps) {
    var player = _a.player;
    return ({
        playing: !!(ownProps.metaData.id === player.activeSongId && player.playing)
    });
};
exports["default"] = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(SongListItem);
//# sourceMappingURL=SongListItem.js.map