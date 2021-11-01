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
var react_window_1 = require("react-window");
var react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
var react_redux_1 = require("react-redux");
var SongListItem_1 = __importDefault(require("./SongListItem"));
var styles_1 = require("@mui/styles");
var useStyles = (0, styles_1.makeStyles)({
    root: {
        flexGrow: 1,
        overflow: 'auto',
        overflowY: 'hidden',
        padding: '0 0 0 40px'
    },
    title: {
        fontSize: 18,
        padding: '0px 20px'
    }
});
var Row = (0, react_1.memo)(function (_a) {
    var data = _a.data, index = _a.index, style = _a.style;
    var metaData = data[index];
    return metaData ? ((0, jsx_runtime_1.jsx)(SongListItem_1["default"], { style: style, metaData: metaData }, metaData.id)) : null;
}, react_window_1.areEqual);
// Row.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
//   index: PropTypes.number.isRequired,
//   style: PropTypes.shape({}).isRequired,
// };
var PlayingQueueList = function (_a) {
    var player = _a.player, songs = _a.songs;
    var _b = (0, react_1.useState)([]), songListWithMeta = _b[0], setSongListWithMeta = _b[1];
    var classes = useStyles();
    var queue = player.queue;
    var allSongs = songs.all;
    (0, react_1.useEffect)(function () {
        if (queue === null || queue === void 0 ? void 0 : queue.length) {
            Promise.all(queue.map(function (songId) { return allSongs[songId] || {}; })).then(setSongListWithMeta);
        }
    }, [queue, allSongs]);
    if (!songListWithMeta.length) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: classes.root }, { children: [(0, jsx_runtime_1.jsx)("p", __assign({ className: classes.title }, { children: "Now Playing" }), void 0), (0, jsx_runtime_1.jsx)(react_virtualized_auto_sizer_1["default"], { children: function (_a) {
                    var height = _a.height, width = _a.width;
                    return ((0, jsx_runtime_1.jsx)(react_window_1.FixedSizeList, __assign({ height: height, itemCount: songListWithMeta.length, itemData: songListWithMeta, itemSize: 80, width: width }, { children: Row }), void 0));
                } }, void 0)] }), void 0));
};
PlayingQueueList.propTypes = {
    classes: prop_types_1["default"].objectOf(prop_types_1["default"].string).isRequired,
    player: prop_types_1["default"].shape({
        queue: prop_types_1["default"].arrayOf(prop_types_1["default"].string).isRequired
    }).isRequired,
    songs: prop_types_1["default"].shape({
        all: prop_types_1["default"].objectOf(prop_types_1["default"].shape({})).isRequired
    }).isRequired
};
var mapStateToProps = function (_a) {
    var player = _a.player, songs = _a.songs;
    return ({ player: player, songs: songs });
};
exports["default"] = (0, react_redux_1.connect)(mapStateToProps)(PlayingQueueList);
//# sourceMappingURL=PlayingQueueList.js.map