"use strict";
exports.__esModule = true;
var JSONStore = /** @class */ (function () {
    function JSONStore(_a) {
        var fileName = _a.fileName, _b = _a.defaultData, defaultData = _b === void 0 ? {} : _b;
        this.path = window.electron.getFilePath(fileName);
        this.data = window.electron.parseDataFile(this.path, defaultData);
    }
    JSONStore.prototype.get = function (key) {
        if (key) {
            return this.data[key];
        }
        return this.data;
    };
    JSONStore.prototype.set = function (key, val) {
        if (key) {
            this.data[key] = val;
        }
        else {
            this.data = val;
        }
        window.electron.writeFile(this.path, JSON.stringify(this.data));
    };
    return JSONStore;
}());
// expose the class
exports["default"] = JSONStore;
//# sourceMappingURL=JSONStore.js.map