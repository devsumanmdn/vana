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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var music_metadata_1 = require("music-metadata");
electron_1.contextBridge.exposeInMainWorld("electron", {
    getFilePath: function (fileName) {
        var userDataPath = electron_1.app.getPath("userData");
        return path_1["default"].join(userDataPath, fileName + ".json");
    },
    parseDataFile: function (filePath, defaultData) {
        // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
        // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
        try {
            return JSON.parse(fs_1["default"].readFileSync(filePath, "utf-8"));
        }
        catch (error) {
            // if there was some kind of error, return the passed in defaultData instead.
            return defaultData;
        }
    },
    writeFile: function (filePath, data) { return fs_1["default"].writeFileSync(filePath, data); },
    readFile: function (filePath, data) { return fs_1["default"].readFile(filePath, data); },
    getArrayOfFiles: function (dir, filelist) {
        if (filelist === void 0) { filelist = []; }
        var walk = function (dir, filelist) {
            if (filelist === void 0) { filelist = []; }
            return __awaiter(void 0, void 0, void 0, function () {
                var files, _i, files_1, file, filepath, stat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            files = fs_1["default"].readdirSync(dir);
                            _i = 0, files_1 = files;
                            _a.label = 1;
                        case 1:
                            if (!(_i < files_1.length)) return [3 /*break*/, 5];
                            file = files_1[_i];
                            filepath = path_1["default"].join(dir, file);
                            stat = fs_1["default"].statSync(filepath);
                            if (!stat.isDirectory()) return [3 /*break*/, 3];
                            return [4 /*yield*/, walk(filepath, filelist)];
                        case 2:
                            filelist = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            if (["mp3", "flac", "ogg", "webm"].includes(file.split(".").slice(-1)[0])) {
                                filelist.push(filepath);
                            }
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, filelist];
                    }
                });
            });
        };
        return walk(dir, filelist);
    },
    getMusicMetaData: function (location) {
        return (0, music_metadata_1.parseFile)(location).then(function (parsedData) {
            var albumArt = parsedData.common.picture[0]
                ? "data:image/jpeg;base64," + parsedData.common.picture[0].data.toString("base64")
                : "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/compose_music_ovo2.svg";
            var info = __assign(__assign({}, parsedData), { albumArt: albumArt });
            if (!(info.common && info.common.title)) {
                var filename = location.split("/").slice(-1)[0];
                info.common.title = filename;
            }
            if (!info.common.artists.length) {
                info.common.artists.push("Unknown");
            }
            return info;
        });
    }
});
//# sourceMappingURL=preload.js.map