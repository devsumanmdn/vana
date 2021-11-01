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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var clsx_1 = __importDefault(require("clsx"));
var makeStyles_1 = __importDefault(require("@mui/styles/makeStyles"));
var Slider_1 = __importDefault(require("@mui/material/Slider"));
var PlayArrowRounded_1 = __importDefault(require("@mui/icons-material/PlayArrowRounded"));
var SkipNextRounded_1 = __importDefault(require("@mui/icons-material/SkipNextRounded"));
var SkipPreviousRounded_1 = __importDefault(require("@mui/icons-material/SkipPreviousRounded"));
var PauseRounded_1 = __importDefault(require("@mui/icons-material/PauseRounded"));
var VolumeOff_1 = __importDefault(require("@mui/icons-material/VolumeOff"));
var VolumeDown_1 = __importDefault(require("@mui/icons-material/VolumeDown"));
var Tooltip_1 = __importDefault(require("@mui/material/Tooltip"));
var Button_1 = __importDefault(require("@mui/material/Button"));
var VolumeMute_1 = __importDefault(require("@mui/icons-material/VolumeMute"));
var QueueMusic_1 = __importDefault(require("@mui/icons-material/QueueMusic"));
// import List from "@mui/material/List";
var VolumeUp_1 = __importDefault(require("@mui/icons-material/VolumeUp"));
var moment_1 = __importDefault(require("moment"));
// import momentDurationFormatSetup from "moment-duration-format";
// import AutoSizer from "react-virtualized-auto-sizer";
// import momentDurationFormatSetup from 'moment-duration-format';
var react_redux_1 = require("react-redux");
var playerActions_1 = require("../redux/player/playerActions");
var playerMiddleWareActions_1 = require("../redux/playerMiddleware/playerMiddleWareActions");
var settingsReducer_1 = require("../redux/settings/settingsReducer");
var PlayingQueueList_1 = __importDefault(require("./PlayingQueueList"));
// momentDurationFormatSetup(moment);
var useStyle = (0, makeStyles_1["default"])({
    root: {
        width: "100%",
        maxWidth: "100%",
        maxHeight: 100,
        minHeight: 100,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        transitionDuration: "1s",
        justifyContent: "space-evenly",
        overflow: "hidden",
        position: "relative",
        "&.hidden": {
            minHeight: 0,
            height: 0
        },
        "&:not(.expandedView)": {
            background: "#fff1",
            marginTop: 0,
            marginBottom: 0
        },
        "&.expandedView": {
            height: "100%",
            width: "100%",
            padding: "10px 20px",
            top: 0,
            left: 0,
            maxHeight: "unset",
            flexDirection: "column",
            position: "relative",
            "& $nowPlayingContainer": {
                height: "100%"
            },
            "& $albumArtContainer": {
                height: "100%",
                width: "100%",
                flexDirection: "column",
                position: "relative"
            },
            "& $albumArt": {
                height: "90%",
                width: "90%",
                maxWidth: "calc(100vh - 200px)",
                maxHeight: "calc(100vh - 300px)",
                margin: "20px"
            },
            "& $volumeContainer": {
            // display: 'none'
            },
            "& hideControls": {
                marginBottom: -50,
                opacity: 0,
                transitionDuration: "1s",
                justifyContent: "space-evenly",
                overflow: "hidden",
                position: "relative"
            },
            "& $songInfo": {
                "& > p": {
                    fontSize: "1.1em",
                    margin: "0 10px"
                }
            },
            "& $playBtn": {
                height: "3.2em",
                width: "3.2em",
                marginRight: 20,
                padding: 0,
                "& > svg": {
                    fontSize: "1.6em"
                }
            },
            "& $infoContainer": {
                flexGrow: "unset",
                alignSelf: "stretch"
            },
            "&.showingQueue": {
                "& $nowPlayingContainer": {
                    height: "100%",
                    display: "flex"
                },
                "& $albumArtContainer": {
                    width: "50%"
                }
            }
        }
    },
    nowPlayingContainer: {
        width: "100%",
        transitionDuration: "0.4s"
    },
    albumArtContainer: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    },
    backgroundContainer: {
        position: "fixed",
        zIndex: -999999,
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "#000"
    },
    // backgroundContainer: ({ transparentMode }: { transparentMode: boolean }) => ({
    //   position: 'fixed',
    //   zIndex: -999999,
    //   ...(transparentMode
    //     ? {
    //         top: 30,
    //         left: 30,
    //         height: 'calc(100% - 60px)',
    //         width: 'calc(100% - 60px)',
    //       }
    //     : {
    //         top: 0,
    //         left: 0,
    //         height: '100%',
    //         width: '100%',
    //         backgroundColor: '#000',
    //       }),
    // }),
    background: {
        height: "100%",
        width: "100%",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        filter: function (_a) {
            var transparencyAmount = _a.transparencyAmount;
            return "blur(1.20rem) brightness(0.5) opacity(" + transparencyAmount / 100 + ")";
        },
        transition: "background-image 1.5s .5s",
        willChange: "background-image",
        backgroundColor: "#0008",
        borderRadius: 6
    },
    albumArt: {
        height: 50,
        width: 50,
        minWidth: 50,
        marginRight: 20,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundColor: "transparent",
        transition: "background-image 1s .3s",
        willChange: "background-image",
        cursor: "nesw-resize"
    },
    songNavigation: {
        display: "flex",
        margin: "20px 10px",
        transitionDuration: "0.3s"
    },
    playBtn: {
        backgroundColor: "transparent",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        height: "2.2em",
        width: "2.2em",
        marginRight: 10,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
        cursor: "pointer",
        "&.playPause": {
            border: "1px solid #fff"
        },
        "&:hover": {
            "& > svg": {
                transform: "scale(1.09)"
            }
        },
        "& > svg": {
            fontSize: "1.4em",
            transition: "transform 0.3s"
        }
    },
    infoContainer: {
        flexGrow: 1,
        flexDirection: "column",
        overflow: "hidden",
        marginTop: 10,
        transitionDuration: "0.3s",
        "&.hideControls": {
            marginButtom: -50,
            opacity: 0
        },
        "& $songInfo, & > div": {
            display: "flex",
            alignItems: "center",
            "& > *": {
                whiteSpace: "nowrap"
            }
        }
    },
    songInfo: {
        flexGrow: 1,
        minWidth: 0,
        "& > p": {
            fontSize: "1.1em",
            margin: "0 10px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        }
    },
    songPlaybackProgress: {
        "& > *": {
            margin: 10,
            alignItems: "center"
        }
    },
    progressSlider: {},
    volumeContainer: {
        display: "flex",
        "& button": {
            background: "transparent",
            minWidth: 30,
            margin: 0,
            marginRight: 10,
            "& svg": {
                width: 24
            }
        }
    },
    volumeSlider: {
        minHeight: 100
    },
    tooltip: {
        padding: "15px 5px 10px"
    },
    separator: {
        height: 6,
        width: 6,
        minWidth: 6,
        borderRadius: "50%",
        backgroundColor: "#fff2",
        margin: "4px 8px"
    },
    songsList: {}
});
var Player = function (_a) {
    var activeSong = _a.activeSong, playerState = _a.playerState, pauseSong = _a.pauseSong, playNextSong = _a.playNextSong, playPrevSong = _a.playPrevSong, expandedView = _a.expandedView, setExpandedView = _a.setExpandedView, settings = _a.settings, seek = _a.seek, resumeSong = _a.resumeSong, setPlayerVolume = _a.setPlayerVolume, prepareSong = _a.prepareSong, setShowQueue = _a.setShowQueue, player = _a.player;
    var classes = useStyle(settings);
    var _b = (0, react_1.useState)(null), songInfo = _b[0], setSongInfo = _b[1];
    var _c = (0, react_1.useState)(false), controlsTimeout = _c[0], setControlsTimeout = _c[1];
    var totalDuration = playerState.totalDuration, playedDuration = playerState.playedDuration, volume = playerState.volume;
    (0, react_1.useEffect)(function () {
        if (activeSong && activeSong.location) {
            window.electron.getMusicMetaData(activeSong.location).then(function (metaData) {
                document.title = metaData.common.title || "Song";
                var codec = metaData && metaData.format && metaData.format.container;
                prepareSong({ location: activeSong.location, codec: codec });
            });
        }
        if ("mediaSession" in navigator) {
            // navigator.mediaSession.setActionHandler('play', );
            // navigator.mediaSession.setActionHandler('pause', );
            navigator.mediaSession.setActionHandler("previoustrack", playPrevSong);
            navigator.mediaSession.setActionHandler("nexttrack", playNextSong);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        if (activeSong && activeSong.location) {
            window.electron.getMusicMetaData(activeSong.location).then(function (metaData) {
                document.title = metaData.common.title || "Song";
                setSongInfo(metaData);
                if ("mediaSession" in navigator) {
                    navigator.mediaSession.metadata = new window.MediaMetadata({
                        title: metaData.common.title,
                        artist: metaData.common.artist,
                        album: metaData.common.album,
                        artwork: [
                            {
                                src: metaData.albumArt,
                                sizes: "512x512",
                                type: "image/png"
                            },
                        ]
                    });
                }
            });
        }
    }, [activeSong]);
    (0, react_1.useEffect)(function () {
        var timeOut;
        var handler = function () {
            if (timeOut) {
                clearTimeout(timeOut);
            }
            timeOut = setTimeout(function () {
                setControlsTimeout(true);
            }, 3000);
            setControlsTimeout(false);
        };
        window.addEventListener("mousedown", handler);
        window.addEventListener("mousemove", handler);
        return function () {
            window.removeEventListener("mousedown", handler);
            window.removeEventListener("mousemove", handler);
            if (timeOut) {
                clearTimeout(timeOut);
            }
        };
    }, []);
    var handleVolumeChange = function (event, newVolume) {
        setPlayerVolume(newVolume / 100);
    };
    var handleSeek = function (event, newValue) {
        if (playerState.playing) {
            pauseSong();
        }
        var seekDur = totalDuration * (newValue / 100);
        seek(seekDur);
    };
    var handlePlayPause = function () {
        if (playerState.playing) {
            pauseSong();
        }
        else {
            resumeSong();
        }
    };
    var playing = playerState.playing;
    var albumArtDataURL = songInfo && songInfo.albumArt;
    var getVolumeIcon = function () {
        if (volume) {
            if (volume < 0.3) {
                return (0, jsx_runtime_1.jsx)(VolumeMute_1["default"], {}, void 0);
            }
            if (volume < 0.7) {
                return (0, jsx_runtime_1.jsx)(VolumeDown_1["default"], {}, void 0);
            }
            return (0, jsx_runtime_1.jsx)(VolumeUp_1["default"], {}, void 0);
        }
        return (0, jsx_runtime_1.jsx)(VolumeOff_1["default"], {}, void 0);
    };
    var handleExpandedViewToggle = function () {
        if (expandedView) {
            setShowQueue(false);
        }
        setExpandedView(!expandedView);
    };
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1["default"])(classes.root, {
            expandedView: expandedView || player.showQueue,
            showingQueue: player.showQueue,
            hidden: !activeSong,
            hideControls: controlsTimeout
        }) }, { children: [(0, jsx_runtime_1.jsx)("canvas", { style: {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    zIndex: -1,
                    opacity: 0.6
                }, id: "player-visualization" }, void 0), (0, jsx_runtime_1.jsx)("div", __assign({ className: classes.backgroundContainer }, { children: (0, jsx_runtime_1.jsx)("div", { className: classes.background, style: {
                        backgroundImage: "url(" + albumArtDataURL
                    } }, void 0) }), void 0), activeSong ? ((0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.nowPlayingContainer }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.albumArtContainer }, { children: [songInfo ? ((0, jsx_runtime_1.jsx)("div", { role: "presentation", onClick: handleExpandedViewToggle, className: classes.albumArt, style: { backgroundImage: "url(" + albumArtDataURL } }, void 0)) : ((0, jsx_runtime_1.jsx)("div", { role: "presentation", onClick: handleExpandedViewToggle, className: classes.albumArt, style: { background: "#000" } }, void 0)), (0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1["default"])(classes.songNavigation, {
                                    hideControls: controlsTimeout
                                }) }, { children: [(0, jsx_runtime_1.jsx)("button", __assign({ type: "button", onClick: playPrevSong, className: classes.playBtn }, { children: (0, jsx_runtime_1.jsx)(SkipPreviousRounded_1["default"], {}, void 0) }), void 0), (0, jsx_runtime_1.jsx)("button", __assign({ type: "button", onClick: handlePlayPause, className: (0, clsx_1["default"])(classes.playBtn, "playPause") }, { children: playing ? (0, jsx_runtime_1.jsx)(PauseRounded_1["default"], {}, void 0) : (0, jsx_runtime_1.jsx)(PlayArrowRounded_1["default"], {}, void 0) }), void 0), (0, jsx_runtime_1.jsx)("button", __assign({ type: "button", onClick: playNextSong, className: classes.playBtn }, { children: (0, jsx_runtime_1.jsx)(SkipNextRounded_1["default"], {}, void 0) }), void 0)] }), void 0), (0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1["default"])(classes.infoContainer, {
                                    hideControls: controlsTimeout
                                }) }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [songInfo ? ((0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.songInfo }, { children: [(0, jsx_runtime_1.jsx)("p", { children: songInfo.common.title }, void 0), (0, jsx_runtime_1.jsx)("div", { className: classes.separator }, void 0), (0, jsx_runtime_1.jsx)("p", { children: songInfo.common.artists }, void 0)] }), void 0)) : null, (0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.volumeContainer }, { children: [(0, jsx_runtime_1.jsx)(Tooltip_1["default"], __assign({ classes: { tooltip: classes.tooltip }, title: (0, jsx_runtime_1.jsx)(Slider_1["default"], { classes: { root: classes.volumeSlider }, orientation: "vertical", value: volume * 100, onChange: handleVolumeChange, "aria-labelledby": "continuous-slider" }, void 0) }, { children: (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ "aria-label": "Volumne control" }, { children: getVolumeIcon() }), void 0) }), void 0), (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ onClick: function () { return setShowQueue(!player.showQueue); }, "aria-label": "open playing queue" }, { children: (0, jsx_runtime_1.jsx)(QueueMusic_1["default"], {}, void 0) }), void 0)] }), void 0)] }, void 0), (0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.songPlaybackProgress }, { children: [(0, jsx_runtime_1.jsx)("span", { children: moment_1["default"].duration(playedDuration, "seconds").format("mm:ss", {
                                                    trim: false
                                                }) }, void 0), (0, jsx_runtime_1.jsx)(Slider_1["default"], { classes: { root: classes.progressSlider }, value: (playedDuration / totalDuration) * 100, "aria-labelledby": "continuous-slider", onChange: handleSeek, onChangeCommitted: function () { return resumeSong(); } }, void 0), (0, jsx_runtime_1.jsx)("span", { children: moment_1["default"].duration(totalDuration, "seconds").format("mm:ss", {
                                                    trim: false
                                                }) }, void 0)] }), void 0)] }), void 0)] }), void 0), player.showQueue ? (0, jsx_runtime_1.jsx)(PlayingQueueList_1["default"], {}, void 0) : null] }), void 0)) : null, (0, jsx_runtime_1.jsx)("div", { style: expandedView || player.showQueue
                    ? { visibility: "hidden", maxHeight: 0 }
                    : {}, className: classes.songsList }, void 0)] }), void 0));
};
Player.propTypes = {
    playerState: prop_types_1["default"].shape({
        playing: prop_types_1["default"].bool,
        volume: prop_types_1["default"].number,
        isMute: prop_types_1["default"].bool,
        totalDuration: prop_types_1["default"].number,
        playedDuration: prop_types_1["default"].number
    }).isRequired,
    activeSong: prop_types_1["default"].shape({
        codec: prop_types_1["default"].string,
        title: prop_types_1["default"].string,
        location: prop_types_1["default"].string,
        albumArt: prop_types_1["default"].string
    }),
    player: prop_types_1["default"].shape({
        showQueue: prop_types_1["default"].bool.isRequired
    }).isRequired,
    expandedView: prop_types_1["default"].bool.isRequired,
    setExpandedView: prop_types_1["default"].func.isRequired,
    // playSong: PropTypes.func.isRequired,
    pauseSong: prop_types_1["default"].func.isRequired,
    resumeSong: prop_types_1["default"].func.isRequired,
    playNextSong: prop_types_1["default"].func.isRequired,
    playPrevSong: prop_types_1["default"].func.isRequired,
    seek: prop_types_1["default"].func.isRequired,
    setPlayerVolume: prop_types_1["default"].func.isRequired,
    prepareSong: prop_types_1["default"].func.isRequired,
    settings: settingsReducer_1.settingsPropType.isRequired,
    setShowQueue: prop_types_1["default"].func.isRequired
};
Player.defaultProps = {
    activeSong: null
};
var mapStateToProps = function (_a) {
    var settings = _a.settings, player = _a.player;
    return ({ settings: settings, player: player });
};
var mapDispatchToProps = {
    playSong: playerActions_1.playSong,
    pauseSong: playerActions_1.pauseSong,
    resumeSong: playerActions_1.resumeSong,
    playNextSong: playerActions_1.playNextSong,
    playPrevSong: playerActions_1.playPrevSong,
    seek: playerMiddleWareActions_1.seekPlayer,
    setPlayerVolume: playerMiddleWareActions_1.setPlayerVolume,
    prepareSong: playerActions_1.prepareSong,
    setShowQueue: playerActions_1.setShowQueue
};
exports["default"] = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(Player);
//# sourceMappingURL=Player.js.map