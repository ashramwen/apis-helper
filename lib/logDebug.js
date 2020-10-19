"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = void 0;
var constants_1 = require("./constants");
function logDebug() {
    var message = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
    }
    if (constants_1.DEBUG)
        console.log(message);
}
exports.logDebug = logDebug;
